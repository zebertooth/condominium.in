import { NextResponse } from "next/server";
import { unsubscribeNewsletterEmail } from "@/lib/newsletter-unsubscribe";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get("email");
  const token = searchParams.get("token");

  if (!email || !token) {
    return NextResponse.json({ error: "Missing email or token" }, { status: 400 });
  }

  const ok = await unsubscribeNewsletterEmail(email, token);
  if (!ok) {
    return NextResponse.json({ error: "Invalid or expired link" }, { status: 400 });
  }

  return NextResponse.json({ success: true });
}
