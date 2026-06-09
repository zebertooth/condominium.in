import { redirect } from "next/navigation";
import { MyProperties } from "@/components/dashboard/MyProperties";
import { PackageShop } from "@/components/dashboard/PackageShop";
import { QuotaCard } from "@/components/dashboard/QuotaCard";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { getUserQuota } from "@/lib/quota";
import { dbPropertyToListing } from "@/lib/user-properties";

export default async function DashboardPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const quota = await getUserQuota(user.id);
  const rows = await prisma.userProperty.findMany({
    where: { userId: user.id, status: { not: "deleted" } },
    orderBy: { createdAt: "desc" },
  });
  
  // Fetch stats for all properties
  const propertySlugs = rows.map((r) => r.slug);
  const [views, inquiries] = await Promise.all([
    prisma.propertyViewEvent.groupBy({
      by: ["propertySlug"],
      where: { propertySlug: { in: propertySlugs } },
      _count: true,
    }),
    prisma.matchingEvent.groupBy({
      by: ["propertySlug"],
      where: {
        propertySlug: { in: propertySlugs },
        eventType: "owner_inquiry",
      },
      _count: true,
    }),
  ]);

  const viewCountMap = Object.fromEntries(views.map((v) => [v.propertySlug, v._count]));
  const inquiryCountMap = Object.fromEntries(inquiries.map((i) => [i.propertySlug, i._count]));

  const properties = rows.map((row) => {
    const p = dbPropertyToListing(row);
    p.viewsCount = viewCountMap[p.slug] || 0;
    p.inquiriesCount = inquiryCountMap[p.slug] || 0;
    return p;
  });

  return (
    <div className="space-y-8">
      <QuotaCard quota={quota} />
      <MyProperties properties={properties} canPost={quota.canPost} />
      {quota.canBuyPackages && <PackageShop />}
    </div>
  );
}
