import { getAllListings, filterListings } from "@/lib/listings";
import { hasOpenAI, openaiChat } from "@/lib/openai";
import { BANGKOK_DISTRICTS, getDistrictByName, getDistrictBySlug } from "@/lib/bangkok-districts";
import { districtMatchesFilter } from "@/lib/district-match";
import { textMatchScore } from "@/lib/property-search-text";
import { stationMatchesFilter } from "@/lib/station-match";
import {
  resolveStationFromFilter,
  searchTransitStations,
  stationFilterValue,
} from "@/lib/transit-stations";
import { stationHubPath } from "@/lib/station-seo";
import {
  CATEGORY_PROPERTY_TYPES,
  parsePropertyCategoryFromQuery,
  type PropertyCategory,
} from "@/lib/property-types";
import type { AISearchHubLink, AISearchRequest, AISearchResult, Property } from "@/types/property";

interface SearchFilters {
  listingType?: "sale" | "rent";
  propertyCategory?: PropertyCategory;
  btsStation?: string;
  district?: string;
  bedrooms?: number;
  maxPrice?: number;
}

const BTS_ALIASES: Record<string, string> = {
  อโศก: "อโศก",
  asoke: "อโศก",
  เอกมัย: "เอกมัย",
  ekkamai: "เอกมัย",
  ทองหล่อ: "ทองหล่อ",
  thonglor: "ทองหล่อ",
  สุรศักดิ์: "สุรศักดิ์",
  sathorn: "สุรศักดิ์",
  สาทร: "สุรศักดิ์",
  พญาไท: "พญาไท",
  phayathai: "พญาไท",
  ราชเทวี: "ราชเทวี",
  ratchathewi: "ราชเทวี",
  พร้อมพงษ์: "พร้อมพงษ์",
  "phrom phong": "พร้อมพงษ์",
  phrompong: "พร้อมพงษ์",
  ชิดลม: "ชิดลม",
  chidlom: "ชิดลม",
  อารีย์: "อารีย์",
  ari: "อารีย์",
  สยาม: "สยาม",
  siam: "สยาม",
  นานา: "นานา",
  nana: "นานา",
};

function extractNumber(text: string, patterns: RegExp[]): number | undefined {
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) {
      const num = parseInt(match[1].replace(/,/g, ""), 10);
      if (!isNaN(num)) return num;
    }
  }
  return undefined;
}

function scoreProperty(property: Property, query: string, prefs: {
  btsStation?: string;
  district?: string;
  bedrooms?: number;
  maxPrice?: number;
  listingType?: "sale" | "rent";
}): number {
  let score = textMatchScore(property, query);
  const q = query.toLowerCase();

  if (prefs.listingType && property.listingType === prefs.listingType) score += 30;
  if (prefs.btsStation && stationMatchesFilter(property.btsStation, prefs.btsStation)) score += 40;
  if (prefs.district && districtMatchesFilter(property.district, prefs.district)) score += 35;
  if (prefs.bedrooms && property.bedrooms >= prefs.bedrooms) score += 20;
  if (prefs.maxPrice && property.price <= prefs.maxPrice) score += 25;
  if (property.featured) score += 5;
  if (property.distanceToBtsMeters && property.distanceToBtsMeters <= 400) score += 10;

  if (q.includes("ใกล้ bts") || q.includes("near bts") || q.includes("ใกล้ mrt") || q.includes("near mrt")) {
    if (property.btsStation) score += 15;
  }
  if (q.includes("สระ") || q.includes("pool")) {
    if (property.features.some((f) => f.includes("สระ"))) score += 5;
  }

  return score;
}

function resolveStationFilter(value?: string): string | undefined {
  if (!value) return undefined;
  const resolved = resolveStationFromFilter(value);
  return resolved?.name ?? value.trim();
}

function parseDistrictFromQuery(query: string): string | undefined {
  const lower = query.toLowerCase();
  for (const district of BANGKOK_DISTRICTS) {
    if (
      query.includes(district.nameTh) ||
      query.includes(`เขต${district.nameTh}`) ||
      lower.includes(district.labelEn.toLowerCase()) ||
      lower.includes(district.nameEn.toLowerCase())
    ) {
      return district.nameTh;
    }
  }
  return undefined;
}

