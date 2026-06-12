import type { Property } from "@/types/property";
import { AdPlacement } from "@/components/ads/AdPlacement";
import { PropertyCard } from "./PropertyCard";
import { t, type Locale, defaultLocale } from "@/lib/i18n";

const INFEED_EVERY = 6;

export function PropertyGrid({
  properties,
  locale = defaultLocale,
  infeedSlotId,
}: {
  properties: Property[];
  locale?: Locale;
  infeedSlotId?: string;
}) {
  if (properties.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-12 text-center text-slate-600">
        {t("noPropertiesFound", locale)}
      </div>
    );
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
