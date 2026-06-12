import { NextResponse } from "next/server";
import { adminRouteError, requireAdmin } from "@/lib/admin";
import { prisma } from "@/lib/db";
import { parseRequestJson } from "@/lib/request";
import { teamAgentSchema } from "@/lib/content-validation";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function PATCH(request: Request, context: RouteContext) {
  try {
    await requireAdmin();
    const { id } = await context.params;
    const body = await parseRequestJson(request);
    const parsed = teamAgentSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "ข้อมูลไม่ถูกต้อง" },
        { status: 400 },
      );
    }

    const data = parsed.data;
    const agent = await prisma.teamAgent.update({
      where: { id },
      data: {
        name: data.name,
        role: data.role,
        roleEn: data.roleEn ?? "",
        areas: JSON.stringify(data.areas),
        languages: JSON.stringify(data.languages),
        deals: data.deals,
        imageUrl: data.imageUrl ?? "",
        sortOrder: data.sortOrder,
        published: data.published,
      },
    });

    return NextResponse.json({ message: "บันทึกแล้ว", agent });
  } catch (error) {
    return adminRouteError(error, "บันทึกไม่สำเร็จ");
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  try {
    await requireAdmin();
    const { id } = await context.params;
    await prisma.teamAgent.delete({ where: { id } });
    return NextResponse.json({ message: "ลบแล้ว" });
  } catch (error) {
    return adminRouteError(error, "ลบไม่สำเร็จ");
  }
}
