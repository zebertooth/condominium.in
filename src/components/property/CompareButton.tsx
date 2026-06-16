"use client";

import { useState } from "react";
import { useCompare, MAX_COMPARE } from "@/components/property/CompareProvider";
import { useT, useTf } from "@/components/i18n/LocaleProvider";

interface CompareButtonProps {
  propertySlug: string;
  className?: string;
}

export function CompareButton({ propertySlug, className = "" }: CompareButtonProps) {
  const t = useT();
  const tf = useTf();
  const { isInCompare, toggleCompare } = useCompare();
  const [limitHit, setLimitHit] = useState(false);
  const active = isInCompare(propertySlug);

  return (
    <div className={className}>
      <button
        type="button"
        aria-pressed={active}
        aria-label={active ? t("compareRemove") : t("compareAdd")}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          const ok = toggleCompare(propertySlug);
          if (!ok) setLimitHit(true);
          else setLimitHit(false);
        }}
        className={`rounded-full p-2 shadow-md backdrop-blur transition ${
          active
            ? "bg-indigo-600 text-white hover:bg-indigo-700"
            : "bg-white/90 text-slate-700 hover:bg-white"
        }`}
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
          <path d="M9 3H5a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2Zm10 0h-4a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2ZM9 13H5a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2v-4a2 2 0 0 0-2-2Zm10 0h-4a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2v-4a2 2 0 0 0-2-2Z" />
        </svg>
      </button>
      {limitHit && (
        <p className="absolute right-0 top-full z-20 mt-1 w-44 rounded-lg bg-slate-900 px-2 py-1 text-xs text-white shadow-lg">
          {tf("compareLimit", { max: MAX_COMPARE })}
        </p>
      )}
    </div>
  );
}
