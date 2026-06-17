"use client";

import Link from "next/link";
import { useCompare } from "@/components/property/CompareProvider";
import { useT } from "@/components/i18n/LocaleProvider";
import { localePath } from "@/lib/locale-routing";
import { useLocale } from "@/components/i18n/LocaleProvider";

export function CompareBar() {
  const { slugs, clearCompare } = useCompare();
  const t = useT();
  const locale = useLocale();

  if (slugs.length === 0) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-indigo-200 bg-indigo-50/95 px-4 py-3 shadow-lg backdrop-blur">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3">
        <p className="text-sm font-medium text-indigo-900">
          {t("compareBarCount")} ({slugs.length})
        </p>
        <div className="flex flex-wrap gap-2">
          <Link
            href={localePath("/compare", locale)}
            className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
          >
            {t("compareView")}
          </Link>
          <button
            type="button"
            onClick={clearCompare}
            className="rounded-xl border border-indigo-300 px-4 py-2 text-sm text-indigo-800 hover:bg-white"
          >
            {t("compareClear")}
          </button>
        </div>
      </div>
    </div>
  );
}
