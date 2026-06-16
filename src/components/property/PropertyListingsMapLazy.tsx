"use client";

import dynamic from "next/dynamic";

export const PropertyListingsMapLazy = dynamic(
  () => import("./PropertyListingsMap").then((m) => m.PropertyListingsMap),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-[480px] items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-500">
        Loading map…
      </div>
    ),
  },
);
