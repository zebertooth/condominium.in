import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { createLead } from "@/lib/leads";
import { isOwnerDirectListing, logMatchingEvent } from "@/lib/matching";
import { sendEmail } from "@/lib/notifications";
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
    const parsed = leadSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "ข้อมูลไม่ครบ" },
        { status: 400 },
      );
    }

    let ownerUserId = parsed.data.ownerUserId;
    let propertyTitle = parsed.data.propertyTitle;
    let posterRole = parsed.data.posterRole;

    if (parsed.data.contactMode === "owner_direct") {
      if (!parsed.data.propertySlug) {
        return NextResponse.json({ error: "ไม่พบประกาศ" }, { status: 400 });
      }

      const property = await prisma.userProperty.findFirst({
        where: {
          slug: decodeURIComponent(parsed.data.propertySlug).trim(),
          status: "published",
        },
        include: {
          user: { select: { id: true, role: true, email: true, fullName: true } },
        },
      });

      if (!property?.user || !isOwnerDirectListing(property.user.role)) {
        return NextResponse.json({ error: "ประกาศนี้ไม่รองรับการติดต่อเจ้าของโดยตรง" }, { status: 400 });
      }

      ownerUserId = property.user.id;
      propertyTitle = property.title;
      posterRole = property.user.role;
    }

    const lead = await createLead({
      ...parsed.data,
      ownerUserId,
      propertyTitle,
      posterRole,
    });

    if (parsed.data.contactMode === "owner_direct") {
      await logMatchingEvent({
        eventType: "owner_inquiry",
        propertySlug: parsed.data.propertySlug,
        propertyTitle,
        ownerUserId,
        posterRole,
        leadId: lead.id,
        visitorName: parsed.data.name,
        visitorPhone: parsed.data.phone,
        visitorEmail: parsed.data.email,
      });

      if (ownerUserId) {
        const owner = await prisma.user.findUnique({
          where: { id: ownerUserId },
          select: { email: true, fullName: true },
        });
        if (owner?.email) {
          const title = propertyTitle ?? "ประกาศของคุณ";
          const visitorName = parsed.data.name;
          const visitorContact = [parsed.data.phone, parsed.data.email].filter(Boolean).join(" / ");
          void sendEmail(
            owner.email,
            `มีคนสนใจ: ${title}`,
            [
              `สวัสดีคุณ ${owner.fullName},`,
              "",
              `${visitorName} สนใจประกาศ "${title}" ของคุณและฝากข้อความไว้:`,
              "",
              `"${parsed.data.message}"`,
              "",
              `ช่องทางติดต่อ: ${visitorContact || "ไม่ระบุ"}`,
              "",
              "กรุณาติดต่อกลับโดยตรงเพื่อนัดชมทรัพย์",
              "",
              "— ทีม Condominium.in.th",
            ].join("\n"),
          );
        }
      }
    }

    const message =
      parsed.data.contactMode === "owner_direct"
        ? "ส่งข้อความถึงเจ้าของเรียบร้อย"
        : "ส่งข้อความเรียบร้อย ทีมงานจะติดต่อกลับโดยเร็ว";

    return NextResponse.json({ message });
  } catch {
    return NextResponse.json({ error: "ส่งข้อความไม่สำเร็จ" }, { status: 500 });
  }
}
