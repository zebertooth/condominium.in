"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState, useTransition } from "react";
import { useT, useLocale } from "@/components/i18n/LocaleProvider";
import { DistrictSearchPicker } from "@/components/property/DistrictSearchPicker";
import { LocationFilterPicker } from "@/components/property/LocationFilterPicker";
import { localePath, localePathWithQuery } from "@/lib/locale-routing";

const PRICE_RANGES_RENT = [
  { min: 0, max: 15000, label: "ไม่เกิน ฿15,000", labelEn: "Under ฿15,000" },
  { min: 15000, max: 25000, label: "฿15,000 - ฿25,000", labelEn: "฿15,000 - ฿25,000" },
  { min: 25000, max: 40000, label: "฿25,000 - ฿40,000", labelEn: "฿25,000 - ฿40,000" },
  { min: 40000, max: 60000, label: "฿40,000 - ฿60,000", labelEn: "฿40,000 - ฿60,000" },
  { min: 60000, max: 100000, label: "฿60,000 - ฿100,000", labelEn: "฿60,000 - ฿100,000" },
  { min: 100000, max: 0, label: "฿100,000+", labelEn: "฿100,000+" },
];

const PRICE_RANGES_SALE = [
  { min: 0, max: 3000000, label: "ไม่เกิน ฿3M", labelEn: "Under ฿3M" },
  { min: 3000000, max: 5000000, label: "฿3M - ฿5M", labelEn: "฿3M - ฿5M" },
  { min: 5000000, max: 8000000, label: "฿5M - ฿8M", labelEn: "฿5M - ฿8M" },
  { min: 8000000, max: 15000000, label: "฿8M - ฿15M", labelEn: "฿8M - ฿15M" },
  { min: 15000000, max: 30000000, label: "฿15M - ฿30M", labelEn: "฿15M - ฿30M" },
  { min: 30000000, max: 0, label: "฿30M+", labelEn: "฿30M+" },
];

const BEDROOM_OPTIONS = [
  { value: "", label: "ทั้งหมด", labelEn: "Any" },
  { value: "1", label: "1 ห้องนอน", labelEn: "1 Bedroom" },
  { value: "2", label: "2 ห้องนอน", labelEn: "2 Bedrooms" },
  { value: "3", label: "3 ห้องนอน", labelEn: "3 Bedrooms" },
  { value: "4", label: "4+ ห้องนอน", labelEn: "4+ Bedrooms" },
];

const SQM_RANGES = [
  { min: 0, max: 30, label: "ไม่เกิน 30 ตร.ม.", labelEn: "Under 30 sqm" },
  { min: 30, max: 50, label: "30–50 ตร.ม.", labelEn: "30–50 sqm" },
  { min: 50, max: 80, label: "50–80 ตร.ม.", labelEn: "50–80 sqm" },
  { min: 80, max: 0, label: "80+ ตร.ม.", labelEn: "80+ sqm" },
];

const FURNISHING_OPTIONS = [
  { value: "", label: "ทั้งหมด", labelEn: "Any" },
  { value: "furnished", label: "เฟอร์นิเจอร์ครบ", labelEn: "Fully furnished" },
  { value: "unfurnished", label: "ไม่มีเฟอร์นิเจอร์", labelEn: "Unfurnished" },
];

interface AdvancedFiltersProps {
  listingType: "sale" | "rent";
  currentCategory?: string;
  basePath?: string;
  lockedBts?: string;
  lockedDistrict?: string;
}

