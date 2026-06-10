import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { sendEmailOtp } from "@/lib/email-otp";
import { rateLimit } from "@/lib/rate-limit";
import { parseRequestJson } from "@/lib/request";
import { emailSchema } from "@/lib/validation";

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "กรุณาเข้าสู่ระบบ" }, { status: 401 });
    }

    if (!user.email) {
      return NextResponse.json({ error: "บัญชีนี้ไม่มีอีเมล" }, { status: 400 });
    }

    const limit = rateLimit(`send-email-otp:${user.id}`, 3, 5 * 60_000); // 3 emails / 5 min / user
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

    if (parsed.data !== user.email) {
      return NextResponse.json({ error: "อีเมลไม่ตรงกับบัญชี" }, { status: 400 });
    }

    const result = await sendEmailOtp(parsed.data);

    return NextResponse.json({
      message: "ส่งรหัส OTP ไปที่อีเมลแล้ว",
      ...(result.devCode ? { devCode: result.devCode } : {}),
    });
  } catch {
    return NextResponse.json({ error: "ส่ง OTP ไม่สำเร็จ" }, { status: 500 });
  }
}
