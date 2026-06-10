import type { UserQuota } from "@/lib/quota";
import { t, tf } from "@/lib/i18n";
import { getLocale } from "@/lib/locale";
import { dateLocale } from "@/lib/locale-content";

export async function QuotaCard({ quota }: { quota: UserQuota }) {
  const locale = await getLocale();
  const dateLoc = dateLocale(locale);

  if (quota.unlimited) {
    return (
      <div className="rounded-2xl border border-violet-200 bg-violet-50 p-6">
        <h2 className="font-bold text-violet-900">{t("quotaAdminTitle", locale)}</h2>
        <p className="mt-3 text-violet-800">
          {tf("quotaAdminDesc", locale, { used: quota.used })}
        </p>
      </div>
    );
  }

  if (quota.role === "agent") {
    return (
      <div className="rounded-2xl border border-sky-200 bg-sky-50 p-6">
        <h2 className="font-bold text-sky-900">{t("quotaAgentTitle", locale)}</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl bg-white p-4 text-center">
            <p className="text-2xl font-bold text-sky-800">{quota.used}</p>
            <p className="text-sm text-sky-700">{t("quotaUsed", locale)}</p>
          </div>
          <div className="rounded-xl bg-white p-4 text-center">
            <p className="text-2xl font-bold text-slate-900">{quota.maxAllowed}</p>
            <p className="text-sm text-slate-600">{t("quotaMax", locale)}</p>
          </div>
          <div className="rounded-xl bg-white p-4 text-center">
            <p className="text-2xl font-bold text-sky-800">{quota.remaining}</p>
            <p className="text-sm text-sky-700">{t("quotaRemaining", locale)}</p>
          </div>
        </div>
        <p className="mt-4 text-sm text-sky-800">{t("quotaAgentNote", locale)}</p>
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

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6">
      <h2 className="font-bold text-slate-900">{t("quotaTitle", locale)}</h2>

      {!quota.fullyVerified ? (
        <p className="mt-3 text-amber-700">
          {tf("quotaVerifyFirst", locale, { limit: quota.freeLimit })}
        </p>
      ) : (
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl bg-teal-50 p-4 text-center">
            <p className="text-2xl font-bold text-teal-800">{quota.used}</p>
            <p className="text-sm text-teal-700">{t("quotaUsed", locale)}</p>
          </div>
          <div className="rounded-xl bg-slate-50 p-4 text-center">
            <p className="text-2xl font-bold text-slate-900">{quota.maxAllowed}</p>
            <p className="text-sm text-slate-600">{t("quotaMax", locale)}</p>
          </div>
          <div className="rounded-xl bg-violet-50 p-4 text-center">
            <p className="text-2xl font-bold text-violet-800">{quota.remaining}</p>
            <p className="text-sm text-violet-700">{t("quotaRemaining", locale)}</p>
          </div>
        </div>
      )}

      <div className="mt-4 text-sm text-slate-600">
        <p>
          {tf("quotaFreeLine", locale, { free: quota.freeLimit })}
          {quota.canBuyPackages && tf("quotaExtraLine", locale, { extra: quota.extraSlots })}
        </p>
        {quota.canBuyPackages && quota.activePackages.length > 0 && (
          <ul className="mt-2 space-y-1">
            {quota.activePackages.map((p) => (
              <li key={p.id}>
                {tf("quotaPackageExpires", locale, {
                  id: p.packageId,
                  slots: p.extraSlots,
                  date: new Date(p.expiresAt).toLocaleDateString(dateLoc),
                })}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
