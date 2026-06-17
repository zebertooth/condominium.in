"use client";

import Link from "next/link";
import { useState } from "react";
import { useLocale, useT, useTf } from "@/components/i18n/LocaleProvider";
import { TurnstileField, useCaptchaGate } from "@/components/security/TurnstileField";
import { localePath } from "@/lib/locale-routing";

interface LeadFormProps {
  source: "contact" | "property";
  contactMode?: "agent_team" | "owner_direct";
  ownerUserId?: string;
  posterRole?: string;
  propertySlug?: string;
  propertyTitle?: string;
  btsStation?: string;
  defaultMessage?: string;
  submitLabel?: string;
  successMessage?: string;
}

function LeadSuccessPanel({
  email,
  successMessage,
  variant,
}: {
  email: string;
  successMessage?: string;
  variant: "contact" | "agent" | "owner";
}) {
  const t = useT();
  const tf = useTf();
  const locale = useLocale();

  const steps =
    variant === "owner"
      ? [t("leadNextStep1Owner"), t("leadNextStep2Owner"), t("leadNextStep3Owner")]
      : variant === "contact"
        ? [t("leadNextStep1Contact"), t("leadNextStep2Contact"), t("leadNextStep3Contact")]
        : [t("leadNextStep1Agent"), t("leadNextStep2Agent"), t("leadNextStep3Agent")];

  return (
    <div className="rounded-2xl border border-green-200 bg-green-50 p-6">
      <p className="text-center font-semibold text-green-800">{t("leadSuccessTitle")}</p>
      {successMessage && <p className="mt-1 text-center text-sm text-green-700">{successMessage}</p>}
      {email.trim() && (
        <p className="mt-2 text-center text-sm text-green-700">
          {tf("leadSuccessEmailNote", { email: email.trim() })}
        </p>
      )}

      <div className="mt-5 rounded-xl border border-green-100 bg-white/80 p-4 text-left">
        <p className="text-sm font-semibold text-slate-900">{t("leadNextHeading")}</p>
        <ol className="mt-3 space-y-2">
          {steps.map((step, i) => (
            <li key={i} className="flex gap-2 text-sm text-slate-700">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-teal-100 text-xs font-semibold text-teal-800">
                {i + 1}
              </span>
              <span className="pt-0.5">{step}</span>
            </li>
          ))}
        </ol>
      </div>

      <div className="mt-4 flex flex-wrap justify-center gap-3">
        <Link
          href={localePath("/rent", locale)}
          className="rounded-xl bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-700"
        >
          {t("leadBrowseRent")}
        </Link>
        <Link
          href={localePath("/buy", locale)}
          className="rounded-xl border border-teal-200 bg-white px-4 py-2 text-sm font-medium text-teal-800 hover:bg-teal-50"
        >
          {t("leadBrowseBuy")}
        </Link>
      </div>
    </div>
  );
}

export function LeadForm({
  source,
  contactMode = "agent_team",
  ownerUserId,
  posterRole,
  propertySlug,
  propertyTitle,
  btsStation,
  defaultMessage = "",
  submitLabel = "ส่งข้อความ",
  successMessage,
}: LeadFormProps) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState(defaultMessage);
  const [isViewing, setIsViewing] = useState(false);
  const [viewingDate, setViewingDate] = useState("");
  const [viewingTime, setViewingTime] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "done">("idle");
  const [doneMessage, setDoneMessage] = useState<string | undefined>();
  const [error, setError] = useState("");
  const captcha = useCaptchaGate();

  const successVariant =
    source === "contact" ? "contact" : contactMode === "owner_direct" ? "owner" : "agent";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!captcha.ready) {
      setError("กรุณายืนยัน CAPTCHA");
      return;
    }

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
          contactMode,
          ownerUserId,
          posterRole,
          propertySlug,
          propertyTitle,
          btsStation,
          viewingDate: isViewing ? viewingDate : undefined,
          viewingTime: isViewing ? viewingTime : undefined,
          captchaToken: captcha.token || undefined,
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "ส่งข้อความไม่สำเร็จ");
        setStatus("idle");
        captcha.reset();
        return;
      }

      setDoneMessage(typeof data.message === "string" ? data.message : successMessage);
      setStatus("done");
    } catch {
      setError("ส่งข้อความไม่สำเร็จ ลองใหม่อีกครั้ง");
      setStatus("idle");
    }
  }

  if (status === "done") {
    return (
      <LeadSuccessPanel
        email={email}
        successMessage={doneMessage ?? successMessage}
        variant={successVariant}
      />
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

      {source === "property" && (
        <div className="rounded-xl border border-teal-100 bg-teal-50/50 p-4">
          <label className="flex cursor-pointer items-center gap-2 font-medium text-teal-800">
            <input
              type="checkbox"
              checked={isViewing}
              onChange={(e) => setIsViewing(e.target.checked)}
              className="h-4 w-4 rounded border-teal-300 text-teal-600 focus:ring-teal-500"
            />
            <span>📅 ต้องการนัดเข้าชมทรัพย์จริง (Schedule Viewing)</span>
          </label>

          {isViewing && (
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-medium text-teal-700">วันที่สะดวกเข้าชม</label>
                <input
                  type="date"
                  required
                  min={new Date().toISOString().split("T")[0]}
                  value={viewingDate}
                  onChange={(e) => setViewingDate(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 outline-none ring-teal-500 focus:ring-2"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-teal-700">เวลาที่สะดวก</label>
                <select
                  required
                  value={viewingTime}
                  onChange={(e) => setViewingTime(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 outline-none ring-teal-500 focus:ring-2"
                >
                  <option value="">— เลือกเวลา —</option>
                  <option value="09:00">09:00</option>
                  <option value="10:00">10:00</option>
                  <option value="11:00">11:00</option>
                  <option value="12:00">12:00</option>
                  <option value="13:00">13:00</option>
                  <option value="14:00">14:00</option>
                  <option value="15:00">15:00</option>
                  <option value="16:00">16:00</option>
                  <option value="17:00">17:00</option>
                  <option value="18:00">18:00</option>
                </select>
              </div>
            </div>
          )}
        </div>
      )}

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

      <TurnstileField
        siteKey={captcha.siteKey}
        loading={captcha.loading}
        resetKey={captcha.resetKey}
        onVerify={captcha.setToken}
        onExpire={() => captcha.setToken("")}
        onError={() => captcha.setToken("")}
      />

      <button
        type="submit"
        disabled={status === "submitting" || (captcha.enabled && !captcha.ready)}
        className="w-full rounded-xl bg-teal-600 py-3 font-medium text-white hover:bg-teal-700 disabled:opacity-60"
      >
        {status === "submitting" ? "กำลังส่ง..." : submitLabel}
      </button>
    </form>
  );
}
