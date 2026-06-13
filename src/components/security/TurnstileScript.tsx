"use client";

import Script from "next/script";
import { getTurnstileSiteKeyClient } from "@/components/security/turnstile-shared";

/** Load Turnstile once site-wide (afterInteractive — not lazyOnload). */
export function TurnstileScript() {
  const siteKey = getTurnstileSiteKeyClient();
  if (!siteKey) return null;

  return (
    <Script
      id="cloudflare-turnstile"
      src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
      strategy="afterInteractive"
      onLoad={() => {
        window.dispatchEvent(new Event("turnstile-ready"));
      }}
    />
  );
}
