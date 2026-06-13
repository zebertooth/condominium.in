"use client";

import { useState } from "react";
import { type Locale } from "@/lib/i18n";

interface Alert {
  id: string;
  name: string;
  listingType: string;
  filters: Record<string, unknown>;
  frequency: string;
  active: boolean;
  lastSentAt: string | null;
  createdAt: string;
}

interface AlertsListProps {
  alerts: Alert[];
  locale: Locale;
}

export function AlertsList({ alerts: initialAlerts, locale }: AlertsListProps) {
  const [alerts, setAlerts] = useState(initialAlerts);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const nonTh = locale !== "th";

  async function handleDelete(alertId: string) {
    if (!confirm(nonTh ? "Delete this alert?" : "ลบการแจ้งเตือนนี้?")) return;

    setDeletingId(alertId);
    try {
      const res = await fetch(`/api/user/alerts?id=${alertId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setAlerts((prev) => prev.filter((a) => a.id !== alertId));
      }
    } catch (err) {
      console.error("Delete failed:", err);
    } finally {
      setDeletingId(null);
    }
  }

  function formatFilters(filters: Record<string, unknown>): string {
    const parts: string[] = [];
    if (filters.btsStation) parts.push(`BTS: ${filters.btsStation}`);
    if (filters.district) parts.push(`${nonTh ? "District" : "เขต"}: ${filters.district}`);
    if (filters.bedrooms) parts.push(`${filters.bedrooms} ${nonTh ? "BR" : "ห้องนอน"}`);
    if (filters.minPrice || filters.maxPrice) {
      const min = (filters.minPrice as number)?.toLocaleString() || "0";
      const max = (filters.maxPrice as number)?.toLocaleString() || "∞";
      parts.push(`฿${min} - ${max}`);
    }
    return parts.length > 0 ? parts.join(" · ") : nonTh ? "All listings" : "ทุกประกาศ";
  }

  return (
    <div className="space-y-4">
      {alerts.map((alert) => (
        <div
          key={alert.id}
          className="rounded-xl border border-slate-200 bg-white p-4"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 className="font-medium text-slate-900">{alert.name}</h3>
                <span
                  className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                    alert.listingType === "rent"
                      ? "bg-teal-100 text-teal-700"
                      : "bg-violet-100 text-violet-700"
                  }`}
                >
                  {alert.listingType === "rent"
                    ? nonTh
                      ? "Rent"
                      : "เช่า"
                    : nonTh
                      ? "Buy"
                      : "ซื้อ"}
                </span>
                <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
                  {alert.frequency === "daily"
                    ? nonTh
                      ? "Daily"
                      : "ทุกวัน"
                    : nonTh
                      ? "Weekly"
                      : "ทุกสัปดาห์"}
                </span>
              </div>
              <p className="mt-1 text-sm text-slate-500">
                {formatFilters(alert.filters)}
              </p>
              <p className="mt-2 text-xs text-slate-400">
                {nonTh ? "Created" : "สร้างเมื่อ"}:{" "}
                {new Date(alert.createdAt).toLocaleDateString(
                  locale === "th" ? "th-TH" : "en-US",
                  { year: "numeric", month: "short", day: "numeric" },
                )}
                {alert.lastSentAt && (
                  <>
                    {" · "}
                    {nonTh ? "Last sent" : "ส่งล่าสุด"}:{" "}
                    {new Date(alert.lastSentAt).toLocaleDateString(
                      locale === "th" ? "th-TH" : "en-US",
                      { year: "numeric", month: "short", day: "numeric" },
                    )}
                  </>
                )}
              </p>
            </div>
            <button
              type="button"
              onClick={() => handleDelete(alert.id)}
              disabled={deletingId === alert.id}
              className="rounded-lg p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-500 disabled:opacity-50"
              title={nonTh ? "Delete" : "ลบ"}
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
