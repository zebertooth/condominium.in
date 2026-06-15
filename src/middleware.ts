import { NextRequest, NextResponse } from "next/server";
import type { Locale } from "@/lib/i18n";
import { isValidLocale, LOCALE_COOKIE } from "@/lib/locale-constants";
import { LOCALE_HEADER, normalizeInternalPath } from "@/lib/locale-routing";

const SKIP_PREFIXES = ["/api", "/_next", "/uploads", "/admin", "/dashboard"];

function shouldSkip(pathname: string): boolean {
  if (SKIP_PREFIXES.some((prefix) => pathname.startsWith(prefix))) return true;
  return /\.[a-zA-Z0-9]+$/.test(pathname);
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (shouldSkip(pathname)) {
    return NextResponse.next();
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
    response.cookies.set(LOCALE_COOKIE, locale, {
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
      sameSite: "lax",
    });
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|icon.svg|apple-icon.svg|logo.svg|robots.txt|sitemap.xml|uploads).*)",
  ],
};
