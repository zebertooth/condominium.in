import { SPONSOR_PACKAGES } from "@/lib/packages";
import { sendEmail } from "@/lib/notifications";
import { siteConfig } from "@/lib/seo";

function formatThaiDate(date: Date): string {
  return date.toLocaleDateString("th-TH", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function sponsorPricingLine(): string {
  return SPONSOR_PACKAGES.map((p) => `${p.durationDays} วัน ฿${p.priceBaht}`).join(" · ");
}

export async function sendSponsorPaymentConfirmedEmail(opts: {
  email: string;
  ownerName: string;
  title: string;
  slug: string;
  amountBaht: number;
  sponsoredUntil: Date;
  durationDays?: number;
}): Promise<void> {
  const untilLabel = formatThaiDate(opts.sponsoredUntil);
  const duration =
    opts.durationDays != null ? `${opts.durationDays} วัน` : untilLabel;

  const subject = `[Condominium.in.th] ชำระเงินสำเร็จ — ประกาศแนะนำ "${opts.title}"`;
  const text = [
    `สวัสดีครับ/ค่ะ ${opts.ownerName}`,
    ``,
    `ยืนยันการชำระเงิน ฿${opts.amountBaht} สำหรับประกาศแนะนำเรียบร้อยแล้ว`,
    ``,
    `ประกาศ: ${opts.title}`,
    duration !== untilLabel ? `ระยะเวลา: ${duration}` : undefined,
    `แสดงในหมวดประกาศแนะนำถึง: ${untilLabel}`,
    ``,
    `ดูประกาศ: ${siteConfig.url}/property/${opts.slug}`,
    `แดชบอร์ด: ${siteConfig.url}/dashboard`,
    ``,
    `— Condominium.in.th`,
  ]
    .filter(Boolean)
    .join("\n");

  await sendEmail(opts.email, subject, text);
}

export async function sendSponsorExpiredEmail(opts: {
  email: string;
  ownerName: string;
  title: string;
  slug: string;
}): Promise<void> {
  const subject = `[Condominium.in.th] ประกาศแนะนำ "${opts.title}" หมดอายุแล้ว`;
  const text = [
    `สวัสดีครับ/ค่ะ ${opts.ownerName}`,
    ``,
    `ประกาศแนะนำ "${opts.title}" หมดอายุแล้ว — ประกาศยังอยู่ในระบบแต่ไม่แสดงในหมวดแนะนำ`,
    ``,
    `ต่ออายุประกาศแนะนำได้ที่แดชบอร์ด:`,
    `${siteConfig.url}/dashboard`,
    ``,
    `ราคา: ${sponsorPricingLine()}`,
    `${siteConfig.url}/property/${opts.slug}`,
    ``,
    `— Condominium.in.th`,
  ].join("\n");

  await sendEmail(opts.email, subject, text);
}

export { sponsorPricingLine, formatThaiDate as formatPaymentThaiDate };
