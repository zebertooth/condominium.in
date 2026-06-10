import { AdminUserTable } from "@/components/admin/AdminUserTable";
import { prisma } from "@/lib/db";
import { t } from "@/lib/i18n";
import { getLocale } from "@/lib/locale";

export default async function AdminUsersPage() {
  const locale = await getLocale();
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      fullName: true,
      phone: true,
      email: true,
      phoneVerified: true,
      emailVerified: true,
      idVerified: true,
      role: true,
      listingLimitOverride: true,
      createdAt: true,
      _count: { select: { properties: true } },
    },
  });

  const serialized = users.map((u) => ({
    ...u,
    createdAt: u.createdAt.toISOString(),
  }));

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900">{t("adminUsersTitle", locale)}</h1>
      <p className="mt-1 text-slate-600">{t("adminUsersDesc", locale)}</p>
      <div className="mt-6">
        <AdminUserTable users={serialized} />
      </div>
    </div>
  );
}
