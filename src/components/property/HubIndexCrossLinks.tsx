import Link from "next/link";
import type { BangkokDistrict } from "@/lib/bangkok-districts";
import {
  districtsForStationFromGraph,
  stationsForDistrictFromGraph,
  type DistrictStationGraph,
} from "@/lib/district-stations";
import type { Locale } from "@/lib/i18n";
import { localePath } from "@/lib/locale-routing";
import { stationFilterValue, type TransitStation } from "@/lib/transit-stations";

interface HubIndexCrossLinksProps {
  locale: Locale;
  graph: DistrictStationGraph;
  district?: BangkokDistrict;
  station?: TransitStation;
}

/** District ↔ station cross-links on hub index cards. */
export function HubIndexCrossLinks({ locale, graph, district, station }: HubIndexCrossLinksProps) {
  const nonTh = locale !== "th";
  const lp = (path: string) => localePath(path, locale);

  const nearbyStations = district ? stationsForDistrictFromGraph(graph, district.nameTh, 3) : [];
  const nearbyDistricts = station ? districtsForStationFromGraph(graph, station.name, 3) : [];

  if (nearbyStations.length === 0 && nearbyDistricts.length === 0) return null;

  return (
    <div className="mt-2 space-y-1.5">
      {nearbyStations.length > 0 && (
        <div className="flex flex-wrap items-center gap-1">
          <span className="text-[10px] font-medium text-slate-500">
            {nonTh ? "Stations:" : "สถานี:"}
          </span>
          {nearbyStations.map((s) => (
            <Link
              key={s.id}
              href={lp(`/rent?bts=${encodeURIComponent(stationFilterValue(s))}`)}
              className="rounded-md border border-teal-100 bg-teal-50 px-1.5 py-0.5 text-[10px] font-medium text-teal-800 hover:bg-teal-100"
            >
              {s.label}
            </Link>
          ))}
        </div>
      )}
      {nearbyDistricts.length > 0 && (
        <div className="flex flex-wrap items-center gap-1">
          <span className="text-[10px] font-medium text-slate-500">
            {nonTh ? "Districts:" : "เขต:"}
          </span>
          {nearbyDistricts.map((d) => (
            <Link
              key={d.id}
              href={lp(`/rent/district/${encodeURIComponent(d.slug)}`)}
              className="rounded-md border border-violet-100 bg-violet-50 px-1.5 py-0.5 text-[10px] font-medium text-violet-800 hover:bg-violet-100"
            >
              {nonTh ? d.labelEn : d.labelTh}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
