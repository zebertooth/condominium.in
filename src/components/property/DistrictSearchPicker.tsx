"use client";

import dynamic from "next/dynamic";
import { useMemo, useState } from "react";
import { useLocale } from "@/components/i18n/LocaleProvider";
import {
  DISTRICT_ZONE_LABELS,
  districtFilterValue,
  getDistrictByName,
  searchDistricts,
  type DistrictZone,
} from "@/lib/bangkok-districts";

const DistrictMap = dynamic(() => import("./DistrictMap").then((m) => m.DistrictMap), {
  ssr: false,
  loading: () => (
    <div className="flex h-64 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-500">
      Loading map…
    </div>
  ),
});

interface DistrictSearchPickerProps {
  value: string;
  onChange: (districtName: string) => void;
  disabled?: boolean;
  className?: string;
}

export function DistrictSearchPicker({
  value,
  onChange,
  disabled,
  className,
}: DistrictSearchPickerProps) {
  const locale = useLocale();
  const nonTh = locale !== "th";
  const [query, setQuery] = useState("");
  const [zoneFilter, setZoneFilter] = useState<DistrictZone | "all">("all");
  const [view, setView] = useState<"list" | "map">("list");

  const selected = getDistrictByName(value);
  const filtered = useMemo(() => searchDistricts(query, zoneFilter), [query, zoneFilter]);

  const zoneChips: { id: DistrictZone | "all"; label: string }[] = [
    { id: "all", label: nonTh ? "All zones" : "ทุกโซน" },
    ...(["inner", "central", "outer"] as const).map((z) => ({
      id: z,
      label: nonTh ? DISTRICT_ZONE_LABELS[z].en : DISTRICT_ZONE_LABELS[z].th,
    })),
  ];

  return (
    <div className={`space-y-3 ${className ?? ""}`}>
      <div className="flex flex-wrap gap-1.5">
        {zoneChips.map((chip) => (
          <button
            key={chip.id}
            type="button"
            disabled={disabled}
            onClick={() => setZoneFilter(chip.id)}
            className={`rounded-full border px-2.5 py-1 text-xs font-medium transition ${
              zoneFilter === chip.id
                ? "border-violet-600 bg-violet-600 text-white"
                : "border-slate-200 bg-white text-slate-600 hover:border-violet-300 hover:bg-violet-50"
            }`}
          >
            {chip.label}
          </button>
        ))}
      </div>

      <div className="flex gap-1 rounded-lg bg-slate-100 p-1">
        {(["list", "map"] as const).map((mode) => (
          <button
            key={mode}
            type="button"
            disabled={disabled}
            onClick={() => setView(mode)}
            className={`flex-1 rounded-md px-3 py-1.5 text-xs font-medium transition ${
              view === mode ? "bg-white text-slate-900 shadow-sm" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            {mode === "list" ? (nonTh ? "List" : "รายการ") : nonTh ? "Map" : "แผนที่"}
          </button>
        ))}
      </div>

      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        disabled={disabled}
        placeholder={nonTh ? "Search district (Thai or English)…" : "ค้นหาเขต (ไทยหรืออังกฤษ)…"}
        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none ring-violet-500 focus:ring-2 disabled:opacity-60"
      />

      {view === "map" ? (
        <div className="overflow-hidden rounded-xl border border-slate-200">
          <DistrictMap
            districts={filtered}
            selectedSlug={selected?.slug}
            onSelect={(d) => onChange(districtFilterValue(d))}
          />
          <p className="border-t border-slate-100 bg-slate-50 px-3 py-2 text-xs text-slate-500">
            {nonTh ? "Tap a circle on the map to select a district" : "แตะวงกลมบนแผนที่เพื่อเลือกเขต"}
          </p>
        </div>
      ) : (
        <div className="max-h-52 overflow-y-auto rounded-xl border border-slate-200 bg-white [scrollbar-width:thin]">
          {filtered.length === 0 ? (
            <p className="px-3 py-6 text-center text-sm text-slate-500">
              {nonTh ? "No districts found" : "ไม่พบเขต"}
            </p>
          ) : (
            <ul className="divide-y divide-slate-100">
              {filtered.map((district) => {
                const isSelected = district.nameTh === value;
                const zoneColor =
                  district.zone === "inner" ? "#0d9488" : district.zone === "central" ? "#7c3aed" : "#64748b";
                return (
                  <li key={district.id}>
                    <button
                      type="button"
                      disabled={disabled}
                      onClick={() => onChange(districtFilterValue(district))}
                      className={`flex w-full items-center gap-3 px-3 py-2.5 text-left transition hover:bg-slate-50 ${
                        isSelected ? "bg-violet-50" : ""
                      }`}
                    >
                      <span
                        className="h-2.5 w-2.5 shrink-0 rounded-full"
                        style={{ backgroundColor: zoneColor }}
                        aria-hidden
                      />
                      <span className="min-w-0 flex-1">
                        <span className="block text-sm font-medium text-slate-900">
                          {nonTh ? district.labelEn : district.labelTh}
                        </span>
                        <span className="block text-xs text-slate-500">
                          {nonTh ? district.nameEn : district.nameTh}
                        </span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      )}

      <p className="text-xs text-slate-500">
        {nonTh ? (
          <>
            {filtered.length} districts · data from{" "}
            <a
              href="https://th.wikipedia.org/wiki/%E0%B8%A3%E0%B8%B2%E0%B8%A2%E0%B8%8A%E0%B8%B7%E0%B9%88%E0%B8%AD%E0%B9%80%E0%B8%82%E0%B8%95%E0%B8%82%E0%B8%AD%E0%B8%87%E0%B8%81%E0%B8%A3%E0%B8%B8%E0%B8%87%E0%B9%80%E0%B8%97%E0%B8%9E%E0%B8%A1%E0%B8%AB%E0%B8%B2%E0%B8%99%E0%B8%84%E0%B8%A3"
              target="_blank"
              rel="noopener noreferrer"
              className="text-violet-700 underline"
            >
              Wikipedia
            </a>
          </>
        ) : (
          <>
            {filtered.length} เขต · อ้างอิง{" "}
            <a
              href="https://th.wikipedia.org/wiki/%E0%B8%A3%E0%B8%B2%E0%B8%A2%E0%B8%8A%E0%B8%B7%E0%B9%88%E0%B8%AD%E0%B9%80%E0%B8%82%E0%B8%95%E0%B8%82%E0%B8%AD%E0%B8%87%E0%B8%81%E0%B8%A3%E0%B8%B8%E0%B8%87%E0%B9%80%E0%B8%97%E0%B8%9E%E0%B8%A1%E0%B8%AB%E0%B8%B2%E0%B8%99%E0%B8%84%E0%B8%A3"
              target="_blank"
              rel="noopener noreferrer"
              className="text-violet-700 underline"
            >
              วิกิพีเดีย
            </a>
          </>
        )}
      </p>
    </div>
  );
}
