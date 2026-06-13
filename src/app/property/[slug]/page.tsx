import { AdSlot } from "@/components/ads/AdSlot";
import Link from "next/link";
import { notFound } from "next/navigation";
import { DemoListingBanner } from "@/components/property/ListingsEmptyState";
import { MortgageCalculator } from "@/components/property/MortgageCalculator";
import { PropertyContactSection } from "@/components/property/PropertyContactSection";
import { PropertyImageGallery } from "@/components/property/PropertyImageGallery";
import { PropertyMap } from "@/components/property/PropertyMap";
import { PropertyViewTracker } from "@/components/property/PropertyViewTracker";
import { JsonLd } from "@/components/seo/JsonLd";
import { formatPrice, t } from "@/lib/i18n";
import { getLocale } from "@/lib/locale";
import {
  isNonThaiLocale,
  localizedPropertyDescription,
  localizedPropertyTitle,
} from "@/lib/locale-content";
import { getCurrentUser } from "@/lib/auth";
import { getListingBySlug } from "@/lib/listings";
import { formatNearbyStation } from "@/lib/locations";
import { propertyTypeLabel, showsRoomCounts } from "@/lib/property-types";
import { createMetadata, siteConfig } from "@/lib/seo";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const [property, locale] = await Promise.all([getListingBySlug(slug), getLocale()]);
  if (!property) return {};

  return createMetadata({
    title: localizedPropertyTitle(property, locale),
    description: localizedPropertyDescription(property, locale).slice(0, 160),
    path: `/property/${slug}`,
    keywords: [property.district, property.btsStation ?? "", property.listingType === "rent" ? "เช่า" : "ขาย"],
    locale,
  });
}

