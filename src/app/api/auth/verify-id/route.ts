import { NextResponse } from "next/server";
import { getCurrentUser, hashIdCard, isContactVerified } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { verifyIdSchema } from "@/lib/validation";

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "กรุณาเข้าสู่ระบบ" }, { status: 401 });
    }

    if (!isContactVerified(user)) {
      return NextResponse.json({ error: "กรุณายืนยันเบอร์โทรหรืออีเมลก่อน" }, { status: 400 });
    }

    const body = await request.json();
    const parsed = verifyIdSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "เลขบัตรไม่ถูกต้อง" },
        { status: 400 },
      );
    }

    const idCardHash = await hashIdCard(parsed.data.idCardNumber);

    const duplicate = await prisma.user.findFirst({
      where: { idCardHash, NOT: { id: user.id } },
    });

    if (duplicate) {
      return NextResponse.json(
        { error: "เลขบัตรประชาชนนี้ถูกใช้ลงทะเบียนแล้ว" },
        { status: 409 },
      );
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        idCardHash,
        idVerified: true,
        idSubmittedAt: new Date(),
      },
    });

    return NextResponse.json({
      message: "ยืนยันบัตรประชาชนสำเร็จ คุณสามารถลงประกาศได้สูงสุด 2 รายการ",
      idVerified: true,
    });
  } catch {
    return NextResponse.json({ error: "เกิดข้อผิดพลาด" }, { status: 500 });
  }
}
