import type { Property } from "@/types/property";
import { AdPlacement } from "@/components/ads/AdPlacement";
import { ListingsEmptyState } from "./ListingsEmptyState";
import { PropertyCard } from "./PropertyCard";
import { type Locale, defaultLocale } from "@/lib/i18n";

const INFEED_EVERY = 6;

export function PropertyGrid({
  properties,
  locale = defaultLocale,
  infeedSlotId,
  listingType,
}: {
  properties: Property[];
  locale?: Locale;
  infeedSlotId?: string;
  listingType?: "sale" | "rent";
}) {
  if (properties.length === 0) {
    return <ListingsEmptyState locale={locale} listingType={listingType} />;
  }

  const nodes: React.ReactNode[] = [];

  properties.forEach((property, index) => {
    if (infeedSlotId && index > 0 && index % INFEED_EVERY === 0) {
      nodes.push(
        <div key={`ad-infeed-${index}`} className="col-span-full">
          <AdPlacement
            slotId={infeedSlotId}
            position="listingInfeed"
            format="fluid"
            layout="in-feed"
            className="mx-auto max-w-3xl"
          />
        </div>,
      );
    }
    nodes.push(<PropertyCard key={property.id} property={property} locale={locale} />);
  });

  return <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{nodes}</div>;
}
