"use client";

import dynamic from "next/dynamic";
import { useT } from "@/components/i18n/LocaleProvider";
import { DEFAULT_MAP_CENTER } from "@/lib/locations";

const MapPicker = dynamic(() => import("./MapPicker").then((m) => m.MapPicker), {
  ssr: false,
  loading: () => (
    <div className="flex h-72 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-500">
      Loading map…
    </div>
  ),
});

interface LocationPickerProps {
  latitude: number | null;
  longitude: number | null;
  onChange: (lat: number, lng: number) => void;
  onPinMoved?: () => void;
}

export function LocationPicker({ latitude, longitude, onChange, onPinMoved }: LocationPickerProps) {
  const t = useT();
  const lat = latitude ?? DEFAULT_MAP_CENTER.lat;
  const lng = longitude ?? DEFAULT_MAP_CENTER.lng;

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-slate-700">{t("formMapLabel")}</label>

      <MapPicker
        latitude={latitude}
        longitude={longitude}
        onChange={onChange}
        onPinMoved={onPinMoved}
      />

      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className="text-xs text-slate-500">{t("formLatitude")}</label>
          <input
            type="number"
            step="any"
            value={latitude ?? ""}
            onChange={(e) => {
              onChange(parseFloat(e.target.value) || lat, lng);
              onPinMoved?.();
            }}
            className="mt-1 w-full rounded-xl border border-slate-300 px-4 py-2"
          />
        </div>
        <div>
          <label className="text-xs text-slate-500">{t("formLongitude")}</label>
          <input
            type="number"
            step="any"
            value={longitude ?? ""}
            onChange={(e) => {
              onChange(lat, parseFloat(e.target.value) || lng);
              onPinMoved?.();
            }}
            className="mt-1 w-full rounded-xl border border-slate-300 px-4 py-2"
          />
        </div>
      </div>

      <p className="text-xs text-slate-500">{t("formMapHint")}</p>
    </div>
  );
}
