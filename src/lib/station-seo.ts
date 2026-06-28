import {
  getStationById,
  getStationByName,
  TRANSIT_STATIONS,
  type TransitStation,
} from "@/lib/transit-stations";

export function stationHubStaticParams() {
  return TRANSIT_STATIONS.map((s) => ({ id: s.id }));
}

export function resolveStationHub(idOrSlug: string): TransitStation | undefined {
  const raw = decodeURIComponent(idOrSlug).trim();
  const byId = getStationById(raw);
  if (byId) return byId;
  return getStationByName(raw);
}

export function stationHubPath(
  station: TransitStation,
  listingType: "sale" | "rent",
): string {
  const base = listingType === "sale" ? "/buy" : "/rent";
  return `${base}/station/${encodeURIComponent(station.id)}`;
}
