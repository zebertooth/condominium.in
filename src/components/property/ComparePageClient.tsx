"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useCompare } from "@/components/property/CompareProvider";
import { useLocale, useT } from "@/components/i18n/LocaleProvider";
import { formatPrice } from "@/lib/i18n";
import { localePath } from "@/lib/locale-routing";
import { resolveListingImage } from "@/lib/listing-images";
import { localizedPropertyTitle } from "@/lib/property-i18n";
import { furnishingLabel } from "@/lib/furnishing";
import type { Property } from "@/types/property";

export function ComparePageClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { slugs, removeCompare, replaceCompare } = useCompare();
  const t = useT();
  const locale = useLocale();
  const [listings, setListings] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  const lp = (path: string) => localePath(path, locale);

  // Import ?slugs= from compare bar into localStorage, then use storage as source of truth.
  useEffect(() => {
    const raw = searchParams.get("slugs");
    if (!raw) return;
    const querySlugs = raw
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    if (querySlugs.length === 0) return;
    replaceCompare(querySlugs);
    router.replace(lp("/compare"), { scroll: false });
  }, [searchParams, replaceCompare, router, locale]);

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

  function handleRemove(slug: string) {
    removeCompare(slug);
    setListings((prev) => prev.filter((p) => p.slug !== slug));
  }

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
                  <button
                    type="button"
                    onClick={() => handleRemove(p.slug)}
                    className="absolute right-2 top-2 z-10 rounded-lg bg-white/95 px-2.5 py-1 text-xs font-medium text-red-600 shadow-sm hover:bg-white"
                    aria-label={t("compareRemove")}
                  >
                    {t("compareRemove")}
                  </button>
                  <Image
                    src={resolveListingImage(p.images)}
                    alt={localizedPropertyTitle(p, locale)}
                    fill
                    className="object-cover"
                    sizes="200px"
                  />
                </div>
                <Link
                  href={lp(`/property/${p.slug}`)}
                  className="font-semibold text-teal-700 hover:underline"
                >
                  {localizedPropertyTitle(p, locale)}
                </Link>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.label} className="border-b border-slate-100">
              <td className="sticky left-0 bg-white px-4 py-3 font-medium text-slate-700">
                {row.label}
              </td>
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
