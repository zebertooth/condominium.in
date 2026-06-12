import { AdminAgentApplications } from "@/components/admin/AdminAgentApplications";
import { AdminTeamAgentsPanel } from "@/components/admin/AdminTeamAgentsPanel";
import { getAdminUser } from "@/lib/admin";
import { prisma } from "@/lib/db";
import { t } from "@/lib/i18n";
import { getLocale } from "@/lib/locale";
import { createMetadata } from "@/lib/seo";

export async function generateMetadata() {
  return createMetadata({
    title: "Team Agents",
    description: "Manage public agent team profiles by category",
    path: "/admin/agents",
  });
}

export default async function AdminAgentsPage() {
  const locale = await getLocale();
  await getAdminUser();

  const applications = await prisma.lead.findMany({
    where: { source: "agent_interest" },
    orderBy: { createdAt: "desc" },
    take: 20,
  });

  const dateLoc = locale === "en" ? "en-US" : "th-TH";
  const applicationRows = applications.map((lead) => ({
    id: lead.id,
    name: lead.name,
    phone: lead.phone,
    email: lead.email,
    message: lead.message,
    agentType: lead.agentType,
    createdAt: lead.createdAt.toLocaleDateString(dateLoc, {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }),
  }));

  return (
    <div className="space-y-12">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">{t("adminTeamTitle", locale)}</h1>
        <p className="mt-1 text-slate-600">{t("adminAgentsPageDesc", locale)}</p>
      </div>

      <section>
        <h2 className="text-lg font-bold text-slate-900">{t("adminAgentsApplicationsTitle", locale)}</h2>
        <p className="mt-1 text-sm text-slate-600">{t("adminAgentsApplicationsDesc", locale)}</p>
        <div className="mt-4">
          <AdminAgentApplications applications={applicationRows} locale={locale} />
        </div>
      </section>

      <section>
        <h2 className="text-lg font-bold text-slate-900">{t("adminAgentsProfilesTitle", locale)}</h2>
        <p className="mt-1 text-sm text-slate-600">{t("adminTeamDesc", locale)}</p>
        <div className="mt-4">
          <AdminTeamAgentsPanel />
        </div>
      </section>
    </div>
  );
}
