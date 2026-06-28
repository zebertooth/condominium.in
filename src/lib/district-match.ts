import { getDistrictByName } from "@/lib/bangkok-districts";

/** Match listing district field against search filter. */
export function districtMatchesFilter(
  propertyDistrict: string | undefined | null,
  filterValue: string | undefined,
): boolean {
  if (!filterValue) return true;
  if (!propertyDistrict) return false;

  const filterDistrict = getDistrictByName(filterValue);
  const propertyDistrictResolved = getDistrictByName(propertyDistrict);

  if (filterDistrict && propertyDistrictResolved) {
    return filterDistrict.id === propertyDistrictResolved.id;
  }

  const prop = propertyDistrict.trim().toLowerCase();
  const filter = filterValue.trim().toLowerCase();
  if (prop === filter) return true;
  if (prop.includes(filter) || filter.includes(prop)) return true;

  if (filterDistrict && propertyDistrict.includes(filterDistrict.nameTh)) return true;

  return false;
}
