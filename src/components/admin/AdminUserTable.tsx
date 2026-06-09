"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

interface AdminUser {
  id: string;
  fullName: string;
  phone: string | null;
  email: string | null;
  phoneVerified: boolean;
  emailVerified: boolean;
  idVerified: boolean;
  role: string;
  listingLimitOverride: number | null;
  createdAt: string;
  _count: { properties: number };
}

const roleLabel: Record<string, string> = {
  user: "ผู้ใช้",
  agent: "เอเจนต์",
  admin: "แอดมิน",
};

const roleBadge: Record<string, string> = {
  user: "bg-slate-100 text-slate-700",
  agent: "bg-sky-100 text-sky-800",
  admin: "bg-violet-100 text-violet-800",
};

export function AdminUserTable({ users }: { users: AdminUser[] }) {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);

  async function patchUser(id: string, data: Record<string, boolean | string | number | null>) {
    setLoading(id);
    await fetch(`/api/admin/users/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    setLoading(null);
    router.refresh();
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
      <table className="w-full text-left text-sm">
        <thead className="border-b bg-slate-50 text-slate-600">
          <tr>
            <th className="px-4 py-3">ผู้ใช้</th>
            <th className="px-4 py-3">ยืนยัน</th>
            <th className="px-4 py-3">ประกาศ</th>
            <th className="px-4 py-3">บทบาท</th>
            <th className="px-4 py-3">โควตาประกาศ</th>
            <th className="px-4 py-3">จัดการ</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => {
            const isAdmin = u.role === "admin";
            const isAgent = u.role === "agent";
            return (
              <tr key={u.id} className="border-b last:border-0 align-top">
                <td className="px-4 py-3">
                  <p className="font-medium">{u.fullName}</p>
                  <p className="text-xs text-slate-500">{u.phone ?? u.email}</p>
                  <span className={`mt-1 inline-block rounded px-2 py-0.5 text-xs ${roleBadge[u.role] ?? roleBadge.user}`}>
                    {roleLabel[u.role] ?? u.role}
                  </span>
                </td>
                <td className="px-4 py-3 text-xs">
                  <p>{u.phoneVerified ? "✓ โทร" : "✗ โทร"}</p>
                  <p>{u.emailVerified ? "✓ อีเมล" : "✗ อีเมล"}</p>
                  <p>{u.idVerified ? "✓ บัตร" : "✗ บัตร"}</p>
                </td>
                <td className="px-4 py-3">{u._count.properties}</td>
                <td className="px-4 py-3">
                  <select
                    value={u.role}
                    disabled={loading === u.id}
                    onChange={(e) => patchUser(u.id, { role: e.target.value })}
                    className="rounded-lg border border-slate-300 px-2 py-1.5 text-xs outline-none ring-teal-500 focus:ring-2"
                  >
                    <option value="user">ผู้ใช้</option>
                    <option value="agent">เอเจนต์</option>
                    <option value="admin">แอดมิน</option>
                  </select>
                </td>
                <td className="px-4 py-3">
                  {isAdmin ? (
                    <span className="text-xs text-violet-700">ไม่จำกัด</span>
                  ) : (
                    <div className="flex items-center gap-1">
                      <input
                        type="number"
                        min={0}
                        max={1000}
                        defaultValue={u.listingLimitOverride ?? ""}
                        placeholder={isAgent ? "5" : "2"}
                        disabled={loading === u.id}
                        onBlur={(e) => {
                          const raw = e.target.value.trim();
                          const next = raw === "" ? null : Number(raw);
                          const current = u.listingLimitOverride;
                          if (next !== current) {
                            patchUser(u.id, { listingLimitOverride: next });
                          }
                        }}
                        className="w-20 rounded-lg border border-slate-300 px-2 py-1.5 text-xs outline-none ring-teal-500 focus:ring-2"
                      />
                      <span className="text-xs text-slate-400">{isAgent ? "(เอเจนต์)" : "(ฟรี+แพ็ก)"}</span>
                    </div>
                  )}
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-1">
                    {!u.idVerified && (
                      <button
                        type="button"
                        disabled={loading === u.id}
                        onClick={() => patchUser(u.id, { idVerified: true })}
                        className="rounded bg-teal-600 px-2 py-1 text-xs text-white"
                      >
                        ยืนยันบัตร
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
