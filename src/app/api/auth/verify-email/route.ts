import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { verifyEmailOtp } from "@/lib/email-otp";

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "กรุณาเข้าสู่ระบบ" }, { status: 401 });
    }

    if (!user.email) {
      return NextResponse.json({ error: "บัญชีนี้ไม่มีอีเมล" }, { status: 400 });
    }

    const { code } = (await request.json()) as { code?: string };
    if (!code || code.length !== 6) {
      return NextResponse.json({ error: "กรุณากรอกรหัส OTP 6 หลัก" }, { status: 400 });
    }

    const ok = await verifyEmailOtp(user.email, code);
    if (!ok) {
      return NextResponse.json({ error: "รหัส OTP ไม่ถูกต้องหรือหมดอายุ" }, { status: 400 });
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { emailVerified: true },
    });

    return NextResponse.json({ message: "ยืนยันอีเมลสำเร็จ", emailVerified: true });
  } catch {
    return NextResponse.json({ error: "เกิดข้อผิดพลาด" }, { status: 500 });
  }
}
