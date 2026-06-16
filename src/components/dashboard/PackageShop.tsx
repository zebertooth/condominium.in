"use client";

import { useEffect, useState } from "react";
import { useT } from "@/components/i18n/LocaleProvider";
import { SPONSOR_PACKAGES } from "@/lib/packages";
import {
  readSponsorPaymentSession,
  type SponsorPaymentSession,
} from "@/components/dashboard/SponsorPaymentWizard";

const TIER_KEYS: Record<string, { name: string; desc: string }> = {
  sponsor_1d: { name: "sponsorTier1dName", desc: "sponsorTier1dDesc" },
  sponsor_3d: { name: "sponsorTier3dName", desc: "sponsorTier3dDesc" },
  sponsor_7d: { name: "sponsorTier7dName", desc: "sponsorTier7dDesc" },
};

interface PackageShopProps {
  onResumePayment?: (session: SponsorPaymentSession) => void;
}

export function PackageShop({ onResumePayment }: PackageShopProps) {
  const t = useT();
  const [pendingSession, setPendingSession] = useState<SponsorPaymentSession | null>(null);

  useEffect(() => {
    const session = readSponsorPaymentSession();
    if (session && session.step >= 2 && session.status !== "confirmed") {
      setPendingSession(session);
    }
  }, []);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6">
      <h2 className="font-bold text-slate-900">{t("sponsorShopTitle")}</h2>
      <p className="mt-1 text-sm text-slate-600">{t("sponsorShopDesc")}</p>

      {pendingSession && onResumePayment && (
        <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-4">
          <p className="text-sm font-medium text-amber-900">{t("sponsorFlowResumeTitle")}</p>
          <p className="mt-1 text-xs text-amber-800">
            {pendingSession.propertyTitle} — {pendingSession.packageName}
          </p>
          <button
            type="button"
            onClick={() => onResumePayment(pendingSession)}
            className="mt-3 rounded-lg bg-amber-600 px-4 py-2 text-sm font-medium text-white hover:bg-amber-700"
          >
            {t("sponsorFlowResumeBtn")}
          </button>
        </div>
      )}

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        {SPONSOR_PACKAGES.map((pkg) => {
          const keys = TIER_KEYS[pkg.id];
          return (
            <div
              key={pkg.id}
              className="relative rounded-xl border border-amber-200 bg-amber-50 p-5"
            >
              {pkg.badge && (
                <span className="absolute -top-2 right-3 rounded-full bg-amber-600 px-2 py-0.5 text-xs text-white">
                  {pkg.badge}
                </span>
              )}
              <h3 className="font-bold text-amber-900">
                {keys ? t(keys.name as Parameters<typeof t>[0]) : pkg.name}
              </h3>
              <p className="mt-1 text-sm text-amber-800">
                {keys ? t(keys.desc as Parameters<typeof t>[0]) : pkg.description}
              </p>
              <p className="mt-3 text-2xl font-bold text-amber-900">฿{pkg.priceBaht}</p>
              <p className="mt-1 text-xs text-amber-700">
                {pkg.durationDays} {t("sponsorDaysUnit")}
              </p>
            </div>
          );
        })}
      </div>

      <p className="mt-4 text-sm text-slate-600">{t("sponsorPackageHint")}</p>
      <p className="mt-2 text-xs text-slate-500">{t("sponsorFlowStepsSummary")}</p>
    </div>
  );
}
