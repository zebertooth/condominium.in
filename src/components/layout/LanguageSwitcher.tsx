"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { LocaleFlag } from "@/components/layout/LocaleFlag";
import { activeLocales, type Locale } from "@/lib/i18n";
import { localePath, stripLocaleFromPath } from "@/lib/locale-routing";
import { useT } from "@/components/i18n/LocaleProvider";

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      className={`h-3.5 w-3.5 shrink-0 text-slate-400 transition-transform ${open ? "rotate-180" : ""}`}
      viewBox="0 0 20 20"
      fill="currentColor"
      aria-hidden
    >
      <path
        fillRule="evenodd"
        d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.25a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z"
        clipRule="evenodd"
      />
    </svg>
  );
}

export function LanguageSwitcher() {
  const t = useT();
  const router = useRouter();
  const pathname = usePathname();
  const pathLocale = stripLocaleFromPath(pathname).locale;
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  const current = activeLocales.find((item) => item.code === pathLocale) ?? activeLocales[0];

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
    if (next === pathLocale || loading) return;
    setLoading(true);
    setOpen(false);
    try {
      const { path } = stripLocaleFromPath(pathname);
      const nextPath = localePath(path, next);

      await fetch("/api/locale", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ locale: next }),
      });

      router.push(nextPath);
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <div ref={rootRef} className="relative z-[200] shrink-0">
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={t("language")}
        disabled={loading}
        onClick={() => setOpen((value) => !value)}
        className="inline-flex h-9 min-w-[5.5rem] items-center gap-2 rounded-full border border-slate-200 bg-white px-2.5 text-sm font-medium text-slate-700 shadow-sm transition hover:border-teal-300 hover:bg-teal-50/60 disabled:cursor-wait disabled:opacity-60"
      >
        <LocaleFlag locale={current.code} />
        <span className="truncate">{current.label}</span>
        <ChevronIcon open={open} />
      </button>

      {open && (
        <ul
          role="listbox"
          aria-label={t("language")}
          className="absolute right-0 z-[200] mt-2 w-44 overflow-hidden rounded-xl border border-slate-200 bg-white py-1 shadow-lg"
        >
          {activeLocales.map((item) => {
            const selected = item.code === pathLocale;
            return (
              <li key={item.code} role="option" aria-selected={selected}>
                <button
                  type="button"
                  onClick={() => switchLocale(item.code)}
                  className={`flex w-full items-center gap-2.5 px-3 py-2 text-left text-sm transition ${
                    selected
                      ? "bg-teal-50 font-medium text-teal-900"
                      : "text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  <LocaleFlag locale={item.code} />
                  <span className="flex-1 truncate">{item.label}</span>
                  {selected && (
                    <span className="text-teal-600" aria-hidden>
                      ✓
                    </span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
