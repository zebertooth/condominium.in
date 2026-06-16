"use client";

import dynamic from "next/dynamic";

const CsvImportPanelLazy = dynamic(
  () => import("./CsvImportPanel").then((m) => m.CsvImportPanel),
  {
    ssr: false,
    loading: () => (
      <div className="rounded-xl border border-slate-200 bg-white p-6 text-sm text-slate-500">
        Loading…
      </div>
    ),
  },
);

interface CsvImportPanelLoaderProps {
  locale: string;
  uploadPath: string;
  pendingReviewNote?: boolean;
}

export function CsvImportPanelLoader(props: CsvImportPanelLoaderProps) {
  return <CsvImportPanelLazy {...props} />;
}