function parseStationFromQuery(query: string): string | undefined {
  const lower = query.toLowerCase();
  const hits = searchTransitStations(query);
  if (hits.length === 1) return hits[0]!.name;
  if (hits.length > 1) {
    const exact = hits.find(
      (s) =>
        lower.includes(s.name.toLowerCase()) ||
        lower.includes(s.nameEn.toLowerCase()) ||
        lower.includes(s.label.toLowerCase()),
    );
    if (exact) return exact.name;
  }
  return undefined;
}

/** Deterministic, zero-cost filter extraction from a free-text query. */
function parseFiltersFromQuery(
  query: string,
  requestListingType?: "sale" | "rent",
): SearchFilters {
  const lower = query.toLowerCase();

  const listingType =
    requestListingType ??
    (lower.includes("ซื้อ") || lower.includes("ขาย") || lower.includes("buy")
      ? "sale"
      : lower.includes("เช่า") || lower.includes("rent")
        ? "rent"
        : undefined);

  let btsStation = parseStationFromQuery(query);
  if (!btsStation) {
    for (const [alias, station] of Object.entries(BTS_ALIASES)) {
      if (lower.includes(alias.toLowerCase())) {
        btsStation = station;
        break;
      }
    }
  }

  const district = parseDistrictFromQuery(query);

  const bedrooms = extractNumber(lower, [/(\d+)\s*(ห้องนอน|br|bedroom)/, /(\d+)br/]);

  const maxPrice = extractNumber(lower, [
    /งบ\s*(\d[\d,]*)/,
    /ไม่เกิน\s*(\d[\d,]*)/,
    /under\s*(\d[\d,]*)/,
    /budget\s*(\d[\d,]*)/,
    /(\d[\d,]*)\s*(บาท|baht|thb)/,
  ]);

  return { listingType, propertyCategory: parsePropertyCategoryFromQuery(query), btsStation, district, bedrooms, maxPrice };
}

/** Ask the LLM to extract structured filters. Returns null on any failure. */
async function extractFiltersWithLLM(query: string): Promise<SearchFilters | null> {
  const content = await openaiChat({
    json: true,
    system:
      "You extract structured real-estate search filters from a Thai/English query for a Bangkok condo marketplace. " +
      'Reply ONLY with JSON: {"listingType": "sale"|"rent"|null, "btsStation": string|null, "district": string|null, "bedrooms": number|null, "maxPrice": number|null}. ' +
      "btsStation: Thai station name without line prefix (e.g. อโศก, ทองหล่อ, พร้อมพงษ์, สามย่าน). Works for BTS, MRT, BRT. " +
      "district: Thai district name without เขต prefix (e.g. วัฒนา, คลองเตย, ปทุมวัน). maxPrice is THB (per month for rent). Use null when unknown.",
    user: query,
  });

  if (!content) return null;

  try {
    const parsed = JSON.parse(content) as Record<string, unknown>;
    const listingType =
      parsed.listingType === "sale" || parsed.listingType === "rent"
        ? parsed.listingType
        : undefined;
    const bedrooms =
      typeof parsed.bedrooms === "number" && parsed.bedrooms > 0 ? parsed.bedrooms : undefined;
    const maxPrice =
      typeof parsed.maxPrice === "number" && parsed.maxPrice > 0 ? parsed.maxPrice : undefined;
    const btsStation =
      typeof parsed.btsStation === "string" && parsed.btsStation.trim()
        ? resolveStationFilter(parsed.btsStation)
        : undefined;
    const district =
      typeof parsed.district === "string" && parsed.district.trim()
        ? parseDistrictFromQuery(parsed.district) ?? parsed.district.trim().replace(/^เขต/, "")
        : undefined;
    return { listingType, btsStation, district, bedrooms, maxPrice };
  } catch {
    return null;
  }
}

