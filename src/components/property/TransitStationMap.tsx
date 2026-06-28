"use client";

import { useEffect, useMemo } from "react";
import { CircleMarker, MapContainer, TileLayer, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { DEFAULT_MAP_CENTER, type TransitStation } from "@/lib/transit-stations";

function MapFitBounds({
  stations,
  selectedId,
}: {
  stations: TransitStation[];
  selectedId?: string;
}) {
  const map = useMap();

  useEffect(() => {
    if (selectedId) {
      const selected = stations.find((s) => s.id === selectedId);
      if (selected) {
        map.setView([selected.lat, selected.lng], 14, { animate: true });
        return;
      }
    }
    if (stations.length === 0) {
      map.setView([DEFAULT_MAP_CENTER.lat, DEFAULT_MAP_CENTER.lng], 11);
      return;
    }
    if (stations.length === 1) {
      map.setView([stations[0].lat, stations[0].lng], 13);
      return;
    }
    const lats = stations.map((s) => s.lat);
    const lngs = stations.map((s) => s.lng);
    const bounds: [[number, number], [number, number]] = [
      [Math.min(...lats), Math.min(...lngs)],
      [Math.max(...lats), Math.max(...lngs)],
    ];
    map.fitBounds(bounds, { padding: [28, 28], maxZoom: 13 });
  }, [map, stations, selectedId]);

  return null;
}

interface TransitStationMapProps {
  stations: TransitStation[];
  selectedId?: string;
  onSelect: (station: TransitStation) => void;
  className?: string;
}

export function TransitStationMap({
  stations,
  selectedId,
  onSelect,
  className = "h-64 w-full rounded-xl",
}: TransitStationMapProps) {
  const center = useMemo(() => {
    const selected = stations.find((s) => s.id === selectedId);
    if (selected) return [selected.lat, selected.lng] as [number, number];
    return [DEFAULT_MAP_CENTER.lat, DEFAULT_MAP_CENTER.lng] as [number, number];
  }, [stations, selectedId]);

  return (
    <MapContainer center={center} zoom={11} scrollWheelZoom className={`z-0 ${className}`}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MapFitBounds stations={stations} selectedId={selectedId} />
      {stations.map((station) => {
        const isSelected = station.id === selectedId;
        return (
          <CircleMarker
            key={station.id}
            center={[station.lat, station.lng]}
            radius={isSelected ? 11 : 7}
            pathOptions={{
              color: isSelected ? "#0f766e" : station.lineColor,
              fillColor: station.lineColor,
              fillOpacity: isSelected ? 0.95 : 0.75,
              weight: isSelected ? 3 : 1.5,
            }}
            eventHandlers={{
              click: () => onSelect(station),
            }}
          />
        );
      })}
    </MapContainer>
  );
}
