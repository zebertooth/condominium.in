"use client";

import { useState } from "react";

interface LeadFormProps {
  source: "contact" | "property";
  propertySlug?: string;
  propertyTitle?: string;
  btsStation?: string;
  defaultMessage?: string;
  submitLabel?: string;
}

export function LeadForm({
  source,
  propertySlug,
  propertyTitle,
  btsStation,
  defaultMessage = "",
  submitLabel = "ส่งข้อความ",
}: LeadFormProps) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState(defaultMessage);
  const [status, setStatus] = useState<"idle" | "submitting" | "done">("idle");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setStatus("submitting");

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          phone,
          email,
          message,
          source,
          propertySlug,
          propertyTitle,
          btsStation,
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "ส่งข้อความไม่สำเร็จ");
        setStatus("idle");
        return;
      }

      setStatus("done");
    } catch {
      setError("ส่งข้อความไม่สำเร็จ ลองใหม่อีกครั้ง");
      setStatus("idle");
    }
  }

  if (status === "done") {
    return (
      <div className="rounded-2xl border border-green-200 bg-green-50 p-6 text-center">
        <p className="font-semibold text-green-800">ส่งข้อความเรียบร้อย</p>
        <p className="mt-1 text-sm text-green-700">
          ทีมงาน Condominium.in.th จะติดต่อกลับโดยเร็วที่สุด
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      {propertyTitle && (
        <p className="rounded-xl bg-teal-50 px-4 py-3 text-sm text-teal-800">
          สอบถาม / นัดชม: <span className="font-medium">{propertyTitle}</span>
        </p>
      )}

      <div>
        <label htmlFor="lead-name" className="block text-sm font-medium text-slate-700">
          ชื่อ
        </label>
        <input
          id="lead-name"
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none ring-teal-500 focus:ring-2"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="lead-phone" className="block text-sm font-medium text-slate-700">
            เบอร์โทร / Line ID
          </label>
          <input
            id="lead-phone"
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="mt-1 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none ring-teal-500 focus:ring-2"
          />
        </div>
        <div>
          <label htmlFor="lead-email" className="block text-sm font-medium text-slate-700">
            อีเมล (ไม่บังคับ)
          </label>
          <input
            id="lead-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none ring-teal-500 focus:ring-2"
          />
        </div>
      </div>

      <div>
        <label htmlFor="lead-message" className="block text-sm font-medium text-slate-700">
          ข้อความ
        </label>
        <textarea
          id="lead-message"
          rows={4}
          required
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="เช่น ต้องการเช่าคอนโด 2 ห้องนอน ใกล้ BTS อโศก"
          className="mt-1 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none ring-teal-500 focus:ring-2"
        />
      </div>

      <p className="text-xs text-slate-500">* กรุณากรอกเบอร์โทรหรืออีเมลอย่างน้อยหนึ่งช่องทาง</p>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="w-full rounded-xl bg-teal-600 py-3 font-medium text-white hover:bg-teal-700 disabled:opacity-60"
      >
        {status === "submitting" ? "กำลังส่ง..." : submitLabel}
      </button>
    </form>
  );
}
