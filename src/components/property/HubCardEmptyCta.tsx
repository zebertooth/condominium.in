import Link from "next/link";
import type { Locale } from "@/lib/i18n";
import { t } from "@/lib/i18n";
import { localePath } from "@/lib/locale-routing";

interface HubCardEmptyCtaProps {
  locale: Locale;
}

/** Compact empty-state links for hub index cards (districts / stations). */
export function HubCardEmptyCta({ locale }: HubCardEmptyCtaProps) {
  const nonTh = locale !== "th";
  const lp = (path: string) => localePath(path, locale);

  return (
    <div className="mt-2 flex flex-wrap gap-1.5 text-[11px]">
      <Link
        href={lp("/list-property")}
        className="rounded-md bg-amber-100 px-2 py-0.5 font-medium text-amber-900 hover:bg-amber-200"
      >
        {t("heroListCta", locale)}
      </Link>
      <Link
        href={lp("/contact")}
        className="rounded-md border border-amber-200 px-2 py-0.5 font-medium text-amber-800 hover:bg-amber-50"
      >
        {t("contact", locale)}
      </Link>
      <Link
        href={lp("/ai-search")}
        className="rounded-md border border-amber-200 px-2 py-0.5 font-medium text-amber-800 hover:bg-amber-50"
      >
        {t("aiSearch", locale)}
      </Link>
      <span className="w-full text-[10px] text-amber-700">
        {nonTh ? "Be the first to list here" : "ลงประกาศเป็นคนแรกในพื้นที่นี้"}
      </span>
    </div>
  );
}
