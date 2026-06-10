"use client";

import Link from "next/link";
import { useT } from "@/components/i18n/LocaleProvider";
import { PAID_FEATURES_ENABLED, SPONSOR_PACKAGE } from "@/lib/packages";

export function SponsorUpsellBanner() {
  const t = useT();

  if (!PAID_FEATURES_ENABLED) return null;

  return (
    <div className="rounded-2xl border border-violet-200 bg-gradient-to-r from-violet-50 to-amber-50 p-6">
      <h2 className="font-bold text-violet-900">{t("postSuccessSponsorTitle")}</h2>
      <p className="mt-2 text-sm text-violet-800">{t("postSuccessSponsorDesc")}</p>
      <p className="mt-3 text-sm font-medium text-amber-900">
        {t("sponsorPkgName")} — ฿{SPONSOR_PACKAGE.priceBaht} / {SPONSOR_PACKAGE.durationDays} {t("sponsorDaysUnit")}
      </p>
      <Link
        href="/dashboard"
        className="mt-4 inline-block rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-700"
      >
        {t("postSuccessSponsorCta")}
      </Link>
    </div>
  );
}
