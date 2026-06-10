import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function getAdminUser() {
  const user = await getCurrentUser();
  if (!user || user.role !== "admin") return null;
  return user;
}

export async function requireAdmin() {
  const admin = await getAdminUser();
  if (!admin) throw new Error("FORBIDDEN");
  return admin;
}

export function adminRouteError(error: unknown, fallbackMessage: string) {
  if (error instanceof Error && error.message === "FORBIDDEN") {
    return NextResponse.json({ error: "ไม่มีสิทธิ์เข้าถึง" }, { status: 403 });
  }
  return NextResponse.json({ error: fallbackMessage }, { status: 500 });
}

export async function getAdminStats() {
  const [users, properties, pendingProperties, pendingVerifications, newLeads, pendingPayments] =
    await Promise.all([
      prisma.user.count(),
      prisma.userProperty.count({ where: { status: "published" } }),
      prisma.userProperty.count({ where: { status: "pending" } }),
      prisma.user.count({
        where: {
          idVerified: false,
          OR: [{ phoneVerified: true }, { emailVerified: true }],
        },
      }),
      prisma.lead.count({ where: { status: "new" } }),
      prisma.userSubscription.count({
        where: { paymentStatus: { in: ["pending", "pending_review"] } },
      }),
    ]);

  return { users, properties, pendingProperties, pendingVerifications, newLeads, pendingPayments };
}
