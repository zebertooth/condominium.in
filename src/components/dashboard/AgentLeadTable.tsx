"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { LocalizedLink } from "@/components/i18n/LocalizedLink";
import { useLocale, useT } from "@/components/i18n/LocaleProvider";
import {
  getLeadStatuses,
  leadContactModeLabelFor,
  leadSourceLabelFor,
  leadStatusLabelFor,
} from "@/lib/lead-constants";

export interface LeadView {
  id: string;
  name: string;
  phone: string | null;
  email: string | null;
  message: string;
  source: string;
  contactMode: string;
  propertySlug: string | null;
  propertyTitle: string | null;
  btsStation: string | null;
  status: string;
  assignedToId: string | null;
  agentNote: string | null;
  viewingDate: string | null;
  viewingTime: string | null;
  createdAt: string;
}

const statusStyle: Record<string, string> = {
  new: "bg-blue-100 text-blue-800",
  contacted: "bg-amber-100 text-amber-800",
  viewing: "bg-violet-100 text-violet-800",
  closed: "bg-green-100 text-green-800",
  lost: "bg-slate-200 text-slate-600",
};

export function AgentLeadTable({ leads }: { leads: LeadView[] }) {
  const router = useRouter();
  const locale = useLocale();
  const t = useT();
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const leadStatuses = getLeadStatuses(locale);

  async function patchLead(id: string, payload: Record<string, unknown>) {
    setLoading(id);
    setError(null);
    try {
      const res = await fetch(`/api/admin/leads/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error ?? t("agentLeadSaveError"));
      }
    } catch {
      setError(t("agentLeadNetworkError"));
    } finally {
      setLoading(null);
      router.refresh();
    }
  }

  if (leads.length === 0) {
    return <p className="text-slate-600 text-center py-8">{t("agentLeadsEmpty")}</p>;
  }

  return (
    <div className="space-y-4">
      {error && (
        <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
          ⚠️ {error}
        </div>
      )}

      {leads.map((lead) => (
        <div key={lead.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-slate-900">{lead.name}</h3>
                <span
                  className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                    statusStyle[lead.status] ?? "bg-slate-100 text-slate-700"
                  }`}
                >
                  {leadStatusLabelFor(lead.status, locale)}
                </span>
              </div>
              <p className="mt-1 text-sm text-slate-500">
                {leadSourceLabelFor(lead.source, locale)}
                {" · "}
                {leadContactModeLabelFor(lead.contactMode, locale)}
                {" · "}
                {lead.createdAt}
              </p>
            </div>
            <div className="text-right text-sm">
              {lead.phone && <p className="text-slate-700 font-medium">{lead.phone}</p>}
              {lead.email && <p className="text-slate-500">{lead.email}</p>}
            </div>
          </div>

          {lead.propertyTitle && (
            <p className="mt-2 text-sm text-slate-600">
              {t("agentLeadInterested")}:{" "}
              {lead.propertySlug ? (
                <LocalizedLink
                  href={`/property/${lead.propertySlug}`}
                  className="text-teal-700 hover:underline font-medium"
                >
                  {lead.propertyTitle}
                </LocalizedLink>
              ) : (
                lead.propertyTitle
              )}
            </p>
          )}

          {lead.viewingDate && (
            <div className="mt-3 flex items-center gap-2 rounded-xl bg-violet-50 px-4 py-3 text-sm text-violet-800 border border-violet-100 font-medium">
              <span>📅</span>
              <span>
                {t("agentLeadViewingOn")}: <span className="underline">{lead.viewingDate}</span>
                {lead.viewingTime && (
                  <>
                    {" "}
                    {t("agentLeadViewingTime")}:{" "}
                    <span className="underline">
                      {lead.viewingTime}
                      {t("agentLeadTimeSuffix") ? ` ${t("agentLeadTimeSuffix")}` : ""}
                    </span>
                  </>
                )}
              </span>
            </div>
          )}

          <p className="mt-3 whitespace-pre-line rounded-xl bg-slate-50 p-3 text-sm text-slate-700 border border-slate-100">
            {lead.message}
          </p>

          <div className="mt-4">
            <span className="text-xs font-medium text-slate-500 block mb-1.5">
              {t("agentLeadChangeStatus")}
            </span>
            <div className="flex flex-wrap items-center gap-2">
              {leadStatuses.map((s) => (
                <button
                  key={s.value}
                  type="button"
                  disabled={loading === lead.id || lead.status === s.value}
                  onClick={() => patchLead(lead.id, { status: s.value })}
                  className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                    lead.status === s.value
                      ? "cursor-default bg-teal-600 text-white"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  } disabled:opacity-60`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-4">
            <label className="text-sm block">
              <span className="text-slate-600 font-medium">{t("agentLeadNoteLabel")}</span>
              <input
                type="text"
                defaultValue={lead.agentNote ?? ""}
                disabled={loading === lead.id}
                placeholder={t("agentLeadNotePlaceholder")}
                onBlur={(e) => {
                  if (e.target.value !== (lead.agentNote ?? "")) {
                    patchLead(lead.id, { agentNote: e.target.value });
                  }
                }}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 outline-none ring-teal-500 focus:ring-2"
              />
            </label>
          </div>
        </div>
      ))}
    </div>
  );
}
