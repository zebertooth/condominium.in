import { prisma } from "@/lib/db";

export interface LogSearchInput {
  query: string;
  listingType?: string;
  btsStation?: string;
  district?: string;
  propertyType?: string;
  filters?: Record<string, unknown>;
  resultCount?: number;
  source?: string;
}

export interface LogPropertyViewInput {
  propertySlug: string;
  propertyType?: string;
  listingType?: string;
  district?: string;
  btsStation?: string;
  source?: string;
}

export async function logSearchEvent(input: LogSearchInput) {
  return prisma.searchEvent.create({
    data: {
      query: input.query.trim().slice(0, 500),
      listingType: input.listingType ?? null,
      btsStation: input.btsStation ?? null,
      district: input.district ?? null,
      propertyType: input.propertyType ?? null,
      filters: JSON.stringify(input.filters ?? {}),
      resultCount: input.resultCount ?? 0,
      source: input.source ?? "ai-search",
    },
  });
}

export async function logPropertyView(input: LogPropertyViewInput) {
  return prisma.propertyViewEvent.create({
    data: {
      propertySlug: input.propertySlug,
      propertyType: input.propertyType ?? null,
      listingType: input.listingType ?? null,
      district: input.district ?? null,
      btsStation: input.btsStation ?? null,
      source: input.source ?? "direct",
    },
  });
}

export interface OwnerPropertyStats {
  viewsCount: number;
  inquiriesCount: number;
  contactClicksCount: number;
  viewsCount30d: number;
  inquiriesCount30d: number;
  contactClicksCount30d: number;
}

const CONTACT_CLICK_TYPES = ["owner_phone_click", "owner_email_click"] as const;

function slugCountMap(
  rows: { propertySlug: string | null; _count: number }[],
): Record<string, number> {
  const map: Record<string, number> = {};
  for (const row of rows) {
    if (row.propertySlug) map[row.propertySlug] = row._count;
  }
  return map;
}

/** Per-slug view/inquiry/contact-click totals for owner dashboard. */
export async function getOwnerPropertyStats(
  propertySlugs: string[],
): Promise<Record<string, OwnerPropertyStats>> {
  if (propertySlugs.length === 0) return {};

  const since30 = new Date(Date.now() - DAYS_30 * 24 * 60 * 60 * 1000);
  const slugFilter = { propertySlug: { in: propertySlugs } };

  const [viewsAll, views30, inquiriesAll, inquiries30, clicksAll, clicks30] =
    await Promise.all([
      prisma.propertyViewEvent.groupBy({
        by: ["propertySlug"],
        where: slugFilter,
        _count: true,
      }),
      prisma.propertyViewEvent.groupBy({
        by: ["propertySlug"],
        where: { ...slugFilter, createdAt: { gte: since30 } },
        _count: true,
      }),
      prisma.matchingEvent.groupBy({
        by: ["propertySlug"],
        where: { ...slugFilter, eventType: "owner_inquiry" },
        _count: true,
      }),
      prisma.matchingEvent.groupBy({
        by: ["propertySlug"],
        where: { ...slugFilter, eventType: "owner_inquiry", createdAt: { gte: since30 } },
        _count: true,
      }),
      prisma.matchingEvent.groupBy({
        by: ["propertySlug"],
        where: { ...slugFilter, eventType: { in: [...CONTACT_CLICK_TYPES] } },
        _count: true,
      }),
      prisma.matchingEvent.groupBy({
        by: ["propertySlug"],
        where: {
          ...slugFilter,
          eventType: { in: [...CONTACT_CLICK_TYPES] },
          createdAt: { gte: since30 },
        },
        _count: true,
      }),
    ]);

  const viewsMap = slugCountMap(viewsAll);
  const views30Map = slugCountMap(views30);
  const inquiriesMap = slugCountMap(inquiriesAll);
  const inquiries30Map = slugCountMap(inquiries30);
  const clicksMap = slugCountMap(clicksAll);
  const clicks30Map = slugCountMap(clicks30);

  const result: Record<string, OwnerPropertyStats> = {};
  for (const slug of propertySlugs) {
    result[slug] = {
      viewsCount: viewsMap[slug] ?? 0,
      inquiriesCount: inquiriesMap[slug] ?? 0,
      contactClicksCount: clicksMap[slug] ?? 0,
      viewsCount30d: views30Map[slug] ?? 0,
      inquiriesCount30d: inquiries30Map[slug] ?? 0,
      contactClicksCount30d: clicks30Map[slug] ?? 0,
    };
  }
  return result;
}

