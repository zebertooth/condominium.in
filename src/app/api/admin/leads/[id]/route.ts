import { NextResponse } from "next/server";
import { adminRouteError } from "@/lib/admin";
import { requireAgentOrAdmin } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { LEAD_STATUSES } from "@/lib/lead-constants";

interface RouteContext {
  params: Promise<{ id: string }>;
}

const VALID_STATUSES: string[] = LEAD_STATUSES.map((s) => s.value);

export async function PATCH(request: Request, context: RouteContext) {
  try {
    const user = await requireAgentOrAdmin();
    const { id } = await context.params;
    
    // Find existing lead
    const existingLead = await prisma.lead.findUnique({
      where: { id },
    });

    if (!existingLead) {
      return NextResponse.json({ error: "ไม่พบลีด" }, { status: 404 });
    }

    // Agent access control: agent can only edit leads assigned to themselves
    if (user.role === "agent" && existingLead.assignedToId !== user.id) {
      return NextResponse.json({ error: "ไม่มีสิทธิ์จัดการลีดนี้" }, { status: 403 });
    }

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
      // Agents cannot reassign leads
      if (user.role === "agent") {
        return NextResponse.json({ error: "เอเจนต์ไม่มีสิทธิ์มอบหมายลีด" }, { status: 403 });
      }
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
