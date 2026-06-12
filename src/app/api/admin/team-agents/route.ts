import { NextResponse } from "next/server";
import { adminRouteError, requireAdmin } from "@/lib/admin";
import { prisma } from "@/lib/db";
import { parseRequestJson } from "@/lib/request";
import { teamAgentSchema } from "@/lib/content-validation";
import { getAllTeamAgents } from "@/lib/team-agents";

export async function GET() {
  try {
    await requireAdmin();
    const agents = await getAllTeamAgents();
    return NextResponse.json({ agents });
  } catch (error) {
    return adminRouteError(error, "โหลดทีมเอเจนต์ไม่สำเร็จ");
  }
}

export async function POST(request: Request) {
  try {
    await requireAdmin();
    const body = await parseRequestJson(request);
    const parsed = teamAgentSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "ข้อมูลไม่ถูกต้อง" },
        { status: 400 },
      );
    }

    const data = parsed.data;
    const agent = await prisma.teamAgent.create({
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

    return NextResponse.json({ message: "เพิ่มสมาชิกทีมแล้ว", agent });
  } catch (error) {
    return adminRouteError(error, "เพิ่มสมาชิกทีมไม่สำเร็จ");
  }
}
