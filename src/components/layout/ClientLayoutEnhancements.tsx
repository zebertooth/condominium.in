"use client";

import dynamic from "next/dynamic";
import { Suspense } from "react";

const NavigationProgress = dynamic(
  () => import("@/components/layout/NavigationProgress").then((m) => m.NavigationProgress),
  { ssr: false },
);

const DeferredClientWidgets = dynamic(
  () => import("@/components/layout/DeferredClientWidgets").then((m) => m.DeferredClientWidgets),
  { ssr: false },
);

/** Client-only enhancements: nav progress bar + deferred widgets. */
export function ClientLayoutEnhancements() {
  return (
    <>
      <Suspense fallback={null}>
        <NavigationProgress />
      </Suspense>
      <DeferredClientWidgets />
    </>
  );
}
