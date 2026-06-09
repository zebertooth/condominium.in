import { PropertySearch } from "@/components/property/PropertySearch";
import { t, type Locale } from "@/lib/i18n";

export function Hero({ locale }: { locale: Locale }) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-teal-700 via-teal-600 to-cyan-700 text-white">
      <div className="absolute inset-0 opacity-20">
        <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-white/30 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 h-72 w-72 rounded-full bg-cyan-300/30 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24">
        <div className="max-w-3xl">
          <p className="text-sm font-medium uppercase tracking-wider text-teal-100">
            {t("heroSubtitle", locale)}
          </p>
          <h1 className="mt-3 text-3xl font-bold leading-tight sm:text-5xl">
            {t("heroCta", locale)}
          </h1>
          <p className="mt-4 text-lg text-teal-50 sm:text-xl">
            {t("tagline", locale)} — {t("aiDesc", locale)}
          </p>
        </div>

        <div className="mt-10 max-w-3xl">
          <PropertySearch />
        </div>

        <div className="mt-8 flex flex-wrap gap-4 text-sm text-teal-100">
          <span>✓ {t("heroBadge1", locale)}</span>
          <span>✓ {t("heroBadge2", locale)}</span>
          <span>✓ {t("heroBadge3", locale)}</span>
        </div>
      </div>
    </section>
  );
}
