import { randomUUID } from "crypto";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { getFacebookAuthUrl, facebookConfigured } from "@/lib/facebook-oauth";

const STATE_COOKIE = "facebook_oauth_state";

export async function GET(request: Request) {
  if (!facebookConfigured()) {
    return NextResponse.redirect(new URL("/login?oauth=facebook-unconfigured", request.url));
  }

  const state = randomUUID();
  const cookieStore = await cookies();
  cookieStore.set(STATE_COOKIE, state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 600,
  });

  return NextResponse.redirect(getFacebookAuthUrl(state));
}
