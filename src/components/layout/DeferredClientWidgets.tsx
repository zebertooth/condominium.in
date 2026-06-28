"use client";

import { CompareBar } from "@/components/property/CompareBar";
import { CookieConsent } from "@/components/layout/CookieConsent";
import { FloatingFeedbackWidget } from "@/components/layout/FloatingFeedbackWidget";

/** Non-critical UI loaded after first paint to keep initial JS smaller. */
export function DeferredClientWidgets() {
  return (
    <>
      <FloatingFeedbackWidget />
      <CookieConsent />
      <CompareBar />
    </>
  );
}
