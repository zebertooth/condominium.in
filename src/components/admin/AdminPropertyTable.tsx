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

  async function updateStatus(id: string, status: string) {
    setLoading(id);
    await fetch(`/api/admin/properties/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
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
            onClick={() => bulkUpdate("published")}
            className="rounded bg-green-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-green-700 disabled:opacity-50"
          >
            {t("adminApproveSelected")}
          </button>
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
        <table className="w-full text-left text-sm">
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
            {properties.map((p) => (
              <tr key={p.id} className="border-b last:border-0">
                <td className="px-4 py-3">
                  <input
                    type="checkbox"
                    checked={selected.has(p.id)}
                    onChange={() => toggle(p.id)}
                    aria-label={p.title}
                  />
                </td>
                <td className="px-4 py-3">
                  <Link href={`/property/${p.slug}`} className="font-medium text-teal-700 hover:underline">
                    {p.title}
                  </Link>
                  <p className="text-xs text-slate-500">{formatPrice(p.price, p.priceUnit)}</p>
                </td>
                <td className="px-4 py-3">
                  <p>{p.ownerName}</p>
                  <p className="text-xs text-slate-500">{p.ownerPhone ?? p.ownerEmail}</p>
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-2 py-1 text-xs font-medium ${
                      p.status === "pending"
                        ? "bg-amber-100 text-amber-800"
                        : p.status === "published"
                          ? "bg-green-100 text-green-800"
                          : "bg-slate-100 text-slate-700"
                    }`}
                  >
                    {statusLabel[p.status ?? "pending"] ?? p.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-1">
                    <Link
                      href={`/admin/properties/${p.id}/edit`}
                      className="rounded border border-slate-300 px-2 py-1 text-xs text-slate-700 hover:bg-slate-50"
                    >
                      {t("editBtn")}
                    </Link>
                    {p.status === "pending" && (
                      <>
                        <button
                          type="button"
                          disabled={loading === p.id}
                          onClick={() => updateStatus(p.id, "published")}
                          className="rounded bg-green-600 px-2 py-1 text-xs text-white hover:bg-green-700"
                        >
                          {t("adminApprove")}
                        </button>
                        <button
                          type="button"
                          disabled={loading === p.id}
                          onClick={() => updateStatus(p.id, "rejected")}
                          className="rounded bg-red-600 px-2 py-1 text-xs text-white hover:bg-red-700"
                        >
                          {t("adminReject")}
                        </button>
                      </>
                    )}
                    {p.status === "published" && (
                      <button
                        type="button"
                        disabled={loading === p.id}
                        onClick={() => updateStatus(p.id, "deleted")}
                        className="rounded border border-red-300 px-2 py-1 text-xs text-red-700"
                      >
                        {t("adminUnpublish")}
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
