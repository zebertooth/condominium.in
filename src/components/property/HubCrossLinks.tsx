import Link from "next/link";
import { districtsForStation, stationsForDistrict } from "@/lib/district-stations";
import { districtFilterValue, type BangkokDistrict } from "@/lib/bangkok-districts";
import type { Locale } from "@/lib/i18n";
import { localePath } from "@/lib/locale-routing";
import { getStationByName, stationFilterValue } from "@/lib/transit-stations";
import type { ListingType } from "@/types/property";

interface HubCrossLinksProps {
  locale: Locale;
  listingType: ListingType;
  district?: BangkokDistrict | null;
  stationName?: string | null;
}

export async function HubCrossLinks({
  locale,
  listingType,
  district,
  stationName,
}: HubCrossLinksProps) {
  const nonTh = locale !== "th";
  const lp = (path: string) => localePath(path, locale);
  const typePath = listingType === "sale" ? "buy" : "rent";

  const nearbyStations = district ? await stationsForDistrict(district.nameTh, 8) : [];
  const stationResolved = stationName ? getStationByName(stationName) : null;
  const nearbyDistricts = stationResolved
    ? await districtsForStation(stationResolved.name, 6)
    : stationName
      ? await districtsForStation(stationName, 6)
      : [];

  if (nearbyStations.length === 0 && nearbyDistricts.length === 0) return null;

  return (
    <section className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 p-5">
      {nearbyStations.length > 0 && (
        <div>
          <h2 className="text-sm font-semibold text-slate-800">
            {nonTh
              ? `Transit stations in ${district ? (nonTh ? district.labelEn : district.labelTh) : "this area"}`
              : `สถานีรถไฟฟ้าใน${district ? district.labelTh : "พื้นที่นี้"}`}
          </h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {nearbyStations.map((station) => (
              <Link
                key={station.id}
                href={lp(`/${typePath}?bts=${encodeURIComponent(stationFilterValue(station))}`)}
                className="rounded-full border border-teal-200 bg-white px-3 py-1.5 text-xs font-medium text-teal-800 hover:bg-teal-50"
              >
                {station.label}
              </Link>
            ))}
            <Link
              href={lp("/stations")}
              className="rounded-full border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-white"
            >
              {nonTh ? "All stations" : "สถานีทั้งหมด"}
            </Link>
          </div>
        </div>
      )}

      {nearbyDistricts.length > 0 && (
        <div className={nearbyStations.length > 0 ? "mt-5 border-t border-slate-200 pt-5" : ""}>
          <h2 className="text-sm font-semibold text-slate-800">
            {nonTh
              ? `Districts near ${stationResolved?.label ?? stationName}`
              : `เขตใกล้ ${stationResolved?.label ?? stationName}`}
          </h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {nearbyDistricts.map((d) => (
              <Link
                key={d.id}
                href={lp(`/${typePath}/district/${encodeURIComponent(d.slug)}`)}
                className="rounded-full border border-violet-200 bg-white px-3 py-1.5 text-xs font-medium text-violet-800 hover:bg-violet-50"
              >
                {nonTh ? d.labelEn : d.labelTh}
              </Link>
            ))}
            <Link
              href={lp("/districts")}
              className="rounded-full border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-white"
            >
              {nonTh ? "All districts" : "เขตทั้งหมด"}
            </Link>
          </div>
        </div>
      )}

      {district && (
        <div className="mt-4 flex flex-wrap gap-2 text-xs">
          <Link
            href={lp(`/map?district=${encodeURIComponent(districtFilterValue(district))}&type=${listingType === "sale" ? "sale" : "rent"}`)}
            className="font-medium text-slate-600 hover:text-teal-700"
          >
            {nonTh ? "View on map" : "ดูบนแผนที่"} →
          </Link>
        </div>
      )}
    </section>
  );
}
