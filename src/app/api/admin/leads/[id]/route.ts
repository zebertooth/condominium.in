import { NextResponse } from "next/server";
import { adminRouteError, requireAdmin } from "@/lib/admin";
import { prisma } from "@/lib/db";
import { LEAD_STATUSES } from "@/lib/lead-constants";

interface RouteContext {
  params: Promise<{ id: string }>;
}

const VALID_STATUSES: string[] = LEAD_STATUSES.map((s) => s.value);

export async function PATCH(request: Request, context: RouteContext) {
  try {
    await requireAdmin();
    const { id } = await context.params;
    const body = (await request.json()) as {
      status?: string;
      assignedToId?: string | null;
      agentNote?: string;
    };

    const data: {
      status?: string;
      assignedToId?: string | null;
      agentNote?: string;
    } = {};

    if (body.status !== undefined) {
      if (!VALID_STATUSES.includes(body.status)) {
        return NextResponse.json({ error: "สถานะไม่ถูกต้อง" }, { status: 400 });
      }
      data.status = body.status;
    }

    if (body.assignedToId !== undefined) {
      data.assignedToId = body.assignedToId || null;
    }

    if (body.agentNote !== undefined) {
      data.agentNote = body.agentNote;
    }

    const lead = await prisma.lead.update({ where: { id }, data });
    return NextResponse.json({ lead });
  } catch (error) {
    return adminRouteError(error, "อัปเดตไม่สำเร็จ");
  }
}
