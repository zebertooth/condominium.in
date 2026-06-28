import Link from "next/link";
import { JsonLd } from "@/components/seo/JsonLd";
import { HubCardEmptyCta } from "@/components/property/HubCardEmptyCta";
import { HubExploreLinks } from "@/components/property/HubExploreLinks";
import { HubIndexCrossLinks } from "@/components/property/HubIndexCrossLinks";
import {
  BANGKOK_DISTRICTS,
  DISTRICT_ZONE_LABELS,
  districtFilterValue,
  districtsByZone,
} from "@/lib/bangkok-districts";
import { getDistrictStationGraph } from "@/lib/district-stations";
import {
  countForDistrict,
  districtCountLabel,
  getHubListingCounts,
} from "@/lib/hub-listing-counts";
import { localePath } from "@/lib/locale-routing";
import { getLocale } from "@/lib/locale";
import { tf } from "@/lib/i18n";
import { createMetadata } from "@/lib/seo";

export async function generateMetadata() {
  const locale = await getLocale();
  return createMetadata({
    title:
      locale === "th"
        ? "50 เขตกรุงเทพฯ ค้นหาคอนโดตามเขต | Condominium.in.th"
        : "50 Bangkok Districts — Find Condos by Area | Condominium.in.th",
    description:
      locale === "th"
        ? "รายชื่อเขตของกรุงเทพมหานคร 50 เขต ค้นหาประกาศซื้อ-เช่าคอนโดตามเขต พร้อมแผนที่"
        : "All 50 Bangkok districts with buy and rent condo listings. Browse by inner, central, or outer zones.",
    path: "/districts",
    keywords: ["เขตกรุงเทพ", "Bangkok districts", "คอนโดตามเขต"],
    locale,
  });
}

