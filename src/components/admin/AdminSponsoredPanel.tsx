"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { useT } from "@/components/i18n/LocaleProvider";
import { formatPrice } from "@/lib/i18n";
import { SPONSOR_PACKAGES } from "@/lib/packages";
import { isActiveSponsor } from "@/lib/sponsored";
import type { Property } from "@/types/property";

type SponsoredProperty = Property & {
  ownerName: string;
  viewsCount: number;
  isSponsoredRaw: boolean;
  sponsoredUntilRaw: string | null;
};

function addDays(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  d.setHours(23, 59, 59, 999);
  return d.toISOString();
}

function dateInputToIso(dateValue: string): string | null {
  if (!dateValue) return null;
  const d = new Date(`${dateValue}T23:59:59`);
  if (Number.isNaN(d.getTime())) return null;
  return d.toISOString();
}

function formatUntil(iso: string | null | undefined, locale: string): string {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString(locale === "th" ? "th-TH" : "en-GB");
}

export function AdminSponsoredPanel({
  properties,
  locale,
  today,
}: {
  properties: SponsoredProperty[];
  locale: string;
  today: string;
}) {
  const router = useRouter();
  const t = useT();
  const [loading, setLoading] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [customDates, setCustomDates] = useState<Record<string, string>>({});

  const minDate = today;

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return properties;
    return properties.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.slug.toLowerCase().includes(q) ||
        p.ownerName.toLowerCase().includes(q),
    );
  }, [properties, query]);

  const activeCount = useMemo(
    () =>
      properties.filter((p) =>
        isActiveSponsor(p.isSponsoredRaw, p.sponsoredUntilRaw ? new Date(p.sponsoredUntilRaw) : null),
      ).length,
    [properties],
  );

  function customDateValue(p: SponsoredProperty): string {
    if (customDates[p.id] !== undefined) return customDates[p.id];
    if (p.sponsoredUntilRaw) return p.sponsoredUntilRaw.slice(0, 10);
    return minDate;
  }

  async function patchSponsor(id: string, body: { isSponsored?: boolean; sponsoredUntil?: string | null }) {
    setLoading(id);
    await fetch(`/api/admin/properties/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    setLoading(null);
    router.refresh();
  }

  async function applyCustomDate(p: SponsoredProperty) {
    const iso = dateInputToIso(customDateValue(p));
    if (!iso) return;
    await patchSponsor(p.id, { sponsoredUntil: iso });
    setCustomDates((prev) => {
      const next = { ...prev };
      delete next[p.id];
      return next;
    });
  }

  if (properties.length === 0) {
    return <p className="text-slate-600">{t("adminNoListings")}</p>;
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-violet-200 bg-violet-50 px-4 py-3">
        <p className="text-sm text-violet-900">
          {t("adminStatSponsored")}: {activeCount}
        </p>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t("filterSearch")}
          className="rounded-lg border border-violet-200 bg-white px-3 py-2 text-sm"
        />
      </div>

      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
        <table className="min-w-[52rem] w-full text-left text-sm">
          <thead className="border-b bg-slate-50 text-slate-600">
            <tr>
              <th className="px-4 py-3">{t("adminPropertiesTitle")}</th>
              <th className="px-4 py-3">{t("adminSponsoredViews")}</th>
              <th className="px-4 py-3">{t("adminSponsoredUntil")}</th>
              <th className="px-4 py-3">{t("adminSponsored")}</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => {
              const active = isActiveSponsor(
                p.isSponsoredRaw,
                p.sponsoredUntilRaw ? new Date(p.sponsoredUntilRaw) : null,
              );
              const busy = loading === p.id;
              const dateValue = customDateValue(p);

              return (
                <tr key={p.id} className="border-b last:border-0">
                  <td className="px-4 py-3">
                    <Link
                      href={`/property/${p.slug}`}
                      className="font-medium text-teal-700 hover:underline"
                      target="_blank"
                    >
                      {p.title}
                    </Link>
                    <p className="mt-0.5 text-xs text-slate-500">
                      {p.ownerName} · {formatPrice(p.price, p.priceUnit)}
                    </p>
                  </td>
                  <td className="px-4 py-3 text-slate-700">{p.viewsCount.toLocaleString()}</td>
                  <td className="px-4 py-3">
                    {active && p.sponsoredUntilRaw ? (
                      <span className="text-slate-700">{formatUntil(p.sponsoredUntilRaw, locale)}</span>
                    ) : (
                      <span className="text-slate-400">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap items-center gap-2">
                      {SPONSOR_PACKAGES.map((tier, index) => (
                        <button
                          key={tier.id}
                          type="button"
                          disabled={busy}
                          onClick={() =>
                            patchSponsor(p.id, { sponsoredUntil: addDays(tier.durationDays) })
                          }
                          className={
                            index === SPONSOR_PACKAGES.length - 1
                              ? "rounded-lg bg-violet-600 px-2.5 py-1.5 text-xs font-medium text-white hover:bg-violet-700 disabled:opacity-50"
                              : "rounded-lg border border-violet-300 px-2.5 py-1.5 text-xs font-medium text-violet-800 hover:bg-violet-50 disabled:opacity-50"
                          }
                          title={tier.badge ?? undefined}
                        >
                          {t("adminSponsoredSetDays").replace(
                            "{days}",
                            String(tier.durationDays),
                          )}
                        </button>
                      ))}
                      <div className="flex items-center gap-1.5">
                        <input
                          type="date"
                          value={dateValue}
                          min={minDate}
                          disabled={busy}
                          onChange={(e) =>
                            setCustomDates((prev) => ({ ...prev, [p.id]: e.target.value }))
                          }
                          className="rounded-lg border border-slate-300 px-2 py-1.5 text-xs"
                          aria-label={t("adminSponsoredCustom")}
                        />
                        <button
                          type="button"
                          disabled={busy || !dateValue}
                          onClick={() => applyCustomDate(p)}
                          className="rounded-lg border border-slate-300 px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                        >
                          {t("adminSponsoredCustom")}
                        </button>
                      </div>
                      {active && (
                        <button
                          type="button"
                          disabled={busy}
                          onClick={() => patchSponsor(p.id, { isSponsored: false })}
                          className="rounded-lg border border-red-200 px-2.5 py-1.5 text-xs font-medium text-red-700 hover:bg-red-50 disabled:opacity-50"
                        >
                          {t("adminSponsoredClear")}
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
