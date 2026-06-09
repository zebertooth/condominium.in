import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";

/**
 * GET /api/packages/status?id=<subscriptionId>
 *
 * Check the payment status of a pending subscription.
 */
export async function GET(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "กรุณาเข้าสู่ระบบ" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const subscriptionId = searchParams.get("id");

    if (!subscriptionId) {
      return NextResponse.json({ error: "กรุณาระบุ id" }, { status: 400 });
    }

    const subscription = await prisma.userSubscription.findFirst({
      where: {
        id: subscriptionId,
        userId: user.id,
      },
      select: {
        id: true,
        packageId: true,
        pricePaid: true,
        paymentStatus: true,
        paymentMethod: true,
        transactionRef: true,
        slipUrl: true,
        status: true,
        expiresAt: true,
        createdAt: true,
      },
    });

    if (!subscription) {
      return NextResponse.json({ error: "ไม่พบคำสั่งซื้อ" }, { status: 404 });
    }

    return NextResponse.json({ subscription });
  } catch {
    return NextResponse.json(
      { error: "ตรวจสอบสถานะไม่สำเร็จ" },
      { status: 500 },
    );
  }
}
