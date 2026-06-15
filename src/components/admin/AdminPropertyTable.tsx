"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { useT, useTf } from "@/components/i18n/LocaleProvider";
import { formatPrice } from "@/lib/i18n";
import type { Property } from "@/types/property";

type AdminProperty = Property & {
  ownerName: string;
  ownerPhone: string | null;
  ownerEmail: string | null;
};

export function AdminPropertyTable({ properties }: { properties: AdminProperty[] }) {
  const router = useRouter();
  const t = useT();
  const tf = useTf();
  const [loading, setLoading] = useState<string | null>(null);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [bulkLoading, setBulkLoading] = useState(false);

  const statusLabel = useMemo(
    () => ({
      pending: t("statusPending"),
      published: t("statusPublished"),
      rejected: t("statusRejected"),
      deleted: t("statusDeleted"),
    }),
    [t],
  );

  const flagLabel = useMemo(
    () => ({
      new_listing: t("moderationFlagNew"),
      edited: t("moderationFlagEdited"),
      profanity: t("moderationFlagProfanity"),
      legacy_pending: t("moderationFlagLegacy"),
    }),
    [t],
  );

  async function patchProperty(id: string, body: Record<string, unknown>) {
    setLoading(id);
    await fetch(`/api/admin/properties/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    setLoading(null);
    router.refresh();
  }

  function toggle(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleAll() {
    setSelected((prev) =>
      prev.size === properties.length ? new Set() : new Set(properties.map((p) => p.id)),
    );
  }

  async function bulkUpdate(status: string) {
    if (selected.size === 0) return;
    setBulkLoading(true);
    await fetch("/api/admin/properties/bulk", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids: [...selected], status }),
    });
    setBulkLoading(false);
    setSelected(new Set());
    router.refresh();
  }

  if (properties.length === 0) {
    return <p className="text-slate-600">{t("adminNoListings")}</p>;
  }

  return (
    <div className="space-y-3">
      {selected.size > 0 && (
        <div className="flex flex-wrap items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
          <span className="text-sm font-medium text-slate-700">
            {tf("adminSelectedCount", { count: selected.size })}
          </span>
          <button
            type="button"
            disabled={bulkLoading}
            onClick={() => bulkUpdate("rejected")}
            className="rounded bg-red-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-red-700 disabled:opacity-50"
          >
            {t("adminRejectSelected")}
          </button>
          <button
            type="button"
            onClick={() => setSelected(new Set())}
            className="text-xs text-slate-500 hover:underline"
          >
            {t("adminClearSelection")}
          </button>
        </div>
      )}
      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
        <table className="min-w-[40rem] w-full text-left text-sm">
          <thead className="border-b bg-slate-50 text-slate-600">
            <tr>
              <th className="px-4 py-3">
                <input
                  type="checkbox"
                  checked={selected.size === properties.length}
                  onChange={toggleAll}
                  aria-label={t("adminSelectAll")}
                />
              </th>
              <th className="px-4 py-3">{t("adminColListing")}</th>
              <th className="px-4 py-3">{t("adminColOwner")}</th>
              <th className="px-4 py-3">{t("adminColStatus")}</th>
              <th className="px-4 py-3">{t("adminColActions")}</th>
            </tr>
          </thead>
          <tbody>
            {properties.map((p) => {
              const hasProfanity = p.moderationFlags?.includes("profanity");
              return (
                <tr
                  key={p.id}
                  className={`border-b last:border-0 ${hasProfanity ? "bg-red-50/60" : ""}`}
                >
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={selected.has(p.id)}
                      onChange={() => toggle(p.id)}
                      aria-label={p.title}
                    />
                  </td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/property/${p.slug}`}
                      className="font-medium text-teal-700 hover:underline"
                    >
                      {p.title}
                    </Link>
                    <p className="text-xs text-slate-500">{formatPrice(p.price, p.priceUnit)}</p>
                    {p.moderationFlags && p.moderationFlags.length > 0 && (
                      <div className="mt-1 flex flex-wrap gap-1">
                        {p.moderationFlags.map((flag) => (
                          <span
                            key={flag}
                            className={`rounded px-1.5 py-0.5 text-[10px] font-medium ${
                              flag === "profanity"
                                ? "bg-red-100 text-red-800"
                                : "bg-amber-100 text-amber-800"
                            }`}
                          >
                            {flagLabel[flag as keyof typeof flagLabel] ?? flag}
                          </span>
                        ))}
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <p>{p.ownerName}</p>
                    <p className="text-xs text-slate-500">{p.ownerPhone ?? p.ownerEmail}</p>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-col gap-1">
                      <span
                        className={`inline-flex w-fit rounded-full px-2 py-1 text-xs font-medium ${
                          p.status === "pending"
                            ? "bg-amber-100 text-amber-800"
                            : p.status === "published"
                              ? "bg-green-100 text-green-800"
                              : "bg-slate-100 text-slate-700"
                        }`}
                      >
                        {statusLabel[p.status ?? "published"] ?? p.status}
                      </span>
                      {p.needsReview && p.status === "published" && (
                        <span className="inline-flex w-fit rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-medium text-amber-900">
                          {t("adminNeedsReviewBadge")}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      <Link
                        href={`/admin/properties/${p.id}/edit`}
                        className="rounded border border-slate-300 px-2 py-1 text-xs text-slate-700 hover:bg-slate-50"
                      >
                        {t("editBtn")}
                      </Link>
                      {p.needsReview && (
                        <button
                          type="button"
                          disabled={loading === p.id}
                          onClick={() => patchProperty(p.id, { needsReview: false })}
                          className="rounded bg-slate-700 px-2 py-1 text-xs text-white hover:bg-slate-800"
                        >
                          {t("adminMarkReviewed")}
                        </button>
                      )}
                      {p.status === "pending" && (
                        <button
                          type="button"
                          disabled={loading === p.id}
                          onClick={() => patchProperty(p.id, { status: "published", needsReview: false })}
                          className="rounded bg-green-600 px-2 py-1 text-xs text-white hover:bg-green-700"
                        >
                          {t("adminApprove")}
                        </button>
                      )}
                      {(p.status === "published" || p.status === "pending") && (
                        <button
                          type="button"
                          disabled={loading === p.id}
                          onClick={() => patchProperty(p.id, { status: "rejected" })}
                          className="rounded bg-red-600 px-2 py-1 text-xs text-white hover:bg-red-700"
                        >
                          {t("adminReject")}
                        </button>
                      )}
                      {p.status === "published" && (
                        <button
                          type="button"
                          disabled={loading === p.id}
                          onClick={() => patchProperty(p.id, { status: "deleted" })}
                          className="rounded border border-red-300 px-2 py-1 text-xs text-red-700"
                        >
                          {t("adminUnpublish")}
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
