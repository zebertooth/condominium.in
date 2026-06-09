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
  const properties = rows.map(dbPropertyToListing);

  return (
    <div className="space-y-8">
      <QuotaCard quota={quota} />
      <MyProperties properties={properties} canPost={quota.canPost} />
      {quota.canBuyPackages && <PackageShop />}
    </div>
  );
}
