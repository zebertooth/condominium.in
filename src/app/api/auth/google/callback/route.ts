import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { exchangeGoogleCode } from "@/lib/google-oauth";
import { establishOAuthSession, loginOrRegisterOAuth } from "@/lib/oauth-users";

const STATE_COOKIE = "google_oauth_state";

function redirectAfterLogin(request: Request, userId: string) {
  return prisma.user.findUnique({ where: { id: userId }, select: { role: true } }).then((user) => {
    const path = user?.role === "admin" ? "/admin" : "/dashboard";
    return NextResponse.redirect(new URL(path, request.url));
  });
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const state = searchParams.get("state");

  const cookieStore = await cookies();
  const savedState = cookieStore.get(STATE_COOKIE)?.value;
  cookieStore.delete(STATE_COOKIE);

  if (!code || !state || !savedState || state !== savedState) {
    return NextResponse.redirect(new URL("/login?oauth=error", request.url));
  }

  const profile = await exchangeGoogleCode(code);
  if (!profile) {
    return NextResponse.redirect(new URL("/login?oauth=error", request.url));
  }

  const { userId, loginId } = await loginOrRegisterOAuth({
    provider: "google",
    providerId: profile.id,
    email: profile.email,
    fullName: profile.name ?? "Google User",
  });

  await establishOAuthSession(userId, loginId);
  return redirectAfterLogin(request, userId);
}
