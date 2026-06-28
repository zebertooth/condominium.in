"use client";

import dynamic from "next/dynamic";
import { useMemo, useState } from "react";
import { useLocale } from "@/components/i18n/LocaleProvider";
import {
  TRANSIT_LINES,
  findStationId,
  searchTransitStations,
  stationFilterValue,
  type TransitLineId,
  type TransitStation,
} from "@/lib/transit-stations";

const TransitStationMap = dynamic(
  () => import("./TransitStationMap").then((m) => m.TransitStationMap),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-64 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-500">
        Loading map…
      </div>
    ),
  },
);

interface StationSearchPickerProps {
  value: string;
  onChange: (stationName: string) => void;
  disabled?: boolean;
  className?: string;
}

export function StationSearchPicker({
  value,
  onChange,
  disabled,
  className,
}: StationSearchPickerProps) {
  const locale = useLocale();
  const nonTh = locale !== "th";
  const [query, setQuery] = useState("");
  const [lineFilter, setLineFilter] = useState<TransitLineId | "all">("all");
  const [view, setView] = useState<"list" | "map">("list");

  const selectedId = findStationId(value);
  const filtered = useMemo(
    () => searchTransitStations(query, lineFilter),
    [query, lineFilter],
  );

  function selectStation(station: TransitStation) {
    onChange(stationFilterValue(station));
    setQuery("");
  }

  const lineChips = [
    { id: "all" as const, label: nonTh ? "All lines" : "ทุกสาย" },
    ...TRANSIT_LINES.map((line) => ({
      id: line.id,
      label: nonTh ? line.nameEn : line.nameTh,
      color: line.color,
    })),
  ];

  return (
    <div className={`space-y-3 ${className ?? ""}`}>
      <div className="flex flex-wrap gap-1.5">
        {lineChips.map((chip) => {
          const active = lineFilter === chip.id;
          return (
            <button
              key={chip.id}
              type="button"
              disabled={disabled}
              onClick={() => setLineFilter(chip.id)}
              className={`rounded-full border px-2.5 py-1 text-xs font-medium transition ${
                active
                  ? "border-teal-600 bg-teal-600 text-white shadow-sm"
                  : "border-slate-200 bg-white text-slate-600 hover:border-teal-300 hover:bg-teal-50"
              }`}
              style={
                active && "color" in chip && chip.color
                  ? { backgroundColor: chip.color, borderColor: chip.color, color: "#fff" }
                  : undefined
              }
            >
              {chip.label}
            </button>
          );
        })}
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
            {mode === "list"
              ? nonTh
                ? "List"
                : "รายการ"
              : nonTh
                ? "Map"
                : "แผนที่"}
          </button>
        ))}
      </div>

      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        disabled={disabled}
        placeholder={
          nonTh ? "Search station (Thai or English)…" : "ค้นหาสถานี (ไทยหรืออังกฤษ)…"
        }
        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none ring-teal-500 focus:ring-2 disabled:opacity-60"
      />

      {view === "map" ? (
        <div className="overflow-hidden rounded-xl border border-slate-200">
          <TransitStationMap
            stations={filtered}
            selectedId={selectedId || undefined}
            onSelect={selectStation}
          />
          <p className="border-t border-slate-100 bg-slate-50 px-3 py-2 text-xs text-slate-500">
            {nonTh
              ? "Tap a dot on the map to select a station"
              : "แตะจุดบนแผนที่เพื่อเลือกสถานี"}
          </p>
        </div>
      ) : (
        <div className="max-h-52 overflow-y-auto rounded-xl border border-slate-200 bg-white [scrollbar-width:thin]">
          {filtered.length === 0 ? (
            <p className="px-3 py-6 text-center text-sm text-slate-500">
              {nonTh ? "No stations found" : "ไม่พบสถานี"}
            </p>
          ) : (
            <ul className="divide-y divide-slate-100">
              {filtered.map((station) => {
                const isSelected = station.name === value;
                return (
                  <li key={station.id}>
                    <button
                      type="button"
                      disabled={disabled}
                      onClick={() => selectStation(station)}
                      className={`flex w-full items-center gap-3 px-3 py-2.5 text-left transition hover:bg-slate-50 ${
                        isSelected ? "bg-teal-50" : ""
                      }`}
                    >
                      <span
                        className="h-2.5 w-2.5 shrink-0 rounded-full"
                        style={{ backgroundColor: station.lineColor }}
                        aria-hidden
                      />
                      <span className="min-w-0 flex-1">
                        <span className="block text-sm font-medium text-slate-900">
                          {station.label}
                        </span>
                        <span className="block text-xs text-slate-500">
                          {nonTh ? station.lineLabelEn : station.lineLabelTh}
                          {nonTh ? ` · ${station.nameEn}` : ""}
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
            {filtered.length} stations · data from{" "}
            <a
              href="https://th.wikipedia.org/wiki/%E0%B8%A3%E0%B8%B2%E0%B8%A2%E0%B8%8A%E0%B8%B7%E0%B9%88%E0%B8%AD%E0%B8%AA%E0%B8%96%E0%B8%B2%E0%B8%99%E0%B8%B5%E0%B8%A3%E0%B8%96%E0%B9%84%E0%B8%9F%E0%B8%9F%E0%B9%89%E0%B8%B2%E0%B9%83%E0%B8%99%E0%B8%81%E0%B8%A3%E0%B8%B8%E0%B8%87%E0%B9%80%E0%B8%97%E0%B8%9E%E0%B8%A1%E0%B8%AB%E0%B8%B2%E0%B8%99%E0%B8%84%E0%B8%A3%E0%B9%81%E0%B8%A5%E0%B8%B0%E0%B8%9B%E0%B8%A3%E0%B8%B4%E0%B8%A1%E0%B8%93%E0%B8%91%E0%B8%A5"
              target="_blank"
              rel="noopener noreferrer"
              className="text-teal-700 underline"
            >
              Wikipedia
            </a>
          </>
        ) : (
          <>
            {filtered.length} สถานี · อ้างอิง{" "}
            <a
              href="https://th.wikipedia.org/wiki/%E0%B8%A3%E0%B8%B2%E0%B8%A2%E0%B8%8A%E0%B8%B7%E0%B9%88%E0%B8%AD%E0%B8%AA%E0%B8%96%E0%B8%B2%E0%B8%99%E0%B8%B5%E0%B8%A3%E0%B8%96%E0%B9%84%E0%B8%9F%E0%B8%9F%E0%B9%89%E0%B8%B2%E0%B9%83%E0%B8%99%E0%B8%81%E0%B8%A3%E0%B8%B8%E0%B8%87%E0%B9%80%E0%B8%97%E0%B8%9E%E0%B8%A1%E0%B8%AB%E0%B8%B2%E0%B8%99%E0%B8%84%E0%B8%A3%E0%B9%81%E0%B8%A5%E0%B8%B0%E0%B8%9B%E0%B8%A3%E0%B8%B4%E0%B8%A1%E0%B8%93%E0%B8%91%E0%B8%A5"
              target="_blank"
              rel="noopener noreferrer"
              className="text-teal-700 underline"
            >
              วิกิพีเดีย
            </a>
          </>
        )}
      </p>
    </div>
  );
}
