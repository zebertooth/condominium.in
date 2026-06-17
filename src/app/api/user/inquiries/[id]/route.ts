import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { LEAD_STATUS_VALUES } from "@/lib/lead-constants";

interface RouteContext {
  params: Promise<{ id: string }>;
}

const OWNER_ALLOWED_STATUSES = ["new", "contacted", "viewing", "closed", "lost"] as const;

export async function PATCH(request: Request, context: RouteContext) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "กรุณาเข้าสู่ระบบ" }, { status: 401 });
  }

  const { id } = await context.params;
  const lead = await prisma.lead.findFirst({
    where: {
      id,
      ownerUserId: user.id,
      contactMode: "owner_direct",
    },
  });

  if (!lead) {
    return NextResponse.json({ error: "ไม่พบรายการ" }, { status: 404 });
  }

  const body = (await request.json()) as { status?: string };
  if (!body.status || !LEAD_STATUS_VALUES.includes(body.status as (typeof LEAD_STATUS_VALUES)[number])) {
    return NextResponse.json({ error: "สถานะไม่ถูกต้อง" }, { status: 400 });
  }

  if (!OWNER_ALLOWED_STATUSES.includes(body.status as (typeof OWNER_ALLOWED_STATUSES)[number])) {
    return NextResponse.json({ error: "สถานะไม่ถูกต้อง" }, { status: 400 });
  }

  const updated = await prisma.lead.update({
    where: { id },
    data: { status: body.status },
  });

  return NextResponse.json({
    inquiry: {
      id: updated.id,
      status: updated.status,
      updatedAt: updated.updatedAt.toISOString(),
    },
  });
}
