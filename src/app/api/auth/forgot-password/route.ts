import { NextResponse } from "next/server";
import { requestPasswordReset } from "@/lib/password-reset";
import { getClientIp, rateLimit } from "@/lib/rate-limit";
import { parseRequestJson } from "@/lib/request";
import { forgotPasswordSchema } from "@/lib/validation";

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request);
    const ipLimit = rateLimit(`forgot-password:ip:${ip}`, 5, 15 * 60_000);
    if (!ipLimit.allowed) {
      return NextResponse.json(
        { error: `ขอรีเซ็ตรหัสผ่านบ่อยเกินไป กรุณารออีก ${ipLimit.retryAfterSec} วินาที` },
        { status: 429, headers: { "Retry-After": String(ipLimit.retryAfterSec) } },
      );
    }

    const body = await parseRequestJson(request);
    const parsed = forgotPasswordSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "อีเมลไม่ถูกต้อง" }, { status: 400 });
    }

    const emailLimit = rateLimit(
      `forgot-password:email:${parsed.data.email}`,
      3,
      15 * 60_000,
    );
    if (!emailLimit.allowed) {
      return NextResponse.json(
        { error: `ขอรีเซ็ตรหัสผ่านบ่อยเกินไป กรุณารออีก ${emailLimit.retryAfterSec} วินาที` },
        { status: 429, headers: { "Retry-After": String(emailLimit.retryAfterSec) } },
      );
    }

    const result = await requestPasswordReset(parsed.data.email);
    if (!result.sent) {
      return NextResponse.json({
        message:
          "ไม่สามารถส่งอีเมลได้ในขณะนี้ — หากบัญชีมีอีเมลในระบบ กรุณาลองใหม่ภายหลัง",
        warning: result.error,
      });
    }

    return NextResponse.json({
      message:
        "หากอีเมลนี้มีในระบบ เราได้ส่งลิงก์รีเซ็ตรหัสผ่านไปแล้ว — ตรวจสอบกล่องจดหมายและโฟลเดอร์สแปม",
    });
  } catch (error) {
    console.error("[forgot-password]", error);
    return NextResponse.json({ error: "เกิดข้อผิดพลาด" }, { status: 500 });
  }
}
