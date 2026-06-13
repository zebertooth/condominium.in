import { NextResponse } from "next/server";
import { adminRouteError, requireAdmin } from "@/lib/admin";
import { projectSchema } from "@/lib/content-validation";
import { prisma } from "@/lib/db";
import { uniqueProjectSlug } from "@/lib/projects";
import { parseRequestJson } from "@/lib/request";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function PATCH(request: Request, context: RouteContext) {
  try {
    await requireAdmin();
    const { id } = await context.params;
    const body = await parseRequestJson(request);
    const parsed = projectSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "ข้อมูลไม่ถูกต้อง" },
        { status: 400 },
      );
    }

    const existing = await prisma.project.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "ไม่พบโครงการ" }, { status: 404 });
    }

    const data = parsed.data;
    const slug =
      data.name !== existing.name
        ? await uniqueProjectSlug(data.name, id)
        : existing.slug;
    const completionDate = data.completionDate ? new Date(data.completionDate) : null;

    const project = await prisma.project.update({
      where: { id },
      data: {
        slug,
        name: data.name,
        nameEn: data.nameEn ?? "",
        developer: data.developer,
        location: data.location,
        district: data.district ?? "",
        btsStation: data.btsStation,
        amenities: JSON.stringify(data.amenities),
        totalUnits: data.totalUnits,
        completionDate,
        imageUrl: data.imageUrl ?? "",
        description: data.description ?? "",
        descriptionEn: data.descriptionEn ?? "",
        published: data.published,
      },
    });

    return NextResponse.json({ message: "บันทึกแล้ว", project });
  } catch (error) {
    return adminRouteError(error, "บันทึกไม่สำเร็จ");
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  try {
    await requireAdmin();
    const { id } = await context.params;
    await prisma.project.delete({ where: { id } });
    return NextResponse.json({ message: "ลบแล้ว" });
  } catch (error) {
    return adminRouteError(error, "ลบไม่สำเร็จ");
  }
}
