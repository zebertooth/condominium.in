import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { prisma } from "@/lib/db";
import { dbPropertyToListing } from "@/lib/user-properties";

export async function GET(request: Request) {
  try {
    await requireAdmin();
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");

    const properties = await prisma.userProperty.findMany({
      where: status ? { status } : undefined,
      orderBy: { createdAt: "desc" },
      include: {
        user: { select: { fullName: true, phone: true, email: true } },
      },
    });

    return NextResponse.json({
      properties: properties.map((p) => ({
        ...dbPropertyToListing(p),
        ownerName: p.user.fullName,
        ownerPhone: p.user.phone,
        ownerEmail: p.user.email,
      })),
    });
  } catch {
    return NextResponse.json({ error: "ไม่มีสิทธิ์เข้าถึง" }, { status: 403 });
  }
}
