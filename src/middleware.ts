import { NextRequest, NextResponse } from "next/server";
import type { Locale } from "@/lib/i18n";
import { isValidLocale, LOCALE_COOKIE } from "@/lib/locale-constants";
import { LOCALE_HEADER, normalizeInternalPath } from "@/lib/locale-routing";

const SKIP_PREFIXES = ["/api", "/_next", "/uploads"];

const COOKIE_OPTS = {
  path: "/",
  maxAge: 60 * 60 * 24 * 365,
  sameSite: "lax" as const,
};

function shouldSkip(pathname: string): boolean {
  if (SKIP_PREFIXES.some((prefix) => pathname.startsWith(prefix))) return true;
  return /\.[a-zA-Z0-9]+$/.test(pathname);
}

function cookieLocale(request: NextRequest): Locale {
  const value = request.cookies.get(LOCALE_COOKIE)?.value;
  return value && isValidLocale(value) ? value : "th";
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (shouldSkip(pathname)) {
    return NextResponse.next();
  }

  // Admin/dashboard keep cookie preference; no URL prefix convention.
  if (pathname.startsWith("/admin") || pathname.startsWith("/dashboard")) {
    const locale = cookieLocale(request);
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set(LOCALE_HEADER, locale);
    return NextResponse.next({ request: { headers: requestHeaders } });
  }

  const segments = pathname.split("/").filter(Boolean);
  const first = segments[0];

  if (first === "th") {
    const stripped = normalizeInternalPath("/" + segments.slice(1).join("/"));
    return NextResponse.redirect(new URL(stripped, request.url));
  }

  if (first && isValidLocale(first) && first !== "th") {
    const locale = first as Locale;
    const stripped = normalizeInternalPath("/" + segments.slice(1).join("/"));
    const url = request.nextUrl.clone();
    url.pathname = stripped;

    const requestHeaders = new Headers(request.headers);
    requestHeaders.set(LOCALE_HEADER, locale);

    const response = NextResponse.rewrite(url, { request: { headers: requestHeaders } });
    response.cookies.set(LOCALE_COOKIE, locale, COOKIE_OPTS);
    return response;
  }

  // Unprefixed public URLs = Thai default. Reset cookie so locale cannot leak from /ja/... visits.
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set(LOCALE_HEADER, "th");

  const response = NextResponse.next({ request: { headers: requestHeaders } });
  response.cookies.set(LOCALE_COOKIE, "th", COOKIE_OPTS);
  return response;
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|icon.svg|apple-icon.svg|logo.svg|robots.txt|sitemap.xml|uploads).*)",
  ],
};
