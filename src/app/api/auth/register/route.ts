import { NextResponse } from "next/server";
import { createSession, hashPassword, setSessionCookie } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { normalizePhone, registerSchema } from "@/lib/validation";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = registerSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "ข้อมูลไม่ถูกต้อง" },
        { status: 400 },
      );
    }

    const phone = parsed.data.phone ? normalizePhone(parsed.data.phone) : null;
    const email = parsed.data.email?.trim().toLowerCase() || null;

    if (phone) {
      const existingPhone = await prisma.user.findUnique({ where: { phone } });
      if (existingPhone) {
        return NextResponse.json({ error: "เบอร์โทรนี้ลงทะเบียนแล้ว" }, { status: 409 });
      }
    }

    if (email) {
      const existingEmail = await prisma.user.findUnique({ where: { email } });
      if (existingEmail) {
        return NextResponse.json({ error: "อีเมลนี้ลงทะเบียนแล้ว" }, { status: 409 });
      }
    }

    const passwordHash = await hashPassword(parsed.data.password);

    const user = await prisma.user.create({
      data: {
        phone,
        email,
        fullName: parsed.data.fullName,
        passwordHash,
        role: "user",
        isThai: parsed.data.isThai ?? true,
      },
    });

    const loginId = phone ?? email ?? user.id;
    const token = await createSession(user.id, loginId);
    await setSessionCookie(token);

    return NextResponse.json({
      user: {
        id: user.id,
        phone: user.phone,
        email: user.email,
        fullName: user.fullName,
        phoneVerified: user.phoneVerified,
        emailVerified: user.emailVerified,
        idVerified: user.idVerified,
        role: user.role,
      },
      message: user.isThai
        ? "สมัครสมาชิกสำเร็จ กรุณายืนยันตัวตนอย่างน้อย 2 ใน 3 ช่องทางก่อนลงประกาศ"
        : "สมัครสมาชิกสำเร็จ กรุณายืนยันอีเมลเพื่อใช้งาน (บัญชีชาวต่างชาติยังลงประกาศไม่ได้)",
    });
  } catch {
    return NextResponse.json({ error: "เกิดข้อผิดพลาด" }, { status: 500 });
  }
}
