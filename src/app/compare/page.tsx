import { Suspense } from "react";
import { ComparePageClient } from "@/components/property/ComparePageClient";
import { getLocale } from "@/lib/locale";
import { t } from "@/lib/i18n";
import { createMetadata } from "@/lib/seo";

export async function generateMetadata() {
  const locale = await getLocale();
  return createMetadata({
    title: t("comparePageTitle", locale),
    description: t("comparePageDesc", locale),
    path: "/compare",
    locale,
  });
}

export default async function ComparePage() {
  const locale = await getLocale();

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-bold text-slate-900">{t("comparePageTitle", locale)}</h1>
      <p className="mt-2 text-slate-600">{t("comparePageDesc", locale)}</p>
      <div className="mt-8">
        <Suspense fallback={<p className="text-slate-600">{t("compareLoading", locale)}</p>}>
          <ComparePageClient />
        </Suspense>
      </div>
    </div>
  );
}
