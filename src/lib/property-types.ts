import type { Locale } from "@/lib/i18n";
import { t } from "@/lib/i18n";
import type { PropertyType } from "@/types/property";

export const PROPERTY_TYPES = [
  "condo",
  "apartment",
  "house",
  "townhouse",
  "land",
  "commercial",
  "npa",
] as const satisfies readonly PropertyType[];

export type PropertyCategory = "all" | "condo" | "house" | "land" | "commercial" | "npa";

export const PROPERTY_CATEGORIES: PropertyCategory[] = [
  "all",
  "condo",
  "house",
  "land",
  "commercial",
  "npa",
];

/** Listing types included when a browse category chip is selected. */
export const CATEGORY_PROPERTY_TYPES: Record<Exclude<PropertyCategory, "all">, PropertyType[]> = {
  condo: ["condo", "apartment"],
  house: ["house", "townhouse"],
  land: ["land"],
  commercial: ["commercial"],
  npa: ["npa"],
};

export function parsePropertyCategory(value?: string | null): PropertyCategory {
  if (value && PROPERTY_CATEGORIES.includes(value as PropertyCategory)) {
    return value as PropertyCategory;
  }
  return "all";
}

export function propertyTypeLabel(type: PropertyType, locale: Locale): string {
  const key = `propertyType_${type}` as Parameters<typeof t>[0];
  return t(key, locale);
}

export function propertyCategoryLabel(category: PropertyCategory, locale: Locale): string {
  const key = `category_${category}` as Parameters<typeof t>[0];
  return t(key, locale);
}

export function isLandOrNpa(type: PropertyType): boolean {
  return type === "land" || type === "npa";
}

export function showsRoomCounts(type: PropertyType): boolean {
  return !isLandOrNpa(type) && type !== "commercial";
}

/** Infer browse category from free-text search (Thai + English). */
export function parsePropertyCategoryFromQuery(query: string): PropertyCategory | undefined {
  const lower = query.toLowerCase();
  if (/npa|ขายทอดตลาด|ทรัพย์สินรอการขาย|ทรัพย์ธนาคาร|จากธนาคาร/.test(lower)) return "npa";
  if (/ที่ดิน|\bland\b|plot/.test(lower)) return "land";
  if (/อาคารพาณิชย์|สำนักงาน|commercial|office|retail|shop/.test(lower)) return "commercial";
  if (/บ้าน|ทาวน์|townhouse|\bhouse\b|home/.test(lower)) return "house";
  if (/คอนโด|condo|apartment|อพาร/.test(lower)) return "condo";
  return undefined;
}
