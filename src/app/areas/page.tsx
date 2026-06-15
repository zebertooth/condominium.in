import Link from "next/link";
import { areaGuides } from "@/lib/areas";
import { t } from "@/lib/i18n";
import { areaBtsLineLabel, areaDescription, areaHighlights, areaName } from "@/lib/locale-content";
import { getLocale } from "@/lib/locale";
import { localePath } from "@/lib/locale-routing";
import { createMetadata } from "@/lib/seo";

export async function generateMetadata() {
  return createMetadata({
  title: "ย่านใกล้ BTS กรุงเทพ",
  description:
    "คู่มือย่านใกล้ BTS ในกรุงเทพฯ อโศก ทองหล่อ สาทร เอกมัย พญาไท ราคาเช่าและขายคอนโด",
  path: "/areas",
  keywords: ["ย่าน BTS", "คอนโดใกล้ BTS", "ทำเลคอนโด"],
  });
}

export default async function AreasPage() {
  const locale = await getLocale();
  const lp = (path: string) => localePath(path, locale);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-bold text-slate-900">{t("areasPageTitle", locale)}</h1>
      <p className="mt-2 max-w-2xl text-slate-600">{t("areasCardDesc", locale)}</p>

      <div className="mt-10 grid gap-6 sm:grid-cols-2">
        {areaGuides.map((area) => {
          const name = areaName(area, locale);
          const description = areaDescription(area, locale);
          const highlights = areaHighlights(area, locale);
          const btsLine = areaBtsLineLabel(area.btsLine, locale);

          return (
            <Link
              key={area.slug}
              href={lp(`/areas/${area.slug}`)}
              className="rounded-2xl border border-slate-200 bg-white p-6 transition hover:border-teal-300 hover:shadow-md"
            >
              <p className="text-sm font-medium text-teal-700">
                BTS {area.nameEn} · {btsLine}
              </p>
              <h2 className="mt-2 text-xl font-bold text-slate-900">{name}</h2>
              <p className="mt-3 text-slate-600">{description}</p>
              <ul className="mt-4 flex flex-wrap gap-2">
                {highlights.map((h) => (
                  <li key={h} className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-700">
                    {h}
                  </li>
                ))}
              </ul>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
