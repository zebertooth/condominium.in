import Link from "next/link";
import { notFound } from "next/navigation";
import { LeadForm } from "@/components/lead/LeadForm";
import { PropertyImageGallery } from "@/components/property/PropertyImageGallery";
import { PropertyMap } from "@/components/property/PropertyMap";
import { JsonLd } from "@/components/seo/JsonLd";
import { formatPrice, t } from "@/lib/i18n";
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
  const property = await getListingBySlug(slug);
  if (!property) notFound();

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

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <JsonLd data={jsonLd} />

      <nav className="mb-6 text-sm text-slate-500">
        <Link href="/" className="hover:text-teal-700">หน้าแรก</Link>
        {" / "}
        <Link href={property.listingType === "rent" ? "/rent" : "/buy"} className="hover:text-teal-700">
          {property.listingType === "rent" ? "เช่า" : "ขาย"}
        </Link>
        {" / "}
        <span className="text-slate-900">{property.title}</span>
      </nav>

      <div className="grid gap-8 lg:grid-cols-2">
        <PropertyImageGallery images={property.images} title={property.title} />

        <div>
          <div className="flex flex-wrap gap-2">
            <span className="rounded-full bg-teal-100 px-3 py-1 text-sm font-medium text-teal-800">
              {property.listingType === "rent" ? "เช่า" : "ขาย"}
            </span>
            {property.btsStation && (
              <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-800">
                BTS {property.btsStation}
                {property.distanceToBtsMeters ? ` (${property.distanceToBtsMeters}m)` : ""}
              </span>
            )}
          </div>

          <h1 className="mt-4 text-3xl font-bold text-slate-900">{property.title}</h1>
          <p className="mt-2 text-3xl font-bold text-teal-700">
            {formatPrice(property.price, property.priceUnit)}
          </p>
          <p className="mt-2 text-sm text-slate-600">{property.address}</p>

          <div className="mt-6 grid grid-cols-3 gap-4 rounded-xl bg-slate-50 p-4">
            <div>
              <p className="text-sm text-slate-500">{t("bedrooms")}</p>
              <p className="text-lg font-semibold">{property.bedrooms}</p>
            </div>
            <div>
              <p className="text-sm text-slate-500">{t("bathrooms")}</p>
              <p className="text-lg font-semibold">{property.bathrooms}</p>
            </div>
            <div>
              <p className="text-sm text-slate-500">{t("sqm")}</p>
              <p className="text-lg font-semibold">{property.areaSqm}</p>
            </div>
          </div>

          <p className="mt-6 leading-relaxed text-slate-700">{property.description}</p>

          <div className="mt-6">
            <h2 className="font-semibold text-slate-900">สิ่งอำนวยความสะดวก</h2>
            <ul className="mt-2 flex flex-wrap gap-2">
              {property.features.map((f) => (
                <li key={f} className="rounded-lg bg-slate-100 px-3 py-1 text-sm text-slate-700">{f}</li>
              ))}
            </ul>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/contact" className="rounded-xl bg-teal-600 px-6 py-3 font-medium text-white hover:bg-teal-700">
              {t("scheduleViewing")}
            </Link>
            <Link href="/agents" className="rounded-xl border border-slate-300 px-6 py-3 font-medium text-slate-800 hover:bg-slate-50">
              {t("contactAgent")}
            </Link>
          </div>
        </div>
      </div>

      {property.latitude != null && property.longitude != null && (
        <PropertyMap latitude={property.latitude} longitude={property.longitude} address={property.address} />
      )}

      <div className="mt-12 max-w-2xl">
        <h2 className="text-2xl font-bold text-slate-900">สนใจทรัพย์นี้? นัดชมกับทีมเอเจนต์</h2>
        <p className="mt-2 text-slate-600">
          กรอกข้อมูลเพื่อให้ทีมงานติดต่อกลับ พาชมทรัพย์จริง และช่วยดูแลขั้นตอนเช่า-ซื้อ
        </p>
        <div className="mt-6">
          <LeadForm
            source="property"
            propertySlug={property.slug}
            propertyTitle={property.title}
            btsStation={property.btsStation}
            defaultMessage={`สนใจ "${property.title}" ต้องการสอบถามข้อมูลเพิ่มเติม / นัดชมทรัพย์`}
            submitLabel="ส่งคำขอนัดชม"
          />
        </div>
      </div>
    </div>
  );
}
