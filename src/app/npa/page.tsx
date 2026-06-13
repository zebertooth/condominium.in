import { PropertyGrid } from "@/components/property/PropertyGrid";
import { filterListings } from "@/lib/listings";
import { t } from "@/lib/i18n";
import { getLocale } from "@/lib/locale";
import { createMetadata } from "@/lib/seo";

export async function generateMetadata() {
  return createMetadata({
    title: "ทรัพย์ NPA ธนาคาร",
    description:
      "รวมประกาศขายทรัพย์ NPA และทรัพย์สินธนาคารในกรุงเทพฯ คอนโด บ้าน ที่ดิน ใกล้ BTS",
    path: "/npa",
    keywords: ["NPA", "ทรัพย์ธนาคาร", "ขายทรัพย์สินธนาคาร", "คอนโด NPA"],
  });
}

export default async function NpaPage() {
  const locale = await getLocale();
  const allSale = await filterListings({ listingType: "sale", propertyType: "npa" });
  const allRent = await filterListings({ listingType: "rent", propertyType: "npa" });
  const listings = [...allSale, ...allRent];

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-bold text-slate-900">{t("npaTitle", locale)}</h1>
      <p className="mt-2 max-w-2xl text-slate-600">{t("npaSubtitle", locale)}</p>

      <div className="mt-10">
        <PropertyGrid properties={listings} locale={locale} listingType="sale" />
      </div>
    </div>
  );
}
