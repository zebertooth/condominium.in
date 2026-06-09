"use client";

import { createContext, useContext } from "react";
import { t as translate, type Locale, type TranslationKey } from "@/lib/i18n";

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
  return (key: TranslationKey) => translate(key, locale);
}
