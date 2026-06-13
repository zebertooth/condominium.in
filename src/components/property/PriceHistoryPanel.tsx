import { formatPrice, t, type Locale } from "@/lib/i18n";
import type { PriceHistoryEntry } from "@/lib/price-history";

interface PriceHistoryPanelProps {
  history: PriceHistoryEntry[];
  locale: Locale;
  priceUnit: "THB" | "THB/month";
  showReducedBadge?: boolean;
}

function changeLabel(changeType: PriceHistoryEntry["changeType"], locale: Locale): string {
  const keyMap = {
    initial: "priceHistoryInitial",
    increase: "priceHistoryIncrease",
    decrease: "priceHistoryDecrease",
    update: "priceHistoryUpdate",
  } as const;
  return t(keyMap[changeType], locale);
}

export function PriceHistoryPanel({
  history,
  locale,
  priceUnit,
  showReducedBadge,
}: PriceHistoryPanelProps) {
  if (history.length === 0) return null;

  const minPrice = Math.min(...history.map((h) => h.price));
  const maxPrice = Math.max(...history.map((h) => h.price));

  return (
    <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-bold text-slate-900">{t("priceHistoryTitle", locale)}</h2>
        {showReducedBadge && (
          <span className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-semibold text-emerald-800">
            {t("priceReducedBadge", locale)}
          </span>
        )}
      </div>

      {history.length > 1 && (
        <div className="mt-4 flex h-24 items-end gap-1">
          {history.map((entry) => {
            const range = maxPrice - minPrice || 1;
            const height = 20 + ((entry.price - minPrice) / range) * 70;
            const isDecrease = entry.changeType === "decrease";
            return (
              <div key={entry.id} className="flex flex-1 flex-col items-center gap-1">
                <div
                  className={`w-full max-w-[2rem] rounded-t-md ${isDecrease ? "bg-emerald-500" : "bg-teal-500"}`}
                  style={{ height: `${height}%` }}
                  title={formatPrice(entry.price, priceUnit, locale)}
                />
              </div>
            );
          })}
        </div>
      )}

      <ol className="mt-4 space-y-3">
        {[...history].reverse().map((entry) => (
          <li
            key={entry.id}
            className="flex flex-wrap items-baseline justify-between gap-2 border-b border-slate-100 pb-3 last:border-0 last:pb-0"
          >
            <div>
              <p className="font-semibold text-slate-900">
                {formatPrice(entry.price, priceUnit, locale)}
              </p>
              <p className="text-sm text-slate-500">{changeLabel(entry.changeType, locale)}</p>
            </div>
            <time className="text-sm text-slate-500" dateTime={entry.createdAt.toISOString()}>
              {entry.createdAt.toLocaleDateString(locale === "th" ? "th-TH" : "en-GB")}
            </time>
          </li>
        ))}
      </ol>
    </section>
  );
}
