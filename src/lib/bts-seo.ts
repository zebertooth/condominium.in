import { areaGuides } from "@/lib/areas";
import type { AreaGuide } from "@/types/property";

export function resolveBtsGuide(stationSlug: string): AreaGuide | undefined {
  const normalized = stationSlug.trim().toLowerCase();
  return areaGuides.find(
    (guide) =>
      guide.slug === normalized ||
      guide.slug === `${normalized}-bts` ||
      guide.slug.replace(/-bts$/, "") === normalized,
  );
}

export function btsHubStaticParams() {
  return areaGuides.map((guide) => ({
    station: guide.slug.replace(/-bts$/, ""),
  }));
}
