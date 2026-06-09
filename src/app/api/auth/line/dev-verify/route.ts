import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { lineConfigured } from "@/lib/line";

/**
 * Development-only fallback to mark LINE as verified without a real LINE channel.
 * Disabled whenever LINE is properly configured or running in production.
 */
export async function POST() {
  if (process.env.NODE_ENV === "production" || lineConfigured()) {
    return NextResponse.json({ error: "ไม่พร้อมใช้งาน" }, { status: 403 });
  }

  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "กรุณาเข้าสู่ระบบ" }, { status: 401 });
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { lineVerified: true },
  });

  return NextResponse.json({ message: "ยืนยัน LINE (โหมดทดสอบ) สำเร็จ", lineVerified: true });
}
