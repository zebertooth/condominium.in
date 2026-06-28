import {
  BANGKOK_DISTRICTS,
  type BangkokDistrict,
  type DistrictZone,
} from "@/lib/bangkok-districts-data";
import { DEFAULT_MAP_CENTER } from "@/lib/transit-stations";

export { DEFAULT_MAP_CENTER };

export type { BangkokDistrict, DistrictZone };
export { BANGKOK_DISTRICTS, DISTRICT_ZONE_LABELS } from "@/lib/bangkok-districts-data";

export function getDistrictBySlug(slug: string): BangkokDistrict | undefined {
  const decoded = decodeURIComponent(slug).trim();
  return BANGKOK_DISTRICTS.find(
    (d) => d.slug === decoded || d.nameTh === decoded || d.nameEn.toLowerCase() === decoded.toLowerCase(),
  );
}

export function getDistrictByName(name: string): BangkokDistrict | undefined {
  const trimmed = name.trim();
  return BANGKOK_DISTRICTS.find(
    (d) =>
      d.nameTh === trimmed ||
      d.labelTh === trimmed ||
      d.nameEn.toLowerCase() === trimmed.toLowerCase() ||
      trimmed === `เขต${d.nameTh}`,
  );
}

export function districtFilterValue(district: BangkokDistrict): string {
  return district.nameTh;
}

export function districtsByZone(zone: DistrictZone | "all"): BangkokDistrict[] {
  if (zone === "all") return BANGKOK_DISTRICTS;
  return BANGKOK_DISTRICTS.filter((d) => d.zone === zone);
}

export function searchDistricts(query: string, zone: DistrictZone | "all" = "all"): BangkokDistrict[] {
  const q = query.trim().toLowerCase();
  let list = districtsByZone(zone);
  if (!q) return list;
  return list.filter(
    (d) =>
      d.nameTh.includes(query.trim()) ||
      d.nameEn.toLowerCase().includes(q) ||
      d.labelTh.includes(query.trim()) ||
      d.labelEn.toLowerCase().includes(q),
  );
}

export function districtStaticParams() {
  return BANGKOK_DISTRICTS.map((d) => ({ slug: d.slug }));
}
