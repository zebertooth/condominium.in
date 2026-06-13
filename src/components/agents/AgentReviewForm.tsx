"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

interface AgentReviewFormProps {
  teamAgentId: string;
  agentName: string;
  loggedIn: boolean;
}

export function AgentReviewForm({ teamAgentId, agentName, loggedIn }: AgentReviewFormProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  if (!loggedIn) {
    return (
      <p className="mt-3 text-sm text-slate-500">
        <a href="/login" className="font-medium text-teal-700 hover:underline">
          เข้าสู่ระบบ
        </a>{" "}
        เพื่อให้คะแนนเอเจนต์
      </p>
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    const res = await fetch("/api/agent-reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ teamAgentId, rating, comment }),
    });
    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error ?? "ส่งรีวิวไม่สำเร็จ");
      return;
    }

    setMessage(data.message ?? "ส่งรีวิวแล้ว");
    setOpen(false);
    router.refresh();
  }

  return (
    <div className="mt-4 border-t border-slate-100 pt-4">
      {!open ? (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="text-sm font-medium text-teal-700 hover:underline"
        >
          ให้คะแนน {agentName}
        </button>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-3">
          <p className="text-sm font-medium text-slate-800">คะแนน</p>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => setRating(value)}
                className={`rounded px-1 text-lg ${value <= rating ? "text-amber-500" : "text-slate-300"}`}
                aria-label={`${value} stars`}
              >
                ★
              </button>
            ))}
          </div>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="ความคิดเห็น (ไม่บังคับ)"
            rows={3}
            className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none ring-teal-500 focus:ring-2"
          />
          {error && <p className="text-sm text-red-600">{error}</p>}
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={loading}
              className="rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-700 disabled:opacity-50"
            >
              {loading ? "กำลังส่ง..." : "ส่งรีวิว"}
            </button>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
            >
              ยกเลิก
            </button>
          </div>
        </form>
      )}
      {message && <p className="mt-2 text-sm text-teal-700">{message}</p>}
    </div>
  );
}
