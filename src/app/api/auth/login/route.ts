import { NextResponse } from "next/server";
import { requireCaptcha } from "@/lib/captcha";
import { createSession, isContactVerified, setSessionCookie, verifyPassword } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { getClientIp } from "@/lib/rate-limit";
import { loginSchema, parseLoginIdentifier } from "@/lib/validation";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const captcha = await requireCaptcha(body.captchaToken, getClientIp(request));
    if (!captcha.ok) {
      return NextResponse.json({ error: captcha.error }, { status: captcha.status });
    }

    const parsed = loginSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "ข้อมูลไม่ถูกต้อง" }, { status: 400 });
    }

    const { phone, email } = parseLoginIdentifier(parsed.data.login);
    const user = phone
      ? await prisma.user.findUnique({ where: { phone } })
      : email
        ? await prisma.user.findUnique({ where: { email } })
        : null;

    if (!user || !(await verifyPassword(parsed.data.password, user.passwordHash))) {
      return NextResponse.json({ error: "ข้อมูลเข้าสู่ระบบหรือรหัสผ่านไม่ถูกต้อง" }, { status: 401 });
    }

    const loginId = user.phone ?? user.email ?? user.id;
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
        contactVerified: isContactVerified(user),
      },
    });
  } catch {
    return NextResponse.json({ error: "เกิดข้อผิดพลาด" }, { status: 500 });
  }
}
