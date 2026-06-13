"use client";

import Script from "next/script";
import { useCallback, useEffect, useRef, useState } from "react";

declare global {
  interface Window {
    turnstile?: {
      render: (
        container: string | HTMLElement,
        options: {
          sitekey: string;
          callback: (token: string) => void;
          "expired-callback"?: () => void;
          "error-callback"?: () => void;
          theme?: "light" | "dark" | "auto";
        },
      ) => string;
      reset: (widgetId?: string) => void;
      remove: (widgetId?: string) => void;
    };
  }
}

export function getTurnstileSiteKeyClient(): string {
  const configured = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY?.trim();
  if (configured) return configured;
  if (process.env.NODE_ENV === "development") return "1x00000000000000000000AA";
  return "";
}

export function useCaptchaGate() {
  const enabled = Boolean(getTurnstileSiteKeyClient());
  const [token, setToken] = useState("");
  const [resetKey, setResetKey] = useState(0);

  const reset = useCallback(() => {
    setToken("");
    setResetKey((value) => value + 1);
  }, []);

  return {
    enabled,
    token,
    setToken,
    reset,
    resetKey,
    ready: !enabled || Boolean(token),
  };
}

interface TurnstileFieldProps {
  onVerify: (token: string) => void;
  onExpire?: () => void;
  onError?: () => void;
  resetKey?: number;
}

export function TurnstileField({
  onVerify,
  onExpire,
  onError,
  resetKey = 0,
}: TurnstileFieldProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);
  const [scriptReady, setScriptReady] = useState(false);
  const siteKey = getTurnstileSiteKeyClient();

  const renderWidget = useCallback(() => {
    if (!scriptReady || !containerRef.current || !window.turnstile || !siteKey) return;

    if (widgetIdRef.current) {
      window.turnstile.remove(widgetIdRef.current);
      widgetIdRef.current = null;
    }

    widgetIdRef.current = window.turnstile.render(containerRef.current, {
      sitekey: siteKey,
      callback: onVerify,
      "expired-callback": () => onExpire?.(),
      "error-callback": () => onError?.(),
      theme: "light",
    });
  }, [scriptReady, siteKey, onVerify, onExpire, onError]);

  useEffect(() => {
    renderWidget();
    return () => {
      if (widgetIdRef.current && window.turnstile) {
        window.turnstile.remove(widgetIdRef.current);
        widgetIdRef.current = null;
      }
    };
  }, [renderWidget, resetKey]);

  if (!siteKey) return null;

  return (
    <>
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
        strategy="lazyOnload"
        onLoad={() => setScriptReady(true)}
      />
      <div ref={containerRef} className="flex min-h-[65px] justify-center" aria-label="CAPTCHA" />
    </>
  );
}
