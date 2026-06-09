"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

interface VerifyFormProps {
  email: string | null;
  emailVerified: boolean;
  lineVerified: boolean;
  isThai: boolean;
  lineConfigured: boolean;
  phone: string | null;
  phoneVerified: boolean;
}

const lineStatusMessage: Record<string, string> = {
  success: "ยืนยัน LINE สำเร็จ",
  error: "เชื่อมต่อ LINE ไม่สำเร็จ ลองใหม่อีกครั้ง",
  duplicate: "บัญชี LINE นี้ถูกใช้ยืนยันกับผู้ใช้อื่นแล้ว",
  unconfigured: "ระบบ LINE ยังไม่ได้ตั้งค่า (โหมดทดสอบ)",
};

export function VerifyForm({
  email,
  emailVerified,
  lineVerified,
  isThai,
  lineConfigured,
  phone,
  phoneVerified,
}: VerifyFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const lineStatus = searchParams.get("line");

  const [emailOtp, setEmailOtp] = useState("");
  const [devEmailCode, setDevEmailCode] = useState<string | null>(null);
  const [phoneOtp, setPhoneOtp] = useState("");
  const [devPhoneCode, setDevPhoneCode] = useState<string | null>(null);
  const [message, setMessage] = useState(lineStatus ? lineStatusMessage[lineStatus] ?? "" : "");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function sendPhoneOtp() {
    setLoading(true);
    setError("");
    const res = await fetch("/api/auth/send-otp", { method: "POST" });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      setError(data.error);
      return;
    }
    setMessage("ส่งรหัส OTP ไปที่เบอร์โทรแล้ว");
    if (data.devCode) setDevPhoneCode(data.devCode);
  }

  async function verifyPhone(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("/api/auth/verify-phone", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code: phoneOtp }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      setError(data.error);
      return;
    }
    setMessage("ยืนยันเบอร์โทรสำเร็จ");
    router.refresh();
  }

  async function sendEmailOtp() {
    setLoading(true);
    setError("");
    const res = await fetch("/api/auth/send-email-otp", { method: "POST" });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      setError(data.error);
      return;
    }
    setMessage("ส่งรหัส OTP ไปที่อีเมลแล้ว");
    if (data.devCode) setDevEmailCode(data.devCode);
  }

  async function verifyEmail(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("/api/auth/verify-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code: emailOtp }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      setError(data.error);
      return;
    }
    setMessage("ยืนยันอีเมลสำเร็จ");
    router.refresh();
  }

  async function devVerifyLine() {
    setLoading(true);
    setError("");
    const res = await fetch("/api/auth/line/dev-verify", { method: "POST" });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      setError(data.error);
      return;
    }
    setMessage(data.message);
    router.refresh();
  }

  return (
    <div className="space-y-8">
      {error && <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}
      {message && <div className="rounded-lg bg-teal-50 px-4 py-3 text-sm text-teal-800">{message}</div>}

      {!isThai && (
        <div className="rounded-2xl border border-sky-200 bg-sky-50 p-6">
          <h2 className="font-bold text-sky-900">บัญชีชาวต่างชาติ (Non-Thai)</h2>
          <p className="mt-2 text-sm text-sky-800">
            ยืนยันอีเมลเพื่อใช้งานเว็บไซต์และติดต่อทีมเอเจนต์ได้ — ขณะนี้บัญชีชาวต่างชาติ
            <strong> ยังไม่สามารถลงประกาศได้ </strong>
            (จะเปิดให้บริการในเฟสถัดไป)
          </p>
          <p className="mt-1 text-xs text-sky-700">
            Verify your email to use the site and contact agents. Listing is not available for
            non-Thai accounts yet.
          </p>
        </div>
      )}

      {/* LINE verification — Thai users only */}
      {isThai && (
        <section className="rounded-2xl border border-slate-200 bg-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-bold text-slate-900">ยืนยันผ่าน LINE</h2>
              <p className="text-sm text-slate-600">เชื่อมต่อบัญชี LINE เพื่อยืนยันตัวตน</p>
            </div>
            {lineVerified ? (
              <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-800">ยืนยันแล้ว ✓</span>
            ) : (
              <span className="rounded-full bg-amber-100 px-3 py-1 text-sm font-medium text-amber-800">รอยืนยัน</span>
            )}
          </div>
          {!lineVerified && (
            <div className="mt-4">
              {lineConfigured ? (
                <a
                  href="/api/auth/line/start"
                  className="inline-block rounded-lg bg-[#06C755] px-4 py-2 text-sm font-medium text-white hover:opacity-90"
                >
                  เชื่อมต่อ LINE เพื่อยืนยัน
                </a>
              ) : (
                <div className="space-y-2">
                  <button
                    type="button"
                    onClick={devVerifyLine}
                    disabled={loading}
                    className="rounded-lg bg-[#06C755] px-4 py-2 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50"
                  >
                    ยืนยัน LINE (โหมดทดสอบ)
                  </button>
                  <p className="text-xs text-amber-700">
                    ยังไม่ได้ตั้งค่า LINE channel — ใช้ปุ่มทดสอบเพื่อจำลองการยืนยัน
                  </p>
                </div>
              )}
            </div>
          )}
        </section>
      )}

      {/* Email verification — required for all */}
      {email ? (
        <section className="rounded-2xl border border-slate-200 bg-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-bold text-slate-900">ยืนยันอีเมล</h2>
              <p className="text-sm text-slate-600">{email}</p>
            </div>
            {emailVerified ? (
              <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-800">ยืนยันแล้ว ✓</span>
            ) : (
              <span className="rounded-full bg-amber-100 px-3 py-1 text-sm font-medium text-amber-800">รอยืนยัน</span>
            )}
          </div>
          {!emailVerified && (
            <div className="mt-4 space-y-3">
              <button type="button" onClick={sendEmailOtp} disabled={loading} className="rounded-lg bg-slate-800 px-4 py-2 text-sm font-medium text-white">ส่ง OTP อีเมล</button>
              {devEmailCode && <p className="text-sm text-amber-700">โหมดทดสอบ — OTP: <strong>{devEmailCode}</strong></p>}
              <form onSubmit={verifyEmail} className="flex gap-2">
                <input value={emailOtp} onChange={(e) => setEmailOtp(e.target.value)} placeholder="OTP 6 หลัก" maxLength={6} className="flex-1 rounded-xl border px-4 py-2" />
                <button type="submit" disabled={loading || emailOtp.length !== 6} className="rounded-xl bg-teal-600 px-4 py-2 text-white">ยืนยัน</button>
              </form>
            </div>
          )}
        </section>
      ) : (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-sm text-amber-800">
          บัญชีนี้ยังไม่มีอีเมล — กรุณาเพิ่มอีเมลเพื่อยืนยันตัวตน
        </div>
      )}

      {/* Phone (SMS) verification — Thai users, optional/additional */}
      {isThai && phone && (
        <section className="rounded-2xl border border-slate-200 bg-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-bold text-slate-900">
                ยืนยันเบอร์โทร <span className="text-sm font-normal text-slate-400">(เพิ่มเติม)</span>
              </h2>
              <p className="text-sm text-slate-600">{phone}</p>
            </div>
            {phoneVerified ? (
              <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-800">ยืนยันแล้ว ✓</span>
            ) : (
              <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-600">ยังไม่ยืนยัน</span>
            )}
          </div>
          {!phoneVerified && (
            <div className="mt-4 space-y-3">
              <button type="button" onClick={sendPhoneOtp} disabled={loading} className="rounded-lg bg-slate-800 px-4 py-2 text-sm font-medium text-white">ส่ง OTP ทาง SMS</button>
              {devPhoneCode && <p className="text-sm text-amber-700">โหมดทดสอบ — OTP: <strong>{devPhoneCode}</strong></p>}
              <form onSubmit={verifyPhone} className="flex gap-2">
                <input value={phoneOtp} onChange={(e) => setPhoneOtp(e.target.value)} placeholder="OTP 6 หลัก" maxLength={6} className="flex-1 rounded-xl border px-4 py-2" />
                <button type="submit" disabled={loading || phoneOtp.length !== 6} className="rounded-xl bg-teal-600 px-4 py-2 text-white">ยืนยัน</button>
              </form>
            </div>
          )}
        </section>
      )}
    </div>
  );
}
