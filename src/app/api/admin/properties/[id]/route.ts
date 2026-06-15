import { NextResponse } from "next/server";
import { adminRouteError, requireAdmin } from "@/lib/admin";
import { prisma } from "@/lib/db";
import { logPriceChange } from "@/lib/price-history";
import { normalizePropertyLocaleFields } from "@/lib/property-locale-fields";
import { validateProjectId } from "@/lib/projects";
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
    const projectId = await validateProjectId(data.projectId);
    const localeFields = normalizePropertyLocaleFields(data);

    // Admin is the moderator — keep the current status (no reset to pending).
    const property = await prisma.userProperty.update({
      where: { id },
      data: {
        title: data.title,
        description: data.description,
        ...localeFields,
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
        projectId,
      },
    });

    await logPriceChange(property.id, data.price, data.listingType, {
      price: existing.price,
      listingType: existing.listingType,
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
    const body = (await request.json()) as {
      status?: string;
      needsReview?: boolean;
      isSponsored?: boolean;
      sponsoredUntil?: string | null;
    };

    const data: {
      status?: string;
      needsReview?: boolean;
      moderationFlags?: string;
      isSponsored?: boolean;
      sponsoredUntil?: Date | null;
    } = {};

    if (body.status !== undefined) {
      if (!["pending", "published", "rejected", "deleted"].includes(body.status)) {
        return NextResponse.json({ error: "สถานะไม่ถูกต้อง" }, { status: 400 });
      }
      data.status = body.status;
      if (body.status === "rejected" || body.status === "deleted") {
        data.needsReview = false;
        data.moderationFlags = "[]";
      }
    }

    if (body.needsReview === false) {
      data.needsReview = false;
    }

    if (body.isSponsored !== undefined) {
      data.isSponsored = body.isSponsored;
      if (!body.isSponsored) {
        data.sponsoredUntil = null;
      }
    }

    if (body.sponsoredUntil !== undefined) {
      if (body.sponsoredUntil === null || body.sponsoredUntil === "") {
        data.sponsoredUntil = null;
      } else {
        const until = new Date(body.sponsoredUntil);
        if (Number.isNaN(until.getTime())) {
          return NextResponse.json({ error: "วันหมดอายุไม่ถูกต้อง" }, { status: 400 });
        }
        data.sponsoredUntil = until;
        data.isSponsored = true;
      }
    }

    if (Object.keys(data).length === 0) {
      return NextResponse.json({ error: "ไม่มีข้อมูลที่จะอัปเดต" }, { status: 400 });
    }

    const property = await prisma.userProperty.update({
      where: { id },
      data,
    });

    return NextResponse.json({ property: dbPropertyToListing(property) });
  } catch (error) {
    return adminRouteError(error, "อัปเดตไม่สำเร็จ");
  }
}