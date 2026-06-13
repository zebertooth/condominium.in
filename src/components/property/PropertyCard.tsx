import Image from "next/image";
import Link from "next/link";
import { formatPrice, t, type Locale, defaultLocale } from "@/lib/i18n";
import { formatNearbyStation } from "@/lib/locations";
import { localizedPropertyDistrict, localizedPropertyTitle } from "@/lib/property-i18n";
import { propertyTypeLabel, showsRoomCounts } from "@/lib/property-types";
import type { Property } from "@/types/property";
import { SaveButton } from "./SaveButton";

interface PropertyCardProps {
  property: Property;
  locale?: Locale;
  showSaveButton?: boolean;
  isSaved?: boolean;
}

export function PropertyCard({
  property,
  locale = defaultLocale,
  showSaveButton = false,
  isSaved = false,
}: PropertyCardProps) {
  const title = localizedPropertyTitle(property, locale);
  const district = localizedPropertyDistrict(property, locale);
  return (
    <article className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md">
      {showSaveButton && (
        <div className="absolute right-3 top-3 z-10">
          <SaveButton propertySlug={property.slug} initialSaved={isSaved} />
        </div>
      )}
      <Link href={`/property/${property.slug}`} className="block">
        <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
          <Image
            src={property.images[0]}
            alt={title}
            fill
            className="object-cover transition duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
          <div className="absolute left-3 top-3 flex flex-wrap gap-2">
            {property.isDemo && (
              <span className="rounded-full bg-amber-500 px-2.5 py-1 text-xs font-medium text-white">
                {t("demoListingBadge", locale)}
              </span>
            )}
            {property.featured && (
              <span className="rounded-full bg-violet-600 px-2.5 py-1 text-xs font-medium text-white">
                {t("statusFeatured", locale)}
              </span>
            )}
            <span className="rounded-full bg-teal-600 px-2.5 py-1 text-xs font-medium text-white">
              {property.listingType === "rent" ? t("rent", locale) : t("sale", locale)}
            </span>
            <span className="rounded-full bg-slate-800 px-2.5 py-1 text-xs font-medium text-white">
              {propertyTypeLabel(property.propertyType, locale)}
            </span>
            {property.btsStation && (
              <span className="rounded-full bg-white/90 px-2.5 py-1 text-xs font-medium text-slate-800">
                {formatNearbyStation(property.btsStation)}
              </span>
            )}
          </div>
        </div>

        <div className="p-4">
          <p className="text-xl font-bold text-teal-700">
            {formatPrice(property.price, property.priceUnit, locale)}
          </p>
          <h3 className="mt-1 line-clamp-2 font-semibold text-slate-900">
            {title}
          </h3>
          <p className="mt-1 text-sm text-slate-500">
            {district} · {property.btsStation ? formatNearbyStation(property.btsStation) : property.address}
          </p>
          <div className="mt-3 flex flex-wrap gap-4 text-sm text-slate-600">
            {showsRoomCounts(property.propertyType) && (
              <>
                <span>{property.bedrooms} {t("bedrooms", locale)}</span>
                <span>{property.bathrooms} {t("bathrooms", locale)}</span>
              </>
            )}
            {property.landSqWah ? (
              <span>{property.landSqWah} {t("sqWah", locale)}</span>
            ) : (
              <span>{property.areaSqm} {t("sqm", locale)}</span>
            )}
          </div>
        </div>
      </Link>
    </article>
  );
}
