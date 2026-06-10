import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { sendPhoneOtp } from "@/lib/otp";
import { smsProviderConfigured } from "@/lib/notifications";
import { rateLimit } from "@/lib/rate-limit";
import { parseRequestJson } from "@/lib/request";
import { phoneSchema } from "@/lib/validation";

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "กรุณาเข้าสู่ระบบ" }, { status: 401 });
    }

    if (!user.phone) {
      return NextResponse.json({ error: "บัญชีนี้ไม่มีเบอร์โทร" }, { status: 400 });
    }

    const limit = rateLimit(`send-otp:${user.id}`, 3, 5 * 60_000);
    if (!limit.allowed) {
      return NextResponse.json(
        { error: `ขอ OTP บ่อยเกินไป กรุณารออีก ${limit.retryAfterSec} วินาที` },
        { status: 429, headers: { "Retry-After": String(limit.retryAfterSec) } },
      );
    }

    const body = await parseRequestJson(request);
    const parsed = phoneSchema.safeParse(body.phone ?? user.phone);

    if (!parsed.success) {
      return NextResponse.json({ error: "เบอร์โทรไม่ถูกต้อง" }, { status: 400 });
    }

    const result = await sendPhoneOtp(parsed.data);

    if (result.delivered) {
      return NextResponse.json({ message: "ส่งรหัส OTP แล้ว" });
    }

    if (!smsProviderConfigured()) {
      return NextResponse.json({
        message: "ระบบ SMS ยังไม่ได้ตั้งค่า — ใช้รหัสด้านล่างเพื่อยืนยัน",
        devCode: result.devCode,
        warning: "Set THAIBULKSMS_* on Vercel",
      });
    }

    return NextResponse.json({
      message: "ส่ง SMS ไม่สำเร็จ — ใช้รหัสด้านล่างเพื่อยืนยัน (ตรวจสอบ THAIBULKSMS sender)",
      devCode: result.devCode,
      warning: result.deliveryError,
    });
  } catch (error) {
    console.error("[send-otp]", error);
    return NextResponse.json({ error: "ส่ง OTP ไม่สำเร็จ" }, { status: 500 });
  }
}
