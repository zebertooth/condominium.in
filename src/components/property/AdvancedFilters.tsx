"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState, useTransition } from "react";
import { useT, useLocale } from "@/components/i18n/LocaleProvider";

const BTS_STATIONS = [
  { value: "อโศก", label: "อโศก", labelEn: "Asoke" },
  { value: "ทองหล่อ", label: "ทองหล่อ", labelEn: "Thonglor" },
  { value: "เอกมัย", label: "เอกมัย", labelEn: "Ekkamai" },
  { value: "พร้อมพงษ์", label: "พร้อมพงษ์", labelEn: "Phrom Phong" },
  { value: "สุรศักดิ์", label: "สุรศักดิ์", labelEn: "Surasak" },
  { value: "พญาไท", label: "พญาไท", labelEn: "Phayathai" },
  { value: "ราชเทวี", label: "ราชเทวี", labelEn: "Ratchathewi" },
  { value: "ชิดลม", label: "ชิดลม", labelEn: "Chidlom" },
  { value: "อารีย์", label: "อารีย์", labelEn: "Ari" },
  { value: "สยาม", label: "สยาม", labelEn: "Siam" },
  { value: "อ่อนนุช", label: "อ่อนนุช", labelEn: "On Nut" },
  { value: "สำโรง", label: "สำโรง", labelEn: "Samrong" },
  { value: "บางนา", label: "บางนา", labelEn: "Bang Na" },
];

const DISTRICTS = [
  { value: "วัฒนา", label: "วัฒนา", labelEn: "Watthana" },
  { value: "บางรัก", label: "บางรัก", labelEn: "Bang Rak" },
  { value: "ราชเทวี", label: "ราชเทวี", labelEn: "Ratchathewi" },
  { value: "สาทร", label: "สาทร", labelEn: "Sathorn" },
  { value: "ปทุมวัน", label: "ปทุมวัน", labelEn: "Pathumwan" },
  { value: "พญาไท", label: "พญาไท", labelEn: "Phayathai" },
  { value: "ห้วยขวาง", label: "ห้วยขวาง", labelEn: "Huai Khwang" },
  { value: "คลองเตย", label: "คลองเตย", labelEn: "Khlong Toei" },
  { value: "ดินแดง", label: "ดินแดง", labelEn: "Din Daeng" },
  { value: "จตุจักร", label: "จตุจักร", labelEn: "Chatuchak" },
];

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

interface AdvancedFiltersProps {
  listingType: "sale" | "rent";
  currentCategory?: string;
  basePath?: string;
}

export function AdvancedFilters({ listingType, currentCategory, basePath }: AdvancedFiltersProps) {
  const t = useT();
  const locale = useLocale();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const nonTh = locale !== "th";

  const [btsStation, setBtsStation] = useState(searchParams.get("bts") ?? "");
  const [district, setDistrict] = useState(searchParams.get("district") ?? "");
  const [priceRange, setPriceRange] = useState(searchParams.get("price") ?? "");
  const [bedrooms, setBedrooms] = useState(searchParams.get("beds") ?? "");
  const [expanded, setExpanded] = useState(
    !!(searchParams.get("bts") || searchParams.get("district") || searchParams.get("price") || searchParams.get("beds"))
  );

  const priceRanges = listingType === "rent" ? PRICE_RANGES_RENT : PRICE_RANGES_SALE;

  const applyFilters = useCallback(() => {
    const params = new URLSearchParams();
    if (currentCategory && currentCategory !== "all") params.set("category", currentCategory);
    if (btsStation) params.set("bts", btsStation);
    if (district) params.set("district", district);
    if (priceRange) params.set("price", priceRange);
    if (bedrooms) params.set("beds", bedrooms);

    const resolvedBasePath = basePath ?? (listingType === "rent" ? "/rent" : "/buy");
    if (basePath === "/map") params.set("type", listingType);
    const query = params.toString();

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
      }),
    });

    startTransition(() => {
      router.push(query ? `${resolvedBasePath}?${query}` : resolvedBasePath);
    });
  }, [btsStation, district, priceRange, bedrooms, currentCategory, listingType, basePath, router]);

  const resetFilters = useCallback(() => {
    setBtsStation("");
    setDistrict("");
    setPriceRange("");
    setBedrooms("");
    const resolvedBasePath = basePath ?? (listingType === "rent" ? "/rent" : "/buy");
    const params = new URLSearchParams();
    if (currentCategory && currentCategory !== "all") params.set("category", currentCategory);
    if (basePath === "/map") params.set("type", listingType);
    const query = params.toString();
    startTransition(() => {
      router.push(query ? `${resolvedBasePath}?${query}` : resolvedBasePath);
    });
  }, [currentCategory, listingType, basePath, router]);

  const hasFilters = btsStation || district || priceRange || bedrooms;

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
              {[btsStation, district, priceRange, bedrooms].filter(Boolean).length}
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
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                {t("filterBts")}
              </label>
              <select
                value={btsStation}
                onChange={(e) => setBtsStation(e.target.value)}
                className={selectClass}
              >
                <option value="">{t("any")}</option>
                {BTS_STATIONS.map((s) => (
                  <option key={s.value} value={s.value}>
                    {nonTh ? s.labelEn : s.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                {t("filterDistrict")}
              </label>
              <select
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className={selectClass}
              >
                <option value="">{t("any")}</option>
                {DISTRICTS.map((d) => (
                  <option key={d.value} value={d.value}>
                    {nonTh ? d.labelEn : d.label}
                  </option>
                ))}
              </select>
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
