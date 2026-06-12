import { NextResponse } from "next/server";
import { adminRouteError, requireAdmin } from "@/lib/admin";
import { hashPassword } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { parseRequestJson } from "@/lib/request";
import { adminCreateUserSchema, normalizePhone } from "@/lib/validation";

const userSelect = {
  id: true,
  fullName: true,
  phone: true,
  email: true,
  phoneVerified: true,
  emailVerified: true,
  idVerified: true,
  role: true,
  listingLimitOverride: true,
  createdAt: true,
  _count: { select: { properties: true } },
} as const;

export async function GET(request: Request) {
  try {
    await requireAdmin();
    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q")?.trim() ?? "";

    const users = await prisma.user.findMany({
      where: q
        ? {
            OR: [
              { fullName: { contains: q, mode: "insensitive" } },
              { email: { contains: q, mode: "insensitive" } },
              { phone: { contains: q.replace(/\D/g, "") } },
            ],
          }
        : undefined,
      orderBy: { createdAt: "desc" },
      select: userSelect,
    });

    return NextResponse.json({ users });
  } catch (error) {
    return adminRouteError(error, "โหลดผู้ใช้ไม่สำเร็จ");
  }
}

export async function POST(request: Request) {
  try {
    await requireAdmin();
    const body = await parseRequestJson(request);
    const parsed = adminCreateUserSchema.safeParse(body);

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
        role: parsed.data.role,
        isThai: parsed.data.isThai ?? true,
        phoneVerified: parsed.data.phoneVerified ?? false,
        emailVerified: parsed.data.emailVerified ?? false,
      },
      select: userSelect,
    });

    return NextResponse.json({ message: "เพิ่มผู้ใช้แล้ว", user });
  } catch (error) {
    return adminRouteError(error, "เพิ่มผู้ใช้ไม่สำเร็จ");
  }
}
