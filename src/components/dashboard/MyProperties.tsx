"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useLocale, useT, useTf } from "@/components/i18n/LocaleProvider";
import { formatPrice } from "@/lib/i18n";
import { dateLocale } from "@/lib/locale-content";
import type { Property } from "@/types/property";

function formatSponsorDate(iso: string, locale: "th" | "en" | "zh" | "ja" | "ar") {
  return new Date(iso).toLocaleDateString(dateLocale(locale), {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function MyProperties({
  properties,
  canPost,
  userRole = "user",
  paidFeaturesEnabled = false,
  onSponsorClick,
}: {
  properties: Property[];
  canPost: boolean;
  userRole?: string;
  /** From server — PROMPTPAY_ID is not available in the client bundle. */
  paidFeaturesEnabled?: boolean;
  onSponsorClick?: (property: Property) => void;
}) {
  const router = useRouter();
  const t = useT();
  const tf = useTf();
  const locale = useLocale();
  const [loading, setLoading] = useState<string | null>(null);
  const isOwnerUser = userRole === "user";
  const totalInquiries = properties.reduce((sum, p) => sum + (p.inquiriesCount ?? 0), 0);

  async function deleteProperty(id: string) {
    if (!confirm(t("deleteConfirm"))) return;
    setLoading(id);
    const res = await fetch(`/api/user/properties/${id}`, { method: "DELETE" });
    setLoading(null);
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      alert((data as { error?: string }).error ?? t("genericError"));
      return;
    }
    router.refresh();
  }

  async function toggleAgentManaged(id: string, next: boolean) {
    setLoading(`agent-${id}`);
    const res = await fetch(`/api/user/properties/${id}/agent-managed`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ agentManaged: next }),
    });
    const data = await res.json();
    setLoading(null);
    if (!res.ok) {
      alert((data as { error?: string }).error ?? t("genericError"));
      return;
    }
    router.refresh();
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6">
      <div className="flex items-center justify-between">
        <h2 className="font-bold text-slate-900">
          {tf("myListings", { count: properties.length })}
        </h2>
        {canPost ? (
          <Link
            href="/dashboard/post"
            className="rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-700"
          >
            {t("newListing")}
          </Link>
        ) : (
          <span className="text-sm text-amber-700">{t("verifyToPost")}</span>
        )}
      </div>

      {isOwnerUser && totalInquiries > 0 && (
        <div className="mt-4 flex justify-end">
          <Link
            href="/dashboard/inquiries"
            className="text-sm font-medium text-teal-700 hover:underline"
          >
            {t("viewInquiriesBtn")} ({totalInquiries})
          </Link>
        </div>
      )}

      {properties.length > 0 && (
        <p className="mt-3 text-xs text-slate-500">{t("statsLegend")}</p>
      )}

      {properties.length === 0 ? (
        <p className="mt-6 text-slate-600">{t("noListingsYet")}</p>
      ) : (
        <ul className="mt-6 space-y-4">
          {properties.map((p) => {
            const canSponsor =
              paidFeaturesEnabled && p.status === "published" && !p.featured;
            const statsPending = p.status !== "published";

            return (
              <li
                key={p.id}
                className="flex flex-col gap-3 rounded-xl border border-slate-100 p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0 flex-1">
                  <Link
                    href={`/property/${p.slug}`}
                    className="font-semibold text-slate-900 hover:text-teal-700"
                  >
                    {p.title}
                  </Link>
                  <p className="text-sm text-teal-700">
                    {formatPrice(p.price, p.priceUnit, locale)}
                  </p>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {p.status === "pending" && (
                      <span className="rounded bg-amber-100 px-2 py-0.5 text-xs text-amber-800">
                        {t("statusPending")}
                      </span>
                    )}
                    {p.status === "published" && p.needsReview && (
                      <span className="rounded bg-sky-100 px-2 py-0.5 text-xs text-sky-800">
                        {t("statusLiveReview")}
                      </span>
                    )}
                    {p.status === "rejected" && (
                      <span className="rounded bg-red-100 px-2 py-0.5 text-xs text-red-800">
                        {t("statusRejected")}
                      </span>
                    )}
                    {p.featured && (
                      <span className="rounded bg-violet-100 px-2 py-0.5 text-xs text-violet-800">
                        {t("statusFeatured")}
                        {p.sponsoredUntil
                          ? ` · ${tf("sponsoredUntilLabel", {
                              date: formatSponsorDate(p.sponsoredUntil, locale),
                            })}`
                          : ""}
                      </span>
                    )}
                    {isOwnerUser && p.agentManaged && (
                      <span className="rounded bg-teal-100 px-2 py-0.5 text-xs text-teal-800">
                        {t("agentManagedBadge")}
                      </span>
                    )}
                    {p.status === "published" && !p.highlights?.trim() && (
                      <Link
                        href={`/dashboard/edit/${p.id}`}
                        className="rounded bg-violet-100 px-2 py-0.5 text-xs text-violet-800 hover:bg-violet-200"
                      >
                        {t("highlightsNudgeEdit")}
                      </Link>
                    )}
                  </div>

                  {p.status === "published" && !p.highlights?.trim() && (
                    <p className="mt-2 text-xs text-violet-700">{t("highlightsNudge")}</p>
                  )}

                  {statsPending ? (
                    <p className="mt-2 text-xs text-slate-400">{t("statsPendingNote")}</p>
                  ) : (
                    <>
                      <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
                        <span className="flex items-center gap-1">
                          <svg
                            className="h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                            />
                          </svg>
                          {p.viewsCount ?? 0} {t("viewsLabel")}
                        </span>
                        <span className="flex items-center gap-1">
                          <svg
                            className="h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                            />
                          </svg>
                          {p.inquiriesCount ?? 0} {t("inquiriesLabel")}
                        </span>
                        <span className="flex items-center gap-1">
                          <svg
                            className="h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                            />
                          </svg>
                          {p.contactClicksCount ?? 0} {t("contactClicksLabel")}
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-slate-400">
                        {tf("statsLast30Days", {
                          views: p.viewsCount30d ?? 0,
                          inquiries: p.inquiriesCount30d ?? 0,
                          clicks: p.contactClicksCount30d ?? 0,
                        })}
                      </p>
                    </>
                  )}
                </div>
                <div className="flex shrink-0 flex-wrap gap-2">
                  {!p.agentManaged && isOwnerUser && (p.inquiriesCount ?? 0) > 0 && (
                    <Link
                      href="/dashboard/inquiries"
                      className="rounded-lg border border-teal-200 bg-teal-50 px-3 py-1.5 text-sm text-teal-800 hover:bg-teal-100"
                    >
                      {t("viewInquiriesBtn")}
                    </Link>
                  )}
                  {isOwnerUser && p.status === "published" && (
                    <button
                      type="button"
                      onClick={() => toggleAgentManaged(p.id, !p.agentManaged)}
                      disabled={loading === `agent-${p.id}`}
                      className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50"
                    >
                      {p.agentManaged ? t("agentManagedOff") : t("agentManagedOn")}
                    </button>
                  )}
                  <Link
                    href={`/dashboard/edit/${p.id}`}
                    className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50"
                  >
                    {t("editBtn")}
                  </Link>
                  {canSponsor && onSponsorClick && (
                    <button
                      type="button"
                      onClick={() => onSponsorClick(p)}
                      className="rounded-lg border border-amber-300 px-3 py-1.5 text-sm text-amber-800 hover:bg-amber-50"
                    >
                      {t("sponsorBtn")}
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => deleteProperty(p.id)}
                    disabled={loading === p.id}
                    className="rounded-lg border border-red-200 px-3 py-1.5 text-sm text-red-700 hover:bg-red-50"
                  >
                    {t("deleteBtn")}
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
