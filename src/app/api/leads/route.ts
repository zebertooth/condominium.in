import { NextResponse } from "next/server";
import { requireCaptcha } from "@/lib/captcha";
import { prisma } from "@/lib/db";
import {
  resolveLeadAssigneeId,
  resolveListingContactMode,
} from "@/lib/contact-routing";
import { createLead, pickLeadAssignee } from "@/lib/leads";
import {
  notifyAgentManagedInquiry,
  notifyOwnerInquiry,
  notifyPosterInquiry,
  sendLeadNurtureEmail,
} from "@/lib/lead-notifications";
import { processViewingRequest } from "@/lib/viewing-scheduler";
import { logMatchingEvent } from "@/lib/matching";
import { getClientIp, rateLimit } from "@/lib/rate-limit";
import { leadSchema } from "@/lib/validation";

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request);
    const limit = rateLimit(`lead:${ip}`, 5, 60_000);
    if (!limit.allowed) {
      return NextResponse.json(
        { error: "ส่งคำขอบ่อยเกินไป กรุณารอสักครู่" },
        { status: 429, headers: { "Retry-After": String(limit.retryAfterSec) } },
      );
    }

    const body = await request.json();
    const captcha = await requireCaptcha(body.captchaToken, ip);
    if (!captcha.ok) {
      return NextResponse.json({ error: captcha.error }, { status: captcha.status });
    }

    const parsed = leadSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "ข้อมูลไม่ครบ" },
        { status: 400 },
      );
    }

    const visitor = {
      name: parsed.data.name,
      phone: parsed.data.phone,
      email: parsed.data.email,
      message: parsed.data.message,
      viewingDate: parsed.data.viewingDate,
      viewingTime: parsed.data.viewingTime,
    };

    let contactMode = parsed.data.contactMode ?? "agent_team";
    let ownerUserId = parsed.data.ownerUserId;
    let propertyTitle = parsed.data.propertyTitle;
    let posterRole = parsed.data.posterRole;
    let assignedToId: string | null = null;
    let propertySlug = parsed.data.propertySlug;

    if (propertySlug) {
      const slug = decodeURIComponent(propertySlug).trim();
      const property = await prisma.userProperty.findFirst({
        where: { slug, status: "published" },
        include: {
          user: { select: { id: true, role: true, email: true, fullName: true } },
        },
      });

      if (!property?.user) {
        return NextResponse.json({ error: "ไม่พบประกาศ" }, { status: 400 });
      }

      contactMode = resolveListingContactMode(property.user.role, property.agentManaged);
      ownerUserId = property.user.id;
      propertyTitle = property.title;
      posterRole = property.user.role;
      propertySlug = slug;
      assignedToId = resolveLeadAssigneeId(
        property.user.role,
        property.user.id,
        property.agentManaged,
      );
      if (!assignedToId && contactMode === "agent_team") {
        assignedToId = await pickLeadAssignee(property.btsStation);
      }

      const lead = await createLead({
        ...parsed.data,
        contactMode,
        propertySlug,
        propertyTitle,
        ownerUserId,
        posterRole,
        assignedToId,
        btsStation: property.btsStation ?? parsed.data.btsStation,
      });

      if (contactMode === "owner_direct") {
        await logMatchingEvent({
          eventType: "owner_inquiry",
          propertySlug,
          propertyTitle,
          ownerUserId,
          posterRole,
          leadId: lead.id,
          visitorName: visitor.name,
          visitorPhone: visitor.phone,
          visitorEmail: visitor.email,
        });
        await notifyOwnerInquiry(property.user, propertyTitle, visitor);
      } else if (property.agentManaged && property.user.role === "user") {
        await notifyAgentManagedInquiry(propertyTitle, property.user.fullName, visitor);
      } else {
        await notifyPosterInquiry(property.user, propertyTitle, visitor);
      }

      void sendLeadNurtureEmail(visitor, {
        kind: "property",
        contactMode,
        propertyTitle,
        propertySlug,
        agentManaged: property.agentManaged,
      });

      if (visitor.viewingDate) {
        void processViewingRequest(visitor, {
          leadId: lead.id,
          assignedToId,
          ownerUserId,
          contactMode,
          propertyTitle,
          propertySlug,
        });
      }

      return NextResponse.json({
        message:
          contactMode === "owner_direct"
            ? "ส่งข้อความถึงเจ้าของเรียบร้อย"
            : property.agentManaged
              ? "ส่งคำขอแล้ว ทีมเอเจนต์จะติดต่อกลับโดยเร็ว"
              : "ส่งข้อความเรียบร้อย ผู้ลงประกาศจะติดต่อกลับโดยเร็ว",
      });
    }

    assignedToId =
      contactMode === "owner_direct" ? null : await pickLeadAssignee(parsed.data.btsStation);

    const lead = await createLead({
      ...parsed.data,
      contactMode,
      ownerUserId,
      propertyTitle,
      posterRole,
      assignedToId,
    });

    if (visitor.viewingDate) {
      void processViewingRequest(visitor, {
        leadId: lead.id,
        assignedToId,
        contactMode,
        propertyTitle,
        propertySlug,
      });
    }

    void sendLeadNurtureEmail(visitor, { kind: "contact" });

    return NextResponse.json({
      message: "ส่งข้อความเรียบร้อย ทีมงานจะติดต่อกลับโดยเร็ว",
    });
  } catch {
    return NextResponse.json({ error: "ส่งข้อความไม่สำเร็จ" }, { status: 500 });
  }
}
