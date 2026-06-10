import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { PAID_FEATURES_ENABLED, SPONSOR_PACKAGE } from "@/lib/packages";
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
        { error: "ขณะนี้ยังไม่เปิดให้ทำประกาศเด่น" },
        { status: 403 },
      );
    }

    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "กรุณาเข้าสู่ระบบ" }, { status: 401 });
    }

    const { propertyId } = (await request.json()) as { propertyId?: string };
    if (!propertyId) {
      return NextResponse.json({ error: "กรุณาระบุประกาศ" }, { status: 400 });
    }

    const property = await prisma.userProperty.findFirst({
      where: { id: propertyId, userId: user.id, status: "published" },
    });

    if (!property) {
      return NextResponse.json({ error: "ไม่พบประกาศ" }, { status: 404 });
    }

    if (isActiveSponsor(property.isSponsored, property.sponsoredUntil)) {
      return NextResponse.json(
        { error: "ประกาศนี้เป็นประกาศเด่นอยู่แล้ว" },
        { status: 400 },
      );
    }

    const pendingOrder = await prisma.userSubscription.findFirst({
      where: {
        userId: user.id,
        packageId: `sponsor_${propertyId}`,
        paymentStatus: { in: ["pending", "pending_review"] },
      },
    });
    if (pendingOrder) {
      return NextResponse.json(
        { error: "มีคำสั่งซื้อประกาศเด่นที่รอชำระอยู่แล้ว — ดูที่แพ็กด้านล่าง" },
        { status: 400 },
      );
    }

    const transactionRef = generateTransactionRef();

    // Create a subscription record to track sponsor payment
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + SPONSOR_PACKAGE.durationDays);

    const subscription = await prisma.userSubscription.create({
      data: {
        userId: user.id,
        packageId: `sponsor_${propertyId}`,
        extraSlots: 0,
        pricePaid: SPONSOR_PACKAGE.priceBaht,
        expiresAt,
        status: "pending_payment",
        paymentStatus: "pending",
        paymentMethod: "promptpay",
        transactionRef,
      },
    });

    // Generate PromptPay QR if configured
    let qrDataUrl: string | null = null;
    if (promptPayConfigured()) {
      qrDataUrl = await generatePromptPayQR(SPONSOR_PACKAGE.priceBaht);
    }

    return NextResponse.json({
      message: `สร้างคำสั่งสปอนเซอร์สำเร็จ กรุณาชำระ ฿${SPONSOR_PACKAGE.priceBaht} ผ่าน PromptPay`,
      subscriptionId: subscription.id,
      propertyId,
      transactionRef,
      amount: SPONSOR_PACKAGE.priceBaht,
      qrDataUrl,
    });
  } catch {
    return NextResponse.json({ error: "สปอนเซอร์ไม่สำเร็จ" }, { status: 500 });
  }
}
