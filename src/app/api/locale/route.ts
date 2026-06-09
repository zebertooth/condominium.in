import { NextResponse } from "next/server";
import { isValidLocale, LOCALE_COOKIE } from "@/lib/locale";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { locale?: string };
    if (!body.locale || !isValidLocale(body.locale)) {
      return NextResponse.json({ error: "Invalid locale" }, { status: 400 });
    }

    const res = NextResponse.json({ success: true, locale: body.locale });
    res.cookies.set(LOCALE_COOKIE, body.locale, {
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
      sameSite: "lax",
    });
    return res;
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
