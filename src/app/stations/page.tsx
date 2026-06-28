import Link from "next/link";
import { JsonLd } from "@/components/seo/JsonLd";
import { HubExploreLinks } from "@/components/property/HubExploreLinks";
import {
  countForStation,
  getHubListingCounts,
  stationCountLabel,
} from "@/lib/hub-listing-counts";
import { localePath } from "@/lib/locale-routing";
import { getLocale } from "@/lib/locale";
import { t, tf } from "@/lib/i18n";
import { createMetadata } from "@/lib/seo";
import {
  TRANSIT_LINES,
  TRANSIT_STATIONS,
  stationFilterValue,
  stationsByLine,
} from "@/lib/transit-stations";

export async function generateMetadata() {
  const locale = await getLocale();
  return createMetadata({
    title:
      locale === "th"
        ? "สถานีรถไฟฟ้ากรุงเทพ BTS MRT BRT | Condominium.in.th"
        : "Bangkok Transit Stations BTS MRT BRT | Condominium.in.th",
    description:
      locale === "th"
        ? "รายชื่อสถานีรถไฟฟ้าในกรุงเทพฯ BTS สายสุขุมวิท สีลม MRT สีน้ำเงิน ม่วง เหลือง BRT และ Airport Rail Link — ค้นหาคอนโดใกล้สถานี"
        : "Browse Bangkok BTS, MRT, BRT and Airport Rail Link stations. Find condos for sale or rent near each station.",
    path: "/stations",
    keywords: ["BTS", "MRT", "BRT", "สถานีรถไฟฟ้า", "คอนโดใกล้ BTS"],
    locale,
  });
}

