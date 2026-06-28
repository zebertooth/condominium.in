"use client";

import { useState } from "react";
import Link from "next/link";
import { t, type Locale } from "@/lib/i18n";
import type { AISearchExtractedFilters } from "@/types/property";

interface AISearchCreateAlertProps {
  listingType: "sale" | "rent";
  locale: Locale;
  filters?: AISearchExtractedFilters;
  query?: string;
}

export function AISearchCreateAlert({
  listingType,
  locale,
  filters,
  query,
}: AISearchCreateAlertProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const alertFilters = {
    district: filters?.district,
    btsStation: filters?.btsStation,
    maxPrice: filters?.maxPrice,
    bedrooms: filters?.bedrooms,
  };

  const hasFilters = Object.values(alertFilters).some(Boolean);

  async function handleCreate() {
    const label =
      name.trim() ||
      (query?.trim()
        ? query.trim().slice(0, 40)
        : t("aiSearchCreateAlert", locale));

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/user/alerts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: label,
          listingType,
          filters: alertFilters,
        }),
      });

      if (res.status === 401) {
        setError(locale === "th" ? "กรุณาเข้าสู่ระบบก่อน" : "Please log in first");
        return;
      }

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Failed");
        return;
      }

      setSuccess(true);
      setTimeout(() => {
        setOpen(false);
        setSuccess(false);
        setName("");
      }, 2500);
    } catch {
      setError(t("createAlertNetworkError", locale));
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="mt-4 rounded-lg border border-violet-300 bg-white px-4 py-2 text-sm font-medium text-violet-800 hover:bg-violet-50"
      >
        {t("aiSearchCreateAlert", locale)}
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
            <h2 className="text-lg font-bold text-slate-900">{t("createAlertTitle", locale)}</h2>
            <p className="mt-1 text-sm text-slate-600">{t("createAlertDesc", locale)}</p>

            {success ? (
              <p className="mt-6 rounded-lg bg-green-50 p-4 text-center text-green-800">
                {t("createAlertSuccess", locale)}
              </p>
            ) : (
              <>
                <div className="mt-4">
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    {t("createAlertNameLabel", locale)}
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={query?.slice(0, 50) || t("createAlertNamePlaceholder", locale)}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 outline-none ring-teal-500 focus:ring-2"
                  />
                </div>

                {hasFilters && (
                  <div className="mt-3 rounded-lg bg-slate-50 p-3 text-sm text-slate-700">
                    {alertFilters.btsStation && <p>BTS: {alertFilters.btsStation}</p>}
                    {alertFilters.district && (
                      <p>
                        {t("filterDistrict", locale)}: {alertFilters.district}
                      </p>
                    )}
                    {alertFilters.bedrooms && (
                      <p>
                        {alertFilters.bedrooms} {t("bedrooms", locale)}
                      </p>
                    )}
                    {alertFilters.maxPrice && (
                      <p>
                        ≤ {alertFilters.maxPrice.toLocaleString()} {locale === "th" ? "บาท" : "THB"}
                      </p>
                    )}
                  </div>
                )}

                {error && (
                  <p className="mt-3 text-sm text-red-600">
                    {error}{" "}
                    {error.includes("log in") || error.includes("เข้าสู่ระบบ") ? (
                      <Link href="/login" className="font-medium underline">
                        {t("login", locale)}
                      </Link>
                    ) : null}
                  </p>
                )}

                <div className="mt-6 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    className="flex-1 rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700"
                  >
                    {t("cancelBtn", locale)}
                  </button>
                  <button
                    type="button"
                    onClick={handleCreate}
                    disabled={loading}
                    className="flex-1 rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
                  >
                    {loading ? t("createAlertCreating", locale) : t("createAlertBtn", locale)}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
