import { isContactVerified } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { AGENT_DEFAULT_LIMIT, FREE_PROPERTY_LIMIT, PAID_FEATURES_ENABLED } from "@/lib/packages";

export interface UserQuota {
  role: string;
  unlimited: boolean;
  canBuyPackages: boolean;
  requiresVerification: boolean;
  postingBlocked: boolean;
  isThai: boolean;
  lineVerified: boolean;
  listingLimitOverride: number | null;
  freeLimit: number;
  extraSlots: number;
  maxAllowed: number;
  used: number;
  remaining: number;
  canPost: boolean;
  phoneVerified: boolean;
  emailVerified: boolean;
  contactVerified: boolean;
  idVerified: boolean;
  fullyVerified: boolean;
  activePackages: {
    id: string;
    packageId: string;
    extraSlots: number;
    expiresAt: string;
  }[];
}

export async function expireOldSubscriptions(userId: string) {
  await prisma.userSubscription.updateMany({
    where: {
      userId,
      status: "active",
      paymentStatus: "confirmed",
      expiresAt: { lt: new Date() },
    },
    data: { status: "expired" },
  });
}

export async function getUserQuota(userId: string): Promise<UserQuota> {
  await expireOldSubscriptions(userId);

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      role: true,
      listingLimitOverride: true,
      isThai: true,
      lineVerified: true,
      phoneVerified: true,
      emailVerified: true,
      idVerified: true,
    },
  });

  if (!user) {
    throw new Error("USER_NOT_FOUND");
  }

  const used = await prisma.userProperty.count({
    where: {
      userId,
      status: { in: ["pending", "published"] },
    },
  });

  const activePackages = await prisma.userSubscription.findMany({
    where: {
      userId,
      status: "active",
      paymentStatus: "confirmed",
      expiresAt: { gt: new Date() },
    },
    orderBy: { expiresAt: "asc" },
  });

  const rawExtraSlots = activePackages.reduce((sum, p) => sum + p.extraSlots, 0);
  const extraSlots = PAID_FEATURES_ENABLED ? rawExtraSlots : 0;
  const contactVerified = isContactVerified(user);

  const isAdmin = user.role === "admin";
  const isAgent = user.role === "agent";
  const isThai = user.isThai;
  const unlimited = isAdmin;
  const isNormalUser = !isAdmin && !isAgent;

  // Launch policy: ID no longer required. Thai users unlock posting with LINE + Email.
  // Non-Thai users may verify email but cannot post listings yet (SMS verify in next phase).
  const launchVerified = user.lineVerified && user.emailVerified;
  const postingBlocked = isNormalUser && !isThai;
  const requiresVerification = isNormalUser && isThai && !launchVerified;

  // Eligible-to-post flag (kept as `fullyVerified` for backward compatibility).
  const fullyVerified = isAdmin || isAgent || (isThai && launchVerified);

  const canBuyPackages = PAID_FEATURES_ENABLED && isNormalUser && isThai;

  // Base allowance per role. Admin can override any account's base limit.
  const baseLimit =
    user.listingLimitOverride ?? (isAgent ? AGENT_DEFAULT_LIMIT : FREE_PROPERTY_LIMIT);

  let maxAllowed: number;
  if (unlimited) {
    maxAllowed = Number.MAX_SAFE_INTEGER;
  } else if (isAgent) {
    maxAllowed = baseLimit; // agents cannot buy packages — limit is admin-controlled
  } else if (postingBlocked || requiresVerification) {
    maxAllowed = 0;
  } else {
    maxAllowed = baseLimit + extraSlots;
  }

  const remaining = unlimited ? Number.MAX_SAFE_INTEGER : Math.max(0, maxAllowed - used);
  const eligibleToPost = !postingBlocked && !requiresVerification;
  const canPost = unlimited || (eligibleToPost && remaining > 0);

  return {
    role: user.role,
    unlimited,
    canBuyPackages,
    requiresVerification,
    postingBlocked,
    isThai,
    lineVerified: user.lineVerified,
    listingLimitOverride: user.listingLimitOverride,
    freeLimit: baseLimit,
    extraSlots,
    maxAllowed,
    used,
    remaining,
    canPost,
    phoneVerified: user.phoneVerified,
    emailVerified: user.emailVerified,
    contactVerified,
    idVerified: user.idVerified,
    fullyVerified,
    activePackages: activePackages.map((p) => ({
      id: p.id,
      packageId: p.packageId,
      extraSlots: p.extraSlots,
      expiresAt: p.expiresAt.toISOString(),
    })),
  };
}