export default async function StationsPage() {
  const locale = await getLocale();
  const nonTh = locale !== "th";
  const hubCounts = await getHubListingCounts();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: nonTh ? "Bangkok transit stations" : "สถานีรถไฟฟ้ากรุงเทพ",
    numberOfItems: TRANSIT_STATIONS.length,
    itemListElement: TRANSIT_STATIONS.slice(0, 50).map((station, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: station.label,
      url: `https://www.condominium.in.th${localePath(`/buy?bts=${encodeURIComponent(station.name)}`, locale)}`,
    })),
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <JsonLd data={jsonLd} />

      <header className="max-w-3xl">
        <p className="text-sm font-medium text-teal-700">
          {nonTh ? "Transit guide" : "คู่มือสถานีรถไฟฟ้า"}
        </p>
        <h1 className="mt-2 text-3xl font-bold text-slate-900 sm:text-4xl">
          {nonTh
            ? "Bangkok BTS, MRT & BRT stations"
            : "สถานี BTS MRT BRT ในกรุงเทพฯ"}
        </h1>
        <p className="mt-3 text-slate-600">
          {nonTh ? (
            <>
              {TRANSIT_STATIONS.length} stations across {TRANSIT_LINES.length} lines — pick a
              station to browse condos for sale or rent. Station names reference{" "}
              <a
                href="https://th.wikipedia.org/wiki/%E0%B8%A3%E0%B8%B2%E0%B8%A2%E0%B8%8A%E0%B8%B7%E0%B9%88%E0%B8%AD%E0%B8%AA%E0%B8%96%E0%B8%B2%E0%B8%99%E0%B8%B5%E0%B8%A3%E0%B8%96%E0%B9%84%E0%B8%9F%E0%B8%9F%E0%B9%89%E0%B8%B2%E0%B9%83%E0%B8%99%E0%B8%81%E0%B8%A3%E0%B8%B8%E0%B8%87%E0%B9%80%E0%B8%97%E0%B8%9E%E0%B8%A1%E0%B8%AB%E0%B8%B2%E0%B8%99%E0%B8%84%E0%B8%A3%E0%B9%81%E0%B8%A5%E0%B8%B0%E0%B8%9B%E0%B8%A3%E0%B8%B4%E0%B8%A1%E0%B8%93%E0%B8%91%E0%B8%A5"
                className="text-teal-700 underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                Wikipedia
              </a>
              .
            </>
          ) : (
            <>
              รวม {TRANSIT_STATIONS.length} สถานี {TRANSIT_LINES.length} สาย — เลือกสถานีเพื่อดูประกาศซื้อ-เช่าคอนโดใกล้เคียง
              อ้างอิง{" "}
              <a
                href="https://th.wikipedia.org/wiki/%E0%B8%A3%E0%B8%B2%E0%B8%A2%E0%B8%8A%E0%B8%B7%E0%B9%88%E0%B8%AD%E0%B8%AA%E0%B8%96%E0%B8%B2%E0%B8%99%E0%B8%B5%E0%B8%A3%E0%B8%96%E0%B9%84%E0%B8%9F%E0%B8%9F%E0%B9%89%E0%B8%B2%E0%B9%83%E0%B8%99%E0%B8%81%E0%B8%A3%E0%B8%B8%E0%B8%87%E0%B9%80%E0%B8%97%E0%B8%9E%E0%B8%A1%E0%B8%AB%E0%B8%B2%E0%B8%99%E0%B8%84%E0%B8%A3%E0%B9%81%E0%B8%A5%E0%B8%B0%E0%B8%9B%E0%B8%A3%E0%B8%B4%E0%B8%A1%E0%B8%93%E0%B8%91%E0%B8%A5"
                className="text-teal-700 underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                วิกิพีเดีย
              </a>
            </>
          )}
        </p>
        <HubExploreLinks locale={locale} className="mt-4" />
      </header>

      <div className="mt-10 space-y-10">
        {TRANSIT_LINES.map((line) => {
          const stations = stationsByLine(line.id);
          if (stations.length === 0) return null;

          return (
            <section
              key={line.id}
              className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
            >
              <div
                className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-5 py-4"
                style={{ borderLeftWidth: 4, borderLeftColor: line.color }}
              >
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">
                    {line.prefix} · {nonTh ? line.nameEn : line.nameTh}
                  </h2>
                  <p className="text-sm text-slate-500">
                    {stations.length} {nonTh ? "stations" : "สถานี"}
                  </p>
                </div>
                <span
                  className="rounded-full px-3 py-1 text-xs font-semibold text-white"
                  style={{ backgroundColor: line.color }}
                >
                  {line.prefix}
                </span>
              </div>

              <ul className="grid gap-px bg-slate-100 sm:grid-cols-2 lg:grid-cols-3">
                {stations.map((station) => {
                  const counts = countForStation(hubCounts, station);
                  const countText = stationCountLabel(counts, locale);
                  const buyHref = localePath(
                    `/buy?bts=${encodeURIComponent(stationFilterValue(station))}`,
                    locale,
                  );
                  const rentHref = localePath(
                    `/rent?bts=${encodeURIComponent(stationFilterValue(station))}`,
                    locale,
                  );
                  const hubHref = station.hubSlug
                    ? localePath(`/buy/bts/${station.hubSlug}`, locale)
                    : null;

                  const mapHref = localePath(
                    `/map?bts=${encodeURIComponent(stationFilterValue(station))}&type=rent`,
                    locale,
                  );

                  return (
                    <li key={station.id} className="bg-white p-4">
                      <p className="font-medium text-slate-900">{station.label}</p>
                      <p className="text-xs text-slate-500">
                        {nonTh ? station.nameEn : station.name}
                      </p>
                      <p className="mt-1 text-xs font-medium text-teal-700">{countText}</p>
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
                        {hubHref && (
                          <Link
                            href={hubHref}
                            className="rounded-lg border border-slate-200 px-2.5 py-1 font-medium text-slate-700 hover:bg-slate-50"
                          >
                            {nonTh ? "Area guide" : "หน้าย่าน"}
                          </Link>
                        )}
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
        {tf("stationsFooter", locale, { count: String(TRANSIT_STATIONS.length) })}
      </p>
    </div>
  );
}
