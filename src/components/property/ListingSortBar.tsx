"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import { useLocale, useT } from "@/components/i18n/LocaleProvider";
import { listingQueryFromParams } from "@/lib/listing-search-params";
import { localePathWithQuery } from "@/lib/locale-routing";
import type { ListingSort } from "@/types/property";
import { LISTING_SORT_OPTIONS } from "@/types/property";

interface ListingSortBarProps {
  basePath: string;
}

const SORT_LABEL_KEYS: Record<ListingSort, "sortRecommended" | "sortNewest" | "sortPriceAsc" | "sortPriceDesc"> = {
  recommended: "sortRecommended",
  newest: "sortNewest",
  price_asc: "sortPriceAsc",
  price_desc: "sortPriceDesc",
};

export function ListingSortBar({ basePath }: ListingSortBarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const locale = useLocale();
  const t = useT();
  const [isPending, startTransition] = useTransition();

  const currentParams = {
    category: searchParams.get("category") ?? undefined,
    bts: searchParams.get("bts") ?? undefined,
    district: searchParams.get("district") ?? undefined,
    price: searchParams.get("price") ?? undefined,
    beds: searchParams.get("beds") ?? undefined,
    sqm: searchParams.get("sqm") ?? undefined,
    furnish: searchParams.get("furnish") ?? undefined,
    sort: searchParams.get("sort") ?? undefined,
    view: searchParams.get("view") ?? undefined,
  };

  const current = (searchParams.get("sort") as ListingSort) || "recommended";

  function onChange(next: ListingSort) {
    startTransition(() => {
      router.push(
        localePathWithQuery(
          basePath,
          locale,
          listingQueryFromParams(currentParams, {
            sort: next === "recommended" ? undefined : next,
          }),
        ),
      );
    });
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-sm text-slate-500">{t("sortLabel")}:</span>
      <select
        value={current}
        onChange={(e) => onChange(e.target.value as ListingSort)}
        disabled={isPending}
        aria-label={t("sortLabel")}
        className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-800 shadow-sm focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20 disabled:opacity-60"
      >
        {LISTING_SORT_OPTIONS.map((option) => (
          <option key={option} value={option}>
            {t(SORT_LABEL_KEYS[option])}
          </option>
        ))}
      </select>
    </div>
  );
}
