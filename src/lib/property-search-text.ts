import type { Property } from "@/types/property";

/** Combined searchable text for a listing (used by AI search and filters). */
export function getPropertySearchText(property: Property): string {
  return [
    property.title,
    property.titleEn,
    property.titleZh,
    property.titleJa,
    property.titleAr,
    property.description,
    property.descriptionEn,
    property.descriptionZh,
    property.descriptionJa,
    property.descriptionAr,
    property.highlights ?? "",
    property.district,
    property.districtEn,
    property.btsStation ?? "",
    property.address,
    ...property.features,
  ]
    .join(" ")
    .toLowerCase();
}

/** Score how well free-text query matches listing prose (title, description, highlights, etc.). */
export function textMatchScore(property: Property, query: string): number {
  const haystack = getPropertySearchText(property);
  const q = query.toLowerCase().trim();
  if (!q) return 0;

  let score = 0;

  if (haystack.includes(q)) score += 30;

  const tokens = q.split(/[\s,]+/).filter((t) => t.length >= 2);
  for (const token of tokens) {
    if (haystack.includes(token)) score += 6;
  }

  const poiPairs: [RegExp, RegExp][] = [
    [/โรงเรียน|school|international/i, /โรงเรียน|school|นานาชาติ|international/i],
    [/ห้าง|mall|shopping/i, /ห้าง|mall|shopping|เซ็นทรัล|central|emquartier|terminal/i],
    [/โรงพยาบาล|hospital/i, /โรงพยาบาล|hospital|บำรุง|bumrungrad/i],
    [/สวน|park/i, /สวน|park|benjasiri|lumpini/i],
    [/ใกล้|near|\d+\s*km/i, /ใกล้|near|\d+\s*(km|m|เมตร)/i],
  ];
  for (const [queryPat, hayPat] of poiPairs) {
    if (queryPat.test(q) && hayPat.test(haystack)) score += 20;
  }

  return score;
}
