import { prisma } from "@/lib/db";
import { sendEmail } from "@/lib/notifications";

interface InquiryVisitor {
  name: string;
  phone?: string;
  email?: string;
  message: string;
  viewingDate?: string;
  viewingTime?: string;
}

function visitorContactLine(visitor: InquiryVisitor): string {
  return [visitor.phone, visitor.email].filter(Boolean).join(" / ") || "ไม่ระบุ";
}

function viewingLine(visitor: InquiryVisitor): string {
  if (!visitor.viewingDate) return "";
  return `\nต้องการนัดชมทรัพย์ในวันที่: ${visitor.viewingDate} เวลา: ${visitor.viewingTime ?? "ไม่ระบุ"}`;
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
      "ดูรายละเอียดได้ที่แดชบอร์ด → ลูกค้าที่สนใจ",
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
      "ดูรายละเอียดได้ที่แดชบอร์ด CRM",
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
      "มอบหมายเอเจนต์ได้ที่ /admin/leads",
      "",
      "— Condominium.in.th",
    ].join("\n"),
  );
}
