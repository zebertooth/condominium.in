import { NextResponse } from "next/server";
import { adminRouteError, requireAdmin } from "@/lib/admin";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    await requireAdmin();
    const reviews = await prisma.agentReview.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        user: { select: { fullName: true, email: true } },
        teamAgent: { select: { name: true } },
      },
    });
    return NextResponse.json({ reviews });
  } catch (error) {
    return adminRouteError(error, "โหลดรีวิวไม่สำเร็จ");
  }
}

export async function PATCH(request: Request) {
  try {
    await requireAdmin();
    const body = (await request.json()) as { id?: string; status?: string };
    if (!body.id || !body.status) {
      return NextResponse.json({ error: "ข้อมูลไม่ครบ" }, { status: 400 });
    }
    if (!["approved", "rejected", "pending"].includes(body.status)) {
      return NextResponse.json({ error: "สถานะไม่ถูกต้อง" }, { status: 400 });
    }

    const review = await prisma.agentReview.update({
      where: { id: body.id },
      data: { status: body.status },
    });
    return NextResponse.json({ review });
  } catch (error) {
    return adminRouteError(error, "อัปเดตรีวิวไม่สำเร็จ");
  }
}
