import { cookies, headers } from "next/headers";
import type { Locale } from "@/lib/i18n";
import { isValidLocale, LOCALE_COOKIE, parseLocaleCookie } from "@/lib/locale-constants";
import { LOCALE_HEADER } from "@/lib/locale-routing";

export { LOCALE_COOKIE, isValidLocale, parseLocaleCookie } from "@/lib/locale-constants";

/** Locale from middleware header only — never infer from cookie on public pages. */
export async function getLocale(): Promise<Locale> {
  const headerStore = await headers();
  const fromHeader = headerStore.get(LOCALE_HEADER);
  if (fromHeader && isValidLocale(fromHeader)) return fromHeader;
  return "th";
}

/** Cookie locale for admin/dashboard routes (also mirrored to LOCALE_HEADER in middleware). */
export async function getLocaleFromCookie(): Promise<Locale> {
  const store = await cookies();
  return parseLocaleCookie(store.get(LOCALE_COOKIE)?.value);
}
