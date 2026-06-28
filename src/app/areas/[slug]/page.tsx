import Link from "next/link";
import { notFound } from "next/navigation";
import { PropertyGrid } from "@/components/property/PropertyGrid";
import { HubExploreLinks } from "@/components/property/HubExploreLinks";
import { getAreaBySlug } from "@/lib/areas";
import { t } from "@/lib/i18n";
import { filterListings } from "@/lib/listings";
import {
  areaBtsLineLabel,
  areaDescription,
  areaHighlights,
  areaName,
  areaSeoTitle,
  areaSeoDescription,
  isNonThaiLocale,
  numberLocale,
} from "@/lib/locale-content";
import { getLocale } from "@/lib/locale";
import { localePath } from "@/lib/locale-routing";
import { MarketTrendsBanner } from "@/components/market/MarketTrendsBanner";
import { createMetadata } from "@/lib/seo";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const area = getAreaBySlug(slug);
  if (!area) return {};

  const locale = await getLocale();

  return createMetadata({
    title: areaSeoTitle(area, locale),
    description: areaSeoDescription(area, locale),
    path: `/areas/${slug}`,
    keywords: [area.nameEn, area.name, `BTS ${area.nameEn}`, "condo"],
    locale,
  });
}

export default async function AreaPage({ params }: PageProps) {
  const { slug } = await params;
  const area = getAreaBySlug(slug);
  if (!area) notFound();

  const [properties, locale] = await Promise.all([
    filterListings({ btsStation: area.btsStation }),
    getLocale(),
  ]);

  const name = areaName(area, locale);
  const description = areaDescription(area, locale);
  const btsLine = areaBtsLineLabel(area.btsLine, locale);
  const highlights = areaHighlights(area, locale);
  const nonTh = isNonThaiLocale(locale);
  const numLoc = numberLocale(locale);
  const lp = (path: string) => localePath(path, locale);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <nav className="mb-6 text-sm text-slate-500">
        <Link href={lp("/areas")} className="hover:text-teal-700">
          {t("areas", locale)}
        </Link>
        {" / "}
        <span className="text-slate-900">BTS {area.nameEn}</span>
      </nav>

      <h1 className="text-3xl font-bold text-slate-900">
        {nonTh
          ? locale === "zh"
            ? `BTS ${area.nameEn} 附近公寓 (${name})`
            : locale === "ja"
              ? `BTS ${area.nameEn} 近くのコンド (${name})`
              : locale === "ar"
                ? `شقق قرب BTS ${area.nameEn} (${name})`
                : `Condos near BTS ${area.nameEn} (${name})`
          : `คอนโดใกล้ BTS ${area.btsStation} (${area.name})`}
      </h1>
      <p className="mt-4 max-w-3xl text-lg leading-relaxed text-slate-700">{description}</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl bg-teal-50 p-4">
          <p className="text-sm text-teal-700">{t("avgRentPrice", locale)}</p>
          <p className="text-xl font-bold text-teal-900">
            ฿{area.avgRentPrice.toLocaleString(numLoc)}
            {nonTh ? (locale === "ar" ? "/شهر" : locale === "zh" ? "/月" : locale === "ja" ? "/月" : "/mo") : "/เดือน"}
          </p>
        </div>
        <div className="rounded-xl bg-slate-50 p-4">
          <p className="text-sm text-slate-600">{t("avgSalePrice", locale)}</p>
          <p className="text-xl font-bold text-slate-900">
            ฿{area.avgSalePrice.toLocaleString(numLoc)}
            {nonTh ? (locale === "ar" ? "/م²" : locale === "zh" ? "/㎡" : locale === "ja" ? "/㎡" : "/sqm") : "/ตร.ม."}
          </p>
        </div>
        <div className="rounded-xl bg-slate-50 p-4">
          <p className="text-sm text-slate-600">
            {locale === "th" ? "สาย BTS" : locale === "zh" ? "BTS 线路" : locale === "ja" ? "BTS路線" : locale === "ar" ? "خط BTS" : "BTS Line"}
          </p>
          <p className="text-xl font-bold text-slate-900">{btsLine}</p>
        </div>
        <div className="rounded-xl bg-slate-50 p-4">
          <p className="text-sm text-slate-600">
            {locale === "th"
              ? "ประกาศในระบบ"
              : locale === "zh"
                ? "在架房源"
                : locale === "ja"
                  ? "掲載物件"
                  : locale === "ar"
                    ? "الإعلانات النشطة"
                    : "Active Listings"}
          </p>
          <p className="text-xl font-bold text-slate-900">
            {properties.length}{" "}
            {locale === "th"
              ? "รายการ"
              : locale === "zh"
                ? "套"
                : locale === "ja"
                  ? "件"
                  : locale === "ar"
                    ? "إعلان"
                    : "listings"}
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

      <MarketTrendsBanner locale={locale} district={area.name} />

      <div className="mt-8 flex flex-wrap gap-2">
        <Link
          href={lp(`/buy?bts=${encodeURIComponent(area.btsStation)}`)}
          className="rounded-lg bg-teal-50 px-3 py-1.5 text-sm font-medium text-teal-800 hover:bg-teal-100"
        >
          {nonTh ? `Buy near BTS ${area.nameEn}` : `ซื้อใกล้ BTS ${area.btsStation}`}
        </Link>
        <Link
          href={lp(`/rent?bts=${encodeURIComponent(area.btsStation)}`)}
          className="rounded-lg bg-violet-50 px-3 py-1.5 text-sm font-medium text-violet-800 hover:bg-violet-100"
        >
          {nonTh ? `Rent near BTS ${area.nameEn}` : `เช่าใกล้ BTS ${area.btsStation}`}
        </Link>
        <Link
          href={lp(`/map?bts=${encodeURIComponent(area.btsStation)}&type=rent`)}
          className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          {nonTh ? "Map" : "แผนที่"}
        </Link>
        <Link
          href={lp("/stations")}
          className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          {nonTh ? "All stations" : "สถานีทั้งหมด"}
        </Link>
        <Link
          href={lp("/districts")}
          className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          {nonTh ? "By district" : "ค้นหาตามเขต"}
        </Link>
      </div>

      <div className="mt-10 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 p-6 text-white">
        <h2 className="text-xl font-bold">
          {locale === "zh"
            ? `用 AI 搜索 BTS ${area.nameEn} 附近公寓`
            : locale === "ja"
              ? `AIでBTS ${area.nameEn}近くのコンドを探す`
              : locale === "ar"
                ? `ابحث عن شقق قرب BTS ${area.nameEn} بالذكاء الاصطناعي`
                : nonTh
                  ? `Find Condos near BTS ${area.nameEn} with AI`
                  : `หาคอนโดใกล้ BTS ${area.btsStation} ด้วย AI`}
        </h2>
        <p className="mt-2 text-violet-100">
          {locale === "zh"
            ? `描述您的需求，例如"BTS ${area.nameEn} 附近两居室，预算 30,000 泰铢"。AI 将为您匹配房源。`
            : locale === "ja"
              ? `「BTS ${area.nameEn}近く2BR、予算3万バーツ」など、希望条件を入力するとAIが物件を提案します。`
              : locale === "ar"
                ? `صف احتياجك، مثل "غرفتان قرب BTS ${area.nameEn}، ميزانية 30,000 بات".`
                : nonTh
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
          {locale === "zh"
            ? `BTS ${area.nameEn} 附近房源`
            : locale === "ja"
              ? `BTS ${area.nameEn}近くの物件`
              : locale === "ar"
                ? `إعلانات قرب BTS ${area.nameEn}`
                : nonTh
                  ? `Listings near BTS ${area.nameEn}`
                  : `ประกาศใกล้ BTS ${area.btsStation}`}
        </h2>
        <PropertyGrid properties={properties} locale={locale} />
      </div>
    </div>
  );
}
