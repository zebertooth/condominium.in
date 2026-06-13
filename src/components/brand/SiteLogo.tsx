import type { SVGProps } from "react";
import { t, type Locale } from "@/lib/i18n";

const LOGO_ALT =
  "condominium.in.th logo — Bangkok condo and home buy & rent marketplace near BTS";

export function siteLogoAltText(): string {
  return LOGO_ALT;
}

export function SiteLogoMark({ className, ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 40 40"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-hidden
      className={className}
      {...props}
    >
      <path fill="#0d9488" d="M3 30 L11 12 L19 12 L19 30 Z" />
      <path fill="#14b8a6" d="M15 30 L23 6 L31 6 L31 30 Z" />
      <path fill="#0f766e" d="M27 30 L33 16 L39 16 L39 30 Z" />
      <rect fill="#115e59" x="2" y="30" width="38" height="3" rx="0.5" />
    </svg>
  );
}

type SiteLogoProps = {
  locale: Locale;
  showTagline?: boolean;
  className?: string;
};

/** DDproperty-style: icon left, brand name + tagline right */
export function SiteLogo({ locale, showTagline = true, className }: SiteLogoProps) {
  return (
    <div className={`flex min-w-0 items-center gap-2.5 ${className ?? ""}`}>
      <SiteLogoMark className="h-9 w-9 shrink-0 sm:h-10 sm:w-10" />
      <div className="min-w-0 leading-none">
        <p className="truncate text-base font-bold tracking-tight text-slate-900 sm:text-[17px]">
          <span>Condominium</span>
          <span className="font-semibold text-slate-400">.in.th</span>
        </p>
        {showTagline && (
          <p className="mt-1 truncate text-[11px] leading-tight text-slate-500">
            {t("tagline", locale)}
          </p>
        )}
      </div>
    </div>
  );
}
