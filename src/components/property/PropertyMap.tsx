import { getGoogleMapsUrl, getOsmEmbedUrl } from "@/lib/locations";

interface PropertyMapProps {
  latitude: number;
  longitude: number;
  address: string;
}

export function PropertyMap({ latitude, longitude, address }: PropertyMapProps) {
  return (
    <section className="mt-10">
      <h2 className="text-xl font-bold text-slate-900">แผนที่ตำแหน่ง</h2>
      <p className="mt-1 text-sm text-slate-600">{address}</p>
      <p className="text-xs text-slate-500">
        พิกัด {latitude.toFixed(5)}, {longitude.toFixed(5)}
      </p>

      <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200">
        <iframe
          title="แผนที่ตำแหน่งทรัพย์"
          src={getOsmEmbedUrl(latitude, longitude)}
          className="h-80 w-full"
          loading="lazy"
        />
      </div>

      <a
        href={getGoogleMapsUrl(latitude, longitude)}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-3 inline-block text-sm font-medium text-teal-700 hover:underline"
      >
        เปิดใน Google Maps →
      </a>
    </section>
  );
}
