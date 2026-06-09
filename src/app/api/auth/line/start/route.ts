import { randomUUID } from "crypto";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { getLineAuthUrl, lineConfigured } from "@/lib/line";

const STATE_COOKIE = "line_oauth_state";

export async function GET(request: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (!lineConfigured()) {
    // No LINE channel configured — send back to verify page; dev fallback handles it.
    return NextResponse.redirect(new URL("/dashboard/verify?line=unconfigured", request.url));
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

  return NextResponse.redirect(getLineAuthUrl(state));
}
