import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import {
  getSponsorPackageById,
  PAID_FEATURES_ENABLED,
} from "@/lib/packages";
import {
  buildSponsorPackageId,
  sponsorPendingPackageFilter,
} from "@/lib/sponsor-subscription";
import { isActiveSponsor } from "@/lib/user-properties";
import {
  generatePromptPayQR,
  generateTransactionRef,
  promptPayConfigured,
} from "@/lib/promptpay";

export async function POST(request: Request) {
  try {
    if (!PAID_FEATURES_ENABLED) {
      return NextResponse.json(
        { error: "ขณะนี้ยังไม่เปิดให้ทำประกาศแนะนำ" },
        { status: 403 },
      );
    }

    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "กรุณาเข้าสู่ระบบ" }, { status: 401 });
    }

    const { propertyId, sponsorTierId } = (await request.json()) as {
      propertyId?: string;
      sponsorTierId?: string;
    };

    if (!propertyId) {
      return NextResponse.json({ error: "กรุณาระบุประกาศ" }, { status: 400 });
    }

    const tier = getSponsorPackageById(sponsorTierId ?? "sponsor_7d");
    if (!tier) {
      return NextResponse.json({ error: "ไม่พบแพ็กประกาศแนะนำ" }, { status: 400 });
    }

    const property = await prisma.userProperty.findFirst({
      where: { id: propertyId, userId: user.id, status: "published" },
    });

    if (!property) {
      return NextResponse.json({ error: "ไม่พบประกาศ (ต้องเป็นประกาศที่เผยแพร่แล้ว)" }, { status: 404 });
    }

    if (isActiveSponsor(property.isSponsored, property.sponsoredUntil)) {
      return NextResponse.json(
        { error: "ประกาศนี้เป็นประกาศแนะนำอยู่แล้ว" },
        { status: 400 },
      );
    }

    const pendingOrder = await prisma.userSubscription.findFirst({
      where: {
        userId: user.id,
        paymentStatus: { in: ["pending", "pending_review"] },
        ...sponsorPendingPackageFilter(propertyId),
      },
    });
    if (pendingOrder) {
      return NextResponse.json(
        { error: "มีคำสั่งซื้อประกาศแนะนำที่รอชำระอยู่แล้ว — ดูที่แดชบอร์ด" },
        { status: 400 },
      );
    }

    const transactionRef = generateTransactionRef();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + tier.durationDays);

    const subscription = await prisma.userSubscription.create({
      data: {
        userId: user.id,
        packageId: buildSponsorPackageId(tier.id, propertyId),
        extraSlots: 0,
        pricePaid: tier.priceBaht,
        expiresAt,
        status: "pending_payment",
        paymentStatus: "pending",
        paymentMethod: "promptpay",
        transactionRef,
      },
    });

    let qrDataUrl: string | null = null;
    if (promptPayConfigured()) {
      qrDataUrl = await generatePromptPayQR(tier.priceBaht);
    }

    return NextResponse.json({
      message: `สร้างคำสั่งประกาศแนะนำสำเร็จ กรุณาชำระ ฿${tier.priceBaht} ผ่าน PromptPay`,
      subscriptionId: subscription.id,
      propertyId,
      sponsorTierId: tier.id,
      transactionRef,
      amount: tier.priceBaht,
      durationDays: tier.durationDays,
      qrDataUrl,
    });
  } catch {
    return NextResponse.json({ error: "สร้างคำสั่งไม่สำเร็จ" }, { status: 500 });
  }
}
