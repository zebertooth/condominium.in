import { prisma } from "@/lib/db";
import { sendEmail } from "@/lib/notifications";
import { siteConfig } from "@/lib/seo";

interface InquiryVisitor {
  name: string;
  phone?: string;
  email?: string;
  message: string;
  viewingDate?: string;
  viewingTime?: string;
}

export type LeadNurtureContext =
  | { kind: "contact" }
  | {
      kind: "property";
      contactMode: "agent_team" | "owner_direct";
      propertyTitle: string;
      propertySlug: string;
      agentManaged?: boolean;
    };

function visitorContactLine(visitor: InquiryVisitor): string {
  return [visitor.phone, visitor.email].filter(Boolean).join(" / ") || "ไม่ระบุ";
}

function viewingLine(visitor: InquiryVisitor): string {
  if (!visitor.viewingDate) return "";
  return `\nต้องการนัดชมทรัพย์: ${visitor.viewingDate} เวลา ${visitor.viewingTime ?? "ไม่ระบุ"}`;
}

const dashboardInquiriesUrl = `${siteConfig.url}/dashboard/inquiries`;

/** Auto-reply to buyer/visitor when they leave an email address. */
export async function sendLeadNurtureEmail(
  visitor: InquiryVisitor,
  context: LeadNurtureContext,
): Promise<void> {
  const to = visitor.email?.trim();
  if (!to) return;

  let subject: string;
  let intro: string;
  let steps: string[];

  if (context.kind === "contact") {
    subject = "[Condominium.in.th] รับคำขอของคุณแล้ว";
    intro = `สวัสดีคุณ ${visitor.name},\n\nขอบคุณที่ติดต่อ Condominium.in.th เราได้รับข้อความของคุณแล้ว:`;
    steps = [
      "1. ทีมงานได้รับคำขอและจะอ่านข้อความของคุณ",
      "2. เราจะติดต่อกลับทางโทรศัพท์ LINE หรืออีเมลภายใน 1 วันทำการ",
      "3. ช่วยค้นหาทรัพย์ นัดชม หรือตอบคำถามตามที่คุณต้องการ",
    ];
  } else if (context.contactMode === "owner_direct") {
    subject = `[Condominium.in.th] ส่งข้อความถึงเจ้าของแล้ว — ${context.propertyTitle}`;
    intro = `สวัสดีคุณ ${visitor.name},\n\nเราได้ส่งข้อความของคุณถึงเจ้าของประกาศ "${context.propertyTitle}" แล้ว:`;
    steps = [
      "1. เจ้าของได้รับข้อความและข้อมูลติดต่อของคุณ",
      "2. เจ้าของจะติดต่อกลับโดยตรงทางโทรศัพท์ LINE หรืออีเมล",
      "3. นัดชมทรัพย์และสรุปเงื่อนไขเช่า/ซื้อกับเจ้าของ",
    ];
  } else if (context.agentManaged) {
    subject = `[Condominium.in.th] รับคำขอนัดชมแล้ว — ${context.propertyTitle}`;
    intro = `สวัสดีคุณ ${visitor.name},\n\nเราได้รับคำขอของคุณสำหรับประกาศ "${context.propertyTitle}" (ทีมเอเจนต์ดูแล):`;
    steps = [
      "1. ทีมเอเจนต์ Condominium.in.th ได้รับคำขอแล้ว",
      "2. เอเจนต์จะติดต่อกลับภายใน 1 วันทำการเพื่อยืนยันรายละเอียด",
      "3. นัดชมทรัพย์จริงและสรุปขั้นตอนต่อไป",
    ];
  } else {
    subject = `[Condominium.in.th] รับคำขอนัดชมแล้ว — ${context.propertyTitle}`;
    intro = `สวัสดีคุณ ${visitor.name},\n\nเราได้รับคำขอของคุณสำหรับประกาศ "${context.propertyTitle}":`;
    steps = [
      "1. ทีม Condominium.in.th ได้รับคำขอแล้ว",
      "2. เราจะติดต่อกลับภายใน 1 วันทำการเพื่อยืนยันและนัดชม",
      "3. พาไปชมทรัพย์จริงและช่วยสรุปเงื่อนไข",
    ];
  }

  const propertyBlock =
    context.kind === "property"
      ? `\n\nดูประกาศ: ${siteConfig.url}/property/${context.propertySlug}`
      : "";

  const text = [
    intro,
    `\n"${visitor.message}"${viewingLine(visitor)}`,
    propertyBlock,
    "",
    "ขั้นตอนถัดไป:",
    ...steps,
    "",
    `ค้นหาประกาศเพิ่ม: ${siteConfig.url}/rent · ${siteConfig.url}/buy`,
    "",
    "— Condominium.in.th",
  ].join("\n");

  await sendEmail(to, subject, text);
}