export default async function DistrictsPage() {
  const locale = await getLocale();
  const nonTh = locale !== "th";
  const [hubCounts, graph] = await Promise.all([getHubListingCounts(), getDistrictStationGraph()]);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: nonTh ? "Bangkok districts" : "เขตกรุงเทพมหานคร",
    numberOfItems: BANGKOK_DISTRICTS.length,
    itemListElement: BANGKOK_DISTRICTS.slice(0, 50).map((d, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: nonTh ? d.labelEn : d.labelTh,
      url: `https://www.condominium.in.th${localePath(`/buy/district/${encodeURIComponent(d.slug)}`, locale)}`,
    })),
  };

  const zones = ["inner", "central", "outer"] as const;

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <JsonLd data={jsonLd} />

      <header className="max-w-3xl">
        <p className="text-sm font-medium text-violet-700">
          {nonTh ? "District guide" : "คู่มือเขตกรุงเทพฯ"}
        </p>
        <h1 className="mt-2 text-3xl font-bold text-slate-900 sm:text-4xl">
          {nonTh ? "50 Bangkok districts" : "50 เขตกรุงเทพมหานคร"}
        </h1>
        <p className="mt-3 text-slate-600">
          {nonTh ? (
            <>
              Browse condos by district with map search. Data from{" "}
              <a
                href="https://th.wikipedia.org/wiki/%E0%B8%A3%E0%B8%B2%E0%B8%A2%E0%B8%8A%E0%B8%B7%E0%B9%88%E0%B8%AD%E0%B9%80%E0%B8%82%E0%B8%95%E0%B8%82%E0%B8%AD%E0%B8%87%E0%B8%81%E0%B8%A3%E0%B8%B8%E0%B8%87%E0%B9%80%E0%B8%97%E0%B8%9E%E0%B8%A1%E0%B8%AB%E0%B8%B2%E0%B8%99%E0%B8%84%E0%B8%A3"
                className="text-violet-700 underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                Wikipedia
              </a>
              .
            </>
          ) : (
            <>
              ค้นหาคอนโดตามเขต พร้อมแผนที่ — อ้างอิง{" "}
              <a
                href="https://th.wikipedia.org/wiki/%E0%B8%A3%E0%B8%B2%E0%B8%A2%E0%B8%8A%E0%B8%B7%E0%B9%88%E0%B8%AD%E0%B9%80%E0%B8%82%E0%B8%95%E0%B8%82%E0%B8%AD%E0%B8%87%E0%B8%81%E0%B8%A3%E0%B8%B8%E0%B8%87%E0%B9%80%E0%B8%97%E0%B8%9E%E0%B8%A1%E0%B8%AB%E0%B8%B2%E0%B8%99%E0%B8%84%E0%B8%A3"
                className="text-violet-700 underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                วิกิพีเดีย
              </a>
            </>
          )}
        </p>
        <Link
          href={localePath("/map", locale)}
          className="btn-primary mt-4 inline-flex"
        >
          {nonTh ? "Open map search" : "เปิดค้นหาบนแผนที่"}
        </Link>
        <HubExploreLinks locale={locale} className="mt-4" />
      </header>

      <div className="mt-10 space-y-10">
        {zones.map((zone) => {
          const districts = districtsByZone(zone);
          const zoneColor =
            zone === "inner" ? "#0d9488" : zone === "central" ? "#7c3aed" : "#64748b";

          return (
            <section
              key={zone}
              className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
            >
              <div
                className="border-b border-slate-100 px-5 py-4"
                style={{ borderLeftWidth: 4, borderLeftColor: zoneColor }}
              >
                <h2 className="text-lg font-semibold text-slate-900">
                  {nonTh ? DISTRICT_ZONE_LABELS[zone].en : DISTRICT_ZONE_LABELS[zone].th}
                </h2>
                <p className="text-sm text-slate-500">
                  {districts.length} {nonTh ? "districts" : "เขต"}
                </p>
              </div>

              <ul className="grid gap-px bg-slate-100 sm:grid-cols-2 lg:grid-cols-3">
                {districts.map((district) => {
                  const counts = countForDistrict(hubCounts, district);
                  const countText = districtCountLabel(counts, locale);
                  const isEmpty = counts.sale + counts.rent === 0;
                  const buyHref = localePath(
                    `/buy/district/${encodeURIComponent(district.slug)}`,
                    locale,
                  );
                  const rentHref = localePath(
                    `/rent/district/${encodeURIComponent(district.slug)}`,
                    locale,
                  );
                  const mapHref = localePath(
                    `/map?district=${encodeURIComponent(districtFilterValue(district))}&type=rent`,
                    locale,
                  );

                  return (
                    <li key={district.id} className="bg-white p-4">
                      <p className="font-medium text-slate-900">
                        {nonTh ? district.labelEn : district.labelTh}
                      </p>
                      <p className="text-xs text-slate-500">{district.nameEn}</p>
                      <p className="mt-1 text-xs font-medium text-violet-700">{countText}</p>
                      {isEmpty && <HubCardEmptyCta locale={locale} />}
                      <HubIndexCrossLinks locale={locale} graph={graph} district={district} />
                      <div className="mt-3 flex flex-wrap gap-2 text-xs">
                        <Link
                          href={buyHref}
                          className="rounded-lg bg-teal-50 px-2.5 py-1 font-medium text-teal-800 hover:bg-teal-100"
                        >
                          {nonTh ? "Buy" : "ซื้อ"}
                        </Link>
                        <Link
                          href={rentHref}
                          className="rounded-lg bg-violet-50 px-2.5 py-1 font-medium text-violet-800 hover:bg-violet-100"
                        >
                          {nonTh ? "Rent" : "เช่า"}
                        </Link>
                        <Link
                          href={mapHref}
                          className="rounded-lg border border-slate-200 px-2.5 py-1 font-medium text-slate-700 hover:bg-slate-50"
                        >
                          {nonTh ? "Map" : "แผนที่"}
                        </Link>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </section>
          );
        })}
      </div>

      <p className="mt-10 text-center text-sm text-slate-500">
        {tf("districtsFooter", locale, { count: String(BANGKOK_DISTRICTS.length) })}
      </p>
    </div>
  );
}
