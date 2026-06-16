import { AdminOpsPanel } from "@/components/admin/AdminOpsPanel";
import { getLocale } from "@/lib/locale";
import { t } from "@/lib/i18n";
import { createMetadata } from "@/lib/seo";

export async function generateMetadata() {
  const locale = await getLocale();
  return createMetadata({
    title: t("adminOps", locale),
    description: t("adminOpsIntro", locale),
    path: "/admin/ops",
    locale,
  });
}

export default async function AdminOpsPage() {
  const locale = await getLocale();

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900">{t("adminOps", locale)}</h1>
      <p className="mt-1 text-sm text-slate-600">{t("adminOpsIntro", locale)}</p>
      <div className="mt-6">
        <AdminOpsPanel />
      </div>
    </div>
  );
}
