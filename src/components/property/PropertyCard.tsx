import Image from "next/image";
import Link from "next/link";
import { formatPrice, t } from "@/lib/i18n";
import type { Property } from "@/types/property";

export function PropertyCard({ property }: { property: Property }) {
  return (
    <article className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md">
      <Link href={`/property/${property.slug}`} className="block">
        <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
          <Image
            src={property.images[0]}
            alt={property.title}
            fill
            className="object-cover transition duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
          <div className="absolute left-3 top-3 flex gap-2">
            <span className="rounded-full bg-teal-600 px-2.5 py-1 text-xs font-medium text-white">
              {property.listingType === "rent" ? "เช่า" : "ขาย"}
            </span>
            {property.btsStation && (
              <span className="rounded-full bg-white/90 px-2.5 py-1 text-xs font-medium text-slate-800">
                BTS {property.btsStation}
              </span>
            )}
          </div>
        </div>

        <div className="p-4">
          <p className="text-xl font-bold text-teal-700">
            {formatPrice(property.price, property.priceUnit)}
          </p>
          <h3 className="mt-1 line-clamp-2 font-semibold text-slate-900">
            {property.title}
          </h3>
          <p className="mt-1 text-sm text-slate-500">
            {property.district} · {property.btsStation ? `BTS ${property.btsStation}` : property.address}
          </p>
          <div className="mt-3 flex gap-4 text-sm text-slate-600">
            <span>{property.bedrooms} {t("bedrooms")}</span>
            <span>{property.bathrooms} {t("bathrooms")}</span>
            <span>{property.areaSqm} {t("sqm")}</span>
          </div>
        </div>
      </Link>
    </article>
  );
}
