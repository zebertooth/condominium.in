import { AdminTeamAgentsPanel } from "@/components/admin/AdminTeamAgentsPanel";
import { t } from "@/lib/i18n";
import { getLocale } from "@/lib/locale";
import { createMetadata } from "@/lib/seo";

export async function generateMetadata() {
  return createMetadata({
    title: "Team Agents",
    description: "Manage public agent team profiles",
    path: "/admin/agents",
  });
}

export default async function AdminAgentsPage() {
  const locale = await getLocale();

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900">{t("adminTeamTitle", locale)}</h1>
      <div className="mt-8">
        <AdminTeamAgentsPanel />
      </div>
    </div>
  );
}
