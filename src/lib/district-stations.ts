import { areaGuides } from "@/lib/areas";
import { BANGKOK_DISTRICTS, getDistrictByName, type BangkokDistrict } from "@/lib/bangkok-districts";
import { getAllListings } from "@/lib/listings";
import {
  getStationByName,
  type TransitStation,
} from "@/lib/transit-stations";

export interface DistrictStationGraph {
  stationsByDistrict: Record<string, string[]>;
  districtsByStation: Record<string, string[]>;
}

let cached: DistrictStationGraph | null = null;
let cachedAt = 0;
const CACHE_MS = 120_000;

/** Build district ↔ station links from live listings + area guides. */
export async function getDistrictStationGraph(): Promise<DistrictStationGraph> {
  const now = Date.now();
  if (cached && now - cachedAt < CACHE_MS) return cached;

  const stationsByDistrict = new Map<string, Set<string>>();
  const districtsByStation = new Map<string, Set<string>>();

  function link(districtName: string, stationName: string) {
    if (!districtName || !stationName) return;
    if (!stationsByDistrict.has(districtName)) stationsByDistrict.set(districtName, new Set());
    stationsByDistrict.get(districtName)!.add(stationName);
    if (!districtsByStation.has(stationName)) districtsByStation.set(stationName, new Set());
    districtsByStation.get(stationName)!.add(districtName);
  }

  const listings = await getAllListings();
  for (const listing of listings) {
    if (listing.btsStation && listing.district) {
      link(listing.district, listing.btsStation);
    }
  }

  for (const area of areaGuides) {
    const district = getDistrictByName(area.name) ?? getDistrictByName(area.btsStation);
    if (district) link(district.nameTh, area.btsStation);
  }

  const graph: DistrictStationGraph = {
    stationsByDistrict: Object.fromEntries(
      [...stationsByDistrict.entries()].map(([k, v]) => [k, [...v].sort()]),
    ),
    districtsByStation: Object.fromEntries(
      [...districtsByStation.entries()].map(([k, v]) => [k, [...v].sort()]),
    ),
  };

  cached = graph;
  cachedAt = now;
  return graph;
}

export async function stationsForDistrict(districtNameTh: string, limit = 8): Promise<TransitStation[]> {
  const graph = await getDistrictStationGraph();
  return stationsForDistrictFromGraph(graph, districtNameTh, limit);
}

export async function districtsForStation(stationName: string, limit = 6): Promise<BangkokDistrict[]> {
  const graph = await getDistrictStationGraph();
  return districtsForStationFromGraph(graph, stationName, limit);
}

export function stationsForDistrictFromGraph(
  graph: DistrictStationGraph,
  districtNameTh: string,
  limit = 3,
): TransitStation[] {
  const district = getDistrictByName(districtNameTh);
  const key = district?.nameTh ?? districtNameTh;
  const names = graph.stationsByDistrict[key] ?? [];

  const resolved: TransitStation[] = [];
  for (const name of names) {
    const station = getStationByName(name);
    if (station) resolved.push(station);
    if (resolved.length >= limit) break;
  }
  return resolved;
}

export function districtsForStationFromGraph(
  graph: DistrictStationGraph,
  stationName: string,
  limit = 3,
): BangkokDistrict[] {
  const station = getStationByName(stationName);
  const names = graph.districtsByStation[station?.name ?? stationName] ?? [];

  const resolved: BangkokDistrict[] = [];
  for (const name of names) {
    const district = getDistrictByName(name);
    if (district) resolved.push(district);
    if (resolved.length >= limit) break;
  }
  return resolved;
}

/** Popular districts that share listings with a station (fallback when graph is sparse). */
export function popularDistrictsNearStation(stationName: string, limit = 4): BangkokDistrict[] {
  const station = getStationByName(stationName);
  if (!station) return [];
  const inner = BANGKOK_DISTRICTS.filter((d) => d.zone === "inner" || d.zone === "central");
  return inner.slice(0, limit);
}
