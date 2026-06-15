"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useT, useLocale } from "@/components/i18n/LocaleProvider";
import { localePathWithQuery } from "@/lib/locale-routing";

interface PropertySearchProps {
  defaultType?: "sale" | "rent";
  redirectTo?: string;
}

export function PropertySearch({
  defaultType = "rent",
  redirectTo = "/ai-search",
}: PropertySearchProps) {
  const t = useT();
  const locale = useLocale();
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [type, setType] = useState<"sale" | "rent">(defaultType);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    // Log browse search event (fire-and-forget)
    void fetch("/api/analytics/search-filter", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ listingType: type, query: query || undefined }),
    });

    router.push(
      localePathWithQuery(redirectTo, locale, {
        q: query || undefined,
        type,
      }),
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-slate-200 bg-white p-4 shadow-lg sm:p-6"
    >
      <div className="mb-4 flex gap-2">
        <button
          type="button"
          onClick={() => setType("rent")}
          className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
            type === "rent"
              ? "bg-teal-600 text-white"
              : "bg-slate-100 text-slate-700 hover:bg-slate-200"
          }`}
        >
          {t("rent")}
        </button>
        <button
          type="button"
          onClick={() => setType("sale")}
          className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
            type === "sale"
              ? "bg-teal-600 text-white"
              : "bg-slate-100 text-slate-700 hover:bg-slate-200"
          }`}
        >
          {t("buy")}
        </button>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t("searchPlaceholder")}
          className="flex-1 rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none ring-teal-500 focus:ring-2"
        />
        <button
          type="submit"
          className="rounded-xl bg-teal-600 px-6 py-3 font-medium text-white transition hover:bg-teal-700"
        >
          {t("aiSearch")}
        </button>
      </div>
    </form>
  );
}
