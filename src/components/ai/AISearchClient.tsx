"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { PropertyGrid } from "@/components/property/PropertyGrid";
import type { AISearchResult } from "@/types/property";

export function AISearchClient() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") ?? "";
  const [query, setQuery] = useState(initialQuery);
  const [type, setType] = useState<"sale" | "rent">(
    (searchParams.get("type") as "sale" | "rent") ?? "rent",
  );
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AISearchResult | null>(null);

  async function runSearch(searchQuery: string) {
    if (!searchQuery.trim()) return;
    setLoading(true);
    try {
      const res = await fetch("/api/ai-search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: searchQuery, listingType: type }),
      });
      const data = (await res.json()) as AISearchResult;
      setResult(data);
    } finally {
      setLoading(false);
    }
  }

  const hasAutoSearched = useRef(false);
  useEffect(() => {
    if (hasAutoSearched.current || !initialQuery) return;
    hasAutoSearched.current = true;
    runSearch(initialQuery);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialQuery]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    runSearch(query);
  }

  return (
    <div>
      <form onSubmit={handleSubmit} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-4 flex gap-2">
          <button
            type="button"
            onClick={() => setType("rent")}
            className={`rounded-lg px-4 py-2 text-sm font-medium ${
              type === "rent" ? "bg-teal-600 text-white" : "bg-slate-100 text-slate-700"
            }`}
          >
            เช่า
          </button>
          <button
            type="button"
            onClick={() => setType("sale")}
            className={`rounded-lg px-4 py-2 text-sm font-medium ${
              type === "sale" ? "bg-teal-600 text-white" : "bg-slate-100 text-slate-700"
            }`}
          >
            ซื้อ
          </button>
        </div>

        <textarea
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          rows={3}
          placeholder="เช่น คอนโด 2 ห้องนอน ใกล้ BTS อโศก งบ 40,000 มีสระว่ายน้ำ"
          className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none ring-teal-500 focus:ring-2"
        />

        <button
          type="submit"
          disabled={loading || !query.trim()}
          className="mt-4 rounded-xl bg-violet-600 px-6 py-3 font-medium text-white transition hover:bg-violet-700 disabled:opacity-50"
        >
          {loading ? "กำลังวิเคราะห์..." : "ค้นหาด้วย AI"}
        </button>
      </form>

      {result && (
        <div className="mt-10">
          <div className="rounded-2xl bg-violet-50 p-6">
            <h2 className="font-bold text-violet-900">ผลการวิเคราะห์ AI</h2>
            <p className="mt-2 text-violet-800">{result.summary}</p>
            <ul className="mt-4 space-y-1 text-sm text-violet-700">
              {result.suggestions.map((s) => (
                <li key={s}>• {s}</li>
              ))}
            </ul>
          </div>

          <h2 className="mb-6 mt-10 text-xl font-semibold text-slate-900">
            ทรัพย์ที่แนะนำ ({result.properties.length})
          </h2>
          <PropertyGrid properties={result.properties} />
        </div>
      )}

      <div className="mt-10 rounded-2xl border border-dashed border-slate-300 p-6 text-sm text-slate-600">
        <p className="font-medium text-slate-800">ตัวอย่างคำค้นหา:</p>
        <ul className="mt-2 space-y-1">
          <li>• คอนโด 2 ห้องนอน ใกล้ BTS อโศก งบ 45,000</li>
          <li>• เช่าสตูดิโอ ใกล้ BTS พญาไท ไม่เกิน 15,000</li>
          <li>• ซื้อคอนโด สาทร งบ 8 ล้าน ใกล้ BTS</li>
        </ul>
      </div>
    </div>
  );
}
