import { NextResponse } from "next/server";
import { adminRouteError, requireAdmin } from "@/lib/admin";
import { prisma } from "@/lib/db";
import { dbPropertyToListing } from "@/lib/user-properties";
import { propertySchema } from "@/lib/validation";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function PUT(request: Request, context: RouteContext) {
  try {
    await requireAdmin();
    const { id } = await context.params;

    const existing = await prisma.userProperty.findUnique({ where: { id } });
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

    // Admin is the moderator — keep the current status (no reset to pending).
    const property = await prisma.userProperty.update({
      where: { id },
      data: {
        title: data.title,
        description: data.description,
        listingType: data.listingType,
        propertyType: data.propertyType,
        price: data.price,
        priceUnit,
        bedrooms: data.bedrooms,
        bathrooms: data.bathrooms,
        areaSqm: data.areaSqm,
        floor: data.floor,
        district: data.district,
        btsStation: data.btsStation,
        address: data.address,
        latitude: data.latitude,
        longitude: data.longitude,
        features: JSON.stringify(data.features),
        images: JSON.stringify(data.images),
      },
    });

    return NextResponse.json({
      property: dbPropertyToListing(property),
      message: "บันทึกการแก้ไขแล้ว",
    });
  } catch (error) {
    return adminRouteError(error, "แก้ไขประกาศไม่สำเร็จ");
  }
}

export async function PATCH(request: Request, context: RouteContext) {
  try {
    await requireAdmin();
    const { id } = await context.params;
    const { status } = (await request.json()) as { status?: string };

    if (!status || !["pending", "published", "rejected", "deleted"].includes(status)) {
      return NextResponse.json({ error: "สถานะไม่ถูกต้อง" }, { status: 400 });
    }

    const property = await prisma.userProperty.update({
      where: { id },
      data: { status },
    });

    return NextResponse.json({ property });
  } catch (error) {
    return adminRouteError(error, "อัปเดตไม่สำเร็จ");
  }
}
