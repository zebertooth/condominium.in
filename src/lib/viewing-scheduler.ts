import { prisma } from "@/lib/db";
import { buildViewingIcs } from "@/lib/calendar-invite";
import { sendEmail, type EmailAttachment } from "@/lib/notifications";
import { siteConfig } from "@/lib/seo";

interface ViewingVisitor {
  name: string;
  phone?: string;
  email?: string;
  message: string;
  viewingDate?: string;
  viewingTime?: string;
}

interface ViewingLeadContext {
  leadId: string;
  assignedToId: string | null;
  ownerUserId?: string | null;
  contactMode: "agent_team" | "owner_direct";
  propertyTitle?: string | null;
  propertySlug?: string | null;
}

function visitorContactLine(visitor: ViewingVisitor): string {
  return [visitor.phone, visitor.email].filter(Boolean).join(" / ") || "ไม่ระบุ";
}

async function resolveAdminEmail(): Promise<string | null> {
  if (process.env.ADMIN_EMAIL) return process.env.ADMIN_EMAIL;
  const admin = await prisma.user.findFirst({
    where: { role: "admin", email: { not: null } },
    select: { email: true },
  });
  return admin?.email ?? null;
}

function viewingIcsAttachment(
  leadId: string,
  title: string,
  visitor: ViewingVisitor,
  propertyTitle?: string | null,
): EmailAttachment {
  const ics = buildViewingIcs({
    uid: `viewing-${leadId}@condominium.in.th`,
    title: title,
    date: visitor.viewingDate!,
    time: visitor.viewingTime,
    description: `${visitor.name}: ${visitor.message}`,
    location: propertyTitle ?? undefined,
    organizerEmail: process.env.EMAIL_FROM ?? undefined,
  });
  return { filename: "viewing.ics", content: ics };
}

async function sendViewingEmail(
  to: string,
  subject: string,
  text: string,
  attachment: EmailAttachment,
): Promise<void> {
  await sendEmail(to, subject, text, [attachment]);
}

/** Mark lead as viewing + email assignee (agent_team) when buyer requests a slot. */
export async function processViewingRequest(
  visitor: ViewingVisitor,
  ctx: ViewingLeadContext,
): Promise<void> {
  if (!visitor.viewingDate?.trim()) return;

  await prisma.lead.update({
    where: { id: ctx.leadId },
    data: { status: "viewing" },
  });

  if (ctx.contactMode === "owner_direct") {
    if (ctx.ownerUserId) {
      const owner = await prisma.user.findUnique({
        where: { id: ctx.ownerUserId },
        select: { email: true, fullName: true },
      });
      if (owner?.email) {
        const timeLabel = visitor.viewingTime ?? "ไม่ระบุ";
        const propertyBlock = ctx.propertyTitle
          ? `\nประกาศ: ${ctx.propertyTitle}${
              ctx.propertySlug ? `\n${siteConfig.url}/property/${ctx.propertySlug}` : ""
            }`
          : "";
        await sendViewingEmail(
          owner.email,
          `คำขอนัดชมทรัพย์ — ${ctx.propertyTitle ?? "ประกาศของคุณ"}`,
          [
            `สวัสดีคุณ ${owner.fullName},`,
            "",
            `${visitor.name} ขอนัดชมทรัพย์ของคุณ:`,
            "",
            `วันที่: ${visitor.viewingDate}`,
            `เวลา: ${timeLabel}`,
            `ช่องทางติดต่อ: ${visitorContactLine(visitor)}`,
            propertyBlock,
            "",
            `ข้อความ: "${visitor.message}"`,
            "",
            `จัดการในแดชบอร์ด: ${siteConfig.url}/dashboard/inquiries`,
            "",
            "ไฟล์ viewing.ics แนบมาด้วย — เปิดเพื่อเพิ่มลงปฏิทิน",
            "",
            "— Condominium.in.th",
          ].join("\n"),
          viewingIcsAttachment(ctx.leadId, `นัดชม: ${ctx.propertyTitle ?? "ทรัพย์"}`, visitor, ctx.propertyTitle),
        );
      }
    }
    return;
  }

  const recipientId = ctx.assignedToId;
  const assignee = recipientId
    ? await prisma.user.findUnique({
        where: { id: recipientId },
        select: { email: true, fullName: true, role: true },
      })
    : null;

  const to = assignee?.email ?? (await resolveAdminEmail());
  if (!to) return;

  const timeLabel = visitor.viewingTime ?? "ไม่ระบุ";
  const propertyBlock = ctx.propertyTitle
    ? `\nประกาศ: ${ctx.propertyTitle}${
        ctx.propertySlug ? `\n${siteConfig.url}/property/${ctx.propertySlug}` : ""
      }`
    : "";

  const dashboardUrl =
    assignee?.role === "agent"
      ? `${siteConfig.url}/dashboard/agent`
      : `${siteConfig.url}/admin/leads`;

  const greeting = assignee?.fullName ? `สวัสดีคุณ ${assignee.fullName},` : "สวัสดี,";

  await sendViewingEmail(
    to,
    `คำขอนัดชมทรัพย์ — ${ctx.propertyTitle ?? visitor.name}`,
    [
      greeting,
      "",
      "มีลูกค้าขอนัดชมทรัพย์:",
      "",
      `ลูกค้า: ${visitor.name}`,
      `ช่องทางติดต่อ: ${visitorContactLine(visitor)}`,
      `วันที่: ${visitor.viewingDate}`,
      `เวลา: ${timeLabel}`,
      propertyBlock,
      "",
      `ข้อความ: "${visitor.message}"`,
      "",
      `จัดการในแดชบอร์ด: ${dashboardUrl}`,
      "",
      "ไฟล์ viewing.ics แนบมาด้วย — เปิดเพื่อเพิ่มลงปฏิทิน",
      "",
      "— Condominium.in.th",
    ].join("\n"),
    viewingIcsAttachment(
      ctx.leadId,
      `นัดชม: ${ctx.propertyTitle ?? visitor.name}`,
      visitor,
      ctx.propertyTitle,
    ),
  );
}
