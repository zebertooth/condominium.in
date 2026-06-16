"use client";

import { useState } from "react";
import { renderBlogContent } from "@/lib/blog-render";

interface MarkdownEditorProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  rows?: number;
  hint?: string;
}

export function MarkdownEditor({
  label,
  value,
  onChange,
  required,
  rows = 8,
  hint,
}: MarkdownEditorProps) {
  const [tab, setTab] = useState<"edit" | "preview">("edit");

  return (
    <div className="sm:col-span-2">
      <div className="flex items-center justify-between gap-2">
        <span className="text-sm font-medium text-slate-700">{label}</span>
        <div className="flex rounded-lg border border-slate-300 p-0.5 text-xs">
          <button
            type="button"
            onClick={() => setTab("edit")}
            className={`rounded-md px-3 py-1 ${tab === "edit" ? "bg-slate-900 text-white" : "text-slate-600"}`}
          >
            Edit
          </button>
          <button
            type="button"
            onClick={() => setTab("preview")}
            className={`rounded-md px-3 py-1 ${tab === "preview" ? "bg-slate-900 text-white" : "text-slate-600"}`}
          >
            Preview
          </button>
        </div>
      </div>
      {tab === "edit" ? (
        <textarea
          required={required}
          rows={rows}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="mt-1 w-full rounded-xl border border-slate-300 px-4 py-2 font-mono text-sm"
        />
      ) : (
        <div className="prose mt-1 max-w-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
          {value.trim() ? renderBlogContent(value) : <p className="text-slate-500">—</p>}
        </div>
      )}
      {hint && <p className="mt-1 text-xs text-slate-500">{hint}</p>}
    </div>
  );
}
