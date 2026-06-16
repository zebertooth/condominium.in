"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useCompare } from "@/components/property/CompareProvider";
import { useLocale, useT } from "@/components/i18n/LocaleProvider";
import { formatPrice } from "@/lib/i18n";
import { localePath } from "@/lib/locale-routing";
import { resolveListingImage } from "@/lib/listing-images";
import { localizedPropertyTitle } from "@/lib/property-i18n";
import { furnishingLabel } from "@/lib/furnishing";
import type { Property } from "@/types/property";

export function ComparePageClient() {
  const searchParams = useSearchParams();
  const { slugs: storedSlugs, removeCompare } = useCompare();
  const t = useT();
  const locale = useLocale();
  const [listings, setListings] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  const querySlugs =
    searchParams.get("slugs")?.split(",").map((s) => s.trim()).filter(Boolean) ?? [];
  const slugs = querySlugs.length > 0 ? querySlugs : storedSlugs;

  useEffect(() => {
    if (slugs.length === 0) {
      setListings([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    fetch(`/api/compare?slugs=${encodeURIComponent(slugs.join(","))}`)
      .then((r) => r.json())
      .then((data: { listings?: Property[] }) => setListings(data.listings ?? []))
      .finally(() => setLoading(false));
  }, [slugs.join(",")]);

  const lp = (path: string) => localePath(path, locale);

  if (loading) {
    return <p className="text-slate-600">{t("compareLoading")}</p>;
  }

  if (listings.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
        <p className="text-slate-600">{t("compareEmpty")}</p>
        <Link href={lp("/buy")} className="mt-4 inline-block text-teal-700 hover:underline">
          {t("buy")}
        </Link>
      </div>
    );
  }

  const rows: { label: string; render: (p: Property) => string }[] = [
    {
      label: t("comparePrice"),
      render: (p) => formatPrice(p.price, p.priceUnit, locale),
    },
    {
      label: t("compareType"),
      render: (p) => (p.listingType === "rent" ? t("rent") : t("sale")),
    },
    { label: t("compareBedrooms"), render: (p) => String(p.bedrooms) },
    { label: t("compareBathrooms"), render: (p) => String(p.bathrooms) },
    {
      label: t("compareArea"),
      render: (p) => `${p.areaSqm} ${locale === "th" ? "ตร.ม." : "sqm"}`,
    },
    {
      label: t("compareFurnishing"),
      render: (p) => furnishingLabel(p.furnishing ?? "unknown", locale === "th" ? "th" : "en"),
    },
    { label: t("compareDistrict"), render: (p) => p.district },
    { label: t("compareBts"), render: (p) => p.btsStation ?? "—" },
  ];

  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
      <table className="min-w-full text-sm">
        <thead>
          <tr className="border-b border-slate-200 bg-slate-50">
            <th className="sticky left-0 z-10 bg-slate-50 px-4 py-3 text-left font-medium text-slate-600">
              {t("compareField")}
            </th>
            {listings.map((p) => (
              <th key={p.slug} className="min-w-[200px] px-4 py-3 text-left align-top">
                <div className="relative mb-2 aspect-[4/3] overflow-hidden rounded-xl bg-slate-100">
                  <Image
                    src={resolveListingImage(p.images)}
                    alt={localizedPropertyTitle(p, locale)}
                    fill
                    className="object-cover"
                    sizes="200px"
                  />
                </div>
                <Link href={lp(`/property/${p.slug}`)} className="font-semibold text-teal-700 hover:underline">
                  {localizedPropertyTitle(p, locale)}
                </Link>
                <button
                  type="button"
                  onClick={() => removeCompare(p.slug)}
                  className="mt-2 block text-xs text-red-600 hover:underline"
                >
                  {t("compareRemove")}
                </button>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.label} className="border-b border-slate-100">
              <td className="sticky left-0 bg-white px-4 py-3 font-medium text-slate-700">{row.label}</td>
              {listings.map((p) => (
                <td key={p.slug} className="px-4 py-3 text-slate-800">
                  {row.render(p)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
