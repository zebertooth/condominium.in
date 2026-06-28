"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { LocalizedLink } from "@/components/i18n/LocalizedLink";
import { PropertyGrid } from "@/components/property/PropertyGrid";
import { useLocale, useT } from "@/components/i18n/LocaleProvider";
import { tf, type Locale, type TranslationKey } from "@/lib/i18n";
import type { AISearchExtractedFilters, AISearchResult } from "@/types/property";

function filterChips(
  filters: AISearchExtractedFilters,
  t: (key: TranslationKey) => string,
  locale: Locale,
): string[] {
  const chips: string[] = [];
  if (filters.listingType) {
    chips.push(filters.listingType === "sale" ? t("buy") : t("rent"));
  }
  if (filters.btsStation) {
    chips.push(tf("aiSearchFilterBts", locale, { station: filters.btsStation }));
  }
  if (filters.district) {
    chips.push(tf("aiSearchFilterDistrict", locale, { district: filters.district }));
  }
  if (filters.bedrooms) {
    chips.push(tf("aiSearchFilterBedrooms", locale, { count: filters.bedrooms }));
  }
  if (filters.maxPrice) {
    chips.push(
      tf("aiSearchFilterMaxPrice", locale, {
        price: filters.maxPrice.toLocaleString(locale === "th" ? "th-TH" : "en-US"),
      }),
    );
  }
  return chips;
}

export function AISearchClient() {
  const locale = useLocale();
  const t = useT();
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") ?? "";
  const [query, setQuery] = useState(initialQuery);
  const [type, setType] = useState<"sale" | "rent">(
    (searchParams.get("type") as "sale" | "rent") ?? "rent",
  );
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AISearchResult | null>(null);

  async function runSearch(searchQuery: string) {
    if (!searchQuery.trim()) return;
    setLoading(true);
    try {
      const res = await fetch("/api/ai-search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: searchQuery, listingType: type }),
      });
      const data = (await res.json()) as AISearchResult;
      setResult(data);
    } finally {
      setLoading(false);
    }
  }

  const hasAutoSearched = useRef(false);
  useEffect(() => {
    if (hasAutoSearched.current || !initialQuery) return;
    hasAutoSearched.current = true;
    runSearch(initialQuery);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialQuery]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    runSearch(query);
  }

  const chips = result?.filters ? filterChips(result.filters, t, locale) : [];

  return (
    <div>
      <form onSubmit={handleSubmit} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-4 flex gap-2">
          <button
            type="button"
            onClick={() => setType("rent")}
            className={`rounded-lg px-4 py-2 text-sm font-medium ${
              type === "rent" ? "bg-teal-600 text-white" : "bg-slate-100 text-slate-700"
            }`}
          >
            {t("rent")}
          </button>
          <button
            type="button"
            onClick={() => setType("sale")}
            className={`rounded-lg px-4 py-2 text-sm font-medium ${
              type === "sale" ? "bg-teal-600 text-white" : "bg-slate-100 text-slate-700"
            }`}
          >
            {t("buy")}
          </button>
        </div>

        <textarea
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          rows={3}
          placeholder={t("searchPlaceholder")}
          className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none ring-teal-500 focus:ring-2"
        />

        <button
          type="submit"
          disabled={loading || !query.trim()}
          className="mt-4 rounded-xl bg-violet-600 px-6 py-3 font-medium text-white transition hover:bg-violet-700 disabled:opacity-50"
        >
          {loading ? "…" : t("aiSearch")}
        </button>
      </form>

      {result && (
        <div className="mt-10">
          <div className="rounded-2xl bg-violet-50 p-6">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="font-bold text-violet-900">{t("aiSearch")}</h2>
              <span
                className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                  result.engine === "ai"
                    ? "bg-violet-600 text-white"
                    : "bg-slate-200 text-slate-700"
                }`}
              >
                {result.engine === "ai" ? t("aiSearchEngineLlm") : t("aiSearchEngineRules")}
              </span>
            </div>
            <p className="mt-2 text-violet-800">{result.summary}</p>

            {chips.length > 0 && (
              <div className="mt-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-violet-700">
                  {t("aiSearchFiltersHeading")}
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {chips.map((chip) => (
                    <span
                      key={chip}
                      className="rounded-full border border-violet-200 bg-white px-3 py-1 text-xs font-medium text-violet-900"
                    >
                      {chip}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {result.hubLinks && result.hubLinks.length > 0 && (
              <div className="mt-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-violet-700">
                  {t("aiSearchHubLinksHeading")}
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {result.hubLinks.map((link) => (
                    <LocalizedLink
                      key={link.href}
                      href={link.href}
                      className="rounded-full border border-violet-300 bg-violet-100 px-3 py-1.5 text-xs font-medium text-violet-900 hover:bg-violet-200"
                    >
                      {link.label}
                    </LocalizedLink>
                  ))}
                </div>
              </div>
            )}

            <ul className="mt-4 space-y-1 text-sm text-violet-700">
              {result.suggestions.map((s) => (
                <li key={s}>• {s}</li>
              ))}
            </ul>
          </div>

          <h2 className="mb-6 mt-10 text-xl font-semibold text-slate-900">
            {t("featuredListings")} ({result.properties.length})
          </h2>
          <PropertyGrid properties={result.properties} locale={locale} />
        </div>
      )}

      <div className="mt-10 rounded-2xl border border-dashed border-slate-300 p-6 text-sm text-slate-600">
        <p className="font-medium text-slate-800">{t("searchPlaceholder")}</p>
        <ul className="mt-2 space-y-1">
          <li>• คอนโด 2 ห้องนอน ใกล้ BTS อโศก งบ 45,000</li>
          <li>• เช่าสตูดิโอ ใกล้ BTS พญาไท ไม่เกิน 15,000</li>
          <li>• ซื้อคอนโด สาทร งบ 8 ล้าน ใกล้ BTS</li>
        </ul>
      </div>
    </div>
  );
}
