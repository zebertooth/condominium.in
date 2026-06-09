import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    await requireAdmin();
    const users = await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        fullName: true,
        phone: true,
        email: true,
        phoneVerified: true,
        emailVerified: true,
        idVerified: true,
        role: true,
        createdAt: true,
        _count: { select: { properties: true } },
      },
    });
    return NextResponse.json({ users });
  } catch {
    return NextResponse.json({ error: "ไม่มีสิทธิ์เข้าถึง" }, { status: 403 });
  }
}