export function AdvancedFilters({ listingType, currentCategory, basePath, lockedBts, lockedDistrict }: AdvancedFiltersProps) {
  const t = useT();
  const locale = useLocale();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const nonTh = locale !== "th";

  const [btsStation, setBtsStation] = useState(searchParams.get("bts") ?? lockedBts ?? "");
  const [district, setDistrict] = useState(searchParams.get("district") ?? lockedDistrict ?? "");
  const [priceRange, setPriceRange] = useState(searchParams.get("price") ?? "");
  const [bedrooms, setBedrooms] = useState(searchParams.get("beds") ?? "");
  const [sqmRange, setSqmRange] = useState(searchParams.get("sqm") ?? "");
  const [furnishing, setFurnishing] = useState(searchParams.get("furnish") ?? "");
  const [expanded, setExpanded] = useState(
    !!(
      searchParams.get("bts") ||
      searchParams.get("district") ||
      searchParams.get("price") ||
      searchParams.get("beds") ||
      searchParams.get("sqm") ||
      searchParams.get("furnish")
    ),
  );

  const priceRanges = listingType === "rent" ? PRICE_RANGES_RENT : PRICE_RANGES_SALE;

  const applyFilters = useCallback(() => {
    const params = new URLSearchParams();
    if (currentCategory && currentCategory !== "all") params.set("category", currentCategory);
    const bts = lockedBts ?? btsStation;
    const dist = lockedDistrict ?? district;
    if (bts) params.set("bts", bts);
    if (dist) params.set("district", dist);
    if (priceRange) params.set("price", priceRange);
    if (bedrooms) params.set("beds", bedrooms);
    if (sqmRange) params.set("sqm", sqmRange);
    if (furnishing) params.set("furnish", furnishing);
    const sort = searchParams.get("sort");
    if (sort) params.set("sort", sort);
    const view = searchParams.get("view");
    if (view === "map") params.set("view", "map");

    const internalPath = basePath ?? (listingType === "rent" ? "/rent" : "/buy");
    if (basePath === "/map") params.set("type", listingType);
    const query = params.toString();
    const resolvedBasePath = localePath(internalPath, locale);

    const [minStr, maxStr] = priceRange?.split("-") ?? [];
    void fetch("/api/analytics/search-filter", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        listingType,
        btsStation: btsStation || undefined,
        district: district || undefined,
        minPrice: minStr ? parseInt(minStr, 10) || undefined : undefined,
        maxPrice: maxStr ? parseInt(maxStr, 10) || undefined : undefined,
        bedrooms: bedrooms ? parseInt(bedrooms, 10) : undefined,
        minSqm: sqmRange ? parseInt(sqmRange.split("-")[0], 10) || undefined : undefined,
        maxSqm: sqmRange ? parseInt(sqmRange.split("-")[1], 10) || undefined : undefined,
        furnishing: furnishing || undefined,
      }),
    });

    startTransition(() => {
      router.push(query ? `${resolvedBasePath}?${query}` : resolvedBasePath);
    });
  }, [
    btsStation,
    lockedBts,
    lockedDistrict,
    district,
    priceRange,
    bedrooms,
    sqmRange,
    furnishing,
    currentCategory,
    listingType,
    basePath,
    locale,
    router,
    searchParams,
  ]);

  const resetFilters = useCallback(() => {
    setBtsStation("");
    setDistrict("");
    setPriceRange("");
    setBedrooms("");
    setSqmRange("");
    setFurnishing("");
    const internalPath = basePath ?? (listingType === "rent" ? "/rent" : "/buy");
    startTransition(() => {
      router.push(
        localePathWithQuery(internalPath, locale, {
          category: currentCategory && currentCategory !== "all" ? currentCategory : undefined,
          type: basePath === "/map" ? listingType : undefined,
          bts: lockedBts,
          district: lockedDistrict,
          sort: searchParams.get("sort") ?? undefined,
          view: searchParams.get("view") === "map" ? "map" : undefined,
        }),
      );
    });
  }, [currentCategory, listingType, basePath, locale, router, lockedBts, lockedDistrict, searchParams]);

  const hasFilters =
    (lockedBts ? false : btsStation) ||
    (lockedDistrict ? false : district) ||
    priceRange ||
    bedrooms ||
    sqmRange ||
    furnishing;

  const selectClass =
    "w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none ring-teal-500 focus:ring-2";

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="flex w-full items-center justify-between text-left"
      >
        <span className="font-medium text-slate-900">
          {nonTh ? "Advanced Filters" : "ตัวกรองขั้นสูง"}
          {hasFilters && (
            <span className="ml-2 rounded-full bg-teal-100 px-2 py-0.5 text-xs text-teal-800">
              {[btsStation, district, priceRange, bedrooms, sqmRange, furnishing].filter(Boolean).length}
            </span>
          )}
        </span>
        <svg
          className={`h-5 w-5 text-slate-500 transition-transform ${expanded ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {expanded && (
        <div className="mt-4 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="sm:col-span-2 lg:col-span-3">
              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                {lockedBts
                  ? t("filterTransit")
                  : lockedDistrict
                    ? t("filterDistrict")
                    : t("filterLocation")}
              </label>
              <LocationFilterPicker
                district={district}
                station={btsStation}
                onDistrictChange={setDistrict}
                onStationChange={setBtsStation}
                lockedDistrict={lockedDistrict}
                lockedStation={lockedBts}
                listingType={listingType}
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                {nonTh ? "Price Range" : "ช่วงราคา"}
              </label>
              <select
                value={priceRange}
                onChange={(e) => setPriceRange(e.target.value)}
                className={selectClass}
              >
                <option value="">{t("any")}</option>
                {priceRanges.map((p, i) => (
                  <option key={i} value={`${p.min}-${p.max}`}>
                    {nonTh ? p.labelEn : p.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                {t("filterBedrooms")}
              </label>
              <select
                value={bedrooms}
                onChange={(e) => setBedrooms(e.target.value)}
                className={selectClass}
              >
                {BEDROOM_OPTIONS.map((b) => (
                  <option key={b.value} value={b.value}>
                    {nonTh ? b.labelEn : b.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                {t("filterSqm")}
              </label>
              <select
                value={sqmRange}
                onChange={(e) => setSqmRange(e.target.value)}
                className={selectClass}
              >
                <option value="">{t("any")}</option>
                {SQM_RANGES.map((range, i) => (
                  <option key={i} value={`${range.min}-${range.max}`}>
                    {nonTh ? range.labelEn : range.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                {t("filterFurnishing")}
              </label>
              <select
                value={furnishing}
                onChange={(e) => setFurnishing(e.target.value)}
                className={selectClass}
              >
                {FURNISHING_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {nonTh ? option.labelEn : option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={applyFilters}
              disabled={isPending}
              className="rounded-lg bg-teal-600 px-5 py-2 text-sm font-medium text-white transition hover:bg-teal-700 disabled:opacity-50"
            >
              {isPending ? (nonTh ? "Searching..." : "กำลังค้นหา...") : t("filterSearch")}
            </button>
            {hasFilters && (
              <button
                type="button"
                onClick={resetFilters}
                disabled={isPending}
                className="rounded-lg border border-slate-300 px-5 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
              >
                {t("filterReset")}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