async function selectResults(
  properties: Property[],
  query: string,
  filters: SearchFilters,
): Promise<Property[]> {
  const { listingType, propertyCategory, btsStation, district, bedrooms, maxPrice } = filters;

  const scored = properties
    .map((p) => ({
      property: p,
      score: scoreProperty(p, query.toLowerCase(), { btsStation, district, bedrooms, maxPrice, listingType }),
      textScore: textMatchScore(p, query),
    }))
    .filter(({ score, property, textScore }) => {
      if (listingType && property.listingType !== listingType) return false;
      if (propertyCategory && propertyCategory !== "all") {
        const allowed = CATEGORY_PROPERTY_TYPES[propertyCategory];
        if (!allowed.includes(property.propertyType)) return false;
      }
      if (btsStation && !stationMatchesFilter(property.btsStation, btsStation) && textScore < 12) return false;
      if (district && !districtMatchesFilter(property.district, district) && textScore < 12) return false;
      if (bedrooms && property.bedrooms < bedrooms) return false;
      if (maxPrice && property.price > maxPrice) return false;
      return score > 0;
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 6)
    .map(({ property }) => property);

  if (scored.length > 0) return scored;

  return (
    await filterListings({ listingType, propertyCategory, btsStation, district, bedrooms, maxPrice, query })
  ).slice(0, 6);
}

function templateSummary(
  results: Property[],
  total: number,
  filters: SearchFilters,
): string {
  const parts: string[] = [];
  if (filters.listingType === "rent") parts.push("ประเภท: เช่า");
  else if (filters.listingType === "sale") parts.push("ประเภท: ซื้อ/ขาย");
  if (filters.btsStation) parts.push(`ใกล้ ${resolveStationFromFilter(filters.btsStation)?.label ?? `BTS ${filters.btsStation}`}`);
  if (filters.district) parts.push(`เขต${filters.district}`);
  if (filters.bedrooms) parts.push(`${filters.bedrooms} ห้องนอนขึ้นไป`);
  if (filters.maxPrice) parts.push(`งบไม่เกิน ฿${filters.maxPrice.toLocaleString("th-TH")}`);

  return results.length > 0
    ? `พบ ${results.length} ทรัพย์ที่ตรงกับความต้องการ${parts.length ? ` (${parts.join(", ")})` : ""} จากข้อมูล ${total} ประกาศบนเว็บไซต์`
    : "ไม่พบทรัพย์ที่ตรงเงื่อนไขทั้งหมด ลองปรับงบประมาณหรือย่านอื่น หรือติดต่อทีมเอเจนต์เพื่อหาทรัพย์เพิ่มเติม";
}

async function llmSummary(
  query: string,
  results: Property[],
  fallback: string,
): Promise<string> {
  if (results.length === 0) return fallback;

  const listingLines = results
    .map((p) => {
      const extras = [p.highlights, p.description].filter(Boolean).join(" · ");
      return `- ${p.title} | ${p.listingType === "rent" ? "เช่า" : "ขาย"} ฿${p.price.toLocaleString("th-TH")} | ${p.bedrooms} นอน | BTS ${p.btsStation ?? "-"}${extras ? ` | ${extras.slice(0, 120)}` : ""}`;
    })
    .join("\n");

  const content = await openaiChat({
    temperature: 0.4,
    maxTokens: 220,
    system:
      "คุณเป็นผู้ช่วยอสังหาฯ ของ Condominium.in.th ตอบเป็นภาษาไทย กระชับ 1-2 ประโยค สรุปว่าทรัพย์ที่แนะนำตรงกับความต้องการอย่างไร ห้ามแต่งข้อมูลที่ไม่มีในรายการ",
    user: `คำค้นหา: "${query}"\nทรัพย์ที่แนะนำ:\n${listingLines}`,
  });

  return content?.trim() || fallback;
}

function buildHubLinks(
  filters: SearchFilters,
  listingType?: "sale" | "rent",
): AISearchHubLink[] {
  const type = filters.listingType ?? listingType ?? "rent";
  const base = type === "sale" ? "/buy" : "/rent";
  const links: AISearchHubLink[] = [];

  if (filters.btsStation) {
    const station = resolveStationFromFilter(filters.btsStation);
    const q = encodeURIComponent(station ? stationFilterValue(station) : filters.btsStation);
    if (station) {
      links.push({
        label: `ดูประกาศใกล้ ${station.label}`,
        href: stationHubPath(station, type),
      });
    } else {
      links.push({
        label: `ดูประกาศใกล้ BTS ${filters.btsStation}`,
        href: `${base}?bts=${q}`,
      });
    }
    links.push({
      label: "ค้นหาบนแผนที่",
      href: `/map?bts=${q}&type=${type}`,
    });
    if (station?.hubSlug) {
      links.push({ label: "คู่มือย่าน", href: `/areas/${station.hubSlug}-bts` });
    }
  }

  if (filters.district) {
    const district = getDistrictBySlug(filters.district) ?? getDistrictByName(filters.district);
    if (district) {
      links.push({
        label: `ดูประกาศใน${district.labelTh}`,
        href: `${base}/district/${encodeURIComponent(district.slug)}`,
      });
      links.push({
        label: "ค้นหาบนแผนที่",
        href: `/map?district=${encodeURIComponent(district.nameTh)}&type=${type}`,
      });
    }
  }

  links.push({ label: "สถานีรถไฟฟ้าทั้งหมด", href: "/stations" });
  links.push({ label: "เขตกรุงเทพทั้งหมด", href: "/districts" });

  return links;
}

export async function runAISearch(request: AISearchRequest): Promise<AISearchResult> {
  const properties = await getAllListings();
  const query = request.query.trim();

  const ruleFilters = parseFiltersFromQuery(query, request.listingType);
  const requestCategory =
    request.propertyCategory && request.propertyCategory !== "all"
      ? request.propertyCategory
      : undefined;

  let filters = {
    ...ruleFilters,
    propertyCategory: requestCategory ?? ruleFilters.propertyCategory,
  };
  let engine: "ai" | "rules" = "rules";

  if (hasOpenAI()) {
    const llmFilters = await extractFiltersWithLLM(query);
    if (llmFilters) {
      // LLM result wins, but keep rule-based values where LLM returned nothing.
      filters = {
        listingType: request.listingType ?? llmFilters.listingType ?? ruleFilters.listingType,
        propertyCategory: requestCategory ?? ruleFilters.propertyCategory,
        btsStation: llmFilters.btsStation ?? ruleFilters.btsStation,
        district: llmFilters.district ?? ruleFilters.district,
        bedrooms: llmFilters.bedrooms ?? ruleFilters.bedrooms,
        maxPrice: llmFilters.maxPrice ?? ruleFilters.maxPrice,
      };
      engine = "ai";
    }
  }

  const results = await selectResults(properties, query, filters);
  const baseSummary = templateSummary(results, properties.length, filters);
  const summary = engine === "ai" ? await llmSummary(query, results, baseSummary) : baseSummary;

  const stationLabel = filters.btsStation
    ? resolveStationFromFilter(filters.btsStation)?.label ?? `BTS ${filters.btsStation}`
    : null;

  const suggestions = [
    stationLabel
      ? `ดูคอนโดทั้งหมดใกล้ ${stationLabel}`
      : filters.district
        ? `ดูคอนโดทั้งหมดในเขต${filters.district}`
        : "ลองระบุสถานี BTS/MRT หรือเขต เช่น อโศก วัฒนา",
    filters.maxPrice
      ? "เพิ่มงบประมาณเล็กน้อยเพื่อดูตัวเลือกเพิ่ม"
      : "ระบุงบประมาณเพื่อผลลัพธ์ที่แม่นยำขึ้น",
    "นัดชมทรัพย์จริงกับทีมเอเจนต์ของเรา",
  ];

  return {
    summary,
    properties: results,
    suggestions,
    engine,
    filters: {
      listingType: filters.listingType,
      btsStation: filters.btsStation,
      district: filters.district,
      bedrooms: filters.bedrooms,
      maxPrice: filters.maxPrice,
    },
    hubLinks: buildHubLinks(filters, request.listingType),
  };
}
