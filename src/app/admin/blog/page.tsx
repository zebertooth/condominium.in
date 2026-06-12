import { AdminBlogTable } from "@/components/admin/AdminBlogTable";
import { t } from "@/lib/i18n";
import { getLocale } from "@/lib/locale";
import { createMetadata } from "@/lib/seo";

export async function generateMetadata() {
  return createMetadata({
    title: "Blog Articles",
    description: "Manage blog articles and cover images",
    path: "/admin/blog",
  });
}

export default async function AdminBlogPage() {
  const locale = await getLocale();

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900">{t("adminBlogTitle", locale)}</h1>
      <div className="mt-8">
        <AdminBlogTable />
      </div>
    </div>
  );
}
