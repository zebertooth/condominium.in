"use client";

import { BTS_LOCATIONS, getOsmEmbedUrl } from "@/lib/locations";

interface LocationPickerProps {
  latitude: number | null;
  longitude: number | null;
  btsStation?: string;
  onChange: (lat: number, lng: number) => void;
}

export function LocationPicker({ latitude, longitude, btsStation, onChange }: LocationPickerProps) {
  const lat = latitude ?? 13.7563;
  const lng = longitude ?? 100.5018;

  function applyBts(station: string) {
    const loc = BTS_LOCATIONS[station];
    if (loc) onChange(loc.lat, loc.lng);
  }

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-slate-700">ตำแหน่งบนแผนที่</label>

      <div className="flex flex-wrap gap-2">
        {Object.keys(BTS_LOCATIONS).map((station) => (
          <button
            key={station}
            type="button"
            onClick={() => applyBts(station)}
            className={`rounded-full px-3 py-1 text-xs font-medium transition ${
              btsStation === station
                ? "bg-teal-600 text-white"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            {station}
          </button>
        ))}
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className="text-xs text-slate-500">Latitude</label>
          <input
            type="number"
            step="any"
            value={latitude ?? ""}
            onChange={(e) => onChange(parseFloat(e.target.value) || lat, lng)}
            className="mt-1 w-full rounded-xl border border-slate-300 px-4 py-2"
          />
        </div>
        <div>
          <label className="text-xs text-slate-500">Longitude</label>
          <input
            type="number"
            step="any"
            value={longitude ?? ""}
            onChange={(e) => onChange(lat, parseFloat(e.target.value) || lng)}
            className="mt-1 w-full rounded-xl border border-slate-300 px-4 py-2"
          />
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200">
        <iframe
          title="เลือกตำแหน่ง"
          src={getOsmEmbedUrl(lat, lng)}
          className="h-56 w-full pointer-events-none"
          loading="lazy"
        />
      </div>
      <p className="text-xs text-slate-500">
        กดปุ่มสถานี BTS เพื่อตั้งพิกัด หรือกรอก lat/lng เอง
      </p>
    </div>
  );
}