export default async function PropertyPage({ params }: PageProps) {
  const { slug } = await params;
  const user = await getCurrentUser();
  const viewer = user
    ? { userId: user.id, isAdmin: user.role === "admin" }
    : undefined;
  const [property, locale] = await Promise.all([
    getListingBySlug(slug, viewer),
    getLocale(),
  ]);
  if (!property) notFound();

  const isPublished = property.status === "published" || !property.status;
  const isPreview = !isPublished;
  const nonTh = isNonThaiLocale(locale);
  const displayTitle = localizedPropertyTitle(property, locale);
  const displayDescription = localizedPropertyDescription(property, locale);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": property.listingType === "rent" ? "RentAction" : "Offer",
    name: property.title,
    description: property.description,
    url: `${siteConfig.url}/property/${property.slug}`,
    price: property.price,
    priceCurrency: "THB",
    address: {
      "@type": "PostalAddress",
      addressLocality: property.district,
      addressRegion: "Bangkok",
      addressCountry: "TH",
      streetAddress: property.address,
    },
    ...(property.latitude && property.longitude
      ? { geo: { "@type": "GeoCoordinates", latitude: property.latitude, longitude: property.longitude } }
      : {}),
  };

  const listingLabel = property.listingType === "rent" ? t("rent", locale) : t("sale", locale);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      {isPublished && (
        <PropertyViewTracker
          propertySlug={property.slug}
          propertyType={property.propertyType}
          listingType={property.listingType}
          district={property.district}
          btsStation={property.btsStation}
          source={property.featured ? "sponsored" : "direct"}
        />
      )}
      {isPreview && (
        <div className="mb-6 rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          {property.status === "pending"
            ? nonTh
              ? "Preview only — this listing is pending admin approval and is not public yet."
              : "โหมดดูตัวอย่าง — ประกาศนี้รอแอดมินอนุมัติ ยังไม่แสดงต่อสาธารณะ"
            : nonTh
              ? "This listing was rejected and is not public."
              : "ประกาศนี้ถูกปฏิเสธ ยังไม่แสดงต่อสาธารณะ"}
        </div>
      )}
      {property.isDemo && <DemoListingBanner locale={locale} />}
      {isPublished && <JsonLd data={jsonLd} />}

      <nav className="mb-6 text-sm text-slate-500">
        <Link href="/" className="hover:text-teal-700">{t("home", locale)}</Link>
        {" / "}
        <Link href={property.listingType === "rent" ? "/rent" : "/buy"} className="hover:text-teal-700">
          {listingLabel}
        </Link>
        {" / "}
        <span className="text-slate-900">{displayTitle}</span>
      </nav>

      <AdSlot position="propertyTop" format="auto" className="mb-8" />

      <div className="grid gap-8 xl:grid-cols-3">
        <div className="xl:col-span-2">
      <div className="grid gap-8 lg:grid-cols-2">
        <PropertyImageGallery images={property.images} title={displayTitle} />

        <div>
          <div className="flex flex-wrap gap-2">
            {property.featured && (
              <span className="rounded-full bg-violet-100 px-3 py-1 text-sm font-medium text-violet-800">
                {t("statusFeatured", locale)}
              </span>
            )}
            <span className="rounded-full bg-teal-100 px-3 py-1 text-sm font-medium text-teal-800">
              {listingLabel}
            </span>
            <span className="rounded-full bg-slate-800 px-3 py-1 text-sm font-medium text-white">
              {propertyTypeLabel(property.propertyType, locale)}
            </span>
            {property.btsStation && (
              <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-800">
                {formatNearbyStation(property.btsStation)}
                {property.distanceToBtsMeters ? ` (${property.distanceToBtsMeters}m)` : ""}
              </span>
            )}
            {property.contactMode === "owner_direct" && (
              <span className="rounded-full bg-amber-100 px-3 py-1 text-sm font-medium text-amber-800">
                {t("contactOwner", locale)}
              </span>
            )}
          </div>

          <h1 className="mt-4 text-3xl font-bold text-slate-900">{displayTitle}</h1>
          <p className="mt-2 text-3xl font-bold text-teal-700">
            {formatPrice(property.price, property.priceUnit, locale)}
          </p>
          <p className="mt-2 text-sm text-slate-600">{property.address}</p>

          <div className={`mt-6 grid gap-4 rounded-xl bg-slate-50 p-4 ${showsRoomCounts(property.propertyType) ? "grid-cols-3" : "grid-cols-2"}`}>
            {showsRoomCounts(property.propertyType) && (
              <>
                <div>
                  <p className="text-sm text-slate-500">{t("bedrooms", locale)}</p>
                  <p className="text-lg font-semibold">{property.bedrooms}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">{t("bathrooms", locale)}</p>
                  <p className="text-lg font-semibold">{property.bathrooms}</p>
                </div>
              </>
            )}
            <div>
              <p className="text-sm text-slate-500">{t("sqm", locale)}</p>
              <p className="text-lg font-semibold">{property.areaSqm}</p>
            </div>
            {property.landSqWah != null && (
              <div>
                <p className="text-sm text-slate-500">{t("sqWah", locale)}</p>
                <p className="text-lg font-semibold">{property.landSqWah}</p>
              </div>
            )}
          </div>

          {(property.npaBank || property.npaReferenceUrl) && (
            <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-950">
              {property.npaBank && (
                <p>
                  <span className="font-medium">{t("npaBankLabel", locale)}:</span> {property.npaBank}
                </p>
              )}
              {property.npaReferenceUrl && (
                <a
                  href={property.npaReferenceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-block font-medium text-teal-700 hover:underline"
                >
                  {t("npaReferenceLink", locale)} →
                </a>
              )}
            </div>
          )}

          <p className="mt-6 leading-relaxed text-slate-700">{displayDescription}</p>

          {property.highlights?.trim() && (
            <div className="mt-6">
              <h2 className="font-semibold text-slate-900">{t("listingHighlights", locale)}</h2>
              <p className="mt-2 whitespace-pre-line leading-relaxed text-slate-700">{property.highlights}</p>
            </div>
          )}

          <div className="mt-6">
            <h2 className="font-semibold text-slate-900">{t("amenities", locale)}</h2>
            <ul className="mt-2 flex flex-wrap gap-2">
              {property.features.map((f) => (
                <li key={f} className="rounded-lg bg-slate-100 px-3 py-1 text-sm text-slate-700">{f}</li>
              ))}
            </ul>
          </div>

          {property.contactMode !== "owner_direct" && (
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/contact" className="rounded-xl bg-teal-600 px-6 py-3 font-medium text-white hover:bg-teal-700">
                {t("scheduleViewing", locale)}
              </Link>
              <Link href="/agents" className="rounded-xl border border-slate-300 px-6 py-3 font-medium text-slate-800 hover:bg-slate-50">
                {t("contactAgent", locale)}
              </Link>
            </div>
          )}
        </div>
      </div>
        </div>

        <aside className="hidden xl:block">
          <div className="sticky top-24">
            <AdSlot position="propertySidebar" format="vertical" className="min-h-[600px]" />
          </div>
        </aside>
      </div>

      {property.listingType === "sale" && (
        <div className="mt-8">
          <MortgageCalculator propertyPrice={property.price} locale={locale} />
        </div>
      )}

      {property.latitude != null && property.longitude != null && (
        <PropertyMap latitude={property.latitude} longitude={property.longitude} address={property.address} />
      )}

      {isPublished && <PropertyContactSection property={property} locale={locale} />}
    </div>
  );
}
