"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { TurnstileField, useCaptchaGate } from "@/components/security/TurnstileField";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const resetSuccess = searchParams.get("reset") === "1";
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
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        login: form.get("login"),
        password: form.get("password"),
        captchaToken: captcha.token || undefined,
      }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error ?? "เข้าสู่ระบบไม่สำเร็จ");
      captcha.reset();
      return;
    }

    if (data.user.role === "admin") {
      router.push("/admin");
    } else if (!data.user.contactVerified || !data.user.idVerified) {
      router.push("/dashboard/verify");
    } else {
      router.push("/dashboard");
    }
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      {resetSuccess && (
        <div className="rounded-lg bg-teal-50 px-4 py-3 text-sm text-teal-800">
          ตั้งรหัสผ่านใหม่เรียบร้อยแล้ว — เข้าสู่ระบบได้เลย
        </div>
      )}
      {error && <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

      <div>
        <label htmlFor="login" className="block text-sm font-medium text-slate-700">
          เบอร์โทรหรืออีเมล
        </label>
        <input id="login" name="login" type="text" required placeholder="08xxxxxxxx หรือ you@email.com" className="mt-1 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none ring-teal-500 focus:ring-2" />
      </div>

      <div>
        <div className="flex items-center justify-between gap-2">
          <label htmlFor="password" className="block text-sm font-medium text-slate-700">รหัสผ่าน</label>
          <Link href="/forgot-password" className="text-sm font-medium text-teal-700 hover:underline">
            ลืมรหัสผ่าน?
          </Link>
        </div>
        <input id="password" name="password" type="password" required className="mt-1 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none ring-teal-500 focus:ring-2" />
      </div>

      <TurnstileField
        resetKey={captcha.resetKey}
        onVerify={captcha.setToken}
        onExpire={() => captcha.setToken("")}
        onError={() => captcha.setToken("")}
      />

      <button type="submit" disabled={loading || !captcha.ready} className="w-full rounded-xl bg-teal-600 py-3 font-medium text-white hover:bg-teal-700 disabled:opacity-50">
        {loading ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}
      </button>

      <p className="text-center text-sm text-slate-600">
        ยังไม่มีบัญชี?{" "}
        <Link href="/register" className="font-medium text-teal-700 hover:underline">สมัครสมาชิก</Link>
      </p>
    </form>
  );
}
