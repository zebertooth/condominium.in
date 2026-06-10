"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { activeLocales, type Locale } from "@/lib/i18n";
import { useLocale } from "@/components/i18n/LocaleProvider";

export function LanguageSwitcher() {
  const locale = useLocale();
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
    <div className="flex max-w-full flex-wrap items-center gap-0.5 rounded-lg border border-slate-200 bg-white p-0.5 text-xs">
      {activeLocales.map((item) => (
        <button
          key={item.code}
          type="button"
          disabled={loading}
          onClick={() => switchLocale(item.code)}
          className={`rounded-md px-2 py-1 font-medium transition ${
            locale === item.code
              ? "bg-teal-600 text-white"
              : "text-slate-600 hover:bg-slate-100"
          }`}
          aria-label={`Switch to ${item.label}`}
        >
          {item.code.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
