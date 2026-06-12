"use client";

import { useEffect } from "react";
import { MapContainer, Marker, TileLayer, useMap, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { DEFAULT_MAP_CENTER } from "@/lib/locations";

// Fix default marker icons with bundlers
const icon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

function MapViewSync({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView([lat, lng], map.getZoom());
  }, [lat, lng, map]);
  return null;
}

function MapClickHandler({
  onChange,
  onPinMoved,
}: {
  onChange: (lat: number, lng: number) => void;
  onPinMoved?: () => void;
}) {
  useMapEvents({
    click(e) {
      onChange(e.latlng.lat, e.latlng.lng);
      onPinMoved?.();
    },
  });
  return null;
}

interface MapPickerProps {
  latitude: number | null;
  longitude: number | null;
  onChange: (lat: number, lng: number) => void;
  onPinMoved?: () => void;
}

export function MapPicker({ latitude, longitude, onChange, onPinMoved }: MapPickerProps) {
  const lat = latitude ?? DEFAULT_MAP_CENTER.lat;
  const lng = longitude ?? DEFAULT_MAP_CENTER.lng;

  return (
    <MapContainer
      center={[lat, lng]}
      zoom={14}
      scrollWheelZoom
      className="h-72 w-full rounded-xl z-0"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MapViewSync lat={lat} lng={lng} />
      <MapClickHandler onChange={onChange} onPinMoved={onPinMoved} />
      <Marker
        position={[lat, lng]}
        icon={icon}
        draggable
        eventHandlers={{
          dragend: (e) => {
            const pos = e.target.getLatLng();
            onChange(pos.lat, pos.lng);
            onPinMoved?.();
          },
        }}
      />
    </MapContainer>
  );
}
