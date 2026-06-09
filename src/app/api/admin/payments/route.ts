import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/admin";

/**
 * GET /api/admin/payments — List all pending and recent payments.
 * PATCH /api/admin/payments — Approve or reject a payment.
 */
export async function GET() {
  try {
    await requireAdmin();

    const payments = await prisma.userSubscription.findMany({
      where: {
        paymentMethod: "promptpay",
      },
      orderBy: { createdAt: "desc" },
      take: 100,
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            email: true,
            phone: true,
          },
        },
      },
    });

    return NextResponse.json({ payments });
  } catch {
    return NextResponse.json(
      { error: "ดึงข้อมูลไม่สำเร็จ" },
      { status: 500 },
    );
  }
}

export async function PATCH(request: Request) {
  try {
    await requireAdmin();

    const { subscriptionId, action } = (await request.json()) as {
      subscriptionId?: string;
      action?: "approve" | "reject";
    };

    if (!subscriptionId || !action) {
      return NextResponse.json(
        { error: "กรุณาระบุ subscriptionId และ action" },
        { status: 400 },
      );
    }

    const subscription = await prisma.userSubscription.findUnique({
      where: { id: subscriptionId },
    });

    if (!subscription) {
      return NextResponse.json(
        { error: "ไม่พบคำสั่งซื้อ" },
        { status: 404 },
      );
    }

    if (action === "approve") {
      await prisma.userSubscription.update({
        where: { id: subscriptionId },
        data: {
          paymentStatus: "confirmed",
          status: "active",
        },
      });

      // If sponsor, activate it on the property
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

      return NextResponse.json({
        message: "อนุมัติการชำระเงินสำเร็จ",
        status: "confirmed",
      });
    }

    if (action === "reject") {
      await prisma.userSubscription.update({
        where: { id: subscriptionId },
        data: {
          paymentStatus: "failed",
          status: "cancelled",
        },
      });

      return NextResponse.json({
        message: "ปฏิเสธการชำระเงิน",
        status: "rejected",
      });
    }

    return NextResponse.json({ error: "action ไม่ถูกต้อง" }, { status: 400 });
  } catch {
    return NextResponse.json(
      { error: "อัปเดตไม่สำเร็จ" },
      { status: 500 },
    );
  }
}
