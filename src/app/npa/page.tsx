import Link from "next/link";
import { PropertyGrid } from "@/components/property/PropertyGrid";
import { getNpaBankNames, getNpaListings } from "@/lib/npa";
import { t } from "@/lib/i18n";
import { getLocale } from "@/lib/locale";
import { localePath, localePathWithQuery } from "@/lib/locale-routing";
import { createMetadata } from "@/lib/seo";

interface NpaPageProps {
  searchParams: Promise<{
    bank?: string;
    type?: string;
  }>;
}

export async function generateMetadata() {
  return createMetadata({
    title: "ทรัพย์ NPA ธนาคาร",
    description:
      "รวมประกาศขายทรัพย์ NPA และทรัพย์สินธนาคารในกรุงเทพฯ คอนโด บ้าน ที่ดิน ใกล้ BTS",
    path: "/npa",
    keywords: ["NPA", "ทรัพย์ธนาคาร", "ขายทรัพย์สินธนาคาร", "คอนโด NPA"],
  });
}

export default async function NpaPage({ searchParams }: NpaPageProps) {
  const params = await searchParams;
  const locale = await getLocale();
  const listingType = params.type === "rent" ? "rent" : params.type === "sale" ? "sale" : undefined;
  const bank = params.bank?.trim();

  const [listings, banks] = await Promise.all([
    getNpaListings({ listingType, npaBank: bank }),
    getNpaBankNames(),
  ]);

  const lp = (path: string) => localePath(path, locale);
  const nonTh = locale !== "th";

  function bankHref(nextBank?: string) {
    return localePathWithQuery("/npa", locale, {
      type: listingType,
      bank: nextBank,
    });
  }

  function typeHref(type?: "sale" | "rent") {
    return localePathWithQuery("/npa", locale, {
      type,
      bank: bank || undefined,
    });
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-bold text-slate-900">{t("npaTitle", locale)}</h1>
      <p className="mt-2 max-w-2xl text-slate-600">{t("npaSubtitle", locale)}</p>

      <div className="mt-8 flex flex-wrap gap-2">
        <Link
          href={typeHref(undefined)}
          className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
            !listingType ? "bg-teal-600 text-white" : "bg-slate-100 text-slate-700 hover:bg-slate-200"
          }`}
        >
          {nonTh ? "All" : "ทั้งหมด"}
        </Link>
        <Link
          href={typeHref("sale")}
          className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
            listingType === "sale" ? "bg-teal-600 text-white" : "bg-slate-100 text-slate-700 hover:bg-slate-200"
          }`}
        >
          {t("buy", locale)}
        </Link>
        <Link
          href={typeHref("rent")}
          className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
            listingType === "rent" ? "bg-teal-600 text-white" : "bg-slate-100 text-slate-700 hover:bg-slate-200"
          }`}
        >
          {t("rent", locale)}
        </Link>
      </div>

      {banks.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          <Link
            href={bankHref(undefined)}
            className={`rounded-full px-3 py-1.5 text-sm font-medium transition ${
              !bank ? "bg-amber-600 text-white" : "bg-amber-50 text-amber-900 hover:bg-amber-100"
            }`}
          >
            {t("npaAllBanks", locale)}
          </Link>
          {banks.map((bankName) => (
            <Link
              key={bankName}
              href={bankHref(bankName)}
              className={`rounded-full px-3 py-1.5 text-sm font-medium transition ${
                bank === bankName
                  ? "bg-amber-600 text-white"
                  : "bg-amber-50 text-amber-900 hover:bg-amber-100"
              }`}
            >
              {bankName}
            </Link>
          ))}
        </div>
      )}

      <div className="mt-10">
        {listings.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center">
            <p className="text-lg font-medium text-slate-800">{t("npaEmpty", locale)}</p>
            <p className="mt-2 text-sm text-slate-600">{t("npaEmptyHint", locale)}</p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link
                href={lp("/contact")}
                className="rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-700"
              >
                {t("contact", locale)}
              </Link>
              <Link
                href={lp("/buy")}
                className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-white"
              >
                {t("buy", locale)}
              </Link>
            </div>
          </div>
        ) : (
          <>
            <p className="mb-6 text-sm text-slate-600">
              {listings.length} {nonTh ? "NPA listings" : "ประกาศ NPA"}
            </p>
            <PropertyGrid properties={listings} locale={locale} listingType={listingType ?? "sale"} />
          </>
        )}
      </div>
    </div>
  );
}
