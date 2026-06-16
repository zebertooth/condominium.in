import { NextResponse } from "next/server";
import { adminRouteError, requireAdmin } from "@/lib/admin";
import { prisma } from "@/lib/db";
import { notifySearchAlertsForPublishedListing } from "@/lib/search-alert-digest";
import { dbPropertyToListing } from "@/lib/user-properties";

const ALLOWED = ["pending", "published", "rejected", "deleted"];

export async function POST(request: Request) {
  try {
    await requireAdmin();
    const { ids, status } = (await request.json()) as { ids?: string[]; status?: string };

    if (!Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ error: "กรุณาเลือกประกาศอย่างน้อยหนึ่งรายการ" }, { status: 400 });
    }

    if (!status || !ALLOWED.includes(status)) {
      return NextResponse.json({ error: "สถานะไม่ถูกต้อง" }, { status: 400 });
    }

    const before =
      status === "published"
        ? await prisma.userProperty.findMany({
            where: { id: { in: ids } },
            select: { id: true, status: true },
          })
        : [];

    const result = await prisma.userProperty.updateMany({
      where: { id: { in: ids } },
      data: {
        status,
        ...(status === "rejected" || status === "deleted"
          ? { needsReview: false, moderationFlags: "[]" }
          : {}),
      },
    });

    if (status === "published") {
      const newlyPublishedIds = before
        .filter((p) => p.status !== "published")
        .map((p) => p.id);

      if (newlyPublishedIds.length > 0) {
        const properties = await prisma.userProperty.findMany({
          where: { id: { in: newlyPublishedIds } },
        });
        for (const property of properties) {
          void notifySearchAlertsForPublishedListing(dbPropertyToListing(property)).catch((err) => {
            console.error("[search-alerts] bulk publish notify failed", err);
          });
        }
      }
    }

    return NextResponse.json({ updated: result.count });
  } catch (error) {
    return adminRouteError(error, "อัปเดตไม่สำเร็จ");
  }
}
