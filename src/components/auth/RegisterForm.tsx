"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { SocialLoginButtons } from "@/components/auth/SocialLoginButtons";
import { TurnstileField, useCaptchaGate } from "@/components/security/TurnstileField";

export function RegisterForm() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const captcha = useCaptchaGate();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!captcha.ready) {
      setError("กรุณายืนยัน CAPTCHA");
      return;
    }

    setLoading(true);
    setError("");

    const form = new FormData(e.currentTarget);
    const phone = String(form.get("phone") || "").trim();
    const email = String(form.get("email") || "").trim();
    const isThai = String(form.get("nationality") || "thai") === "thai";

    if (!email) {
      setError("กรุณากรอกอีเมลเพื่อยืนยันตัวตน");
      setLoading(false);
      return;
    }

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        phone: phone || undefined,
        email: email || undefined,
        password: form.get("password"),
        fullName: form.get("fullName"),
        isThai,
        captchaToken: captcha.token || undefined,
      }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error ?? "สมัครไม่สำเร็จ");
      captcha.reset();
      return;
    }

    if (data.user.role === "admin") {
      router.push("/admin");
    } else {
      router.push("/dashboard/verify");
    }
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      {error && (
        <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
      )}

      <div>
        <label htmlFor="fullName" className="block text-sm font-medium text-slate-700">
          ชื่อ-นามสกุล
        </label>
        <input id="fullName" name="fullName" required className="mt-1 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none ring-teal-500 focus:ring-2" />
      </div>

      <div>
        <label htmlFor="nationality" className="block text-sm font-medium text-slate-700">
          สัญชาติ
        </label>
        <select
          id="nationality"
          name="nationality"
          defaultValue="thai"
          className="mt-1 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none ring-teal-500 focus:ring-2"
        >
          <option value="thai">คนไทย (Thai)</option>
          <option value="foreign">ชาวต่างชาติ (Non-Thai)</option>
        </select>
        <p className="mt-1 text-xs text-slate-500">
          คนไทยยืนยัน LINE + อีเมล เพื่อลงประกาศได้ · ชาวต่างชาติยืนยันอีเมลเพื่อใช้งาน (ยังลงประกาศไม่ได้ในช่วงนี้)
        </p>
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-slate-700">
          อีเมล <span className="text-red-500">*</span>
        </label>
        <input id="email" name="email" type="email" required placeholder="you@email.com" className="mt-1 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none ring-teal-500 focus:ring-2" />
      </div>

      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-slate-700">
          เบอร์โทรศัพท์ <span className="text-slate-400">(ไม่บังคับ — ยืนยันผ่าน SMS เร็วๆ นี้)</span>
        </label>
        <input id="phone" name="phone" type="tel" placeholder="08xxxxxxxx" className="mt-1 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none ring-teal-500 focus:ring-2" />
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-slate-700">
          รหัสผ่าน
        </label>
        <input id="password" name="password" type="password" minLength={6} required className="mt-1 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none ring-teal-500 focus:ring-2" />
      </div>

      <p className="text-xs text-slate-500">
        การสมัครสมาชิกถือว่ายอมรับ{" "}
        <Link href="/terms" className="text-teal-700 hover:underline">
          ข้อกำหนดการให้บริการ
        </Link>{" "}
        และ{" "}
        <Link href="/privacy" className="text-teal-700 hover:underline">
          นโยบายความเป็นส่วนตัว
        </Link>
      </p>

      <TurnstileField
        siteKey={captcha.siteKey}
        loading={captcha.loading}
        resetKey={captcha.resetKey}
        onVerify={captcha.setToken}
        onExpire={() => captcha.setToken("")}
        onError={() => captcha.setToken("")}
      />

      <button type="submit" disabled={loading || (captcha.enabled && !captcha.ready)} className="w-full rounded-xl bg-teal-600 py-3 font-medium text-white hover:bg-teal-700 disabled:opacity-50">
        {loading ? "กำลังสมัคร..." : "สมัครสมาชิก"}
      </button>

      <p className="text-center text-sm text-slate-600">
        มีบัญชีแล้ว?{" "}
        <Link href="/login" className="font-medium text-teal-700 hover:underline">เข้าสู่ระบบ</Link>
      </p>

      <SocialLoginButtons />
    </form>
  );
}
