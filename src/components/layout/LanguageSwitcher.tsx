"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { activeLocales, type Locale } from "@/lib/i18n";
import { useLocale, useT } from "@/components/i18n/LocaleProvider";

export function LanguageSwitcher() {
  const locale = useLocale();
  const t = useT();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function switchLocale(next: Locale) {
    if (next === locale || loading) return;
    setLoading(true);
    try {
      await fetch("/api/locale", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ locale: next }),
      });
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <label className="relative inline-flex shrink-0 items-center">
      <span className="sr-only">{t("language")}</span>
      <select
        value={locale}
        disabled={loading}
        onChange={(event) => switchLocale(event.target.value as Locale)}
        aria-label={t("language")}
        className="cursor-pointer appearance-none rounded-lg border border-slate-200 bg-white py-1.5 pl-2 pr-7 text-xs font-medium text-slate-700 transition hover:border-teal-300 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20 disabled:cursor-wait disabled:opacity-60"
      >
        {activeLocales.map((item) => (
          <option key={item.code} value={item.code}>
            {`${item.flag} ${item.code.toUpperCase()}`}
          </option>
        ))}
      </select>
      <span
        aria-hidden
        className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-slate-400"
      >
        ▼
      </span>
    </label>
  );
}
