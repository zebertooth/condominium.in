"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  LEAD_CONTACT_MODE_LABEL,
  LEAD_SOURCE_LABEL,
  LEAD_STATUSES,
  leadStatusLabel,
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
  assignedToName: string | null;
  agentNote: string | null;
  createdAt: string;
}

export interface AgentOption {
  id: string;
  name: string;
}

const statusStyle: Record<string, string> = {
  new: "bg-blue-100 text-blue-800",
  contacted: "bg-amber-100 text-amber-800",
  viewing: "bg-violet-100 text-violet-800",
  closed: "bg-green-100 text-green-800",
  lost: "bg-slate-200 text-slate-600",
};

export function AdminLeadTable({
  leads,
  agents,
}: {
  leads: LeadView[];
  agents: AgentOption[];
}) {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);

  async function patchLead(id: string, payload: Record<string, unknown>) {
    setLoading(id);
    await fetch(`/api/admin/leads/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    setLoading(null);
    router.refresh();
  }

  if (leads.length === 0) {
    return <p className="text-slate-600">ยังไม่มีลีด</p>;
  }

  return (
    <div className="space-y-4">
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
                  {leadStatusLabel[lead.status] ?? lead.status}
                </span>
              </div>
              <p className="mt-1 text-sm text-slate-500">
                {LEAD_SOURCE_LABEL[lead.source] ?? lead.source}
                {" · "}
                {LEAD_CONTACT_MODE_LABEL[lead.contactMode] ?? lead.contactMode}
                {" · "}
                {lead.createdAt}
              </p>
            </div>
            <div className="text-right text-sm">
              {lead.phone && <p className="text-slate-700">{lead.phone}</p>}
              {lead.email && <p className="text-slate-500">{lead.email}</p>}
            </div>
          </div>

          {lead.propertyTitle && (
            <p className="mt-2 text-sm text-slate-600">
              สนใจ:{" "}
              {lead.propertySlug ? (
                <Link href={`/property/${lead.propertySlug}`} className="text-teal-700 hover:underline">
                  {lead.propertyTitle}
                </Link>
              ) : (
                lead.propertyTitle
              )}
            </p>
          )}

          <p className="mt-3 whitespace-pre-line rounded-xl bg-slate-50 p-3 text-sm text-slate-700">
            {lead.message}
          </p>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            {LEAD_STATUSES.map((s) => (
              <button
                key={s.value}
                type="button"
                disabled={loading === lead.id || lead.status === s.value}
                onClick={() => patchLead(lead.id, { status: s.value })}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                  lead.status === s.value
                    ? "cursor-default bg-slate-900 text-white"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                } disabled:opacity-60`}
              >
                {s.label}
              </button>
            ))}
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <label className="text-sm">
              <span className="text-slate-600">มอบหมายเอเจนต์</span>
              <select
                value={lead.assignedToId ?? ""}
                disabled={loading === lead.id}
                onChange={(e) => patchLead(lead.id, { assignedToId: e.target.value })}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 outline-none ring-teal-500 focus:ring-2"
              >
                <option value="">— ยังไม่มอบหมาย —</option>
                {agents.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.name}
                  </option>
                ))}
              </select>
            </label>

            <label className="text-sm">
              <span className="text-slate-600">บันทึกของเอเจนต์</span>
              <input
                type="text"
                defaultValue={lead.agentNote ?? ""}
                disabled={loading === lead.id}
                placeholder="เช่น โทรแล้ว นัดชมศุกร์นี้"
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
