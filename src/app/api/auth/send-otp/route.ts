import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { sendPhoneOtp } from "@/lib/otp";
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

    const limit = rateLimit(`send-otp:${user.id}`, 3, 5 * 60_000); // 3 SMS / 5 min / user
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

    return NextResponse.json({
      message: "ส่งรหัส OTP แล้ว",
      ...(result.devCode ? { devCode: result.devCode } : {}),
    });
  } catch {
    return NextResponse.json({ error: "ส่ง OTP ไม่สำเร็จ" }, { status: 500 });
  }
}
