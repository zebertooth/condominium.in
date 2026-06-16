import { getSponsorPackageById, type SponsorPackage } from "@/lib/packages";

/** Subscription packageId: `sponsor__{tierId}__{propertyId}` */
export function buildSponsorPackageId(tierId: string, propertyId: string): string {
  return `sponsor__${tierId}__${propertyId}`;
}

export function parseSponsorPackageId(
  packageId: string,
): { propertyId: string; tier: SponsorPackage | undefined } | null {
  if (packageId.startsWith("sponsor__")) {
    const rest = packageId.slice("sponsor__".length);
    const sep = rest.indexOf("__");
    if (sep === -1) return null;
    const tierId = rest.slice(0, sep);
    const propertyId = rest.slice(sep + 2);
    if (!propertyId) return null;
    return { propertyId, tier: getSponsorPackageById(tierId) };
  }

  // Legacy: sponsor_{propertyId} (pre–tier pricing)
  if (packageId.startsWith("sponsor_")) {
    const propertyId = packageId.slice("sponsor_".length);
    if (!propertyId || propertyId.includes("__")) return null;
    return { propertyId, tier: getSponsorPackageById("sponsor_7d") };
  }

  return null;
}

export function isSponsorSubscriptionPackageId(packageId: string): boolean {
  return parseSponsorPackageId(packageId) !== null;
}

export function sponsorPendingPackageFilter(propertyId: string) {
  return {
    OR: [
      { packageId: buildSponsorPackageId("sponsor_1d", propertyId) },
      { packageId: buildSponsorPackageId("sponsor_3d", propertyId) },
      { packageId: buildSponsorPackageId("sponsor_7d", propertyId) },
      { packageId: `sponsor_${propertyId}` },
    ],
  };
}
