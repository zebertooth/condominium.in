"use client";

import { getOsmEmbedUrl } from "@/lib/locations";

interface PropertyMapProps {
  latitude: number;
  longitude: number;
  address: string;
}

export function PropertyMap({ latitude, longitude, address }: PropertyMapProps) {
  const embedUrl = getOsmEmbedUrl(latitude, longitude);

  return (
    <div className="mt-12">
      <h2 className="mb-4 text-lg font-semibold text-slate-900">ตำแหน่งที่ตั้ง</h2>
      <div className="aspect-video overflow-hidden rounded-xl border border-slate-200">
        <iframe
          src={embedUrl}
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title={`แผนที่ ${address}`}
        />
      </div>
      <p className="mt-2 text-sm text-slate-500">{address}</p>
    </div>
  );
}
