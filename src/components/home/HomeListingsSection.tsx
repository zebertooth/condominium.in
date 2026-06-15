import Link from "next/link";
import { PropertyGrid } from "@/components/property/PropertyGrid";
import { t, type Locale } from "@/lib/i18n";
import type { Property } from "@/types/property";

interface HomeListingsSectionProps {
  titleKey: Parameters<typeof t>[0];
  descKey: Parameters<typeof t>[0];
  properties: Property[];
  locale: Locale;
  viewAllHref?: string;
  infeedSlotId?: string;
  className?: string;
}

export function HomeListingsSection({
  titleKey,
  descKey,
  properties,
  locale,
  viewAllHref,
  infeedSlotId,
  className = "",
}: HomeListingsSectionProps) {
  if (properties.length === 0) return null;

  return (
    <section className={`mx-auto max-w-7xl px-4 py-16 sm:px-6 ${className}`}>
      <div className="mb-8 flex items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">{t(titleKey, locale)}</h2>
          <p className="mt-1 text-slate-600">{t(descKey, locale)}</p>
        </div>
        {viewAllHref && (
          <Link
            href={viewAllHref}
            className="shrink-0 text-sm font-medium text-teal-700 hover:underline"
          >
            {t("viewAll", locale)} →
          </Link>
        )}
      </div>
      <PropertyGrid properties={properties} locale={locale} infeedSlotId={infeedSlotId} />
    </section>
  );
}
