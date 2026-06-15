import { prisma } from "@/lib/db";
import { sendEmail } from "@/lib/notifications";
import { isActiveSponsor } from "@/lib/sponsored";
import { siteConfig } from "@/lib/seo";

export interface SponsorReminderResult {
  processed: number;
  sent3d: number;
  sent1d: number;
  skipped: number;
  errors: string[];
}

const DAY_MS = 24 * 60 * 60 * 1000;

function formatThaiDate(date: Date): string {
  return date.toLocaleDateString("th-TH", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function buildReminderEmail(opts: {
  ownerName: string;
  title: string;
  slug: string;
  until: Date;
  daysLeft: 3 | 1;
}): { subject: string; text: string } {
  const untilLabel = formatThaiDate(opts.until);
  const subject =
    opts.daysLeft === 3
      ? `[Condominium.in.th] ประกาศแนะนำ "${opts.title}" หมดอายุใน 3 วัน`
      : `[Condominium.in.th] ประกาศแนะนำ "${opts.title}" หมดอายุพรุ่งนี้`;

  const text = [
    `สวัสดีครับ/ค่ะ ${opts.ownerName}`,
    ``,
    opts.daysLeft === 3
      ? `ประกาศแนะนำ "${opts.title}" จะหมดอายุใน 3 วัน (ถึง ${untilLabel})`
      : `ประกาศแนะนำ "${opts.title}" จะหมดอายุพรุ่งนี้ (ถึง ${untilLabel})`,
    ``,
    `ต่ออายุได้ที่แดชบอร์ดหรือติดต่อทีมงาน:`,
    `${siteConfig.url}/dashboard`,
    `${siteConfig.url}/property/${opts.slug}`,
    ``,
    `— Condominium.in.th`,
  ].join("\n");

  return { subject, text };
}

export async function runSponsorRenewalReminders(): Promise<SponsorReminderResult> {
  const result: SponsorReminderResult = {
    processed: 0,
    sent3d: 0,
    sent1d: 0,
    skipped: 0,
    errors: [],
  };

  const now = Date.now();
  const listings = await prisma.userProperty.findMany({
    where: {
      status: "published",
      isSponsored: true,
      sponsoredUntil: { not: null, gt: new Date() },
    },
    include: {
      user: { select: { email: true, fullName: true } },
    },
  });

  for (const listing of listings) {
    result.processed++;

    if (!isActiveSponsor(listing.isSponsored, listing.sponsoredUntil)) {
      result.skipped++;
      continue;
    }

    const until = listing.sponsoredUntil!;
    const msLeft = until.getTime() - now;
    const daysLeft = msLeft / DAY_MS;

    const email = listing.user.email?.trim();
    if (!email) {
      result.skipped++;
      continue;
    }

    const ownerName = listing.user.fullName || "เจ้าของประกาศ";

    try {
      if (daysLeft <= 3 && daysLeft > 2 && !listing.sponsorReminder3dAt) {
        const { subject, text } = buildReminderEmail({
          ownerName,
          title: listing.title,
          slug: listing.slug,
          until,
          daysLeft: 3,
        });
        await sendEmail(email, subject, text);
        await prisma.userProperty.update({
          where: { id: listing.id },
          data: { sponsorReminder3dAt: new Date() },
        });
        result.sent3d++;
        continue;
      }

      if (daysLeft <= 1 && daysLeft > 0 && !listing.sponsorReminder1dAt) {
        const { subject, text } = buildReminderEmail({
          ownerName,
          title: listing.title,
          slug: listing.slug,
          until,
          daysLeft: 1,
        });
        await sendEmail(email, subject, text);
        await prisma.userProperty.update({
          where: { id: listing.id },
          data: { sponsorReminder1dAt: new Date() },
        });
        result.sent1d++;
        continue;
      }

      result.skipped++;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Send failed";
      result.errors.push(`${listing.slug}: ${message}`);
    }
  }

  return result;
}

/** Clear reminder flags when sponsorship is extended or removed. */
export function clearSponsorReminderFields(): {
  sponsorReminder3dAt: null;
  sponsorReminder1dAt: null;
} {
  return { sponsorReminder3dAt: null, sponsorReminder1dAt: null };
}
