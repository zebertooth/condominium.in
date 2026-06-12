import { NextResponse } from "next/server";
import { resetPasswordWithToken } from "@/lib/password-reset";
import { getClientIp, rateLimit } from "@/lib/rate-limit";
import { parseRequestJson } from "@/lib/request";
import { resetPasswordSchema } from "@/lib/validation";

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request);
    const limit = rateLimit(`reset-password:ip:${ip}`, 10, 15 * 60_000);
    if (!limit.allowed) {
      return NextResponse.json(
        { error: `ลองบ่อยเกินไป กรุณารออีก ${limit.retryAfterSec} วินาที` },
        { status: 429, headers: { "Retry-After": String(limit.retryAfterSec) } },
      );
    }

    const body = await parseRequestJson(request);
    const parsed = resetPasswordSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "ข้อมูลไม่ถูกต้อง" },
        { status: 400 },
      );
    }

    const result = await resetPasswordWithToken(parsed.data.token, parsed.data.password);
    if (!result.ok) {
      return NextResponse.json({ error: result.error ?? "รีเซ็ตไม่สำเร็จ" }, { status: 400 });
    }

    return NextResponse.json({ message: "ตั้งรหัสผ่านใหม่เรียบร้อยแล้ว" });
  } catch (error) {
    console.error("[reset-password]", error);
    return NextResponse.json({ error: "เกิดข้อผิดพลาด" }, { status: 500 });
  }
}
