import { redirect } from "next/navigation";
import { CsvImportPanelLoader } from "@/components/dashboard/CsvImportPanelLoader";
import { getCurrentUser } from "@/lib/auth";
import { t } from "@/lib/i18n";
import { getLocale } from "@/lib/locale";
import { getUserQuota } from "@/lib/quota";

export default async function DashboardImportPage() {
  const [user, locale] = await Promise.all([getCurrentUser(), getLocale()]);
  if (!user) redirect("/login");
  if (user.role === "admin") redirect("/admin/import");

  const quota = await getUserQuota(user.id);

  if (quota.postingBlocked) {
    return (
      <div className="rounded-2xl border border-sky-200 bg-sky-50 p-6">
        <h2 className="font-bold text-sky-900">{t("postBlockedTitle", locale)}</h2>
        <p className="mt-2 text-sky-800">{t("postBlockedDesc", locale)}</p>
      </div>
    );
  }

  if (quota.requiresVerification) {
    return (
      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6">
        <h2 className="font-bold text-amber-900">{t("postVerifyTitle", locale)}</h2>
        <p className="mt-2 text-amber-800">{t("importVerifyDesc", locale)}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-bold text-slate-900">{t("dashImportTitle", locale)}</h2>
        <p className="mt-1 text-sm text-slate-600">{t("dashImportDesc", locale)}</p>
      </div>
      <CsvImportPanelLoader uploadPath="/api/user/import" pendingReviewNote locale={locale} />
    </div>
  );
}
