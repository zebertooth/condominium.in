import { prisma } from "@/lib/db";

export async function getUserSavedSlugs(userId: string): Promise<Set<string>> {
  const saved = await prisma.savedProperty.findMany({
    where: { userId },
    select: { propertySlug: true },
  });
  return new Set(saved.map((s) => s.propertySlug));
}

export async function getUserSavedProperties(userId: string) {
  return prisma.savedProperty.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
}
