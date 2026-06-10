import { NextResponse } from "next/server";
import { adminRouteError, requireAdmin } from "@/lib/admin";
import { prisma } from "@/lib/db";

const ALLOWED = ["pending", "published", "rejected", "deleted"];

export async function POST(request: Request) {
  try {
    await requireAdmin();
    const { ids, status } = (await request.json()) as { ids?: string[]; status?: string };

    if (!Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ error: "กรุณาเลือกประกาศอย่างน้อยหนึ่งรายการ" }, { status: 400 });
    }

    if (!status || !ALLOWED.includes(status)) {
      return NextResponse.json({ error: "สถานะไม่ถูกต้อง" }, { status: 400 });
    }

    const result = await prisma.userProperty.updateMany({
      where: { id: { in: ids } },
      data: { status },
    });

    return NextResponse.json({ updated: result.count });
  } catch (error) {
    return adminRouteError(error, "อัปเดตไม่สำเร็จ");
  }
}
