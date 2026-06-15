"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useLocale, useT } from "@/components/i18n/LocaleProvider";
import { listingQueryFromParams } from "@/lib/listing-search-params";
import { localePathWithQuery } from "@/lib/locale-routing";

interface ListingViewToggleProps {
  basePath: string;
}

export function ListingViewToggle({ basePath }: ListingViewToggleProps) {
  const searchParams = useSearchParams();
  const locale = useLocale();
  const t = useT();

  const params = {
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

  const isMap = params.view === "map";
  const listHref = localePathWithQuery(basePath, locale, listingQueryFromParams(params, { view: undefined }));
  const mapHref = localePathWithQuery(basePath, locale, listingQueryFromParams(params, { view: "map" }));

  const tabClass = (active: boolean) =>
    `rounded-lg px-4 py-2 text-sm font-medium transition ${
      active ? "bg-teal-600 text-white" : "bg-slate-100 text-slate-700 hover:bg-slate-200"
    }`;

  return (
    <div className="inline-flex gap-1 rounded-lg bg-slate-100 p-1">
      <Link href={listHref} className={tabClass(!isMap)}>
        {t("viewList")}
      </Link>
      <Link href={mapHref} className={tabClass(isMap)}>
        {t("viewMap")}
      </Link>
    </div>
  );
}
