import type { UserQuota } from "@/lib/quota";
import { t, tf } from "@/lib/i18n";
import { getLocale } from "@/lib/locale";

export async function QuotaCard({ quota }: { quota: UserQuota }) {
  const locale = await getLocale();

  if (quota.unlimited && quota.role === "admin") {
    return (
      <div className="rounded-2xl border border-violet-200 bg-violet-50 p-6">
        <h2 className="font-bold text-violet-900">{t("quotaAdminTitle", locale)}</h2>
        <p className="mt-3 text-violet-800">
          {tf("quotaAdminDesc", locale, { used: quota.used })}
        </p>
      </div>
    );
  }

  if (quota.postingBlocked) {
    return (
      <div className="rounded-2xl border border-sky-200 bg-sky-50 p-6">
        <h2 className="font-bold text-sky-900">{t("quotaNonThaiTitle", locale)}</h2>
        <p className="mt-3 text-sky-800">{t("quotaNonThaiDesc", locale)}</p>
      </div>
    );
  }

  if (!quota.fullyVerified) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <h2 className="font-bold text-slate-900">{t("quotaTitle", locale)}</h2>
        <p className="mt-3 text-amber-700">
          {tf("quotaVerifyFirst", locale, { limit: quota.verificationRequired })}
          {" "}
          ({quota.verificationCount}/{quota.verificationRequired})
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-teal-200 bg-teal-50 p-6">
      <h2 className="font-bold text-teal-900">{t("quotaUnlimitedTitle", locale)}</h2>
      <p className="mt-2 text-sm text-teal-800">{t("quotaUnlimitedDesc", locale)}</p>
      <div className="mt-4 rounded-xl bg-white p-4 text-center">
        <p className="text-2xl font-bold text-teal-800">{quota.used}</p>
        <p className="text-sm text-teal-700">{t("quotaUsed", locale)}</p>
      </div>
      {quota.role === "agent" && (
        <p className="mt-3 text-sm text-teal-800">{t("quotaAgentNote", locale)}</p>
      )}
    </div>
  );
}
