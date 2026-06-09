"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { formatPrice } from "@/lib/i18n";
import { PAID_FEATURES_ENABLED } from "@/lib/packages";
import type { Property } from "@/types/property";

export function MyProperties({
  properties,
  canPost,
}: {
  properties: Property[];
  canPost: boolean;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);

  async function deleteProperty(id: string) {
    if (!confirm("ลบประกาศนี้?")) return;
    setLoading(id);
    await fetch(`/api/user/properties/${id}`, { method: "DELETE" });
    setLoading(null);
    router.refresh();
  }

  async function sponsorProperty(id: string) {
    setLoading(`sponsor-${id}`);
    const res = await fetch("/api/packages/sponsor", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ propertyId: id }),
    });
    const data = await res.json();
    setLoading(null);
    if (res.ok) alert(data.message);
    else alert(data.error);
    router.refresh();
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6">
      <div className="flex items-center justify-between">
        <h2 className="font-bold text-slate-900">ประกาศของฉัน ({properties.length})</h2>
        {canPost ? (
          <Link
            href="/dashboard/post"
            className="rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-700"
          >
            + ลงประกาศใหม่
          </Link>
        ) : (
          <span className="text-sm text-amber-700">
            {PAID_FEATURES_ENABLED ? "โควตาเต็ม — ซื้อแพ็กเพิ่มด้านล่าง" : "ลงประกาศครบโควตาแล้ว"}
          </span>
        )}
      </div>

      {properties.length === 0 ? (
        <p className="mt-6 text-slate-600">ยังไม่มีประกาศ</p>
      ) : (
        <ul className="mt-6 space-y-4">
          {properties.map((p) => (
            <li
              key={p.id}
              className="flex flex-col gap-3 rounded-xl border border-slate-100 p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <Link href={`/property/${p.slug}`} className="font-semibold text-slate-900 hover:text-teal-700">
                  {p.title}
                </Link>
                <p className="text-sm text-teal-700">{formatPrice(p.price, p.priceUnit)}</p>
                <div className="mt-1 flex flex-wrap gap-1">
                  {p.status === "pending" && (
                    <span className="rounded bg-amber-100 px-2 py-0.5 text-xs text-amber-800">รอแอดมินอนุมัติ</span>
                  )}
                  {p.status === "rejected" && (
                    <span className="rounded bg-red-100 px-2 py-0.5 text-xs text-red-800">ถูกปฏิเสธ</span>
                  )}
                  {p.featured && (
                    <span className="rounded bg-violet-100 px-2 py-0.5 text-xs text-violet-800">ประกาศเด่น</span>
                  )}
                </div>
              </div>
              <div className="flex gap-2">
                <Link
                  href={`/dashboard/edit/${p.id}`}
                  className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50"
                >
                  แก้ไข
                </Link>
                {PAID_FEATURES_ENABLED && p.status === "published" && (
                  <button
                    type="button"
                    onClick={() => sponsorProperty(p.id)}
                    disabled={loading === `sponsor-${p.id}`}
                    className="rounded-lg border border-amber-300 px-3 py-1.5 text-sm text-amber-800 hover:bg-amber-50"
                  >
                    ทำประกาศเด่น ฿50
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => deleteProperty(p.id)}
                  disabled={loading === p.id}
                  className="rounded-lg border border-red-200 px-3 py-1.5 text-sm text-red-700 hover:bg-red-50"
                >
                  ลบ
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
