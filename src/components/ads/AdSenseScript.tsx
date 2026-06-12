"use client";

import Script from "next/script";
import { useSyncExternalStore } from "react";
import { hasAnalyticsConsent } from "@/components/layout/CookieConsent";
import { adsenseClientId } from "@/lib/adsense";

function subscribeConsent(onChange: () => void) {
  window.addEventListener("condo-cookie-consent", onChange);
  return () => window.removeEventListener("condo-cookie-consent", onChange);
}

export function AdSenseScript() {
  const client = adsenseClientId();
  const enabled = useSyncExternalStore(
    subscribeConsent,
    () => hasAnalyticsConsent(),
    () => false,
  );

  if (!client || !enabled) return null;

  return (
    <Script
      id="adsense-init"
      async
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${client}`}
      crossOrigin="anonymous"
      strategy="afterInteractive"
    />
  );
}
