import { getIntegrationStatus } from "@/lib/integrations";
import { PAID_FEATURES_ENABLED } from "@/lib/packages";
import { t } from "@/lib/i18n";
import { getLocale } from "@/lib/locale";

const LABELS: Record<keyof ReturnType<typeof getIntegrationStatus>, string> = {
  openai: "OpenAI",
  resend: "Resend (Email)",
  thaibulksms: "ThaiBulkSMS",
  twilio: "Twilio (SMS fallback)",
  cloudinary: "Cloudinary",
  line: "LINE Login",
  promptpay: "PromptPay",
  slipok: "SlipOK",
  ga4: "GA4",
  turnstile: "Turnstile (CAPTCHA)",
};

export async function IntegrationStatus() {
  const locale = await getLocale();
  const status = getIntegrationStatus();

  return (
    <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6">
      <h2 className="font-semibold text-slate-900">{t("adminIntegrationTitle", locale)}</h2>
      <p className="mt-1 text-sm text-slate-500">{t("adminIntegrationDesc", locale)}</p>
      <p className="mt-2 text-sm">
        {t("adminPaidLabel", locale)}:{" "}
        <span className={PAID_FEATURES_ENABLED ? "font-medium text-green-700" : "text-amber-700"}>
          {PAID_FEATURES_ENABLED ? t("adminPaidOn", locale) : t("adminPaidOff", locale)}
        </span>
      </p>
      <ul className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {(Object.keys(status) as (keyof typeof status)[]).map((key) => (
          <li
            key={key}
            className={`flex items-center justify-between rounded-lg px-3 py-2 text-sm ${
              status[key] ? "bg-green-50 text-green-800" : "bg-slate-50 text-slate-500"
            }`}
          >
            <span>{LABELS[key]}</span>
            <span className="font-medium">{status[key] ? "✓" : "—"}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
