import type { Locale } from "@/lib/i18n";

export const LOCALE_COOKIE = "condo_locale";

const VALID_LOCALES = new Set<Locale>(["th", "en", "zh", "ja", "ar"]);

export function isValidLocale(value: string): value is Locale {
  return VALID_LOCALES.has(value as Locale);
}

export function parseLocaleCookie(value: string | undefined): Locale {
  if (value && isValidLocale(value)) return value;
  return "th";
}
