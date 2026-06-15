import Link from "next/link";
import { areaGuides } from "@/lib/areas";
import type { Locale } from "@/lib/i18n";
import { t } from "@/lib/i18n";
import { areaName, numberLocale } from "@/lib/locale-content";
import { localePath } from "@/lib/locale-routing";

interface BlogAreaStripProps {
  locale: Locale;
}

const AREA_COLORS = [
  "bg-violet-600",
  "bg-pink-600",
  "bg-teal-600",
  "bg-amber-600",
  "bg-indigo-600",
  "bg-rose-600",
];

export function BlogAreaStrip({ locale }: BlogAreaStripProps) {
  const areas = areaGuides.slice(0, 6);
  const lp = (path: string) => localePath(path, locale);

  return (
    <section>
      <div className="text-center">
        <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">
          {t("blogRecommendedAreas", locale)}
        </h2>
        <p className="mx-auto mt-2 max-w-2xl text-sm text-slate-600 sm:text-base">
          {t("blogRecommendedAreasDesc", locale)}
        </p>
      </div>

      <div className="mt-6 flex gap-4 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {areas.map((area, index) => (
          <Link
            key={area.slug}
            href={lp(`/areas/${area.slug}`)}
            className="w-[220px] shrink-0 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md sm:w-[240px]"
          >
            <div className="relative h-28 bg-gradient-to-br from-slate-700 to-slate-900">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.15),transparent_55%)]" />
              <span
                className={`absolute bottom-3 left-3 rounded px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white ${AREA_COLORS[index % AREA_COLORS.length]}`}
              >
                BTS
              </span>
            </div>
            <div className="p-4">
              <p className="font-bold text-slate-900">{areaName(area, locale)}</p>
              <p className="mt-1 text-xs text-slate-500">BTS {area.btsStation}</p>
              <p className="mt-2 text-xs text-teal-700">
                {t("rentAvgPrefix", locale)} ฿
                {area.avgRentPrice.toLocaleString(numberLocale(locale))}
                {t("rentAvgSuffix", locale)}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
