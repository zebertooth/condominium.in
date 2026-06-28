import Link from "next/link";
import type { Locale } from "@/lib/i18n";
import { t } from "@/lib/i18n";
import { localePath } from "@/lib/locale-routing";
import type { ListingType } from "@/types/property";

interface EmptyListingsCtaProps {
  locale: Locale;
  listingType: ListingType;
  district?: string;
  station?: string;
}

export function EmptyListingsCta({ locale, listingType, district, station }: EmptyListingsCtaProps) {
  const nonTh = locale !== "th";
  const lp = (path: string) => localePath(path, locale);
  const buyRent = listingType === "sale" ? lp("/buy") : lp("/rent");
  const mapParams = new URLSearchParams({ type: listingType });
  if (district) mapParams.set("district", district);
  if (station) mapParams.set("bts", station);

  return (
    <div className="rounded-2xl border border-dashed border-amber-200 bg-amber-50 p-8 text-center">
      <p className="text-lg font-semibold text-amber-950">
        {nonTh ? "No listings match yet" : "ยังไม่มีประกาศในพื้นที่นี้"}
      </p>
      <p className="mt-2 text-sm text-amber-900">
        {nonTh
          ? "Be the first to list, contact our agent team, or try a nearby area."
          : "ลงประกาศเป็นคนแรก ติดต่อทีมเอเจนต์ หรือลองพื้นที่ใกล้เคียง"}
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <Link href={lp("/list-property")} className="btn-primary">
          {t("heroListCta", locale)}
        </Link>
        <Link
          href={lp("/contact")}
          className="rounded-xl border border-amber-300 bg-white px-5 py-2.5 text-sm font-medium text-amber-900 hover:bg-amber-100"
        >
          {t("contact", locale)}
        </Link>
        <Link
          href={lp("/ai-search")}
          className="rounded-xl border border-amber-300 bg-white px-5 py-2.5 text-sm font-medium text-amber-900 hover:bg-amber-100"
        >
          {t("aiSearch", locale)}
        </Link>
        <Link
          href={`${lp("/map")}?${mapParams.toString()}`}
          className="rounded-xl border border-amber-300 bg-white px-5 py-2.5 text-sm font-medium text-amber-900 hover:bg-amber-100"
        >
          {nonTh ? "Map search" : "ค้นหาบนแผนที่"}
        </Link>
        <Link
          href={buyRent}
          className="rounded-xl border border-amber-300 bg-white px-5 py-2.5 text-sm font-medium text-amber-900 hover:bg-amber-100"
        >
          {nonTh ? "All listings" : "ดูประกาศทั้งหมด"}
        </Link>
      </div>
    </div>
  );
}
