import { AdminBlogForm } from "@/components/admin/AdminBlogForm";
import { t } from "@/lib/i18n";
import { getLocale } from "@/lib/locale";
import { createMetadata } from "@/lib/seo";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata() {
  return createMetadata({
    title: "Edit Blog Article",
    description: "Edit blog article",
    path: "/admin/blog/edit",
  });
}

export default async function AdminBlogEditPage({ params }: PageProps) {
  const { id } = await params;
  const locale = await getLocale();

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900">{t("adminBlogEdit", locale)}</h1>
      <div className="mt-8 max-w-3xl">
        <AdminBlogForm articleId={id} />
      </div>
    </div>
  );
}
