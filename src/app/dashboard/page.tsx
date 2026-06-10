import { redirect } from "next/navigation";
import { MyProperties } from "@/components/dashboard/MyProperties";
import { PackageShop } from "@/components/dashboard/PackageShop";
import { QuotaCard } from "@/components/dashboard/QuotaCard";
import { SponsorUpsellBanner } from "@/components/dashboard/SponsorUpsellBanner";
import { getCurrentUser } from "@/lib/auth";
import { getOwnerPropertyStats } from "@/lib/analytics";
import { prisma } from "@/lib/db";
import { getUserQuota } from "@/lib/quota";
import { dbPropertyToListing } from "@/lib/user-properties";

interface DashboardPageProps {
  searchParams: Promise<{ posted?: string }>;
}

export default async function DashboardPage({ searchParams }: DashboardPageProps) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const { posted } = await searchParams;
  const quota = await getUserQuota(user.id);
  const rows = await prisma.userProperty.findMany({
    where: { userId: user.id, status: { not: "deleted" } },
    orderBy: { createdAt: "desc" },
  });

  const propertySlugs = rows.map((r) => r.slug);
  const statsMap = await getOwnerPropertyStats(propertySlugs);

  const properties = rows.map((row) => {
    const p = dbPropertyToListing(row);
    const stats = statsMap[p.slug];
    if (stats) {
      p.viewsCount = stats.viewsCount;
      p.inquiriesCount = stats.inquiriesCount;
      p.contactClicksCount = stats.contactClicksCount;
      p.viewsCount30d = stats.viewsCount30d;
      p.inquiriesCount30d = stats.inquiriesCount30d;
      p.contactClicksCount30d = stats.contactClicksCount30d;
    }
    return p;
  });

  return (
    <div className="space-y-8">
      {posted === "1" && <SponsorUpsellBanner />}
      <QuotaCard quota={quota} />
      <MyProperties properties={properties} canPost={quota.canPost} />
      {quota.canBuyPackages && <PackageShop />}
    </div>
  );
}
