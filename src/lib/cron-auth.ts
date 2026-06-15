/** Read cron secret with control characters stripped (Vercel rejects newlines in CRON_SECRET at deploy). */
export function readCronSecret(): string | undefined {
  const raw = process.env.CRON_SECRET ?? process.env.SEARCH_ALERT_CRON_SECRET;
  if (!raw) return undefined;
  const sanitized = raw.replace(/[\x00-\x1F\x7F]/g, "").trim();
  return sanitized || undefined;
}
