import type { BlogFactSheet } from "@/types/property";
import type { Locale, TranslationKey } from "@/lib/i18n";
import { t } from "@/lib/i18n";

interface FactSheetProps {
  facts: BlogFactSheet;
  locale: Locale;
}

const FACT_ROWS: { key: keyof BlogFactSheet; labelKey: TranslationKey }[] = [
  { key: "developer", labelKey: "blogFactDeveloper" },
  { key: "totalUnits", labelKey: "blogFactUnits" },
  { key: "pricePerSqm", labelKey: "blogFactPriceSqm" },
  { key: "btsDistance", labelKey: "blogFactBts" },
  { key: "completion", labelKey: "blogFactCompletion" },
  { key: "parking", labelKey: "blogFactParking" },
  { key: "facilities", labelKey: "blogFactFacilities" },
];

export function FactSheet({ facts, locale }: FactSheetProps) {
  const rows = FACT_ROWS.filter((row) => facts[row.key]?.trim());
  if (rows.length === 0) return null;

  return (
    <aside className="rounded-2xl border border-teal-200 bg-teal-50/80 p-5 lg:sticky lg:top-24">
      <h2 className="text-sm font-bold uppercase tracking-wide text-teal-800">
        {t("blogFactAt", locale)}
      </h2>
      <dl className="mt-4 space-y-3">
        {rows.map(({ key, labelKey }) => (
          <div key={key}>
            <dt className="text-xs font-medium text-teal-700">{t(labelKey, locale)}</dt>
            <dd className="mt-0.5 text-sm text-slate-800">{facts[key]}</dd>
          </div>
        ))}
      </dl>
    </aside>
  );
}
