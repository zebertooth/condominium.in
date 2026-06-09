import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { getPackageById, PAID_FEATURES_ENABLED } from "@/lib/packages";
import { getUserQuota } from "@/lib/quota";
import {
  generatePromptPayQR,
  generateTransactionRef,
  promptPayConfigured,
} from "@/lib/promptpay";

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

    if (user.role === "admin") {
      return NextResponse.json(
        { error: "บัญชีแอดมินลงประกาศได้ไม่จำกัด ไม่ต้องซื้อแพ็ก" },
        { status: 403 },
      );
    }

    if (user.role === "agent") {
      return NextResponse.json(
        { error: "บัญชีเอเจนต์ไม่สามารถซื้อแพ็กเพิ่มได้ ติดต่อแอดมินเพื่อปรับโควตาประกาศ" },
        { status: 403 },
      );
    }

    const { packageId } = (await request.json()) as { packageId?: string };
    const pkg = packageId ? getPackageById(packageId) : undefined;

    if (!pkg) {
      return NextResponse.json({ error: "ไม่พบแพ็กเกจ" }, { status: 400 });
    }

    const transactionRef = generateTransactionRef();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + pkg.durationDays);

    // Create subscription in "pending_payment" status
    const subscription = await prisma.userSubscription.create({
      data: {
        userId: user.id,
        packageId: pkg.id,
        extraSlots: pkg.extraSlots,
        pricePaid: pkg.priceBaht,
        expiresAt,
        status: "pending_payment",
        paymentStatus: "pending",
        paymentMethod: "promptpay",
        transactionRef,
      },
    });

    // Generate PromptPay QR if configured, else return pending for manual flow
    let qrDataUrl: string | null = null;
    if (promptPayConfigured()) {
      qrDataUrl = await generatePromptPayQR(pkg.priceBaht);
    }

    const quota = await getUserQuota(user.id);

    return NextResponse.json({
      message: `สร้างคำสั่งซื้อแพ็ก "${pkg.name}" สำเร็จ กรุณาชำระเงินผ่าน PromptPay`,
      subscriptionId: subscription.id,
      transactionRef,
      amount: pkg.priceBaht,
      qrDataUrl,
      quota,
    });
  } catch {
    return NextResponse.json({ error: "ซื้อแพ็กไม่สำเร็จ" }, { status: 500 });
  }
}
