import Link from "next/link";
import { agentCategoryLabel } from "@/lib/agent-application";
import { t, type Locale } from "@/lib/i18n";

export interface AgentApplicationRow {
  id: string;
  name: string;
  phone: string | null;
  email: string | null;
  message: string;
  agentType: string | null;
  createdAt: string;
}

export function AdminAgentApplications({
  applications,
  locale,
}: {
  applications: AgentApplicationRow[];
  locale: Locale;
}) {
  if (applications.length === 0) {
    return <p className="text-sm text-slate-500">{t("adminAgentsApplicationsEmpty", locale)}</p>;
  }

  return (
    <div className="space-y-3">
      {applications.map((app) => (
        <div key={app.id} className="rounded-xl border border-slate-200 bg-white p-4">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <p className="font-semibold text-slate-900">{app.name}</p>
              <p className="mt-1 text-sm text-slate-500">
                {app.agentType ? agentCategoryLabel(app.agentType, locale) : "—"}
                {" · "}
                {app.createdAt}
              </p>
            </div>
            <div className="text-right text-sm text-slate-600">
              {app.phone && <p>{app.phone}</p>}
              {app.email && <p>{app.email}</p>}
            </div>
          </div>
          <p className="mt-3 whitespace-pre-line rounded-lg bg-slate-50 p-3 text-sm text-slate-700">
            {app.message}
          </p>
        </div>
      ))}
      <Link href="/admin/leads" className="inline-block text-sm font-medium text-teal-700 hover:underline">
        {t("adminViewAllLeads", locale)}
      </Link>
    </div>
  );
}
