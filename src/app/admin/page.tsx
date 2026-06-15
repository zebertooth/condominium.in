import Link from "next/link";
import { IntegrationStatus } from "@/components/admin/IntegrationStatus";
import { getAdminStats } from "@/lib/admin";
import { t } from "@/lib/i18n";
import { getLocale } from "@/lib/locale";

export default async function AdminDashboardPage() {
  const [stats, locale] = await Promise.all([getAdminStats(), getLocale()]);

  const cards = [
    { id: "users", label: t("adminStatUsers", locale), value: stats.users, href: "/admin/users" },
    { id: "published", label: t("adminStatPublished", locale), value: stats.properties, href: "/admin/properties?status=published" },
    { id: "sponsored", label: t("adminStatSponsored", locale), value: stats.sponsoredListings, href: "/admin/sponsored" },
    { id: "review", label: t("adminStatReview", locale), value: stats.reviewProperties, href: "/admin/properties?review=1", highlight: stats.reviewProperties > 0 },
    { id: "leads", label: t("adminStatNewLeads", locale), value: stats.newLeads, href: "/admin/leads", highlight: stats.newLeads > 0 },
    { id: "analytics", label: t("adminAnalytics", locale), value: "→", href: "/admin/analytics" },
    { id: "seo", label: t("adminSeo", locale), value: "→", href: "/admin/seo" },
    { id: "team", label: t("adminTeam", locale), value: "→", href: "/admin/agents" },
    { id: "blog", label: t("adminBlog", locale), value: "→", href: "/admin/blog" },
    { id: "payments", label: t("adminStatPendingPayments", locale), value: stats.pendingPayments, href: "/admin/payments", highlight: stats.pendingPayments > 0 },
    { id: "pending-id", label: t("adminStatPendingId", locale), value: stats.pendingVerifications, href: "/admin/users" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900">{t("adminDashTitle", locale)}</h1>
      <p className="mt-1 text-slate-600">{t("adminDashDesc", locale)}</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <Link
            key={card.id}
            href={card.href}
            className={`rounded-2xl border p-6 transition hover:shadow-md ${
              card.highlight ? "border-amber-300 bg-amber-50" : "border-slate-200 bg-white"
            }`}
          >
            <p className="text-sm text-slate-600">{card.label}</p>
            <p className="mt-2 text-3xl font-bold text-slate-900">{card.value}</p>
          </Link>
        ))}
      </div>

      <IntegrationStatus />
    </div>
  );
}
