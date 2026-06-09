"use client";

import { useEffect, useRef } from "react";

interface PropertyViewTrackerProps {
  propertySlug: string;
  propertyType?: string;
  listingType?: string;
  district?: string;
  btsStation?: string;
}

export function PropertyViewTracker({
  propertySlug,
  propertyType,
  listingType,
  district,
  btsStation,
}: PropertyViewTrackerProps) {
  const sent = useRef(false);

  useEffect(() => {
    if (sent.current) return;
    sent.current = true;
    void fetch("/api/analytics/property-view", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ propertySlug, propertyType, listingType, district, btsStation }),
    });
  }, [propertySlug, propertyType, listingType, district, btsStation]);

  return null;
}
