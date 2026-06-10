import { NextResponse } from "next/server";
import { adminRouteError, requireAdmin } from "@/lib/admin";
import { prisma } from "@/lib/db";

interface RouteContext {
  params: Promise<{ id: string }>;
}

const ALLOWED_ROLES = ["user", "agent", "admin"];

export async function PATCH(request: Request, context: RouteContext) {
  try {
    await requireAdmin();
    const { id } = await context.params;
    const body = (await request.json()) as {
      idVerified?: boolean;
      phoneVerified?: boolean;
      emailVerified?: boolean;
      role?: string;
      listingLimitOverride?: number | null;
    };

    const data: {
      idVerified?: boolean;
      phoneVerified?: boolean;
      emailVerified?: boolean;
      role?: string;
      listingLimitOverride?: number | null;
    } = {};

    if (body.idVerified !== undefined) data.idVerified = body.idVerified;
    if (body.phoneVerified !== undefined) data.phoneVerified = body.phoneVerified;
    if (body.emailVerified !== undefined) data.emailVerified = body.emailVerified;

    if (body.role !== undefined) {
      if (!ALLOWED_ROLES.includes(body.role)) {
        return NextResponse.json({ error: "บทบาทไม่ถูกต้อง" }, { status: 400 });
      }
      data.role = body.role;
    }

    if (body.listingLimitOverride !== undefined) {
      if (body.listingLimitOverride === null) {
        data.listingLimitOverride = null;
      } else if (
        Number.isInteger(body.listingLimitOverride) &&
        body.listingLimitOverride >= 0 &&
        body.listingLimitOverride <= 1000
      ) {
        data.listingLimitOverride = body.listingLimitOverride;
      } else {
        return NextResponse.json({ error: "จำนวนโควตาไม่ถูกต้อง (0–1000)" }, { status: 400 });
      }
    }

    const user = await prisma.user.update({ where: { id }, data });

    return NextResponse.json({ user });
  } catch (error) {
    return adminRouteError(error, "อัปเดตไม่สำเร็จ");
  }
}
