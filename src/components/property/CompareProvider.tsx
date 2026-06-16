"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export const MAX_COMPARE = 4;
const STORAGE_KEY = "condo_compare_slugs";

interface CompareContextValue {
  slugs: string[];
  isInCompare: (slug: string) => boolean;
  toggleCompare: (slug: string) => boolean;
  removeCompare: (slug: string) => void;
  clearCompare: () => void;
}

const CompareContext = createContext<CompareContextValue | null>(null);

function readSlugs(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? (JSON.parse(raw) as unknown) : [];
    return Array.isArray(parsed)
      ? parsed.filter((s): s is string => typeof s === "string").slice(0, MAX_COMPARE)
      : [];
  } catch {
    return [];
  }
}

function writeSlugs(slugs: string[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(slugs.slice(0, MAX_COMPARE)));
}

export function CompareProvider({ children }: { children: ReactNode }) {
  const [slugs, setSlugs] = useState<string[]>([]);

  useEffect(() => {
    setSlugs(readSlugs());
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) setSlugs(readSlugs());
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const persist = useCallback((next: string[]) => {
    writeSlugs(next);
    setSlugs(next);
  }, []);

  const isInCompare = useCallback((slug: string) => slugs.includes(slug), [slugs]);

  const toggleCompare = useCallback(
    (slug: string) => {
      if (slugs.includes(slug)) {
        persist(slugs.filter((s) => s !== slug));
        return true;
      }
      if (slugs.length >= MAX_COMPARE) return false;
      persist([...slugs, slug]);
      return true;
    },
    [persist, slugs],
  );

  const removeCompare = useCallback(
    (slug: string) => persist(slugs.filter((s) => s !== slug)),
    [persist, slugs],
  );

  const clearCompare = useCallback(() => persist([]), [persist]);

  const value = useMemo(
    () => ({ slugs, isInCompare, toggleCompare, removeCompare, clearCompare }),
    [slugs, isInCompare, toggleCompare, removeCompare, clearCompare],
  );

  return <CompareContext.Provider value={value}>{children}</CompareContext.Provider>;
}

export function useCompare() {
  const ctx = useContext(CompareContext);
  if (!ctx) throw new Error("useCompare must be used within CompareProvider");
  return ctx;
}
