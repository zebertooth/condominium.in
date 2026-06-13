export function getTurnstileSiteKeyClient(): string {
  const configured = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY?.trim();
  if (configured) return configured;
  if (process.env.NODE_ENV === "development") return "1x00000000000000000000AA";
  return "";
}

export function subscribeTurnstileReady(onStoreChange: () => void): () => void {
  if (typeof window === "undefined") return () => {};

  if (window.turnstile) {
    queueMicrotask(onStoreChange);
    return () => {};
  }

  const handler = () => onStoreChange();
  window.addEventListener("turnstile-ready", handler);
  return () => window.removeEventListener("turnstile-ready", handler);
}