export async function notifyOwnerInquiry(
  owner: { email: string | null; fullName: string },
  propertyTitle: string,
  visitor: InquiryVisitor,
) {
  if (!owner.email) return;

  await sendEmail(
    owner.email,
    `มีคนสนใจ: ${propertyTitle}`,
    [
      `สวัสดีคุณ ${owner.fullName},`,
      "",
      `${visitor.name} สนใจประกาศ "${propertyTitle}" ของคุณและฝากข้อความไว้:`,
      "",
      `"${visitor.message}"${viewingLine(visitor)}`,
      "",
      `ช่องทางติดต่อ: ${visitorContactLine(visitor)}`,
      "",
      `ดูรายละเอียด: ${dashboardInquiriesUrl}`,
      "",
      "— ทีม Condominium.in.th",
    ].join("\n"),
  );
}

export async function notifyPosterInquiry(
  poster: { email: string | null; fullName: string; role: string },
  propertyTitle: string,
  visitor: InquiryVisitor,
) {
  if (!poster.email) return;

  const roleLabel =
    poster.role === "admin" ? "แอดมิน" : poster.role === "agent" ? "เอเจนต์" : "ทีมงาน";

  await sendEmail(
    poster.email,
    `มีลูกค้าสนใจประกาศ: ${propertyTitle}`,
    [
      `สวัสดีคุณ ${poster.fullName},`,
      "",
      `มีลูกค้าสนใจประกาศ "${propertyTitle}" ที่คุณลงในฐานะ${roleLabel}:`,
      "",
      `"${visitor.message}"${viewingLine(visitor)}`,
      "",
      `ช่องทางติดต่อลูกค้า: ${visitorContactLine(visitor)}`,
      "",
      `ดูรายละเอียด: ${siteConfig.url}/dashboard/agent`,
      "",
      "— ทีม Condominium.in.th",
    ].join("\n"),
  );
}

/** Notify platform admin when owner opts into agent-managed listing. */
export async function notifyAgentManagedInquiry(
  propertyTitle: string,
  ownerName: string,
  visitor: InquiryVisitor,
) {
  const adminEmail =
    process.env.ADMIN_EMAIL ??
    (
      await prisma.user.findFirst({
        where: { role: "admin", email: { not: null } },
        select: { email: true },
      })
    )?.email;

  if (!adminEmail) return;

  await sendEmail(
    adminEmail,
    `ลูกค้าสนใจ (เอเจนต์ดูแล): ${propertyTitle}`,
    [
      "มีลูกค้าสนใจประกาศที่เจ้าของขอให้เอเจนต์ดูแล:",
      "",
      `ประกาศ: ${propertyTitle}`,
      `เจ้าของประกาศ: ${ownerName}`,
      "",
      `${visitor.name} ฝากข้อความ:`,
      `"${visitor.message}"${viewingLine(visitor)}`,
      "",
      `ช่องทางติดต่อ: ${visitorContactLine(visitor)}`,
      "",
      `มอบหมายเอเจนต์: ${siteConfig.url}/admin/leads`,
      "",
      "— Condominium.in.th",
    ].join("\n"),
  );
}
