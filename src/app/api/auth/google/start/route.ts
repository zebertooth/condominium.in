import { randomUUID } from "crypto";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { getGoogleAuthUrl, googleConfigured } from "@/lib/google-oauth";

const STATE_COOKIE = "google_oauth_state";

export async function GET(request: Request) {
  if (!googleConfigured()) {
    return NextResponse.redirect(new URL("/login?oauth=google-unconfigured", request.url));
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

  return NextResponse.redirect(getGoogleAuthUrl(state));
}
