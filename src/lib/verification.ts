/** Minimum verified channels required before a Thai user can post listings. */
export const POSTING_VERIFICATION_REQUIRED = 2;

export interface PostingVerificationUser {
  phoneVerified: boolean;
  emailVerified: boolean;
  idVerified: boolean;
  lineVerified: boolean;
}

/** Identity slot: national ID verified by admin, or LINE linked by user. */
export function isIdentityVerified(user: Pick<PostingVerificationUser, "idVerified" | "lineVerified">) {
  return user.idVerified || user.lineVerified;
}

export function countPostingVerifications(user: PostingVerificationUser): number {
  let count = 0;
  if (user.phoneVerified) count++;
  if (user.emailVerified) count++;
  if (isIdentityVerified(user)) count++;
  return count;
}

export function isPostingVerified(user: PostingVerificationUser): boolean {
  return countPostingVerifications(user) >= POSTING_VERIFICATION_REQUIRED;
}
