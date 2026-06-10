import type { Locale } from "@/lib/i18n";

/** Non-Thai UI locales use English article/area content until per-locale fields exist. */
export function usesEnglishContent(locale: Locale): boolean {
  return locale !== "th";
}

export function isRtlLocale(locale: Locale): boolean {
  return locale === "ar";
}

export function htmlLang(locale: Locale): string {
  const map: Record<Locale, string> = {
    th: "th",
    en: "en",
    zh: "zh-Hans",
    ja: "ja",
    ar: "ar",
  };
  return map[locale];
}

export function dateLocale(locale: Locale): string {
  const map: Record<Locale, string> = {
    th: "th-TH",
    en: "en-US",
    zh: "zh-CN",
    ja: "ja-JP",
    ar: "ar-SA",
  };
  return map[locale];
}

export function numberLocale(locale: Locale): string {
  return dateLocale(locale);
}
