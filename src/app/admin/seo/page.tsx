import { AdminSeoForm } from "@/components/admin/AdminSeoForm";
import { t } from "@/lib/i18n";
import { getLocale } from "@/lib/locale";
import { createMetadata } from "@/lib/seo";

export async function generateMetadata() {
  return createMetadata({
    title: "SEO Settings",
    description: "Manage site title, description, and keywords for Condominium.in.th",
    path: "/admin/seo",
  });
}

export default async function AdminSeoPage() {
  const locale = await getLocale();

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900">{t("adminSeo", locale)}</h1>
      <p className="mt-1 text-slate-600">{t("adminSeoDesc", locale)}</p>
      <div className="mt-8">
        <AdminSeoForm />
      </div>
    </div>
  );
}
