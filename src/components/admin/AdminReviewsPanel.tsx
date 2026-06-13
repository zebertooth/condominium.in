"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { StarRating } from "@/components/agents/StarRating";

export interface AdminReviewRow {
  id: string;
  rating: number;
  comment: string;
  status: string;
  createdAt: string;
  user: { fullName: string; email: string | null };
  teamAgent: { name: string };
}

interface AdminReviewsPanelProps {
  initialReviews: AdminReviewRow[];
}

export function AdminReviewsPanel({ initialReviews }: AdminReviewsPanelProps) {
  const router = useRouter();
  const [reviews, setReviews] = useState(initialReviews);
  const [error, setError] = useState("");

  async function updateStatus(id: string, status: string) {
    setError("");
    const res = await fetch("/api/admin/reviews", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error ?? "อัปเดตไม่สำเร็จ");
      return;
    }
    setReviews((prev) =>
      prev.map((review) => (review.id === id ? { ...review, status } : review)),
    );
    router.refresh();
  }

  if (reviews.length === 0) return <p className="text-slate-600">ยังไม่มีรีวิว</p>;

  return (
    <div>
      {error && <p className="mb-4 text-sm text-red-600">{error}</p>}
      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
        <table className="min-w-full text-sm">
          <thead className="border-b border-slate-200 bg-slate-50 text-left text-slate-600">
            <tr>
              <th className="px-4 py-3">เอเจนต์</th>
              <th className="px-4 py-3">ผู้รีวิว</th>
              <th className="px-4 py-3">คะแนน</th>
              <th className="px-4 py-3">ความคิดเห็น</th>
              <th className="px-4 py-3">สถานะ</th>
              <th className="px-4 py-3">จัดการ</th>
            </tr>
          </thead>
          <tbody>
            {reviews.map((review) => (
              <tr key={review.id} className="border-b border-slate-100 last:border-0">
                <td className="px-4 py-3 font-medium">{review.teamAgent.name}</td>
                <td className="px-4 py-3">
                  {review.user.fullName}
                  {review.user.email && (
                    <span className="block text-xs text-slate-500">{review.user.email}</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <StarRating rating={review.rating} size="sm" />
                </td>
                <td className="max-w-xs px-4 py-3 text-slate-700">{review.comment || "—"}</td>
                <td className="px-4 py-3 capitalize">{review.status}</td>
                <td className="px-4 py-3">
                  {review.status === "pending" && (
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => updateStatus(review.id, "approved")}
                        className="rounded-lg bg-teal-600 px-3 py-1 text-white hover:bg-teal-700"
                      >
                        อนุมัติ
                      </button>
                      <button
                        type="button"
                        onClick={() => updateStatus(review.id, "rejected")}
                        className="rounded-lg border border-red-300 px-3 py-1 text-red-700 hover:bg-red-50"
                      >
                        ปฏิเสธ
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
