"use client";

import Link from "next/link";
import { useState } from "react";
import { useT } from "@/components/i18n/LocaleProvider";
import { leadStatusLabelFor } from "@/lib/lead-constants";
import { type Locale } from "@/lib/i18n";
import { dateLocale } from "@/lib/locale-content";
import { localePath } from "@/lib/locale-routing";

export interface OwnerInquiryRow {
  id: string;
  name: string;
  phone: string | null;
  email: string | null;
  message: string;
  propertySlug: string | null;
  propertyTitle: string | null;
  viewingDate: string | null;
  viewingTime: string | null;
  status: string;
  createdAt: string;
}

interface InquiriesListProps {
  inquiries: OwnerInquiryRow[];
  locale: Locale;
}

export function InquiriesList({ inquiries: initial, locale }: InquiriesListProps) {
  const t = useT();
  const [inquiries, setInquiries] = useState(initial);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const dateLoc = dateLocale(locale);

  async function markContacted(id: string) {
    setUpdatingId(id);
    try {
      const res = await fetch(`/api/user/inquiries/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "contacted" }),
      });
      if (!res.ok) return;
      const data = (await res.json()) as { inquiry?: { id: string; status: string } };
      if (data.inquiry) {
        setInquiries((prev) =>
          prev.map((row) => (row.id === id ? { ...row, status: data.inquiry!.status } : row)),
        );
      }
    } finally {
      setUpdatingId(null);
    }
  }

  return (
    <div className="space-y-4">
      {inquiries.map((lead) => {
        const isNew = lead.status === "new";
        const contact = [lead.phone, lead.email].filter(Boolean).join(" · ") || "—";
        const dateStr = new Date(lead.createdAt).toLocaleString(dateLoc, {
          day: "numeric",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        });

        return (
          <article
            key={lead.id}
            className={`rounded-2xl border bg-white p-5 shadow-sm ${
              isNew ? "border-teal-300 ring-1 ring-teal-100" : "border-slate-200"
            }`}
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-semibold text-slate-900">{lead.name}</p>
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                      isNew
                        ? "bg-teal-100 text-teal-800"
                        : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {leadStatusLabelFor(lead.status, locale)}
                  </span>
                </div>
                <p className="mt-1 text-xs text-slate-500">
                  {t("inquiryDate")}: {dateStr}
                </p>
              </div>
              {lead.propertySlug && (
                <Link
                  href={localePath(`/property/${lead.propertySlug}`, locale)}
                  className="text-sm font-medium text-teal-700 hover:underline"
                >
                  {lead.propertyTitle ?? lead.propertySlug}
                </Link>
              )}
            </div>

            <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">
                  {t("inquiryContact")}
                </dt>
                <dd className="mt-1 text-slate-800">{contact}</dd>
              </div>
              {lead.viewingDate && (
                <div>
                  <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">
                    {t("inquiryViewing")}
                  </dt>
                  <dd className="mt-1 text-slate-800">
                    {lead.viewingDate}
                    {lead.viewingTime ? ` · ${lead.viewingTime}` : ""}
                  </dd>
                </div>
              )}
            </dl>

            <div className="mt-4 rounded-xl bg-slate-50 px-4 py-3">
              <p className="text-xs font-medium text-slate-500">{t("inquiryMessage")}</p>
              <p className="mt-1 whitespace-pre-wrap text-sm text-slate-800">{lead.message}</p>
            </div>

            {isNew && (
              <button
                type="button"
                disabled={updatingId === lead.id}
                onClick={() => markContacted(lead.id)}
                className="mt-4 rounded-xl bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-700 disabled:opacity-60"
              >
                {updatingId === lead.id ? t("inquiryMarkingContacted") : t("inquiryMarkContacted")}
              </button>
            )}
          </article>
        );
      })}
    </div>
  );
}
