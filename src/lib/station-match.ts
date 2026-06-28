import { resolveStationFromFilter } from "@/lib/transit-stations";

/** Match listing `btsStation` field against a search filter (Thai name, label, or id). */
export function stationMatchesFilter(
  propertyStation: string | undefined | null,
  filterValue: string | undefined,
): boolean {
  if (!filterValue) return true;
  if (!propertyStation) return false;

  const filterStation = resolveStationFromFilter(filterValue);
  const propertyResolved = resolveStationFromFilter(propertyStation);

  if (filterStation && propertyResolved) {
    return filterStation.id === propertyResolved.id || filterStation.name === propertyResolved.name;
  }

  const prop = propertyStation.trim().toLowerCase();
  const filter = filterValue.trim().toLowerCase();
  if (prop === filter) return true;
  if (prop.includes(filter) || filter.includes(prop)) return true;

  if (filterStation && (prop.includes(filterStation.name.toLowerCase()) || propertyStation.includes(filterStation.label))) {
    return true;
  }

  return false;
}
