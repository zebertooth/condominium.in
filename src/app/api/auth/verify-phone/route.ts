import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { verifyPhoneOtp } from "@/lib/otp";

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "กรุณาเข้าสู่ระบบ" }, { status: 401 });
    }

    if (!user.phone) {
      return NextResponse.json({ error: "บัญชีนี้ไม่มีเบอร์โทร" }, { status: 400 });
    }

    const { code } = (await request.json()) as { code?: string };
    if (!code || code.length !== 6) {
      return NextResponse.json({ error: "กรุณากรอกรหัส OTP 6 หลัก" }, { status: 400 });
    }

    const ok = await verifyPhoneOtp(user.phone, code);
    if (!ok) {
      return NextResponse.json({ error: "รหัส OTP ไม่ถูกต้องหรือหมดอายุ" }, { status: 400 });
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { phoneVerified: true },
    });

    return NextResponse.json({ message: "ยืนยันเบอร์โทรสำเร็จ", phoneVerified: true });
  } catch {
    return NextResponse.json({ error: "เกิดข้อผิดพลาด" }, { status: 500 });
  }
}
