"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { useT } from "@/components/i18n/LocaleProvider";
import { countPostingVerifications, isPostingVerified, POSTING_VERIFICATION_REQUIRED } from "@/lib/verification";

interface AdminUser {
  id: string;
  fullName: string;
  phone: string | null;
  email: string | null;
  phoneVerified: boolean;
  emailVerified: boolean;
  idVerified: boolean;
  lineVerified: boolean;
  role: string;
  listingLimitOverride: number | null;
  createdAt: string;
  _count: { properties: number };
}

const emptyForm = {
  fullName: "",
  phone: "",
  email: "",
  password: "",
  role: "user",
};

function matchesQuery(user: AdminUser, query: string): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;

  if (user.fullName.toLowerCase().includes(q)) return true;
  if (user.email?.toLowerCase().includes(q)) return true;
  if (user.phone?.includes(q)) return true;

  const digits = q.replace(/\D/g, "");
  if (digits.length >= 3) {
    const phoneDigits = user.phone?.replace(/\D/g, "") ?? "";
    if (phoneDigits.includes(digits)) return true;
  }

  return false;
}

export function AdminUserTable({ users }: { users: AdminUser[] }) {
  const router = useRouter();
  const t = useT();
  const [loading, setLoading] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const roleLabel = useMemo(
    () => ({
      user: t("adminRoleUser"),
      agent: t("adminRoleAgent"),
      admin: t("adminRoleAdmin"),
    }),
    [t],
  );

  const roleBadge: Record<string, string> = {
    user: "bg-slate-100 text-slate-700",
    agent: "bg-sky-100 text-sky-800",
    admin: "bg-violet-100 text-violet-800",
  };

  const filtered = useMemo(
    () => users.filter((u) => matchesQuery(u, query)),
    [users, query],
  );

  async function patchUser(id: string, data: Record<string, boolean | string | number | null>) {
    setLoading(id);
    setError("");
    const res = await fetch(`/api/admin/users/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const result = await res.json();
    setLoading(null);
    if (!res.ok) {
      setError(result.error ?? t("adminUsersSaveError"));
      return;
    }
    router.refresh();
  }

  async function deleteUser(id: string, name: string) {
    if (!confirm(t("adminUsersDeleteConfirm").replace("{name}", name))) return;
    setLoading(id);
    setError("");
    const res = await fetch(`/api/admin/users/${id}`, { method: "DELETE" });
    const result = await res.json();
    setLoading(null);
    if (!res.ok) {
      setError(result.error ?? t("adminUsersDeleteError"));
      return;
    }
    setMessage(result.message ?? t("adminUsersDeleted"));
    router.refresh();
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage("");
    setError("");

    const res = await fetch("/api/admin/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fullName: form.fullName.trim(),
        phone: form.phone.trim() || undefined,
        email: form.email.trim() || undefined,
        password: form.password,
        role: form.role,
      }),
    });
    const data = await res.json();
    setSaving(false);

    if (!res.ok) {
      setError(data.error ?? t("adminUsersCreateError"));
      return;
    }

    setMessage(data.message ?? t("adminUsersCreated"));
    setForm(emptyForm);
    setShowForm(false);
    router.refresh();
  }

  return (
    <div className="space-y-4">
      {message && <p className="rounded-lg bg-green-50 px-4 py-3 text-sm text-green-800">{message}</p>}
      {error && <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t("adminUsersSearch")}
          className="w-full max-w-md rounded-xl border border-slate-300 px-4 py-2.5 text-sm outline-none ring-teal-500 focus:ring-2"
        />
        <button
          type="button"
          onClick={() => {
            setShowForm((v) => !v);
            setError("");
          }}
          className="shrink-0 rounded-xl bg-teal-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-teal-500"
        >
          {showForm ? t("adminCancel") : t("adminUsersAdd")}
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleCreate}
          className="rounded-2xl border border-slate-200 bg-white p-6 space-y-4"
        >
          <h2 className="text-lg font-bold text-slate-900">{t("adminUsersAdd")}</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block sm:col-span-2">
              <span className="text-sm font-medium text-slate-700">{t("adminUsersFullName")}</span>
              <input
                required
                value={form.fullName}
                onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                className="mt-1 w-full rounded-xl border border-slate-300 px-4 py-2"
              />
            </label>
            <label className="block">
              <span className="text-sm font-medium text-slate-700">{t("adminUsersPhone")}</span>
              <input
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="08xxxxxxxx"
                className="mt-1 w-full rounded-xl border border-slate-300 px-4 py-2"
              />
            </label>
            <label className="block">
              <span className="text-sm font-medium text-slate-700">{t("adminUsersEmail")}</span>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="mt-1 w-full rounded-xl border border-slate-300 px-4 py-2"
              />
            </label>
            <label className="block">
              <span className="text-sm font-medium text-slate-700">{t("adminUsersPassword")}</span>
              <input
                required
                type="password"
                minLength={6}
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="mt-1 w-full rounded-xl border border-slate-300 px-4 py-2"
              />
            </label>
            <label className="block">
              <span className="text-sm font-medium text-slate-700">{t("adminColRole")}</span>
              <select
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
                className="mt-1 w-full rounded-xl border border-slate-300 px-4 py-2"
              >
                <option value="user">{t("adminRoleUser")}</option>
                <option value="agent">{t("adminRoleAgent")}</option>
                <option value="admin">{t("adminRoleAdmin")}</option>
              </select>
            </label>
          </div>
          <p className="text-xs text-slate-500">{t("adminUsersAddHint")}</p>
          <div className="flex gap-3">
            <button
              type="submit"
              disabled={saving}
              className="rounded-xl bg-slate-900 px-6 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-50"
            >
              {saving ? t("adminSeoSaving") : t("adminUsersAdd")}
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="rounded-xl border border-slate-300 px-6 py-2 text-sm text-slate-700"
            >
              {t("adminCancel")}
            </button>
          </div>
        </form>
      )}

      {filtered.length === 0 ? (
        <p className="text-sm text-slate-500">{t("adminUsersNoResults")}</p>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="border-b bg-slate-50 text-slate-600">
              <tr>
                <th className="px-4 py-3">{t("adminUsers")}</th>
                <th className="px-4 py-3">{t("adminColVerify")}</th>
                <th className="px-4 py-3">{t("adminColListings")}</th>
                <th className="px-4 py-3">{t("adminColRole")}</th>
                <th className="px-4 py-3">{t("adminColQuota")}</th>
                <th className="px-4 py-3">{t("adminColActions")}</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((u) => {
                const isAdmin = u.role === "admin";
                const isAgent = u.role === "agent";
                return (
                  <tr key={u.id} className="border-b last:border-0 align-top">
                    <td className="px-4 py-3">
                      <p className="font-medium">{u.fullName}</p>
                      {u.phone && <p className="text-xs text-slate-500">{u.phone}</p>}
                      {u.email && <p className="text-xs text-slate-500">{u.email}</p>}
                      <span
                        className={`mt-1 inline-block rounded px-2 py-0.5 text-xs ${roleBadge[u.role] ?? roleBadge.user}`}
                      >
                        {roleLabel[u.role as keyof typeof roleLabel] ?? u.role}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs">
                      <p className="mb-2 font-medium text-slate-700">
                        {countPostingVerifications(u)}/{POSTING_VERIFICATION_REQUIRED}{" "}
                        {isPostingVerified(u) ? (
                          <span className="text-green-700">{t("adminVerifyCanPost")}</span>
                        ) : (
                          <span className="text-amber-700">{t("adminVerifyCannotPost")}</span>
                        )}
                      </p>
                      <VerifyToggle
                        label={t("adminVerifyPhoneLabel")}
                        verified={u.phoneVerified}
                        loading={loading === u.id}
                        setLabel={t("adminVerifySet")}
                        unsetLabel={t("adminVerifyUnset")}
                        onSet={(value) => patchUser(u.id, { phoneVerified: value })}
                      />
                      <VerifyToggle
                        label={t("adminVerifyEmailLabel")}
                        verified={u.emailVerified}
                        loading={loading === u.id}
                        setLabel={t("adminVerifySet")}
                        unsetLabel={t("adminVerifyUnset")}
                        onSet={(value) => patchUser(u.id, { emailVerified: value })}
                      />
                      <VerifyToggle
                        label={t("adminVerifyIdLabel")}
                        verified={u.idVerified}
                        loading={loading === u.id}
                        setLabel={t("adminVerifySet")}
                        unsetLabel={t("adminVerifyUnset")}
                        onSet={(value) => patchUser(u.id, { idVerified: value })}
                      />
                      <VerifyToggle
                        label="LINE"
                        verified={u.lineVerified}
                        loading={loading === u.id}
                        setLabel={t("adminVerifySet")}
                        unsetLabel={t("adminVerifyUnset")}
                        onSet={(value) => patchUser(u.id, { lineVerified: value })}
                      />
                      <p className="mt-1 text-[11px] text-slate-400">{t("adminVerifyIdentityHint")}</p>
                    </td>
                    <td className="px-4 py-3">{u._count.properties}</td>
                    <td className="px-4 py-3">
                      <select
                        value={u.role}
                        disabled={loading === u.id}
                        onChange={(e) => patchUser(u.id, { role: e.target.value })}
                        className="rounded-lg border border-slate-300 px-2 py-1.5 text-xs outline-none ring-teal-500 focus:ring-2"
                      >
                        <option value="user">{t("adminRoleUser")}</option>
                        <option value="agent">{t("adminRoleAgent")}</option>
                        <option value="admin">{t("adminRoleAdmin")}</option>
                      </select>
                    </td>
                    <td className="px-4 py-3">
                      {isAdmin ? (
                        <span className="text-xs text-violet-700">{t("unlimited")}</span>
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
                          <span className="text-xs text-slate-400">
                            {isAgent ? t("adminQuotaAgent") : t("adminQuotaUser")}
                          </span>
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        <button
                          type="button"
                          disabled={loading === u.id}
                          onClick={() => deleteUser(u.id, u.fullName)}
                          className="rounded border border-red-200 px-2 py-1 text-xs text-red-600 hover:bg-red-50"
                        >
                          {t("adminDelete")}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {query && filtered.length > 0 && (
        <p className="text-xs text-slate-500">
          {t("adminUsersResultCount").replace("{count}", String(filtered.length))}
        </p>
      )}
    </div>
  );
}

function VerifyToggle({
  label,
  verified,
  loading,
  setLabel,
  unsetLabel,
  onSet,
}: {
  label: string;
  verified: boolean;
  loading: boolean;
  setLabel: string;
  unsetLabel: string;
  onSet: (value: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-2 py-0.5">
      <span className={verified ? "text-green-700" : "text-slate-500"}>
        {verified ? "✓" : "✗"} {label}
      </span>
      <button
        type="button"
        disabled={loading}
        onClick={() => onSet(!verified)}
        className="shrink-0 text-teal-700 hover:underline disabled:opacity-50"
      >
        {verified ? unsetLabel : setLabel}
      </button>
    </div>
  );
}
