import { filterListings } from "@/lib/listings";
import { prisma } from "@/lib/db";
import { sendEmail } from "@/lib/notifications";
import { siteConfig } from "@/lib/seo";
import type { SearchFilters } from "@/types/property";

export interface DigestRunResult {
  processed: number;
  sent: number;
  skipped: number;
  errors: string[];
}

function parseFilters(raw: string): SearchFilters {
  try {
    const parsed = JSON.parse(raw) as SearchFilters;
    return typeof parsed === "object" && parsed ? parsed : {};
  } catch {
    return {};
  }
}

function isDue(alert: { lastSentAt: Date | null; createdAt: Date }, frequency: string): boolean {
  const now = Date.now();
  const anchor = alert.lastSentAt ?? alert.createdAt;
  const elapsedMs = now - anchor.getTime();
  if (frequency === "weekly") return elapsedMs >= 7 * 24 * 60 * 60 * 1000;
  return elapsedMs >= 24 * 60 * 60 * 1000;
}

function buildDigestEmail(
  alertName: string,
  listingType: "sale" | "rent",
  matches: Awaited<ReturnType<typeof filterListings>>,
): { subject: string; text: string } {
  const typeLabel = listingType === "rent" ? "เช่า" : "ขาย";
  const subject = `[Condominium.in.th] ทรัพย์${typeLabel}ใหม่ตรงกับ "${alertName}" (${matches.length} รายการ)`;
  const lines = matches.slice(0, 10).map((p) => {
    const price =
      p.listingType === "rent"
        ? `฿${p.price.toLocaleString()}/เดือน`
        : `฿${p.price.toLocaleString()}`;
    return `- ${p.title} — ${price}\n  ${siteConfig.url}/property/${p.slug}`;
  });
  const text = [
    `สวัสดีครับ/ค่ะ`,
    ``,
    `มีประกาศ${typeLabel}ใหม่ ${matches.length} รายการที่ตรงกับการแจ้งเตือน "${alertName}":`,
    ``,
    ...lines,
    matches.length > 10 ? `\n... และอีก ${matches.length - 10} รายการ` : "",
    ``,
    `ดูการแจ้งเตือนทั้งหมด: ${siteConfig.url}/dashboard/alerts`,
    ``,
    `— Condominium.in.th`,
  ]
    .filter(Boolean)
    .join("\n");

  return { subject, text };
}

export async function runSearchAlertDigests(frequency: "daily" | "weekly"): Promise<DigestRunResult> {
  const result: DigestRunResult = { processed: 0, sent: 0, skipped: 0, errors: [] };

  const alerts = await prisma.searchAlert.findMany({
    where: { active: true, frequency },
  });

  for (const alert of alerts) {
    result.processed++;

    if (!isDue(alert, frequency)) {
      result.skipped++;
      continue;
    }

    const user = await prisma.user.findUnique({
      where: { id: alert.userId },
      select: { email: true, fullName: true },
    });

    if (!user?.email) {
      result.skipped++;
      continue;
    }

    const filters = parseFilters(alert.filters);
    const since = alert.lastSentAt ?? alert.createdAt;
    const allMatches = await filterListings({
      ...filters,
      listingType: alert.listingType as "sale" | "rent",
    });

    const newMatches = allMatches.filter((p) => {
      const published = new Date(p.publishedAt);
      return published >= since;
    });

    if (newMatches.length === 0) {
      await prisma.searchAlert.update({
        where: { id: alert.id },
        data: { lastSentAt: new Date() },
      });
      result.skipped++;
      continue;
    }

    const { subject, text } = buildDigestEmail(
      alert.name,
      alert.listingType as "sale" | "rent",
      newMatches,
    );

    const emailResult = await sendEmail(user.email, subject, text);
    if (!emailResult.delivered) {
      result.errors.push(`Alert ${alert.id}: ${emailResult.error ?? "email failed"}`);
      continue;
    }

    await prisma.searchAlert.update({
      where: { id: alert.id },
      data: { lastSentAt: new Date() },
    });
    result.sent++;
  }

  return result;
}
