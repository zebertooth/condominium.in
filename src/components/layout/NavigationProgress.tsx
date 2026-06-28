"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

/** Top progress bar + subtle busy state when navigating between pages. */
export function NavigationProgress() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState(0);
  const completeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const tickTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  function clearTimers() {
    if (completeTimer.current) clearTimeout(completeTimer.current);
    if (tickTimer.current) clearTimeout(tickTimer.current);
  }

  function startProgress() {
    clearTimers();
    setVisible(true);
    setProgress(18);
    tickTimer.current = setTimeout(() => setProgress(55), 120);
  }

  function finishProgress() {
    clearTimers();
    setProgress(100);
    completeTimer.current = setTimeout(() => {
      setVisible(false);
      setProgress(0);
    }, 280);
  }

  useEffect(() => {
    startProgress();
    finishProgress();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, searchParams]);

  useEffect(() => {
    function onDocumentClick(event: MouseEvent) {
      if (event.defaultPrevented || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
        return;
      }

      const anchor = (event.target as HTMLElement | null)?.closest("a");
      if (!anchor) return;
      if (anchor.target === "_blank" || anchor.hasAttribute("download")) return;

      const href = anchor.getAttribute("href");
      if (!href || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:")) {
        return;
      }

      try {
        const next = new URL(href, window.location.origin);
        if (next.origin !== window.location.origin) return;

        const current = `${pathname}${searchParams.toString() ? `?${searchParams}` : ""}`;
        const target = `${next.pathname}${next.search}`;
        if (target !== current) startProgress();
      } catch {
        // ignore malformed href
      }
    }

    document.addEventListener("click", onDocumentClick, true);
    return () => document.removeEventListener("click", onDocumentClick, true);
  }, [pathname, searchParams]);

  useEffect(() => clearTimers, []);

  return (
    <>
      <div
        className={`pointer-events-none fixed inset-x-0 top-0 z-[200] h-0.5 transition-opacity duration-200 ${
          visible ? "opacity-100" : "opacity-0"
        }`}
        aria-hidden
      >
        <div
          className="h-full bg-gradient-to-r from-teal-500 via-teal-400 to-violet-500 shadow-[0_0_8px_rgba(20,184,166,0.45)] transition-[width] duration-300 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
      <div
        className={`pointer-events-none fixed inset-0 z-[190] bg-white/25 transition-opacity duration-200 ${
          visible && progress < 100 ? "opacity-100" : "opacity-0"
        }`}
        aria-hidden
      />
    </>
  );
}
