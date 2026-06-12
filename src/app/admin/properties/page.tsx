import { AdminPropertyTable } from "@/components/admin/AdminPropertyTable";
import { prisma } from "@/lib/db";
import { t } from "@/lib/i18n";
import { getLocale } from "@/lib/locale";
import { dbPropertyToListing } from "@/lib/user-properties";

interface PageProps {
  searchParams: Promise<{ status?: string; review?: string }>;
}

export default async function AdminPropertiesPage({ searchParams }: PageProps) {
  const [{ status, review }, locale] = await Promise.all([searchParams, getLocale()]);
  const reviewOnly = review === "1";
  const filterStatus =
    !reviewOnly && status && ["pending", "published", "rejected"].includes(status)
      ? status
      : undefined;

  const rows = await prisma.userProperty.findMany({
    where: reviewOnly
      ? { needsReview: true, status: { not: "deleted" } }
      : filterStatus
        ? { status: filterStatus }
        : { status: { not: "deleted" } },
    orderBy: { createdAt: "desc" },
    include: {
      user: { select: { id: true, fullName: true, phone: true, email: true, role: true } },
    },
  });

  const properties = rows.map((p) => ({
    ...dbPropertyToListing(p),
    ownerName: p.user.fullName,
    ownerPhone: p.user.phone,
    ownerEmail: p.user.email,
  }));

  const tabs = [
    { label: t("adminFilterAll", locale), href: "/admin/properties" },
    { label: t("adminFilterReview", locale), href: "/admin/properties?review=1" },
    { label: t("statusPublished", locale), href: "/admin/properties?status=published" },
    { label: t("statusRejected", locale), href: "/admin/properties?status=rejected" },
  ] as const;

  function tabActive(href: string) {
    if (reviewOnly) return href.includes("review=1");
    if (filterStatus) return href.includes(`status=${filterStatus}`);
    return href === "/admin/properties";
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900">{t("adminPropertiesTitle", locale)}</h1>
      <p className="mt-1 text-sm text-slate-600">{t("adminPropertiesReviewDesc", locale)}</p>
      <div className="mt-4 flex flex-wrap gap-2 text-sm">
        {tabs.map((tab) => (
          <a
            key={tab.href}
            href={tab.href}
            className={`rounded-full px-3 py-1 ${
              tabActive(tab.href)
                ? "bg-slate-900 text-white"
                : "bg-white text-slate-700 border border-slate-200"
            }`}
          >
            {tab.label}
          </a>
        ))}
      </div>
      <div className="mt-6">
        <AdminPropertyTable properties={properties} />
      </div>
    </div>
  );
}
