import { redirect } from "next/navigation";
import { AgentLeadTable, type LeadView } from "@/components/dashboard/AgentLeadTable";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { t, tf } from "@/lib/i18n";
import { leadStatusLabelFor } from "@/lib/lead-constants";
import { dateLocale } from "@/lib/locale-content";
import { getLocale } from "@/lib/locale";

export const dynamic = "force-dynamic";

export default async function AgentDashboardPage() {
  const user = await getCurrentUser();
  if (!user || (user.role !== "agent" && user.role !== "admin")) {
    redirect("/dashboard");
  }

  const locale = await getLocale();
  const dateLoc = dateLocale(locale);

  const isAgent = user.role === "agent";
  const leadsQuery = isAgent ? { assignedToId: user.id } : {};

  const leads = await prisma.lead.findMany({
    where: leadsQuery,
    orderBy: { createdAt: "desc" },
    include: { assignedTo: { select: { fullName: true } } },
  });

  const totalLeads = leads.length;
  const newLeadsCount = leads.filter((l) => l.status === "new").length;
  const contactedLeadsCount = leads.filter((l) => l.status === "contacted").length;
  const viewingLeadsCount = leads.filter((l) => l.status === "viewing").length;
  const closedLeadsCount = leads.filter((l) => l.status === "closed").length;

  const scheduledViewings = leads
    .filter((l) => l.viewingDate !== null)
    .sort((a, b) => {
      const dateA = a.viewingDate || "";
      const dateB = b.viewingDate || "";
      return dateA.localeCompare(dateB);
    });

  const leadViews: LeadView[] = leads.map((lead) => ({
    id: lead.id,
    name: lead.name,
    phone: lead.phone,
    email: lead.email,
    message: lead.message,
    source: lead.source,
    contactMode: lead.contactMode,
    propertySlug: lead.propertySlug,
    propertyTitle: lead.propertyTitle,
    btsStation: lead.btsStation,
    status: lead.status,
    assignedToId: lead.assignedToId,
    agentNote: lead.agentNote,
    viewingDate: lead.viewingDate,
    viewingTime: lead.viewingTime,
    createdAt: lead.createdAt.toLocaleDateString(dateLoc, {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }),
  }));

  return (
    <div className="space-y-8">
      <div className="grid gap-4 grid-cols-2 md:grid-cols-5">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 text-center shadow-sm">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            {t("agentDashTotalLeads", locale)}
          </p>
          <p className="mt-2 text-2xl font-bold text-slate-900">{totalLeads}</p>
        </div>
        <div className="rounded-2xl border border-blue-100 bg-blue-50/50 p-5 text-center shadow-sm">
          <p className="text-xs font-semibold text-blue-600 uppercase tracking-wider">
            {t("leadStatusNew", locale)}
          </p>
          <p className="mt-2 text-2xl font-bold text-blue-900">{newLeadsCount}</p>
        </div>
        <div className="rounded-2xl border border-amber-100 bg-amber-50/50 p-5 text-center shadow-sm">
          <p className="text-xs font-semibold text-amber-600 uppercase tracking-wider">
            {t("leadStatusContacted", locale)}
          </p>
          <p className="mt-2 text-2xl font-bold text-amber-900">{contactedLeadsCount}</p>
        </div>
        <div className="rounded-2xl border border-violet-100 bg-violet-50/50 p-5 text-center shadow-sm">
          <p className="text-xs font-semibold text-violet-600 uppercase tracking-wider">
            {t("leadStatusViewing", locale)}
          </p>
          <p className="mt-2 text-2xl font-bold text-violet-900">{viewingLeadsCount}</p>
        </div>
        <div className="rounded-2xl border border-green-100 bg-green-50/50 p-5 text-center shadow-sm">
          <p className="text-xs font-semibold text-green-600 uppercase tracking-wider">
            {t("leadStatusClosed", locale)}
          </p>
          <p className="mt-2 text-2xl font-bold text-green-900">{closedLeadsCount}</p>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900">
              {isAgent
                ? t("agentDashMyLeadsTitle", locale)
                : t("agentDashAllLeadsAdminTitle", locale)}
            </h2>
            <span className="text-sm text-slate-500">
              {tf("agentDashShowingCount", locale, { count: leadViews.length })}
            </span>
          </div>
          <AgentLeadTable leads={leadViews} />
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-bold text-slate-900">
            📅 {t("agentDashViewingScheduleTitle", locale)}
          </h2>
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
            {scheduledViewings.length === 0 ? (
              <p className="text-sm text-slate-600 text-center py-4">
                {t("agentDashNoViewings", locale)}
              </p>
            ) : (
              <div className="space-y-3">
                {scheduledViewings.map((v) => (
                  <div
                    key={v.id}
                    className="relative pl-4 border-l-2 border-violet-500 py-1 space-y-1"
                  >
                    <p className="text-xs font-semibold text-violet-700">
                      {v.viewingDate}
                      {" · "}
                      {v.viewingTime
                        ? `${v.viewingTime}${t("agentLeadTimeSuffix", locale) ? ` ${t("agentLeadTimeSuffix", locale)}` : ""}`
                        : t("agentDashTimeNotSet", locale)}
                    </p>
                    <p className="text-sm font-semibold text-slate-900">{v.name}</p>
                    {v.propertyTitle && (
                      <p className="text-xs text-slate-500 truncate">
                        {t("agentDashPropertyLabel", locale)}: {v.propertyTitle}
                      </p>
                    )}
                    <span className="inline-block rounded-full bg-slate-100 px-1.5 py-0.5 text-[10px] text-slate-600 font-medium">
                      {t("agentDashStatusLabel", locale)}:{" "}
                      {leadStatusLabelFor(v.status, locale)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
