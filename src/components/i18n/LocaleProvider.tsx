"use client";

import { createContext, useCallback, useContext } from "react";
import { t as translate, tf as translatef, type Locale, type TranslationKey } from "@/lib/i18n";

const LocaleContext = createContext<Locale>("th");

export function LocaleProvider({
  locale,
  children,
}: {
  locale: Locale;
  children: React.ReactNode;
}) {
  return <LocaleContext.Provider value={locale}>{children}</LocaleContext.Provider>;
}

export function useLocale(): Locale {
  return useContext(LocaleContext);
}

export function useT() {
  const locale = useLocale();
  return useCallback((key: TranslationKey) => translate(key, locale), [locale]);
}

export function useTf() {
  const locale = useLocale();
  return useCallback(
    (key: TranslationKey, vars: Record<string, string | number>) =>
      translatef(key, locale, vars),
    [locale],
  );
}
