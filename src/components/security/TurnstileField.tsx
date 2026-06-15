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

function applyConfig(
  siteKey: string | null | undefined,
  enabled: boolean | undefined,
): { siteKey: string; enabled: boolean } {
  const builtIn = getTurnstileSiteKeyClient();
  const key = builtIn || siteKey?.trim() || "";
  return {
    siteKey: key,
    enabled: Boolean(key) && (enabled ?? true),
  };
}

export function useCaptchaGate() {
  const builtInKey = getTurnstileSiteKeyClient();
  const [siteKey, setSiteKey] = useState(builtInKey);
  const [enabled, setEnabled] = useState(Boolean(builtInKey));
  const [loading, setLoading] = useState(!builtInKey);
  const [token, setToken] = useState("");
  const [resetKey, setResetKey] = useState(0);

  useEffect(() => {
    if (builtInKey) return;

    let cancelled = false;
    fetch("/api/captcha/config")
      .then((res) => res.json())
      .then((data: { siteKey?: string | null; enabled?: boolean }) => {
        if (cancelled) return;
        const next = applyConfig(data.siteKey, data.enabled);
        setSiteKey(next.siteKey);
        setEnabled(next.enabled);
      })
      .catch(() => {
        if (!cancelled) {
          setEnabled(false);
          setSiteKey("");
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [builtInKey]);

  const reset = useCallback(() => {
    setToken("");
    setResetKey((value) => value + 1);
  }, []);

  return {
    enabled,
    loading,
    siteKey,
    token,
    setToken,
    reset,
    resetKey,
    ready: !enabled || Boolean(token),
  };
}

interface TurnstileFieldProps {
  siteKey: string;
  onVerify: (token: string) => void;
  onExpire?: () => void;
  onError?: () => void;
  resetKey?: number;
  loading?: boolean;
}

export function TurnstileField({
  siteKey,
  onVerify,
  onExpire,
  onError,
  resetKey = 0,
  loading = false,
}: TurnstileFieldProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);
  const onVerifyRef = useRef(onVerify);
  const onExpireRef = useRef(onExpire);
  const onErrorRef = useRef(onError);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    onVerifyRef.current = onVerify;
    onExpireRef.current = onExpire;
    onErrorRef.current = onError;
  }, [onVerify, onExpire, onError]);

  const scriptReady = useSyncExternalStore(
    subscribeTurnstileReady,
    () => (mounted ? Boolean(window.turnstile) : false),
    () => false,
  );

  useEffect(() => {
    if (!mounted || loading || !scriptReady || !containerRef.current || !window.turnstile || !siteKey) {
      return;
    }

    if (widgetIdRef.current) {
      window.turnstile.remove(widgetIdRef.current);
      widgetIdRef.current = null;
    }

    widgetIdRef.current = window.turnstile.render(containerRef.current, {
      sitekey: siteKey,
      callback: (value) => onVerifyRef.current(value),
      "expired-callback": () => onExpireRef.current?.(),
      "error-callback": () => onErrorRef.current?.(),
      theme: "light",
      size: "normal",
      appearance: "always",
    });

    return () => {
      if (widgetIdRef.current && window.turnstile) {
        window.turnstile.remove(widgetIdRef.current);
        widgetIdRef.current = null;
      }
    };
  }, [mounted, loading, scriptReady, siteKey, resetKey]);

  if (!mounted || loading) {
    return (
      <div
        className="flex min-h-[65px] w-full items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50 text-sm text-slate-500"
        aria-busy="true"
        aria-hidden={!mounted}
        suppressHydrationWarning
      >
        {mounted ? "กำลังโหลด CAPTCHA…" : ""}
      </div>
    );
  }

  if (!siteKey) return null;

  return (
    <div
      ref={containerRef}
      className="flex min-h-[65px] w-full justify-center"
      aria-label="CAPTCHA"
      aria-busy={!scriptReady}
      suppressHydrationWarning
    />
  );
}
