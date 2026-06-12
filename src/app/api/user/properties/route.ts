import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { getUserQuota } from "@/lib/quota";
import { dbPropertyToListing, uniqueSlug } from "@/lib/user-properties";
import { propertySchema } from "@/lib/validation";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "กรุณาเข้าสู่ระบบ" }, { status: 401 });
  }

  const properties = await prisma.userProperty.findMany({
    where: { userId: user.id, status: { not: "deleted" } },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({
    properties: properties.map(dbPropertyToListing),
  });
}

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "กรุณาเข้าสู่ระบบ" }, { status: 401 });
    }

    const quota = await getUserQuota(user.id);

    if (quota.postingBlocked) {
      return NextResponse.json(
        {
          error: "บัญชีชาวต่างชาติยังไม่สามารถลงประกาศได้ในขณะนี้",
          quota,
        },
        { status: 403 },
      );
    }

    if (quota.requiresVerification) {
      return NextResponse.json(
        {
          error: "กรุณายืนยันตัวตนอย่างน้อย 2 ใน 3 ช่องทาง (โทร อีเมล บัตร/LINE) ก่อนลงประกาศ",
          quota,
        },
        { status: 403 },
      );
    }

    if (!quota.canPost) {
      return NextResponse.json(
        {
          error: quota.canBuyPackages
            ? `คุณลงประกาศครบ ${quota.maxAllowed} รายการแล้ว ซื้อแพ็กเพิ่มเพื่อลงต่อ`
            : `คุณลงประกาศครบ ${quota.maxAllowed} รายการแล้ว ติดต่อแอดมินเพื่อเพิ่มโควตา`,
          quota,
        },
        { status: 403 },
      );
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
    const slug = await uniqueSlug(data.title);
    const priceUnit = data.listingType === "rent" ? "THB/month" : "THB";

    const property = await prisma.userProperty.create({
      data: {
        userId: user.id,
        slug,
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
        floor: data.floor,
        district: data.district,
        btsStation: data.btsStation,
        address: data.address,
        latitude: data.latitude,
        longitude: data.longitude,
        features: JSON.stringify(data.features),
        images: JSON.stringify(data.images),
        agentManaged: user.role === "user" ? (data.agentManaged ?? false) : false,
        status: "pending",
      },
    });

    const updatedQuota = await getUserQuota(user.id);

    return NextResponse.json({
      property: dbPropertyToListing(property),
      quota: updatedQuota,
      message: "ส่งประกาศแล้ว รอแอดมินอนุมัติก่อนเผยแพร่",
    });
  } catch {
    return NextResponse.json({ error: "ลงประกาศไม่สำเร็จ" }, { status: 500 });
  }
}
