"use client";

import Link from "next/link";
import Script from "next/script";
import { useState, useSyncExternalStore } from "react";
import { useT } from "@/components/i18n/LocaleProvider";
import { getGaMeasurementId } from "@/lib/ga";

export const COOKIE_CONSENT_NAME = "condo_cookie_consent";
export type CookieConsentValue = "essential" | "all";

function readConsent(): CookieConsentValue | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp(`(?:^|; )${COOKIE_CONSENT_NAME}=([^;]+)`));
  const value = match?.[1];
  return value === "essential" || value === "all" ? value : null;
}

function writeConsent(value: CookieConsentValue) {
  const maxAge = 60 * 60 * 24 * 365;
  document.cookie = `${COOKIE_CONSENT_NAME}=${value}; path=/; max-age=${maxAge}; samesite=lax`;
  window.dispatchEvent(new CustomEvent("condo-cookie-consent", { detail: value }));
}

function subscribeConsent(onChange: () => void) {
  window.addEventListener("condo-cookie-consent", onChange);
  return () => window.removeEventListener("condo-cookie-consent", onChange);
}

export function hasAnalyticsConsent(): boolean {
  return readConsent() === "all";
}

export function CookieConsent() {
  const t = useT();
  const needsConsent = useSyncExternalStore(
    subscribeConsent,
    () => readConsent() === null,
    () => false,
  );
  const [dismissed, setDismissed] = useState(false);

  function choose(value: CookieConsentValue) {
    writeConsent(value);
    setDismissed(true);
  }

  if (!needsConsent || dismissed) return null;

  return (
    <div
      role="dialog"
      aria-live="polite"
      className="fixed inset-x-0 bottom-0 z-[60] border-t border-slate-200 bg-white/95 p-4 shadow-lg backdrop-blur sm:p-5"
    >
      <div className="mx-auto flex max-w-7xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="max-w-3xl">
          <p className="font-semibold text-slate-900">{t("cookieBannerTitle")}</p>
          <p className="mt-1 text-sm text-slate-600">{t("cookieBannerDesc")}</p>
          <Link href="/privacy#cookies" className="mt-2 inline-block text-sm text-teal-700 hover:underline">
            {t("cookieLearnMore")}
          </Link>
        </div>
        <div className="flex shrink-0 flex-wrap gap-2">
          <button
            type="button"
            onClick={() => choose("essential")}
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            {t("cookieEssentialOnly")}
          </button>
          <button
            type="button"
            onClick={() => choose("all")}
            className="rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-700"
          >
            {t("cookieAcceptAll")}
          </button>
        </div>
      </div>
    </div>
  );
}

export function AnalyticsLoader() {
  const gaId = getGaMeasurementId();
  const enabled = useSyncExternalStore(
    subscribeConsent,
    () => hasAnalyticsConsent(),
    () => false,
  );

  if (!gaId || !enabled) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
        strategy="afterInteractive"
      />
      <Script id="ga4-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${gaId}');
        `}
      </Script>
    </>
  );
}
