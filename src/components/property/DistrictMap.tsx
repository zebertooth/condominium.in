"use client";

import { useEffect } from "react";
import { Circle, MapContainer, TileLayer, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { DEFAULT_MAP_CENTER, type BangkokDistrict } from "@/lib/bangkok-districts";

function MapFitDistrict({
  districts,
  selectedSlug,
}: {
  districts: BangkokDistrict[];
  selectedSlug?: string;
}) {
  const map = useMap();

  useEffect(() => {
    const selected = districts.find((d) => d.slug === selectedSlug);
    if (selected) {
      map.setView([selected.lat, selected.lng], 13, { animate: true });
      return;
    }
    if (districts.length === 0) {
      map.setView([DEFAULT_MAP_CENTER.lat, DEFAULT_MAP_CENTER.lng], 11);
      return;
    }
    if (districts.length === 1) {
      map.setView([districts[0].lat, districts[0].lng], 12);
      return;
    }
    const lats = districts.map((d) => d.lat);
    const lngs = districts.map((d) => d.lng);
    map.fitBounds(
      [
        [Math.min(...lats), Math.min(...lngs)],
        [Math.max(...lats), Math.max(...lngs)],
      ],
      { padding: [24, 24], maxZoom: 12 },
    );
  }, [map, districts, selectedSlug]);

  return null;
}

interface DistrictMapProps {
  districts: BangkokDistrict[];
  selectedSlug?: string;
  onSelect: (district: BangkokDistrict) => void;
  className?: string;
}

export function DistrictMap({
  districts,
  selectedSlug,
  onSelect,
  className = "h-64 w-full rounded-xl",
}: DistrictMapProps) {
  const center = districts[0]
    ? ([districts[0].lat, districts[0].lng] as [number, number])
    : ([DEFAULT_MAP_CENTER.lat, DEFAULT_MAP_CENTER.lng] as [number, number]);

  return (
    <MapContainer center={center} zoom={11} scrollWheelZoom className={`z-0 ${className}`}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MapFitDistrict districts={districts} selectedSlug={selectedSlug} />
      {districts.map((district) => {
        const isSelected = district.slug === selectedSlug;
        const zoneColor =
          district.zone === "inner" ? "#0d9488" : district.zone === "central" ? "#7c3aed" : "#64748b";
        return (
          <Circle
            key={district.id}
            center={[district.lat, district.lng]}
            radius={isSelected ? 2200 : 1400}
            pathOptions={{
              color: isSelected ? "#0f766e" : zoneColor,
              fillColor: zoneColor,
              fillOpacity: isSelected ? 0.35 : 0.2,
              weight: isSelected ? 3 : 1.5,
            }}
            eventHandlers={{ click: () => onSelect(district) }}
          />
        );
      })}
    </MapContainer>
  );
}
