"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { LocalizedLink } from "@/components/i18n/LocalizedLink";
import { useLocale, useT } from "@/components/i18n/LocaleProvider";
import { buildGoogleCalendarViewUrl, buildViewingIcs } from "@/lib/calendar-invite";
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

function downloadViewingIcs(lead: LeadView) {
  if (!lead.viewingDate) return;
  const title = lead.propertyTitle
    ? `นัดชม: ${lead.propertyTitle}`
    : `นัดชมทรัพย์ — ${lead.name}`;
  const ics = buildViewingIcs({
    uid: `viewing-${lead.id}@condominium.in.th`,
    title,
    date: lead.viewingDate,
    time: lead.viewingTime ?? undefined,
    description: `${lead.name}: ${lead.message}`,
    location: lead.propertyTitle ?? undefined,
  });
  const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = "viewing.ics";
  anchor.click();
  URL.revokeObjectURL(url);
}

function googleCalUrl(lead: LeadView): string | null {
  if (!lead.viewingDate) return null;
  const title = lead.propertyTitle
    ? `นัดชม: ${lead.propertyTitle}`
    : `นัดชมทรัพย์ — ${lead.name}`;
  return buildGoogleCalendarViewUrl({
    title,
    date: lead.viewingDate,
    time: lead.viewingTime ?? undefined,
    description: `${lead.name}: ${lead.message}`,
    location: lead.propertyTitle ?? undefined,
  });
}

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

      {leads.map((lead) => {
        const calUrl = googleCalUrl(lead);
        return (
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
            <div className="mt-3 rounded-xl border border-violet-100 bg-violet-50 px-4 py-3 text-sm text-violet-800">
              <div className="flex items-center gap-2 font-medium">
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
              <div className="mt-2 flex flex-wrap gap-2">
                {calUrl && (
                  <a
                    href={calUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-lg border border-violet-200 bg-white px-3 py-1.5 text-xs font-medium text-violet-800 hover:bg-violet-100"
                  >
                    {t("agentLeadAddGoogleCal")}
                  </a>
                )}
                <button
                  type="button"
                  onClick={() => downloadViewingIcs(lead)}
                  className="rounded-lg border border-violet-200 bg-white px-3 py-1.5 text-xs font-medium text-violet-800 hover:bg-violet-100"
                >
                  {t("agentLeadDownloadIcs")}
                </button>
              </div>
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
        );
      })}
    </div>
  );
}
