import type { Property } from "@/types/property";

export type FurnishingStatus = "furnished" | "unfurnished" | "partially" | "unknown";

export const FURNISHING_STATUSES: FurnishingStatus[] = [
  "furnished",
  "unfurnished",
  "partially",
  "unknown",
];

const FURNISHED_PATTERN = /เฟอร์|furnish|fully furnished|ครบ/i;

export function isPropertyFurnished(property: Property): boolean {
  if (property.furnishing === "furnished" || property.furnishing === "partially") {
    return true;
  }
  if (property.furnishing === "unfurnished") {
    return false;
  }
  return property.features.some((feature) => FURNISHED_PATTERN.test(feature));
}

export function furnishingLabel(status: FurnishingStatus, locale: "th" | "en" = "th"): string {
  const labels: Record<FurnishingStatus, { th: string; en: string }> = {
    furnished: { th: "เฟอร์นิเจอร์ครบ", en: "Fully furnished" },
    unfurnished: { th: "ไม่มีเฟอร์นิเจอร์", en: "Unfurnished" },
    partially: { th: "เฟอร์นิเจอร์บางส่วน", en: "Partially furnished" },
    unknown: { th: "ไม่ระบุ", en: "Not specified" },
  };
  return labels[status][locale];
}
