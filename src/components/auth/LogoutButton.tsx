"use client";

import { useRouter } from "next/navigation";

export function LogoutButton({ className }: { className?: string }) {
  const router = useRouter();

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={logout}
      className={className ?? "rounded-lg border border-slate-300 px-3 py-1.5 hover:bg-slate-50"}
    >
      ออกจากระบบ
    </button>
  );
}
