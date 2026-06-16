import { filterListings, propertyMatchesFilters } from "@/lib/listings";
import { prisma } from "@/lib/db";
import { sendEmail } from "@/lib/notifications";
import { siteConfig } from "@/lib/seo";
import type { Property, SearchFilters } from "@/types/property";

export interface DigestRunResult {
  processed: number;
  sent: number;
  skipped: number;
  errors: string[];
}

const ENGAGEMENT_WINDOW_MS = 30 * 24 * 60 * 60 * 1000;
const WEEKLY_MS = 7 * 24 * 60 * 60 * 1000;
const MONTHLY_MS = 30 * 24 * 60 * 60 * 1000;
const EVENT_THROTTLE_MS = 6 * 60 * 60 * 1000;

type AlertRow = {
  id: string;
  userId: string;
  name: string;
  listingType: string;
  filters: string;
  lastSentAt: Date | null;
  lastEngagedAt: Date;
  createdAt: Date;
};

function parseFilters(raw: string): SearchFilters {
  try {
    const parsed = JSON.parse(raw) as SearchFilters;
    return typeof parsed === "object" && parsed ? parsed : {};
  } catch {
    return {};
  }
}

function isEngaged(alert: { lastEngagedAt: Date }): boolean {
  return Date.now() - alert.lastEngagedAt.getTime() < ENGAGEMENT_WINDOW_MS;
}

function backupIntervalMs(alert: { lastEngagedAt: Date }): number {
  return isEngaged(alert) ? WEEKLY_MS : MONTHLY_MS;
}

function isDueForBackup(alert: AlertRow): boolean {
  const anchor = alert.lastSentAt ?? alert.createdAt;
  return Date.now() - anchor.getTime() >= backupIntervalMs(alert);
}

function isEventThrottled(alert: AlertRow): boolean {
  if (!alert.lastSentAt) return false;
  return Date.now() - alert.lastSentAt.getTime() < EVENT_THROTTLE_MS;
}

function buildDigestEmail(
  alertName: string,
  listingType: "sale" | "rent",
  matches: Property[],
  kind: "welcome" | "new" | "backup",
): { subject: string; text: string } {
  const typeLabel = listingType === "rent" ? "เช่า" : "ขาย";

  if (kind === "welcome" && matches.length === 0) {
    return {
      subject: `[Condominium.in.th] สมัครการแจ้งเตือน "${alertName}" แล้ว`,
      text: [
        `สวัสดีครับ/ค่ะ`,
        ``,
        `คุณสมัครรับการแจ้งเตือนสำหรับประกาศ${typeLabel} "${alertName}" เรียบร้อยแล้ว`,
        `ตอนนี้ยังไม่มีประกาศที่ตรงกับเงื่อนไข — เราจะส่งอีเมลให้เมื่อมีประกาศใหม่`,
        ``,
        `จัดการการแจ้งเตือน: ${siteConfig.url}/dashboard/alerts`,
        ``,
        `— Condominium.in.th`,
      ].join("\n"),
    };
  }

  const intro =
    kind === "welcome"
      ? `ประกาศ${typeLabel}ที่ตรงกับการแจ้งเตือน "${alertName}" ตอนนี้ (${matches.length} รายการ):`
      : kind === "new"
        ? `มีประกาศ${typeLabel}ใหม่ที่ตรงกับการแจ้งเตือน "${alertName}":`
        : `สรุปประกาศ${typeLabel}ใหม่ที่ตรงกับ "${alertName}" (${matches.length} รายการ):`;

  const subjectPrefix =
    kind === "welcome"
      ? "ทรัพย์ตรงกับการแจ้งเตือน"
      : kind === "new"
        ? "ทรัพย์ใหม่ตรงกับ"
        : "สรุปทรัพย์ใหม่ตรงกับ";

  const subject = `[Condominium.in.th] ${subjectPrefix} "${alertName}" (${matches.length} รายการ)`;

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
    intro,
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

async function sendAlertEmail(
  alert: AlertRow,
  matches: Property[],
  kind: "welcome" | "new" | "backup",
): Promise<{ sent: boolean; error?: string }> {
  const user = await prisma.user.findUnique({
    where: { id: alert.userId },
    select: { email: true },
  });

  if (!user?.email) {
    return { sent: false, error: "no email" };
  }

  const { subject, text } = buildDigestEmail(
    alert.name,
    alert.listingType as "sale" | "rent",
    matches,
    kind,
  );

  const emailResult = await sendEmail(user.email, subject, text);
  if (!emailResult.delivered) {
    return { sent: false, error: emailResult.error ?? "email failed" };
  }

  await prisma.searchAlert.update({
    where: { id: alert.id },
    data: { lastSentAt: new Date() },
  });

  return { sent: true };
}

/** Instant email when user creates a search alert. */
export async function sendWelcomeDigestForAlert(
  alertId: string,
): Promise<{ sent: boolean; error?: string }> {
  const alert = await prisma.searchAlert.findUnique({ where: { id: alertId } });
  if (!alert || !alert.active) {
    return { sent: false, error: "alert not found" };
  }

  const filters = parseFilters(alert.filters);
  const matches = await filterListings({
    ...filters,
    listingType: alert.listingType as "sale" | "rent",
  });

  return sendAlertEmail(alert, matches, "welcome");
}

/** Event-driven email when a listing is published and matches active alerts. */
export async function notifySearchAlertsForPublishedListing(
  listing: Property,
): Promise<{ notified: number; skipped: number }> {
  if (listing.status && listing.status !== "published") {
    return { notified: 0, skipped: 0 };
  }

  const alerts = await prisma.searchAlert.findMany({
    where: { active: true, listingType: listing.listingType },
  });

  let notified = 0;
  let skipped = 0;

  for (const alert of alerts) {
    const filters = parseFilters(alert.filters);
    if (!propertyMatchesFilters(listing, filters)) {
      skipped++;
      continue;
    }

    if (isEventThrottled(alert)) {
      skipped++;
      continue;
    }

    const result = await sendAlertEmail(alert, [listing], "new");
    if (result.sent) notified++;
    else skipped++;
  }

  return { notified, skipped };
}

/** Weekly backup digest for alerts that missed event-driven sends. */
export async function runSearchAlertDigests(): Promise<DigestRunResult> {
  const result: DigestRunResult = { processed: 0, sent: 0, skipped: 0, errors: [] };

  const alerts = await prisma.searchAlert.findMany({
    where: { active: true },
  });

  for (const alert of alerts) {
    result.processed++;

    if (!isDueForBackup(alert)) {
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

    const emailResult = await sendAlertEmail(alert, newMatches, "backup");
    if (emailResult.sent) {
      result.sent++;
    } else {
      result.errors.push(`Alert ${alert.id}: ${emailResult.error ?? "email failed"}`);
    }
  }

  return result;
}

/** Mark alerts as engaged (used when user visits alert dashboard). */
export async function touchSearchAlertEngagement(userId: string): Promise<void> {
  await prisma.searchAlert.updateMany({
    where: { userId, active: true },
    data: { lastEngagedAt: new Date() },
  });
}
