import { cookies, headers } from "next/headers";
import type { Locale } from "@/lib/i18n";
import { isValidLocale, LOCALE_COOKIE, parseLocaleCookie } from "@/lib/locale-constants";
import { LOCALE_HEADER } from "@/lib/locale-routing";

export { LOCALE_COOKIE, isValidLocale, parseLocaleCookie } from "@/lib/locale-constants";

export async function getLocale(): Promise<Locale> {
  const headerStore = await headers();
  const fromHeader = headerStore.get(LOCALE_HEADER);
  if (fromHeader && isValidLocale(fromHeader)) return fromHeader;

  const store = await cookies();
  const value = store.get(LOCALE_COOKIE)?.value;
  if (value && isValidLocale(value)) return value;
  return "th";
}
