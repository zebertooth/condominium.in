import Link from "next/link";
import { getIntegrationStatus } from "@/lib/integrations";
import { readCronSecret } from "@/lib/cron-auth";
import { adsenseClientId } from "@/lib/adsense";
import { getSiteSettings } from "@/lib/site-settings";
import { t } from "@/lib/i18n";
import { getLocale } from "@/lib/locale";

export async function AdminOpsPanel() {
  const locale = await getLocale();
  const integrations = getIntegrationStatus();
  const cronSecret = readCronSecret();
  const adsense = Boolean(adsenseClientId());
  const settings = await getSiteSettings();
  const filledSlots = Object.values(settings.adSlots).filter((s) => s?.trim()).length;

  const gscMeta = Boolean(process.env.GOOGLE_SITE_VERIFICATION?.trim());

  const checks = [
    {
      label: "CRON_SECRET",
      ok: Boolean(cronSecret),
      hint: cronSecret ? t("adminOpsCronOk", locale) : t("adminOpsCronMissing", locale),
    },
    {
      label: "Resend email",
      ok: integrations.resend,
      hint: integrations.resend ? t("adminOpsResendOk", locale) : t("adminOpsResendMissing", locale),
    },
    {
      label: "AdSense client",
      ok: adsense,
      hint: adsense ? adsenseClientId() : t("adminOpsAdsenseClientMissing", locale),
    },
    {
      label: t("adminOpsAdSlots", locale),
      ok: filledSlots >= 3,
      hint: `${filledSlots}/9 — ${t("adminSeo", locale)}`,
    },
    {
      label: "Google Search Console",
      ok: gscMeta,
      hint: gscMeta ? t("adminOpsGscOk", locale) : t("adminOpsGscMissing", locale),
    },
  ];

  return (
    <div className="space-y-6">
      <p className="text-sm text-slate-600">{t("adminOpsIntro", locale)}</p>
      <div className="grid gap-4 sm:grid-cols-2">
        {checks.map((check) => (
          <div
            key={check.label}
            className={`rounded-2xl border p-4 ${check.ok ? "border-emerald-200 bg-emerald-50" : "border-amber-200 bg-amber-50"}`}
          >
            <div className="flex items-center justify-between gap-2">
              <p className="font-medium text-slate-900">{check.label}</p>
              <span
                className={`rounded-full px-2 py-0.5 text-xs font-medium ${check.ok ? "bg-emerald-600 text-white" : "bg-amber-600 text-white"}`}
              >
                {check.ok ? "OK" : "TODO"}
              </span>
            </div>
            <p className="mt-2 text-sm text-slate-700">{check.hint}</p>
          </div>
        ))}
      </div>
      <div className="rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-700">
        <p className="font-medium text-slate-900">{t("adminOpsCronSchedule", locale)}</p>
        <ul className="mt-2 list-inside list-disc space-y-1">
          <li>01:00 UTC — search alerts (daily)</li>
          <li>02:00 UTC Mon — search alerts (weekly)</li>
          <li>03:00 UTC — sponsor reminders</li>
        </ul>
        <p className="mt-3">
          <Link href="/admin/seo" className="text-teal-700 hover:underline">
            {t("adminSeo", locale)}
          </Link>
          {" · "}
          <a
            href="https://search.google.com/search-console"
            target="_blank"
            rel="noopener noreferrer"
            className="text-teal-700 hover:underline"
          >
            Google Search Console
          </a>
        </p>
      </div>
    </div>
  );
}
