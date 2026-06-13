"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import {
  getTurnstileSiteKeyClient,
  subscribeTurnstileReady,
} from "@/components/security/turnstile-shared";

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
          size?: "normal" | "compact" | "flexible";
          appearance?: "always" | "execute" | "interaction-only";
        },
      ) => string;
      reset: (widgetId?: string) => void;
      remove: (widgetId?: string) => void;
    };
  }
}

export { getTurnstileSiteKeyClient } from "@/components/security/turnstile-shared";

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
  const onVerifyRef = useRef(onVerify);
  const onExpireRef = useRef(onExpire);
  const onErrorRef = useRef(onError);
  const siteKey = getTurnstileSiteKeyClient();

  onVerifyRef.current = onVerify;
  onExpireRef.current = onExpire;
  onErrorRef.current = onError;

  const scriptReady = useSyncExternalStore(
    subscribeTurnstileReady,
    () => Boolean(window.turnstile),
    () => false,
  );

  useEffect(() => {
    if (!scriptReady || !containerRef.current || !window.turnstile || !siteKey) return;

    if (widgetIdRef.current) {
      window.turnstile.remove(widgetIdRef.current);
      widgetIdRef.current = null;
    }

    widgetIdRef.current = window.turnstile.render(containerRef.current, {
      sitekey: siteKey,
      callback: (token) => onVerifyRef.current(token),
      "expired-callback": () => onExpireRef.current?.(),
      "error-callback": () => onErrorRef.current?.(),
      theme: "light",
      size: "flexible",
      appearance: "interaction-only",
    });

    return () => {
      if (widgetIdRef.current && window.turnstile) {
        window.turnstile.remove(widgetIdRef.current);
        widgetIdRef.current = null;
      }
    };
  }, [scriptReady, siteKey, resetKey]);

  if (!siteKey) return null;

  return (
    <div
      ref={containerRef}
      className="flex min-h-[65px] w-full justify-center"
      aria-label="CAPTCHA"
      aria-busy={!scriptReady}
    />
  );
}
