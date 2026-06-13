import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { buildModerationUpdate } from "@/lib/listing-moderation";
import { validateProjectId } from "@/lib/projects";
import { getUserQuota } from "@/lib/quota";
import { dbPropertyToListing } from "@/lib/user-properties";
import { propertySchema } from "@/lib/validation";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function PUT(request: Request, context: RouteContext) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "กรุณาเข้าสู่ระบบ" }, { status: 401 });
    }

    const { id } = await context.params;
    const existing = await prisma.userProperty.findFirst({
      where: { id, userId: user.id, status: { not: "deleted" } },
    });

    if (!existing) {
      return NextResponse.json({ error: "ไม่พบประกาศ" }, { status: 404 });
    }

    const body = await request.json();
    const parsed = propertySchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "ข้อมูลไม่ครบ" },
        { status: 400 },
      );
    }

    const data = parsed.data;
    const priceUnit = data.listingType === "rent" ? "THB/month" : "THB";
    const projectId = await validateProjectId(data.projectId);
    const moderation = buildModerationUpdate(
      {
        title: data.title,
        description: data.description,
        highlights: data.highlights,
      },
      "edited",
    );

    const property = await prisma.userProperty.update({
      where: { id },
      data: {
        title: data.title,
        description: data.description,
        highlights: data.highlights ?? "",
        listingType: data.listingType,
        propertyType: data.propertyType,
        price: data.price,
        priceUnit,
        bedrooms: data.bedrooms,
        bathrooms: data.bathrooms,
        areaSqm: data.areaSqm,
        landSqWah: data.landSqWah,
        floor: data.floor,
        district: data.district,
        btsStation: data.btsStation,
        address: data.address,
        latitude: data.latitude,
        longitude: data.longitude,
        npaBank: data.npaBank,
        npaReferenceUrl: data.npaReferenceUrl,
        features: JSON.stringify(data.features),
        images: JSON.stringify(data.images),
        agentManaged: user.role === "user" ? (data.agentManaged ?? existing.agentManaged) : false,
        projectId,
        status: "published",
        ...moderation,
      },
    });

    return NextResponse.json({
      property: dbPropertyToListing(property),
      message: "บันทึกและเผยแพร่แล้ว ทีมงานจะตรวจสอบภายหลัง",
    });
  } catch {
    return NextResponse.json({ error: "แก้ไขประกาศไม่สำเร็จ" }, { status: 500 });
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "กรุณาเข้าสู่ระบบ" }, { status: 401 });
  }

  const { id } = await context.params;
  const property = await prisma.userProperty.findFirst({
    where: { id, userId: user.id },
  });

  if (!property) {
    return NextResponse.json({ error: "ไม่พบประกาศ" }, { status: 404 });
  }

  await prisma.userProperty.update({
    where: { id },
    data: { status: "deleted" },
  });

  const quota = await getUserQuota(user.id);
  return NextResponse.json({ message: "ลบประกาศแล้ว", quota });
}
