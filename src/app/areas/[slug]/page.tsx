import Link from "next/link";
import { notFound } from "next/navigation";
import { PropertyGrid } from "@/components/property/PropertyGrid";
import { getAreaBySlug } from "@/lib/areas";
import { t } from "@/lib/i18n";
import { filterListings } from "@/lib/listings";
import { getLocale } from "@/lib/locale";
import { numberLocale, usesEnglishContent } from "@/lib/locale-content";
import { createMetadata } from "@/lib/seo";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const area = getAreaBySlug(slug);
  if (!area) return {};

  const locale = await getLocale();
  const enContent = usesEnglishContent(locale);

  return createMetadata({
    title: enContent && area.seoTitleEn ? area.seoTitleEn : area.seoTitle,
    description: enContent && area.seoDescriptionEn ? area.seoDescriptionEn : area.seoDescription,
    path: `/areas/${slug}`,
    keywords: [area.nameEn, area.name, `BTS ${area.nameEn}`, "condo"],
  });
}

function btsLineLabel(btsLine: string, enContent: boolean): string {
  if (!enContent) return `สาย${btsLine}`;
  if (btsLine === "สุขุมวิท") return "Sukhumvit Line";
  if (btsLine === "สีลม") return "Silom Line";
  return "Sukhumvit/Silom Interchange";
}

export default async function AreaPage({ params }: PageProps) {
  const { slug } = await params;
  const area = getAreaBySlug(slug);
  if (!area) notFound();

  const [properties, locale] = await Promise.all([
    filterListings({ btsStation: area.btsStation }),
    getLocale(),
  ]);

  const enContent = usesEnglishContent(locale);
  const numLoc = numberLocale(locale);
  const name = enContent ? area.nameEn : area.name;
  const description = enContent && area.descriptionEn ? area.descriptionEn : area.description;
  const btsLine = btsLineLabel(area.btsLine, enContent);
  const highlights = enContent && area.highlightsEn ? area.highlightsEn : area.highlights;

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <nav className="mb-6 text-sm text-slate-500">
        <Link href="/areas" className="hover:text-teal-700">
          {t("areas", locale)}
        </Link>
        {" / "}
        <span className="text-slate-900">BTS {area.nameEn}</span>
      </nav>

      <h1 className="text-3xl font-bold text-slate-900">
        {enContent
          ? `Condos near BTS ${area.nameEn} (${name})`
          : `คอนโดใกล้ BTS ${area.btsStation} (${area.name})`}
      </h1>
      <p className="mt-4 max-w-3xl text-lg leading-relaxed text-slate-700">{description}</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl bg-teal-50 p-4">
          <p className="text-sm text-teal-700">{t("avgRentPrice", locale)}</p>
          <p className="text-xl font-bold text-teal-900">
            ฿{area.avgRentPrice.toLocaleString(numLoc)}
            {enContent ? "/mo" : "/เดือน"}
          </p>
        </div>
        <div className="rounded-xl bg-slate-50 p-4">
          <p className="text-sm text-slate-600">{t("avgSalePrice", locale)}</p>
          <p className="text-xl font-bold text-slate-900">
            ฿{area.avgSalePrice.toLocaleString(numLoc)}
            {enContent ? "/sqm" : "/ตร.ม."}
          </p>
        </div>
        <div className="rounded-xl bg-slate-50 p-4">
          <p className="text-sm text-slate-600">{enContent ? "BTS Line" : "สาย BTS"}</p>
          <p className="text-xl font-bold text-slate-900">{btsLine}</p>
        </div>
        <div className="rounded-xl bg-slate-50 p-4">
          <p className="text-sm text-slate-600">{enContent ? "Active Listings" : "ประกาศในระบบ"}</p>
          <p className="text-xl font-bold text-slate-900">
            {properties.length} {enContent ? "listings" : "รายการ"}
          </p>
        </div>
      </div>

      {highlights.length > 0 && (
        <ul className="mt-6 flex flex-wrap gap-2">
          {highlights.map((h) => (
            <li key={h} className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700">
              {h}
            </li>
          ))}
        </ul>
      )}

      <div className="mt-10 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 p-6 text-white">
        <h2 className="text-xl font-bold">
          {enContent
            ? `Find Condos near BTS ${area.nameEn} with AI`
            : `หาคอนโดใกล้ BTS ${area.btsStation} ด้วย AI`}
        </h2>
        <p className="mt-2 text-violet-100">
          {enContent
            ? `Tell us what you want, e.g. "2 bedrooms near BTS ${area.nameEn}, budget 30,000". AI will find matches.`
            : `บอกความต้องการ เช่น "2 ห้องนอน ใกล้ BTS ${area.btsStation} งบ 30,000" AI จะแนะนำทรัพย์ที่ตรงใจ`}
        </p>
        <Link
          href={`/ai-search?q=ใกล้+BTS+${area.btsStation}&type=rent`}
          className="mt-4 inline-block rounded-xl bg-white px-5 py-2.5 font-medium text-indigo-700"
        >
          {t("heroAiCta", locale)}
        </Link>
      </div>

      <div className="mt-12">
        <h2 className="mb-6 text-xl font-semibold">
          {enContent
            ? `Listings near BTS ${area.nameEn}`
            : `ประกาศใกล้ BTS ${area.btsStation}`}
        </h2>
        <PropertyGrid properties={properties} locale={locale} />
      </div>
    </div>
  );
}
