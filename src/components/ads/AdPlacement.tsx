"use client";

import { useEffect, useRef, useState } from "react";
import { useT } from "@/components/i18n/LocaleProvider";
import { hasAnalyticsConsent } from "@/components/layout/CookieConsent";
import { adsenseClientId, adsenseConfigured, pushAdSenseSlot, type AdSlotKey } from "@/lib/adsense";

export interface AdPlacementProps {
  slotId: string;
  position: AdSlotKey;
  format?: "auto" | "fluid" | "rectangle" | "vertical";
  layout?: string;
  layoutKey?: string;
  className?: string;
}

export function AdPlacement({
  slotId,
  position,
  format = "auto",
  layout,
  layoutKey,
  className,
}: AdPlacementProps) {
  const t = useT();
  const client = adsenseClientId();
  const [consent, setConsent] = useState(false);
  const pushed = useRef(false);

  useEffect(() => {
    setConsent(hasAnalyticsConsent());
    const onChange = () => setConsent(hasAnalyticsConsent());
    window.addEventListener("condo-cookie-consent", onChange);
    return () => window.removeEventListener("condo-cookie-consent", onChange);
  }, []);

  useEffect(() => {
    if (!consent || !adsenseConfigured(client, slotId) || pushed.current) return;
    pushed.current = true;
    pushAdSenseSlot();
  }, [consent, client, slotId]);

  if (!consent || !adsenseConfigured(client, slotId)) return null;

  return (
    <aside
      className={`overflow-hidden rounded-xl border border-slate-100 bg-slate-50/80 p-2 ${className ?? ""}`}
      data-ad-position={position}
      aria-label={t("adLabel")}
    >
      <p className="mb-1 text-center text-[10px] font-medium uppercase tracking-wider text-slate-400">
        {t("adLabel")}
      </p>
      <ins
        className="adsbygoogle block min-h-[90px] w-full"
        style={{ display: "block" }}
        data-ad-client={client!}
        data-ad-slot={slotId}
        data-ad-format={format}
        {...(layout ? { "data-ad-layout": layout } : {})}
        {...(layoutKey ? { "data-ad-layout-key": layoutKey } : {})}
        {...(format === "auto" || format === "fluid" ? { "data-full-width-responsive": "true" } : {})}
      />
    </aside>
  );
}
