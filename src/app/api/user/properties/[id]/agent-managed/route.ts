import { NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { dbPropertyToListing } from "@/lib/user-properties";

interface RouteContext {
  params: Promise<{ id: string }>;
}

const bodySchema = z.object({
  agentManaged: z.boolean(),
});

export async function PATCH(request: Request, context: RouteContext) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "กรุณาเข้าสู่ระบบ" }, { status: 401 });
    }

    if (user.role !== "user") {
      return NextResponse.json(
        { error: "เฉพาะเจ้าของประกาศเท่านั้นที่เปลี่ยนโหมดเอเจนต์ดูแลได้" },
        { status: 403 },
      );
    }

    const { id } = await context.params;
    const existing = await prisma.userProperty.findFirst({
      where: { id, userId: user.id, status: { not: "deleted" } },
    });

    if (!existing) {
      return NextResponse.json({ error: "ไม่พบประกาศ" }, { status: 404 });
    }

    const body = await request.json();
    const parsed = bodySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "ข้อมูลไม่ถูกต้อง" }, { status: 400 });
    }

    const property = await prisma.userProperty.update({
      where: { id },
      data: { agentManaged: parsed.data.agentManaged },
    });

    return NextResponse.json({
      property: dbPropertyToListing(property),
      message: parsed.data.agentManaged
        ? "เปิดโหมดเอเจนต์ดูแลแล้ว — ลูกค้าจะติดต่อทีมเอเจนต์"
        : "เปลี่ยนเป็นติดต่อเจ้าของโดยตรงแล้ว",
    });
  } catch {
    return NextResponse.json({ error: "บันทึกไม่สำเร็จ" }, { status: 500 });
  }
}
