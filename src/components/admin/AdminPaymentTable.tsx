"use client";

import { useState } from "react";

export interface PaymentView {
  id: string;
  userName: string;
  userEmail: string | null;
  packageId: string;
  pricePaid: number;
  paymentStatus: string;
  paymentMethod: string | null;
  transactionRef: string | null;
  slipUrl: string | null;
  status: string;
  createdAt: string;
}

function statusLabel(status: string): { text: string; className: string } {
  switch (status) {
    case "pending":
      return { text: "รอชำระ", className: "bg-yellow-100 text-yellow-800" };
    case "pending_review":
      return { text: "รอตรวจสลิป", className: "bg-orange-100 text-orange-800" };
    case "confirmed":
      return { text: "ยืนยันแล้ว", className: "bg-emerald-100 text-emerald-800" };
    case "failed":
      return { text: "ล้มเหลว", className: "bg-red-100 text-red-800" };
    default:
      return { text: status, className: "bg-slate-100 text-slate-800" };
  }
}

function packageLabel(packageId: string): string {
  if (packageId === "extra_4_monthly") return "แพ็ก +4 ประกาศ";
  if (packageId === "extra_10_monthly") return "แพ็ก +10 ประกาศ";
  if (packageId.startsWith("sponsor_")) return "สปอนเซอร์";
  return packageId;
}

export function AdminPaymentTable({ payments }: { payments: PaymentView[] }) {
  const [items, setItems] = useState(payments);
  const [acting, setActing] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "pending_review" | "pending" | "confirmed">("all");

  const filtered = filter === "all" ? items : items.filter((p) => p.paymentStatus === filter);

  async function handleAction(id: string, action: "approve" | "reject") {
    setActing(id);
    try {
      const res = await fetch("/api/admin/payments", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subscriptionId: id, action }),
      });

      if (res.ok) {
        setItems((prev) =>
          prev.map((p) =>
            p.id === id
              ? {
                  ...p,
                  paymentStatus: action === "approve" ? "confirmed" : "failed",
                  status: action === "approve" ? "active" : "cancelled",
                }
              : p,
          ),
        );
      }
    } catch {
      // silent
    }
    setActing(null);
  }

  const pendingReviewCount = items.filter((p) => p.paymentStatus === "pending_review").length;

  return (
    <div>
      {/* Filter tabs */}
      <div className="mb-4 flex gap-2">
        {(
          [
            ["all", "ทั้งหมด"],
            ["pending_review", `รอตรวจสลิป (${pendingReviewCount})`],
            ["pending", "รอชำระ"],
            ["confirmed", "ยืนยันแล้ว"],
          ] as const
        ).map(([key, label]) => (
          <button
            key={key}
            type="button"
            onClick={() => setFilter(key)}
            className={`rounded-lg px-3 py-1.5 text-sm font-medium transition ${
              filter === key
                ? "bg-violet-600 text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="py-8 text-center text-slate-500">ไม่มีรายการ</p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full text-left text-sm">
            <thead className="border-b bg-slate-50 text-xs uppercase text-slate-600">
              <tr>
                <th className="px-4 py-3">ผู้ใช้</th>
                <th className="px-4 py-3">แพ็กเกจ</th>
                <th className="px-4 py-3">จำนวน</th>
                <th className="px-4 py-3">สถานะ</th>
                <th className="px-4 py-3">สลิป</th>
                <th className="px-4 py-3">Ref</th>
                <th className="px-4 py-3">วันที่</th>
                <th className="px-4 py-3">จัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filtered.map((p) => {
                const st = statusLabel(p.paymentStatus);
                return (
                  <tr key={p.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3">
                      <div className="font-medium text-slate-900">{p.userName}</div>
                      {p.userEmail && (
                        <div className="text-xs text-slate-500">{p.userEmail}</div>
                      )}
                    </td>
                    <td className="px-4 py-3 text-slate-700">{packageLabel(p.packageId)}</td>
                    <td className="px-4 py-3 font-medium text-slate-900">฿{p.pricePaid}</td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${st.className}`}>
                        {st.text}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {p.slipUrl ? (
                        <a
                          href={p.slipUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-violet-600 underline hover:text-violet-800"
                        >
                          ดูสลิป
                        </a>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-slate-500">
                      {p.transactionRef ?? "—"}
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-500">{p.createdAt}</td>
                    <td className="px-4 py-3">
                      {(p.paymentStatus === "pending_review" || p.paymentStatus === "pending") && (
                        <div className="flex gap-1">
                          <button
                            type="button"
                            onClick={() => handleAction(p.id, "approve")}
                            disabled={acting === p.id}
                            className="rounded bg-emerald-600 px-2.5 py-1 text-xs text-white hover:bg-emerald-700 disabled:opacity-50"
                          >
                            อนุมัติ
                          </button>
                          <button
                            type="button"
                            onClick={() => handleAction(p.id, "reject")}
                            disabled={acting === p.id}
                            className="rounded bg-red-600 px-2.5 py-1 text-xs text-white hover:bg-red-700 disabled:opacity-50"
                          >
                            ปฏิเสธ
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