export interface AnalyticsSummary {
  searchTotal: number;
  viewTotal: number;
  matchingTotal: number;
  topSearchQueries: { query: string; count: number }[];
  topPropertyTypes: { propertyType: string; count: number }[];
  topDistricts: { district: string; count: number }[];
  topBtsStations: { btsStation: string; count: number }[];
  topViewedProperties: { propertySlug: string; count: number }[];
  matchingByType: { eventType: string; count: number }[];
  ownerDirectLeads: number;
}

const DAYS_30 = 30;

export async function getAnalyticsSummary(days = DAYS_30): Promise<AnalyticsSummary> {
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

  const [
    searchTotal,
    viewTotal,
    matchingTotal,
    ownerDirectLeads,
    searchRows,
    viewTypeRows,
    viewDistrictRows,
    viewBtsRows,
    viewSlugRows,
    matchingRows,
  ] = await Promise.all([
    prisma.searchEvent.count({ where: { createdAt: { gte: since } } }),
    prisma.propertyViewEvent.count({ where: { createdAt: { gte: since } } }),
    prisma.matchingEvent.count({ where: { createdAt: { gte: since } } }),
    prisma.lead.count({ where: { contactMode: "owner_direct", createdAt: { gte: since } } }),
    prisma.searchEvent.groupBy({
      by: ["query"],
      where: { createdAt: { gte: since } },
      _count: { query: true },
      orderBy: { _count: { query: "desc" } },
      take: 15,
    }),
    prisma.propertyViewEvent.groupBy({
      by: ["propertyType"],
      where: { createdAt: { gte: since }, propertyType: { not: null } },
      _count: { propertyType: true },
      orderBy: { _count: { propertyType: "desc" } },
      take: 10,
    }),
    prisma.propertyViewEvent.groupBy({
      by: ["district"],
      where: { createdAt: { gte: since }, district: { not: null } },
      _count: { district: true },
      orderBy: { _count: { district: "desc" } },
      take: 10,
    }),
    prisma.propertyViewEvent.groupBy({
      by: ["btsStation"],
      where: { createdAt: { gte: since }, btsStation: { not: null } },
      _count: { btsStation: true },
      orderBy: { _count: { btsStation: "desc" } },
      take: 10,
    }),
    prisma.propertyViewEvent.groupBy({
      by: ["propertySlug"],
      where: { createdAt: { gte: since } },
      _count: { propertySlug: true },
      orderBy: { _count: { propertySlug: "desc" } },
      take: 15,
    }),
    prisma.matchingEvent.groupBy({
      by: ["eventType"],
      where: { createdAt: { gte: since } },
      _count: { eventType: true },
      orderBy: { _count: { eventType: "desc" } },
    }),
  ]);

  return {
    searchTotal,
    viewTotal,
    matchingTotal,
    ownerDirectLeads,
    topSearchQueries: searchRows.map((r) => ({ query: r.query, count: r._count.query })),
    topPropertyTypes: viewTypeRows
      .filter((r) => r.propertyType)
      .map((r) => ({ propertyType: r.propertyType as string, count: r._count.propertyType })),
    topDistricts: viewDistrictRows
      .filter((r) => r.district)
      .map((r) => ({ district: r.district as string, count: r._count.district })),
    topBtsStations: viewBtsRows
      .filter((r) => r.btsStation)
      .map((r) => ({ btsStation: r.btsStation as string, count: r._count.btsStation })),
    topViewedProperties: viewSlugRows.map((r) => ({
      propertySlug: r.propertySlug,
      count: r._count.propertySlug,
    })),
    matchingByType: matchingRows.map((r) => ({ eventType: r.eventType, count: r._count.eventType })),
  };
}

export function toCsv(rows: Record<string, string | number | null>[]): string {
  if (rows.length === 0) return "";
  const headers = Object.keys(rows[0]);
  const escape = (v: string | number | null) => {
    const s = String(v ?? "");
    if (s.includes(",") || s.includes('"') || s.includes("\n")) {
      return `"${s.replace(/"/g, '""')}"`;
    }
    return s;
  };
  const lines = [headers.join(",")];
  for (const row of rows) {
    lines.push(headers.map((h) => escape(row[h])).join(","));
  }
  return lines.join("\n");
}
