export function isActiveSponsor(
  isSponsored: boolean,
  sponsoredUntil: Date | null,
  now = new Date(),
): boolean {
  return isSponsored && (!sponsoredUntil || sponsoredUntil > now);
}
