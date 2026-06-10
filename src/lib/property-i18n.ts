import type { Locale } from "@/lib/i18n";
import { usesEnglishContent } from "@/lib/locale-content";
import type { Property } from "@/types/property";

export function localizedPropertyTitle(property: Property, locale: Locale): string {
  if (usesEnglishContent(locale)) return property.titleEn || property.title;
  return property.title;
}

export function localizedPropertyDistrict(property: Property, locale: Locale): string {
  if (usesEnglishContent(locale)) return property.districtEn || property.district;
  return property.district;
}
