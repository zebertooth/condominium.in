import { NextResponse } from "next/server";
import { getTurnstileSiteKey, isCaptchaEnabled } from "@/lib/captcha";

export async function GET() {
  const enabled = isCaptchaEnabled();
  const siteKey = enabled ? getTurnstileSiteKey() : null;

  return NextResponse.json({
    enabled,
    siteKey,
  });
}
