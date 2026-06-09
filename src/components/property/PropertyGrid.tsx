import type { Property } from "@/types/property";
import { PropertyCard } from "./PropertyCard";
import { t, type Locale, defaultLocale } from "@/lib/i18n";

export function PropertyGrid({ properties, locale = defaultLocale }: { properties: Property[]; locale?: Locale }) {
  if (properties.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-12 text-center text-slate-600">
        {t("noPropertiesFound", locale)}
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {properties.map((property) => (
        <PropertyCard key={property.id} property={property} locale={locale} />
      ))}
    </div>
  );
}
