import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { sendEmailOtp } from "@/lib/email-otp";
import { emailProviderConfigured } from "@/lib/notifications";
import { rateLimit } from "@/lib/rate-limit";
import { parseRequestJson } from "@/lib/request";
import { emailSchema } from "@/lib/validation";

function normalizeEmail(value: string | null | undefined): string | null {
  if (!value) return null;
  return value.toLowerCase().trim();
}

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "กรุณาเข้าสู่ระบบ" }, { status: 401 });
    }

    if (!user.email) {
      return NextResponse.json({ error: "บัญชีนี้ไม่มีอีเมล" }, { status: 400 });
    }

    const limit = rateLimit(`send-email-otp:${user.id}`, 3, 5 * 60_000);
    if (!limit.allowed) {
      return NextResponse.json(
        { error: `ขอ OTP บ่อยเกินไป กรุณารออีก ${limit.retryAfterSec} วินาที` },
        { status: 429, headers: { "Retry-After": String(limit.retryAfterSec) } },
      );
    }

    const body = await parseRequestJson(request);
    const parsed = emailSchema.safeParse(body.email ?? user.email);

    if (!parsed.success) {
      return NextResponse.json({ error: "อีเมลไม่ถูกต้อง" }, { status: 400 });
    }

    if (parsed.data !== normalizeEmail(user.email)) {
      return NextResponse.json({ error: "อีเมลไม่ตรงกับบัญชี" }, { status: 400 });
    }

    const result = await sendEmailOtp(parsed.data);

    if (result.delivered) {
      return NextResponse.json({ message: "ส่งรหัส OTP ไปที่อีเมลแล้ว" });
    }

    if (!emailProviderConfigured()) {
      return NextResponse.json({
        message: "ระบบอีเมลยังไม่ได้ตั้งค่า — ใช้รหัสด้านล่างเพื่อยืนยัน",
        devCode: result.devCode,
        warning: "Set RESEND_API_KEY and EMAIL_FROM on Vercel",
      });
    }

    return NextResponse.json({
      message:
        "ส่งอีเมลไม่สำเร็จ — ใช้รหัสด้านล่างเพื่อยืนยัน (ตรวจสอบ EMAIL_FROM ใน Resend)",
      devCode: result.devCode,
      warning: result.deliveryError,
    });
  } catch (error) {
    console.error("[send-email-otp]", error);
    return NextResponse.json({ error: "ส่ง OTP ไม่สำเร็จ" }, { status: 500 });
  }
}
