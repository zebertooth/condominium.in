"use client";

import { useEffect, useRef, useState } from "react";
import type { Property } from "@/types/property";
import type { BangkokDistrict } from "@/lib/bangkok-districts";
import { formatPrice, type Locale } from "@/lib/i18n";
import { localePath } from "@/lib/locale-routing";
import { localizedPropertyTitle } from "@/lib/property-i18n";

interface PropertyListingsMapProps {
  properties: Property[];
  locale: Locale;
  center?: [number, number];
  zoom?: number;
  focusDistrict?: BangkokDistrict | null;
  onPropertyClick?: (property: Property) => void;
}

function clearLeafletContainer(container: HTMLDivElement) {
  const leafletId = (container as HTMLDivElement & { _leaflet_id?: number })._leaflet_id;
  if (leafletId !== undefined) {
    delete (container as HTMLDivElement & { _leaflet_id?: number })._leaflet_id;
    container.replaceChildren();
  }
}

export function PropertyListingsMap({
  properties,
  locale,
  center = [13.7563, 100.5018],
  zoom = 12,
  focusDistrict = null,
  onPropertyClick,
}: PropertyListingsMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const districtLayerRef = useRef<L.Circle | null>(null);
  const onPropertyClickRef = useRef(onPropertyClick);
  const [mapReady, setMapReady] = useState(false);

  useEffect(() => {
    onPropertyClickRef.current = onPropertyClick;
  }, [onPropertyClick]);

  useEffect(() => {
    const container = mapRef.current;
    if (!container) return;

    let cancelled = false;

    const initMap = async () => {
      const L = (await import("leaflet")).default;
      await import("leaflet/dist/leaflet.css");

      if (cancelled || !mapRef.current) return;

      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
        markersLayerRef.current = null;
      }

      clearLeafletContainer(mapRef.current);

      const map = L.map(mapRef.current, {
        center,
        zoom,
        scrollWheelZoom: true,
      });

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19,
      }).addTo(map);

      markersLayerRef.current = L.layerGroup().addTo(map);
      mapInstanceRef.current = map;
      setMapReady(true);
    };

    void initMap();

    return () => {
      cancelled = true;
      setMapReady(false);
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
      markersLayerRef.current = null;
      districtLayerRef.current = null;
      if (mapRef.current) {
        clearLeafletContainer(mapRef.current);
      }
    };
  }, [center, zoom]);

  useEffect(() => {
    if (!mapReady) return;

    const map = mapInstanceRef.current;
    const layerGroup = markersLayerRef.current;
    if (!map || !layerGroup) return;

    let cancelled = false;

    const updateMarkers = async () => {
      const L = (await import("leaflet")).default;
      layerGroup.clearLayers();

      const propertyIcon = L.divIcon({
        className: "property-marker",
        html: `<div class="flex h-8 w-8 items-center justify-center rounded-full bg-teal-600 text-white shadow-lg border-2 border-white">
          <svg class="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"></path>
          </svg>
        </div>`,
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -32],
      });

      const bounds: [number, number][] = [];

      properties.forEach((property) => {
        if (!property.latitude || !property.longitude) return;

        const title = localizedPropertyTitle(property, locale);
        const price = formatPrice(property.price, property.priceUnit, locale);

        const marker = L.marker([property.latitude, property.longitude], {
          icon: propertyIcon,
        });

        marker.bindPopup(`
          <div class="min-w-[200px] p-2">
            <p class="font-bold text-teal-700">${price}</p>
            <p class="text-sm font-medium text-slate-900 line-clamp-2">${title}</p>
            <p class="text-xs text-slate-500 mt-1">${property.bedrooms} bed · ${property.bathrooms} bath · ${property.areaSqm} sqm</p>
            <a href="${localePath(`/property/${property.slug}`, locale)}" class="mt-2 inline-block text-xs text-teal-600 hover:underline">
              ${locale === "th" ? "ดูรายละเอียด →" : "View details →"}
            </a>
          </div>
        `);

        marker.on("click", () => {
          onPropertyClickRef.current?.(property);
        });

        marker.addTo(layerGroup);
        bounds.push([property.latitude, property.longitude]);
      });

      if (!cancelled && bounds.length > 0) {
        map.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 });
      } else if (!cancelled && focusDistrict) {
        map.setView([focusDistrict.lat, focusDistrict.lng], 13);
      } else if (!cancelled) {
        map.setView(center, zoom);
      }
    };

    void import("leaflet").then(async (mod) => {
      if (!cancelled) await updateMarkers();
    });

    return () => {
      cancelled = true;
    };
  }, [mapReady, properties, locale, center, zoom, focusDistrict]);

  useEffect(() => {
    if (!mapReady) return;
    const map = mapInstanceRef.current;
    if (!map) return;

    let cancelled = false;

    const updateDistrict = async () => {
      const L = (await import("leaflet")).default;
      if (cancelled) return;

      if (districtLayerRef.current) {
        districtLayerRef.current.remove();
        districtLayerRef.current = null;
      }

      if (!focusDistrict) return;

      const zoneColor =
        focusDistrict.zone === "inner"
          ? "#0d9488"
          : focusDistrict.zone === "central"
            ? "#7c3aed"
            : "#64748b";

      const circle = L.circle([focusDistrict.lat, focusDistrict.lng], {
        radius: 2500,
        color: zoneColor,
        fillColor: zoneColor,
        fillOpacity: 0.12,
        weight: 2,
        dashArray: "6 4",
      }).addTo(map);

      circle.bindTooltip(
        locale === "th" ? focusDistrict.labelTh : focusDistrict.labelEn,
        { permanent: false, direction: "top" },
      );

      districtLayerRef.current = circle;
    };

    void updateDistrict();

    return () => {
      cancelled = true;
    };
  }, [mapReady, focusDistrict, locale]);

  return (
    <div className="relative">
      <div ref={mapRef} className="h-[500px] w-full rounded-xl" />
      <style jsx global>{`
        .property-marker {
          background: transparent;
          border: none;
        }
        .leaflet-popup-content-wrapper {
          border-radius: 12px;
          padding: 0;
        }
        .leaflet-popup-content {
          margin: 8px;
        }
      `}</style>
    </div>
  );
}
