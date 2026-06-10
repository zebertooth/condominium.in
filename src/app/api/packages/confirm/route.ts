import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { PAID_FEATURES_ENABLED } from "@/lib/packages";
import { verifySlip } from "@/lib/promptpay";
import { getUserQuota } from "@/lib/quota";

/**
 * POST /api/packages/confirm
 *
 * Upload a payment slip to confirm a pending PromptPay payment.
 * Body: { subscriptionId, slipUrl }
 *
 * If SlipOK is configured, the slip is auto-verified.
 * If not, the slip is stored and flagged for admin manual review.
 */
export async function POST(request: Request) {
  try {
    if (!PAID_FEATURES_ENABLED) {
      return NextResponse.json(
        { error: "ขณะนี้ยังไม่เปิดให้ซื้อแพ็กเกจ" },
        { status: 403 },
      );
    }

    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "กรุณาเข้าสู่ระบบ" }, { status: 401 });
    }

    const { subscriptionId, slipUrl } = (await request.json()) as {
      subscriptionId?: string;
      slipUrl?: string;
    };

    if (!subscriptionId || !slipUrl) {
      return NextResponse.json(
        { error: "กรุณาระบุ subscriptionId และ slipUrl" },
        { status: 400 },
      );
    }

    // Find the pending subscription belonging to this user
    const subscription = await prisma.userSubscription.findFirst({
      where: {
        id: subscriptionId,
        userId: user.id,
        paymentStatus: "pending",
      },
    });

    if (!subscription) {
      return NextResponse.json(
        { error: "ไม่พบคำสั่งซื้อที่รอชำระ" },
        { status: 404 },
      );
    }

    // Save slip URL
    await prisma.userSubscription.update({
      where: { id: subscriptionId },
      data: { slipUrl },
    });

    // Try automated verification via SlipOK
    const result = await verifySlip(slipUrl);

    if (result.verified) {
      const receivedAmount = result.amount;
      if (receivedAmount == null || receivedAmount < subscription.pricePaid) {
        await prisma.userSubscription.update({
          where: { id: subscriptionId },
          data: { paymentStatus: "pending_review" },
        });
        return NextResponse.json({
          message:
            receivedAmount == null
              ? "ไม่สามารถตรวจสอบยอดเงินอัตโนมัติได้ รอแอดมินตรวจสอบ"
              : "จำนวนเงินในสลิปไม่ตรงกับยอดที่ต้องชำระ",
          status: receivedAmount == null ? "pending_review" : "amount_mismatch",
          expected: subscription.pricePaid,
          received: receivedAmount ?? undefined,
        }, { status: receivedAmount == null ? 200 : 400 });
      }

      // Activate the subscription
      await prisma.userSubscription.update({
        where: { id: subscriptionId },
        data: {
          paymentStatus: "confirmed",
          status: "active",
        },
      });

      // If this is a sponsor payment, activate the sponsor on the property
      if (subscription.packageId.startsWith("sponsor_")) {
        const propertyId = subscription.packageId.replace("sponsor_", "");
        await prisma.userProperty.update({
          where: { id: propertyId },
          data: {
            isSponsored: true,
            sponsoredUntil: subscription.expiresAt,
          },
        });
      }

      const quota = await getUserQuota(user.id);

      return NextResponse.json({
        message: "ยืนยันการชำระเงินสำเร็จ! แพ็กเกจเปิดใช้งานแล้ว",
        status: "confirmed",
        quota,
      });
    }

    // Not auto-verified — pending admin review
    await prisma.userSubscription.update({
      where: { id: subscriptionId },
      data: {
        paymentStatus: "pending_review",
      },
    });

    return NextResponse.json({
      message: "อัปโหลดสลิปสำเร็จ รอแอดมินตรวจสอบ (ปกติไม่เกิน 30 นาที)",
      status: "pending_review",
    });
  } catch {
    return NextResponse.json(
      { error: "ยืนยันการชำระเงินไม่สำเร็จ" },
      { status: 500 },
    );
  }
}
