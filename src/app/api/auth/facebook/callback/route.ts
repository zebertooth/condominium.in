import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { exchangeFacebookCode } from "@/lib/facebook-oauth";
import { prisma } from "@/lib/db";
import { establishOAuthSession, loginOrRegisterOAuth } from "@/lib/oauth-users";

const STATE_COOKIE = "facebook_oauth_state";

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

  const profile = await exchangeFacebookCode(code);
  if (!profile) {
    return NextResponse.redirect(new URL("/login?oauth=error", request.url));
  }

  const { userId, loginId } = await loginOrRegisterOAuth({
    provider: "facebook",
    providerId: profile.id,
    email: profile.email,
    fullName: profile.name ?? "Facebook User",
  });

  await establishOAuthSession(userId, loginId);
  const user = await prisma.user.findUnique({ where: { id: userId }, select: { role: true } });
  const path = user?.role === "admin" ? "/admin" : "/dashboard";
  return NextResponse.redirect(new URL(path, request.url));
}
