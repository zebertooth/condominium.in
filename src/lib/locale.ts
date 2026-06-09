import { cookies } from "next/headers";
import type { Locale } from "@/lib/i18n";

export const LOCALE_COOKIE = "condo_locale";

export async function getLocale(): Promise<Locale> {
  const store = await cookies();
  const value = store.get(LOCALE_COOKIE)?.value;
  return value === "en" ? "en" : "th";
}

export function isValidLocale(value: string): value is Locale {
  return value === "th" || value === "en";
}
