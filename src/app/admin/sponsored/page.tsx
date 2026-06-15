import { AdminSponsoredPanel } from "@/components/admin/AdminSponsoredPanel";
import { getOwnerPropertyStats } from "@/lib/analytics";
import { prisma } from "@/lib/db";
import { t } from "@/lib/i18n";
import { getLocale } from "@/lib/locale";
import { dbPropertyToListing } from "@/lib/user-properties";

export default async function AdminSponsoredPage() {
  const locale = await getLocale();

  const rows = await prisma.userProperty.findMany({
    where: { status: "published" },
    orderBy: [{ isSponsored: "desc" }, { createdAt: "desc" }],
    include: {
      user: { select: { id: true, fullName: true, phone: true, email: true, role: true } },
    },
  });

  const slugs = rows.map((p) => p.slug);
  const stats = slugs.length > 0 ? await getOwnerPropertyStats(slugs) : {};

  const properties = rows.map((p) => ({
    ...dbPropertyToListing(p),
    ownerName: p.user.fullName,
    viewsCount: stats[p.slug]?.viewsCount ?? 0,
    isSponsoredRaw: p.isSponsored,
    sponsoredUntilRaw: p.sponsoredUntil?.toISOString() ?? null,
  }));

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900">{t("adminSponsoredTitle", locale)}</h1>
      <p className="mt-1 text-sm text-slate-600">{t("adminSponsoredDesc", locale)}</p>
      <div className="mt-6">
        <AdminSponsoredPanel
          properties={properties}
          locale={locale}
          today={new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Bangkok" })}
        />
      </div>
    </div>
  );
}
