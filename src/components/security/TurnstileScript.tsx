"use client";

import Script from "next/script";

/** Load Turnstile script site-wide; widgets render per-form with site key from API. */
export function TurnstileScript() {
  return (
    <Script
      id="cloudflare-turnstile"
      src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
      strategy="lazyOnload"
      onLoad={() => {
        window.dispatchEvent(new Event("turnstile-ready"));
      }}
    />
  );
}
