import { NextResponse } from "next/server";
import { adminRouteError, requireAdmin } from "@/lib/admin";
import { activateConfirmedSubscription } from "@/lib/payment-activation";
import { prisma } from "@/lib/db";

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
  } catch (error) {
    return adminRouteError(error, "ดึงข้อมูลไม่สำเร็จ");
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
      if (!["pending", "pending_review"].includes(subscription.paymentStatus)) {
        return NextResponse.json(
          { error: "คำสั่งซื้อนี้ไม่อยู่ในสถานะที่อนุมัติได้" },
          { status: 400 },
        );
      }

      const activation = await activateConfirmedSubscription(subscriptionId);

      return NextResponse.json({
        message: "อนุมัติการชำระเงินสำเร็จ",
        status: "confirmed",
        emailSent: activation.emailSent,
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
  } catch (error) {
    return adminRouteError(error, "อัปเดตไม่สำเร็จ");
  }
}
