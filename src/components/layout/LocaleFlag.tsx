"use client";

import { useState } from "react";
import { flagImageUrl, localeFlagCodes } from "@/lib/locale-flags";

interface LocaleFlagProps {
  locale: string;
  className?: string;
}

/** Tiny badge when CDN image fails — avoids Windows emoji rendering as "TH"/"GB" text */
function FlagBadge({ locale, className }: LocaleFlagProps) {
  const code = (localeFlagCodes[locale] ?? locale).toUpperCase();
  return (
    <span
      className={`inline-flex h-[18px] w-6 shrink-0 items-center justify-center rounded-[2px] bg-gradient-to-b from-slate-100 to-slate-200 text-[9px] font-bold leading-none text-slate-600 ring-1 ring-black/10 ${className ?? ""}`}
      aria-hidden
    >
      {code}
    </span>
  );
}

export function LocaleFlag({ locale, className }: LocaleFlagProps) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return <FlagBadge locale={locale} className={className} />;
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={flagImageUrl(locale)}
      alt=""
      width={24}
      height={18}
      className={`inline-block h-[18px] w-6 shrink-0 rounded-[2px] object-cover ring-1 ring-black/10 ${className ?? ""}`}
      onError={() => setFailed(true)}
      loading="lazy"
      decoding="async"
    />
  );
}
