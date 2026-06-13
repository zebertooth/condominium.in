"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { activeLocales, type Locale } from "@/lib/i18n";
import { useLocale, useT } from "@/components/i18n/LocaleProvider";

export function LanguageSwitcher() {
  const locale = useLocale();
  const t = useT();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  const current = activeLocales.find((item) => item.code === locale) ?? activeLocales[0];

  useEffect(() => {
    if (!open) return;

    function handleClickOutside(event: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open]);

  async function switchLocale(next: Locale) {
    if (next === locale || loading) return;
    setLoading(true);
    setOpen(false);
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
    <div ref={rootRef} className="relative shrink-0">
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={t("language")}
        disabled={loading}
        onClick={() => setOpen((value) => !value)}
        className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700 transition hover:border-teal-300 hover:bg-teal-50 disabled:cursor-wait disabled:opacity-60"
      >
        <span className="text-base leading-none" aria-hidden>
          {current.flag}
        </span>
        <span>{current.code.toUpperCase()}</span>
        <span className="text-[10px] text-slate-400" aria-hidden>
          ▼
        </span>
      </button>

      {open && (
        <ul
          role="listbox"
          aria-label={t("language")}
          className="absolute right-0 z-50 mt-1 min-w-[9rem] overflow-hidden rounded-xl border border-slate-200 bg-white py-1 shadow-lg"
        >
          {activeLocales.map((item) => {
            const selected = item.code === locale;
            return (
              <li key={item.code} role="option" aria-selected={selected}>
                <button
                  type="button"
                  onClick={() => switchLocale(item.code)}
                  className={`flex w-full items-center gap-2 px-3 py-2 text-left text-sm transition ${
                    selected
                      ? "bg-teal-50 font-medium text-teal-800"
                      : "text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  <span className="text-base leading-none" aria-hidden>
                    {item.flag}
                  </span>
                  <span className="font-medium">{item.code.toUpperCase()}</span>
                  <span className="text-slate-500">{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
