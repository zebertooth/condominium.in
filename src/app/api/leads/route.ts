import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { createLead } from "@/lib/leads";
import { logMatchingEvent } from "@/lib/matching";
import { sendEmail } from "@/lib/notifications";
import { getClientIp, rateLimit } from "@/lib/rate-limit";
import { leadSchema } from "@/lib/validation";

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request);
    const limit = rateLimit(`lead:${ip}`, 5, 60_000); // 5 inquiries / minute / IP
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

    const lead = await createLead(parsed.data);

    if (parsed.data.contactMode === "owner_direct") {
      await logMatchingEvent({
        eventType: "owner_inquiry",
        propertySlug: parsed.data.propertySlug,
        propertyTitle: parsed.data.propertyTitle,
        ownerUserId: parsed.data.ownerUserId,
        posterRole: parsed.data.posterRole,
        leadId: lead.id,
        visitorName: parsed.data.name,
        visitorPhone: parsed.data.phone,
        visitorEmail: parsed.data.email,
      });

      // Notify the owner by email (fires-and-forgets; never blocks response)
      if (parsed.data.ownerUserId) {
        const owner = await prisma.user.findUnique({
          where: { id: parsed.data.ownerUserId },
          select: { email: true, fullName: true },
        });
        if (owner?.email) {
          const propertyTitle = parsed.data.propertyTitle ?? "ประกาศของคุณ";
          const visitorName = parsed.data.name;
          const visitorContact = [parsed.data.phone, parsed.data.email].filter(Boolean).join(" / ");
          void sendEmail(
            owner.email,
            `มีคนสนใจ: ${propertyTitle}`,
            [
              `สวัสดีคุณ ${owner.fullName},`,
              "",
              `${visitorName} สนใจประกาศ "${propertyTitle}" ของคุณและฝากข้อความไว้:`,
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
