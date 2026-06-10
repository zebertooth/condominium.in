import { AdminPropertyTable } from "@/components/admin/AdminPropertyTable";
import { prisma } from "@/lib/db";
import { t } from "@/lib/i18n";
import { getLocale } from "@/lib/locale";
import { dbPropertyToListing } from "@/lib/user-properties";

interface PageProps {
  searchParams: Promise<{ status?: string }>;
}

export default async function AdminPropertiesPage({ searchParams }: PageProps) {
  const [{ status }, locale] = await Promise.all([searchParams, getLocale()]);
  const filterStatus = status && ["pending", "published", "rejected"].includes(status) ? status : undefined;

  const rows = await prisma.userProperty.findMany({
    where: filterStatus ? { status: filterStatus } : { status: { not: "deleted" } },
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
    { label: t("adminFilterAll", locale), value: undefined },
    { label: t("statusPending", locale), value: "pending" },
    { label: t("statusPublished", locale), value: "published" },
    { label: t("statusRejected", locale), value: "rejected" },
  ] as const;

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900">{t("adminPropertiesTitle", locale)}</h1>
      <div className="mt-4 flex gap-2 text-sm">
        {tabs.map((tab) => (
          <a
            key={tab.label}
            href={tab.value ? `/admin/properties?status=${tab.value}` : "/admin/properties"}
            className={`rounded-full px-3 py-1 ${
              filterStatus === tab.value || (!filterStatus && !tab.value)
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
