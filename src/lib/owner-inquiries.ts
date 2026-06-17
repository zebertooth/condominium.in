import { prisma } from "@/lib/db";

const ownerLeadWhere = (userId: string) => ({
  ownerUserId: userId,
  contactMode: "owner_direct" as const,
});

export async function getOwnerUnreadInquiryCount(userId: string): Promise<number> {
  return prisma.lead.count({
    where: { ...ownerLeadWhere(userId), status: "new" },
  });
}

export async function listOwnerInquiries(userId: string) {
  return prisma.lead.findMany({
    where: ownerLeadWhere(userId),
    orderBy: { createdAt: "desc" },
    take: 100,
  });
}
