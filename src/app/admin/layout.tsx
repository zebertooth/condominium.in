import { redirect } from "next/navigation";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { getCurrentUser } from "@/lib/auth";
import { getLocale } from "@/lib/locale";
import { t } from "@/lib/i18n";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  if (user.role !== "admin") redirect("/dashboard");

  const locale = await getLocale();

  const navItems = [
    { href: "/admin", label: t("adminOverview", locale) },
    { href: "/admin/properties", label: t("adminProperties", locale) },
    { href: "/admin/sponsored", label: t("adminSponsored", locale) },
    { href: "/admin/users", label: t("adminUsers", locale) },
    { href: "/admin/leads", label: t("adminLeads", locale) },
    { href: "/admin/payments", label: t("adminPayments", locale) },
    { href: "/admin/analytics", label: t("adminAnalytics", locale) },
    { href: "/admin/seo", label: t("adminSeo", locale) },
    { href: "/admin/ops", label: t("adminOps", locale) },
    { href: "/admin/agents", label: t("adminTeam", locale) },
    { href: "/admin/blog", label: t("adminBlog", locale) },
    { href: "/admin/newsletter", label: t("adminNewsletter", locale) },
    { href: "/admin/import", label: t("adminImport", locale) },
    { href: "/admin/projects", label: t("adminProjects", locale) },
    { href: "/admin/reviews", label: t("adminReviews", locale) },
  ];

  return (
    <div className="min-h-screen bg-slate-100">
      <AdminHeader items={navItems} backLabel={t("backToWebsite", locale)} />
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8">{children}</main>
    </div>
  );
}
