import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { exchangeLineCode } from "@/lib/line";

const STATE_COOKIE = "line_oauth_state";

export async function GET(request: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const state = searchParams.get("state");

  const cookieStore = await cookies();
  const savedState = cookieStore.get(STATE_COOKIE)?.value;
  cookieStore.delete(STATE_COOKIE);

  if (!code || !state || !savedState || state !== savedState) {
    return NextResponse.redirect(new URL("/dashboard/verify?line=error", request.url));
  }

  const profile = await exchangeLineCode(code);
  if (!profile) {
    return NextResponse.redirect(new URL("/dashboard/verify?line=error", request.url));
  }

  // Prevent the same LINE account verifying multiple users.
  const existing = await prisma.user.findFirst({
    where: { lineUserId: profile.userId, NOT: { id: user.id } },
  });
  if (existing) {
    return NextResponse.redirect(new URL("/dashboard/verify?line=duplicate", request.url));
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { lineVerified: true, lineUserId: profile.userId },
  });

  return NextResponse.redirect(new URL("/dashboard/verify?line=success", request.url));
}
