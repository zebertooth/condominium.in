import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { t, tf } from "@/lib/i18n";
import { getLocale } from "@/lib/locale";
import { getUserQuota } from "@/lib/quota";
import { PostPropertyForm } from "@/components/dashboard/PostPropertyForm";

export default async function PostPropertyPage() {
  const [user, locale] = await Promise.all([getCurrentUser(), getLocale()]);
  if (!user) redirect("/login");

  const quota = await getUserQuota(user.id);

  if (quota.postingBlocked) {
    return (
      <div className="rounded-2xl border border-sky-200 bg-sky-50 p-6">
        <h2 className="font-bold text-sky-900">{t("postBlockedTitle", locale)}</h2>
        <p className="mt-2 text-sky-800">{t("postBlockedDesc", locale)}</p>
        <Link
          href="/ai-search"
          className="mt-4 inline-block rounded-lg bg-sky-600 px-4 py-2 text-white hover:bg-sky-700"
        >
          {t("postBlockedCta", locale)}
        </Link>
      </div>
    );
  }

  if (quota.requiresVerification) {
    return (
      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6">
        <h2 className="font-bold text-amber-900">{t("postVerifyTitle", locale)}</h2>
        <p className="mt-2 text-amber-800">
          {tf("postVerifyDesc", locale, { limit: quota.freeLimit })}
        </p>
        <Link
          href="/dashboard/verify"
          className="mt-4 inline-block rounded-lg bg-amber-600 px-4 py-2 text-white hover:bg-amber-700"
        >
          {t("postVerifyCta", locale)}
        </Link>
      </div>
    );
  }

  if (!quota.canPost) {
    return (
      <div className="rounded-2xl border border-violet-200 bg-violet-50 p-6">
        <h2 className="font-bold text-violet-900">{t("postQuotaFullTitle", locale)}</h2>
        <p className="mt-2 text-violet-800">
          {quota.canBuyPackages
            ? tf("postQuotaFullDescBuy", locale, { used: quota.used, max: quota.maxAllowed })
            : tf("postQuotaFullDescContact", locale, { used: quota.used, max: quota.maxAllowed })}
        </p>
        {quota.canBuyPackages && (
          <Link
            href="/dashboard"
            className="mt-4 inline-block rounded-lg bg-violet-600 px-4 py-2 text-white hover:bg-violet-700"
          >
            {t("postQuotaBuyCta", locale)}
          </Link>
        )}
      </div>
    );
  }

  return (
    <div>
      <p className="mb-6 text-sm text-slate-600">
        {quota.unlimited
          ? tf("postQuotaUnlimited", locale, { used: quota.used })
          : tf("postQuotaRemaining", locale, {
              remaining: quota.remaining,
              used: quota.used,
              max: quota.maxAllowed,
            })}
      </p>
      <PostPropertyForm />
    </div>
  );
}
