import Link from "next/link";
import { PropertyListingCarousel } from "@/components/property/PropertyListingCarousel";
import type { Locale } from "@/lib/i18n";
import { t } from "@/lib/i18n";
import { localePath } from "@/lib/locale-routing";
import type { Property } from "@/types/property";

interface BlogSuggestedListingsProps {
  locale: Locale;
  properties: Property[];
  className?: string;
}

export function BlogSuggestedListings({
  locale,
  properties,
  className = "",
}: BlogSuggestedListingsProps) {
  if (properties.length === 0) return null;

  const lp = (path: string) => localePath(path, locale);

  return (
    <section className={`border-t border-slate-200 bg-slate-50 py-14 ${className}`}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">
              {t("blogSuggestedListings", locale)}
            </h2>
            <p className="mt-1 text-slate-600">{t("blogSuggestedListingsDesc", locale)}</p>
          </div>
          <div className="flex gap-3 text-sm font-medium">
            <Link href={lp("/buy")} className="text-teal-700 hover:underline">
              {t("buy", locale)} →
            </Link>
            <Link href={lp("/rent")} className="text-teal-700 hover:underline">
              {t("rent", locale)} →
            </Link>
          </div>
        </div>
        <div className="-mx-4 mt-8 px-4 sm:mx-0 sm:px-1">
          <PropertyListingCarousel properties={properties} locale={locale} />
        </div>
      </div>
    </section>
  );
}
