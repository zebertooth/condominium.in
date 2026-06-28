"use client";

import { useState } from "react";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { DistrictSearchPicker } from "@/components/property/DistrictSearchPicker";
import { SelectedChoice } from "@/components/property/SelectedChoice";
import { StationSearchPicker } from "@/components/property/StationSearchPicker";
import { districtFilterValue, getDistrictByName } from "@/lib/bangkok-districts";
import { localePathWithQuery } from "@/lib/locale-routing";
import { getStationByName, stationFilterValue } from "@/lib/transit-stations";

export type LocationFilterMode = "any" | "district" | "station";

interface LocationFilterPickerProps {
  district: string;
  station: string;
  onDistrictChange: (value: string) => void;
  onStationChange: (value: string) => void;
  lockedDistrict?: string;
  lockedStation?: string;
  listingType?: "sale" | "rent";
}

export function LocationFilterPicker({
  district,
  station,
  onDistrictChange,
  onStationChange,
  lockedDistrict,
  lockedStation,
  listingType = "rent",
}: LocationFilterPickerProps) {
  const locale = useLocale();
  const nonTh = locale !== "th";
  const mapType = listingType === "sale" ? "sale" : "rent";

  const initialMode: LocationFilterMode = lockedStation || station
    ? "station"
    : lockedDistrict || district
      ? "district"
      : "any";

  const [mode, setMode] = useState<LocationFilterMode>(initialMode);
  const [pickerOpen, setPickerOpen] = useState(!district && !station);

  const districtResolved = getDistrictByName(lockedDistrict || district);
  const stationResolved = getStationByName(lockedStation || station);
  const activeDistrict = lockedDistrict || district;
  const activeStation = lockedStation || station;

  function switchMode(next: LocationFilterMode) {
    setMode(next);
    setPickerOpen(next !== "any");
    if (next === "any") {
      if (!lockedDistrict) onDistrictChange("");
      if (!lockedStation) onStationChange("");
    } else if (next === "district") {
      if (!lockedStation) onStationChange("");
    } else if (next === "station") {
      if (!lockedDistrict) onDistrictChange("");
    }
  }

  function clearDistrict() {
    onDistrictChange("");
    setPickerOpen(true);
  }

  function clearStation() {
    onStationChange("");
    setPickerOpen(true);
  }

  const modeOptions: { id: LocationFilterMode; label: string }[] = [
    { id: "any", label: nonTh ? "Any area" : "ทุกพื้นที่" },
    { id: "district", label: nonTh ? "By district" : "ตามเขต" },
    { id: "station", label: nonTh ? "By station" : "ตามสถานี" },
  ];

  const showDistrictPicker = mode === "district" && !lockedDistrict;
  const showStationPicker = mode === "station" && !lockedStation;
  const districtLabel = districtResolved
    ? nonTh
      ? districtResolved.labelEn
      : districtResolved.labelTh
    : activeDistrict;
  const stationLabel = stationResolved
    ? stationResolved.label
    : activeStation
      ? activeStation.startsWith("BTS") || activeStation.startsWith("MRT")
        ? activeStation
        : `BTS ${activeStation}`
      : "";

  const districtMapHref =
    activeDistrict && districtResolved
      ? localePathWithQuery("/map", locale, {
          district: districtFilterValue(districtResolved),
          type: mapType,
        })
      : undefined;

  const stationMapHref =
    activeStation && stationResolved
      ? localePathWithQuery("/map", locale, {
          bts: stationFilterValue(stationResolved),
          type: mapType,
        })
      : activeStation
        ? localePathWithQuery("/map", locale, {
            bts: activeStation,
            type: mapType,
          })
        : undefined;

  const mapLabel = nonTh ? "Map" : "แผนที่";

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-1.5">
        {modeOptions.map((opt) => {
          const disabled =
            (opt.id === "district" && !!lockedDistrict && mode !== "district") ||
            (opt.id === "station" && !!lockedStation && mode !== "station") ||
            (opt.id === "any" && (!!lockedDistrict || !!lockedStation));
          if (opt.id === "any" && (lockedDistrict || lockedStation)) return null;

          return (
            <button
              key={opt.id}
              type="button"
              disabled={disabled}
              onClick={() => switchMode(opt.id)}
              className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                mode === opt.id
                  ? "border-slate-900 bg-slate-900 text-white shadow-sm"
                  : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50"
              } disabled:cursor-not-allowed disabled:opacity-50`}
            >
              {opt.label}
            </button>
          );
        })}
      </div>

      {mode === "district" && activeDistrict && !pickerOpen && (
        <SelectedChoice
          label={nonTh ? "Selected district" : "เขตที่เลือก"}
          value={districtLabel}
          accent="violet"
          onClear={clearDistrict}
          onChange={() => setPickerOpen(true)}
          disabled={!!lockedDistrict}
          changeLabel={nonTh ? "Change" : "เปลี่ยน"}
          clearLabel={nonTh ? "Clear district" : "ล้างเขต"}
          mapHref={districtMapHref}
          mapLabel={mapLabel}
        />
      )}

      {mode === "station" && activeStation && !pickerOpen && (
        <SelectedChoice
          label={nonTh ? "Selected station" : "สถานีที่เลือก"}
          value={stationLabel}
          accent="teal"
          onClear={clearStation}
          onChange={() => setPickerOpen(true)}
          disabled={!!lockedStation}
          changeLabel={nonTh ? "Change" : "เปลี่ยน"}
          clearLabel={nonTh ? "Clear station" : "ล้างสถานี"}
          mapHref={stationMapHref}
          mapLabel={mapLabel}
        />
      )}

      {showDistrictPicker && (pickerOpen || !activeDistrict) && (
        <DistrictSearchPicker
          value={activeDistrict}
          onChange={(v) => {
            onDistrictChange(v);
            if (v) setPickerOpen(false);
          }}
          disabled={!!lockedDistrict}
        />
      )}

      {showStationPicker && (pickerOpen || !activeStation) && (
        <StationSearchPicker
          value={activeStation}
          onChange={(v) => {
            onStationChange(v);
            if (v) setPickerOpen(false);
          }}
          disabled={!!lockedStation}
        />
      )}
    </div>
  );
}
