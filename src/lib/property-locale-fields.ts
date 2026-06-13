/** Optional per-locale title/description on user-submitted listings (Phase 7). */

export interface PropertyLocaleInput {
  titleEn?: string;
  descriptionEn?: string;
  titleZh?: string;
  descriptionZh?: string;
  titleJa?: string;
  descriptionJa?: string;
  titleAr?: string;
  descriptionAr?: string;
}

export interface PropertyLocaleFields {
  titleEn: string;
  descriptionEn: string;
  titleZh: string;
  descriptionZh: string;
  titleJa: string;
  descriptionJa: string;
  titleAr: string;
  descriptionAr: string;
}

export function normalizePropertyLocaleFields(input: PropertyLocaleInput): PropertyLocaleFields {
  return {
    titleEn: input.titleEn?.trim() ?? "",
    descriptionEn: input.descriptionEn?.trim() ?? "",
    titleZh: input.titleZh?.trim() ?? "",
    descriptionZh: input.descriptionZh?.trim() ?? "",
    titleJa: input.titleJa?.trim() ?? "",
    descriptionJa: input.descriptionJa?.trim() ?? "",
    titleAr: input.titleAr?.trim() ?? "",
    descriptionAr: input.descriptionAr?.trim() ?? "",
  };
}

export const LOCALE_FORM_GROUPS: {
  locale: "en" | "zh" | "ja" | "ar";
  titleKey: keyof PropertyLocaleInput;
  descriptionKey: keyof PropertyLocaleInput;
  labelKey: "formLocaleEn" | "formLocaleZh" | "formLocaleJa" | "formLocaleAr";
}[] = [
  { locale: "en", titleKey: "titleEn", descriptionKey: "descriptionEn", labelKey: "formLocaleEn" },
  { locale: "zh", titleKey: "titleZh", descriptionKey: "descriptionZh", labelKey: "formLocaleZh" },
  { locale: "ja", titleKey: "titleJa", descriptionKey: "descriptionJa", labelKey: "formLocaleJa" },
  { locale: "ar", titleKey: "titleAr", descriptionKey: "descriptionAr", labelKey: "formLocaleAr" },
];
