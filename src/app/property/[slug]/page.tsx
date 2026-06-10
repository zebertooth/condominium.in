import Link from "next/link";
import { notFound } from "next/navigation";
import { PropertyContactSection } from "@/components/property/PropertyContactSection";
import { PropertyImageGallery } from "@/components/property/PropertyImageGallery";
import { PropertyMap } from "@/components/property/PropertyMap";
import { PropertyViewTracker } from "@/components/property/PropertyViewTracker";
import { JsonLd } from "@/components/seo/JsonLd";
import { formatPrice, t } from "@/lib/i18n";
import { getLocale } from "@/lib/locale";
import { getCurrentUser } from "@/lib/auth";
import { getListingBySlug } from "@/lib/listings";
import { createMetadata, siteConfig } from "@/lib/seo";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const property = await getListingBySlug(slug);
  if (!property) return {};

  return createMetadata({
    title: `${property.title} | ${siteConfig.name}`,
    description: property.description,
    path: `/property/${slug}`,
    keywords: [property.district, property.btsStation ?? "", property.listingType === "rent" ? "เช่า" : "ขาย"],
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
            ? locale === "en"
              ? "Preview only — this listing is pending admin approval and is not public yet."
              : "โหมดดูตัวอย่าง — ประกาศนี้รอแอดมินอนุมัติ ยังไม่แสดงต่อสาธารณะ"
            : locale === "en"
              ? "This listing was rejected and is not public."
              : "ประกาศนี้ถูกปฏิเสธ ยังไม่แสดงต่อสาธารณะ"}
        </div>
      )}
      {isPublished && <JsonLd data={jsonLd} />}

      <nav className="mb-6 text-sm text-slate-500">
        <Link href="/" className="hover:text-teal-700">{t("home", locale)}</Link>
        {" / "}
        <Link href={property.listingType === "rent" ? "/rent" : "/buy"} className="hover:text-teal-700">
          {listingLabel}
        </Link>
        {" / "}
        <span className="text-slate-900">{property.title}</span>
      </nav>

      <div className="grid gap-8 lg:grid-cols-2">
        <PropertyImageGallery images={property.images} title={property.title} />

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
            {property.btsStation && (
              <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-800">
                BTS {property.btsStation}
                {property.distanceToBtsMeters ? ` (${property.distanceToBtsMeters}m)` : ""}
              </span>
            )}
            {property.contactMode === "owner_direct" && (
              <span className="rounded-full bg-amber-100 px-3 py-1 text-sm font-medium text-amber-800">
                {t("contactOwner", locale)}
              </span>
            )}
          </div>

          <h1 className="mt-4 text-3xl font-bold text-slate-900">{property.title}</h1>
          <p className="mt-2 text-3xl font-bold text-teal-700">
            {formatPrice(property.price, property.priceUnit, locale)}
          </p>
          <p className="mt-2 text-sm text-slate-600">{property.address}</p>

          <div className="mt-6 grid grid-cols-3 gap-4 rounded-xl bg-slate-50 p-4">
            <div>
              <p className="text-sm text-slate-500">{t("bedrooms", locale)}</p>
              <p className="text-lg font-semibold">{property.bedrooms}</p>
            </div>
            <div>
              <p className="text-sm text-slate-500">{t("bathrooms", locale)}</p>
              <p className="text-lg font-semibold">{property.bathrooms}</p>
            </div>
            <div>
              <p className="text-sm text-slate-500">{t("sqm", locale)}</p>
              <p className="text-lg font-semibold">{property.areaSqm}</p>
            </div>
          </div>

          <p className="mt-6 leading-relaxed text-slate-700">{property.description}</p>

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

      {property.latitude != null && property.longitude != null && (
        <PropertyMap latitude={property.latitude} longitude={property.longitude} address={property.address} />
      )}

      {isPublished && <PropertyContactSection property={property} locale={locale} />}
    </div>
  );
}
