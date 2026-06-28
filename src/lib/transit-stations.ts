import { areaGuides } from "@/lib/areas";
import {
  STATION_TUPLES,
  TRANSIT_LINES,
  type StationCategory,
  type TransitLine,
  type TransitLineId,
} from "@/lib/transit-stations-data";

export type { StationCategory, TransitLine, TransitLineId };
export { TRANSIT_LINES, STATION_TUPLES };

export interface TransitStation {
  id: string;
  name: string;
  nameEn: string;
  lineId: TransitLineId;
  category: StationCategory;
  lat: number;
  lng: number;
  label: string;
  lineLabelTh: string;
  lineLabelEn: string;
  lineColor: string;
  /** SEO hub slug when we have an area guide */
  hubSlug?: string;
  searchTerms: string[];
}

const lineById = Object.fromEntries(TRANSIT_LINES.map((l) => [l.id, l])) as Record<
  TransitLineId,
  TransitLine
>;

const hubSlugByName = new Map(
  areaGuides.map((g) => [g.btsStation, g.slug.replace(/-bts$/, "")]),
);

function buildStation(
  id: string,
  lineId: TransitLineId,
  name: string,
  nameEn: string,
  lat: number,
  lng: number,
): TransitStation {
  const line = lineById[lineId];
  const hubSlug = hubSlugByName.get(name);
  return {
    id,
    name,
    nameEn,
    lineId,
    category: line.category,
    lat,
    lng,
    label: `${line.prefix} ${name}`,
    lineLabelTh: line.nameTh,
    lineLabelEn: line.nameEn,
    lineColor: line.color,
    hubSlug,
    searchTerms: [name, nameEn, line.prefix, line.nameTh, line.nameEn, id],
  };
}

export const TRANSIT_STATIONS: TransitStation[] = STATION_TUPLES.map(
  ([id, lineId, name, nameEn, lat, lng]) => buildStation(id, lineId, name, nameEn, lat, lng),
);

/** @deprecated alias — same shape as TransitStation for post forms */
export interface NearbyStation {
  id: string;
  name: string;
  category: StationCategory;
  lat: number;
  lng: number;
  label: string;
}

export const NEARBY_STATIONS: NearbyStation[] = TRANSIT_STATIONS.map((s) => ({
  id: s.id,
  name: s.name,
  category: s.category,
  lat: s.lat,
  lng: s.lng,
  label: s.label,
}));

export const STATION_CATEGORY_ORDER: StationCategory[] = [
  "bts",
  "mrt",
  "gold",
  "brt",
  "train",
  "airport",
];

export function getTransitLine(lineId: TransitLineId): TransitLine {
  return lineById[lineId];
}

export function stationsByCategory(category: StationCategory): TransitStation[] {
  return TRANSIT_STATIONS.filter((s) => s.category === category);
}

export function stationsByLine(lineId: TransitLineId): TransitStation[] {
  return TRANSIT_STATIONS.filter((s) => s.lineId === lineId);
}

export function getStationById(id: string): TransitStation | undefined {
  return TRANSIT_STATIONS.find((s) => s.id === id);
}

export function getStationByName(name: string): TransitStation | undefined {
  const trimmed = name.trim();
  return TRANSIT_STATIONS.find(
    (s) => s.name === trimmed || s.label === trimmed || s.nameEn.toLowerCase() === trimmed.toLowerCase(),
  );
}

export function findStationId(value?: string | null): string {
  if (!value) return "";
  const exact = TRANSIT_STATIONS.find(
    (s) => s.id === value || s.label === value || s.name === value,
  );
  if (exact) return exact.id;
  const byName = getStationByName(value);
  return byName?.id ?? "";
}

export function getStationCoords(stationIdOrLabel: string): { lat: number; lng: number } | null {
  const match = getStationById(stationIdOrLabel) ?? getStationByName(stationIdOrLabel);
  return match ? { lat: match.lat, lng: match.lng } : null;
}

export function formatNearbyStation(station?: string | null): string {
  if (!station) return "";
  if (/^(BTS|MRT|BRT|Gold Line|Airport Rail Link|SRT)/i.test(station)) return station;
  const match = getStationByName(station);
  return match?.label ?? `BTS ${station}`;
}

/** Filter value stored in URL — Thai station name for backward compatibility */
export function stationFilterValue(station: TransitStation): string {
  return station.name;
}

export function resolveStationFromFilter(value?: string | null): TransitStation | undefined {
  if (!value) return undefined;
  return getStationById(value) ?? getStationByName(value);
}

export function searchTransitStations(query: string, lineId?: TransitLineId | "all"): TransitStation[] {
  const q = query.trim().toLowerCase();
  let list = lineId && lineId !== "all" ? stationsByLine(lineId) : TRANSIT_STATIONS;
  if (!q) return list;
  return list.filter((s) =>
    s.searchTerms.some((term) => term.toLowerCase().includes(q)),
  );
}

export const DEFAULT_MAP_CENTER = { lat: 13.7563, lng: 100.5018 };

export function getOsmEmbedUrl(lat: number, lng: number): string {
  const delta = 0.008;
  const bbox = `${lng - delta},${lat - delta},${lng + delta},${lat + delta}`;
  return `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat},${lng}`;
}

export function getGoogleMapsUrl(lat: number, lng: number): string {
  return `https://www.google.com/maps?q=${lat},${lng}`;
}

/** @deprecated */
export const BTS_LOCATIONS: Record<string, { lat: number; lng: number; label: string }> =
  Object.fromEntries(
    TRANSIT_STATIONS.filter((s) => s.category === "bts").map((s) => [
      s.name,
      { lat: s.lat, lng: s.lng, label: s.label },
    ]),
  );
