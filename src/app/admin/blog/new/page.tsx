import { AdminBlogForm } from "@/components/admin/AdminBlogForm";
import { t } from "@/lib/i18n";
import { getLocale } from "@/lib/locale";
import { createMetadata } from "@/lib/seo";

export async function generateMetadata() {
  return createMetadata({
    title: "New Blog Article",
    description: "Create a new blog article",
    path: "/admin/blog/new",
  });
}

export default async function AdminBlogNewPage() {
  const locale = await getLocale();

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900">{t("adminBlogAdd", locale)}</h1>
      <div className="mt-8 max-w-3xl">
        <AdminBlogForm />
      </div>
    </div>
  );
}
