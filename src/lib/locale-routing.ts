import type { Locale } from "@/lib/i18n";
import { isValidLocale } from "@/lib/locale-constants";

/** Set by middleware on locale-prefixed rewrites. */
export const LOCALE_HEADER = "x-condo-locale";

export const LOCALE_PREFIXED: Locale[] = ["en", "zh", "ja", "ar"];

export function normalizeInternalPath(path: string): string {
  if (!path || path === "/") return "/";
  return path.startsWith("/") ? path : `/${path}`;
}

/** Public URL path: Thai unprefixed (`/buy`), others prefixed (`/en/buy`). */
export function localePath(path: string, locale: Locale): string {
  const normalized = normalizeInternalPath(path);
  if (locale === "th") return normalized;
  if (normalized === "/") return `/${locale}`;
  return `/${locale}${normalized}`;
}

export function stripLocaleFromPath(pathname: string): { locale: Locale; path: string } {
  const segments = pathname.split("/").filter(Boolean);
  const first = segments[0];

  if (first && isValidLocale(first)) {
    return {
      locale: first,
      path: normalizeInternalPath("/" + segments.slice(1).join("/")),
    };
  }

  return { locale: "th", path: normalizeInternalPath(pathname) };
}

export function publicPageUrl(path: string, locale: Locale, siteUrl: string): string {
  const localized = localePath(path, locale);
  return localized === "/" ? `${siteUrl}/` : `${siteUrl}${localized}`;
}

export function localePathWithQuery(
  path: string,
  locale: Locale,
  query: Record<string, string | undefined>,
): string {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(query)) {
    if (value) params.set(key, value);
  }
  const qs = params.toString();
  const base = localePath(path, locale);
  return qs ? `${base}?${qs}` : base;
}

/** All locales for sitemap / hreflang expansion. */
export const ALL_LOCALES: Locale[] = ["th", ...LOCALE_PREFIXED];
