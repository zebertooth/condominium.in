import { NextResponse } from "next/server";
import { adminRouteError, requireAdmin } from "@/lib/admin";
import { projectSchema } from "@/lib/content-validation";
import { prisma } from "@/lib/db";
import { getAllProjects, uniqueProjectSlug } from "@/lib/projects";
import { parseRequestJson } from "@/lib/request";

export async function GET() {
  try {
    await requireAdmin();
    const projects = await getAllProjects();
    return NextResponse.json({ projects });
  } catch (error) {
    return adminRouteError(error, "โหลดโครงการไม่สำเร็จ");
  }
}

export async function POST(request: Request) {
  try {
    await requireAdmin();
    const body = await parseRequestJson(request);
    const parsed = projectSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "ข้อมูลไม่ถูกต้อง" },
        { status: 400 },
      );
    }

    const data = parsed.data;
    const slug = await uniqueProjectSlug(data.name);
    const completionDate = data.completionDate ? new Date(data.completionDate) : null;

    const project = await prisma.project.create({
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

    return NextResponse.json({ message: "เพิ่มโครงการแล้ว", project });
  } catch (error) {
    return adminRouteError(error, "เพิ่มโครงการไม่สำเร็จ");
  }
}
