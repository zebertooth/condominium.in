"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useT } from "@/components/i18n/LocaleProvider";
import { SingleImageInput } from "@/components/admin/SingleImageInput";

interface TeamAgentRow {
  id: string;
  name: string;
  role: string;
  roleEn: string;
  areas: string[];
  languages: string[];
  deals: number;
  imageUrl: string;
  sortOrder: number;
  published: boolean;
}

const emptyForm = {
  name: "",
  role: "",
  roleEn: "",
  areasText: "",
  languagesText: "",
  deals: 0,
  imageUrl: "",
  sortOrder: 0,
  published: true,
};

export function AdminTeamAgentsPanel() {
  const t = useT();
  const [agents, setAgents] = useState<TeamAgentRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);

  function loadAgents() {
    setLoading(true);
    fetch("/api/admin/team-agents")
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setError(data.error);
          return;
        }
        setAgents(data.agents ?? []);
      })
      .catch(() => setError(t("adminTeamLoadError")))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    loadAgents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function startEdit(agent: TeamAgentRow) {
    setEditId(agent.id);
    setForm({
      name: agent.name,
      role: agent.role,
      roleEn: agent.roleEn,
      areasText: agent.areas.join(", "),
      languagesText: agent.languages.join(", "),
      deals: agent.deals,
      imageUrl: agent.imageUrl,
      sortOrder: agent.sortOrder,
      published: agent.published,
    });
    setMessage("");
    setError("");
  }

  function startNew() {
    setEditId("new");
    setForm({ ...emptyForm, sortOrder: agents.length });
    setMessage("");
    setError("");
  }

  function cancelForm() {
    setEditId(null);
    setForm(emptyForm);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage("");
    setError("");

    const payload = {
      name: form.name.trim(),
      role: form.role.trim(),
      roleEn: form.roleEn.trim(),
      areas: form.areasText.split(",").map((s) => s.trim()).filter(Boolean),
      languages: form.languagesText.split(",").map((s) => s.trim()).filter(Boolean),
      deals: form.deals,
      imageUrl: form.imageUrl,
      sortOrder: form.sortOrder,
      published: form.published,
    };

    const isNew = editId === "new";
    const url = isNew ? "/api/admin/team-agents" : `/api/admin/team-agents/${editId}`;
    const method = isNew ? "POST" : "PATCH";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    setSaving(false);

    if (!res.ok) {
      setError(data.error ?? t("adminTeamSaveError"));
      return;
    }

    setMessage(data.message ?? t("adminTeamSaved"));
    cancelForm();
    loadAgents();
  }

  async function handleDelete(id: string) {
    if (!confirm(t("adminTeamDeleteConfirm"))) return;
    const res = await fetch(`/api/admin/team-agents/${id}`, { method: "DELETE" });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error ?? t("adminTeamDeleteError"));
      return;
    }
    loadAgents();
  }

  if (loading) {
    return <p className="text-sm text-slate-500">{t("loading")}</p>;
  }

  return (
    <div className="space-y-8">
      {message && <p className="rounded-lg bg-green-50 px-4 py-3 text-sm text-green-800">{message}</p>}
      {error && <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}

      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-600">{t("adminTeamDesc")}</p>
        {!editId && (
          <button
            type="button"
            onClick={startNew}
            className="rounded-xl bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-500"
          >
            {t("adminTeamAdd")}
          </button>
        )}
      </div>

      {editId && (
        <form onSubmit={handleSubmit} className="rounded-2xl border border-slate-200 bg-white p-6 space-y-4">
          <h2 className="text-lg font-bold text-slate-900">
            {editId === "new" ? t("adminTeamAdd") : t("adminTeamEdit")}
          </h2>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="text-sm font-medium text-slate-700">{t("adminTeamName")}</span>
              <input
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="mt-1 w-full rounded-xl border border-slate-300 px-4 py-2"
              />
            </label>
            <label className="block">
              <span className="text-sm font-medium text-slate-700">{t("adminTeamRole")}</span>
              <input
                required
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
                className="mt-1 w-full rounded-xl border border-slate-300 px-4 py-2"
              />
            </label>
            <label className="block">
              <span className="text-sm font-medium text-slate-700">{t("adminTeamRoleEn")}</span>
              <input
                value={form.roleEn}
                onChange={(e) => setForm({ ...form, roleEn: e.target.value })}
                className="mt-1 w-full rounded-xl border border-slate-300 px-4 py-2"
              />
            </label>
            <label className="block">
              <span className="text-sm font-medium text-slate-700">{t("adminTeamDeals")}</span>
              <input
                type="number"
                min={0}
                value={form.deals}
                onChange={(e) => setForm({ ...form, deals: Number(e.target.value) })}
                className="mt-1 w-full rounded-xl border border-slate-300 px-4 py-2"
              />
            </label>
            <label className="block sm:col-span-2">
              <span className="text-sm font-medium text-slate-700">{t("adminTeamAreas")}</span>
              <input
                value={form.areasText}
                onChange={(e) => setForm({ ...form, areasText: e.target.value })}
                placeholder="อโศก, ทองหล่อ, เอกมัย"
                className="mt-1 w-full rounded-xl border border-slate-300 px-4 py-2"
              />
            </label>
            <label className="block sm:col-span-2">
              <span className="text-sm font-medium text-slate-700">{t("adminTeamLanguages")}</span>
              <input
                value={form.languagesText}
                onChange={(e) => setForm({ ...form, languagesText: e.target.value })}
                placeholder="ไทย, English"
                className="mt-1 w-full rounded-xl border border-slate-300 px-4 py-2"
              />
            </label>
            <label className="block">
              <span className="text-sm font-medium text-slate-700">{t("adminTeamSort")}</span>
              <input
                type="number"
                min={0}
                value={form.sortOrder}
                onChange={(e) => setForm({ ...form, sortOrder: Number(e.target.value) })}
                className="mt-1 w-full rounded-xl border border-slate-300 px-4 py-2"
              />
            </label>
            <label className="flex items-center gap-2 pt-6">
              <input
                type="checkbox"
                checked={form.published}
                onChange={(e) => setForm({ ...form, published: e.target.checked })}
              />
              <span className="text-sm text-slate-700">{t("adminTeamPublished")}</span>
            </label>
          </div>

          <SingleImageInput
            imageUrl={form.imageUrl}
            onChange={(url) => setForm({ ...form, imageUrl: url })}
            label={t("adminTeamPhoto")}
          />

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={saving}
              className="rounded-xl bg-slate-900 px-6 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-50"
            >
              {saving ? t("adminSeoSaving") : t("adminSeoSave")}
            </button>
            <button
              type="button"
              onClick={cancelForm}
              className="rounded-xl border border-slate-300 px-6 py-2 text-sm text-slate-700"
            >
              {t("adminCancel")}
            </button>
          </div>
        </form>
      )}

      {agents.length === 0 ? (
        <p className="text-sm text-slate-500">{t("adminTeamEmpty")}</p>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
          <table className="w-full text-sm">
            <thead className="border-b border-slate-200 bg-slate-50 text-left">
              <tr>
                <th className="px-4 py-3">{t("adminTeamPhoto")}</th>
                <th className="px-4 py-3">{t("adminTeamName")}</th>
                <th className="px-4 py-3">{t("adminTeamRole")}</th>
                <th className="px-4 py-3">{t("adminTeamDeals")}</th>
                <th className="px-4 py-3">{t("adminColStatus")}</th>
                <th className="px-4 py-3">{t("adminColActions")}</th>
              </tr>
            </thead>
            <tbody>
              {agents.map((agent) => (
                <tr key={agent.id} className="border-b border-slate-100">
                  <td className="px-4 py-3">
                    {agent.imageUrl ? (
                      <div className="relative h-10 w-10 overflow-hidden rounded-full">
                        <Image src={agent.imageUrl} alt="" fill className="object-cover" sizes="40px" />
                      </div>
                    ) : (
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-teal-100 text-sm font-bold text-teal-700">
                        {agent.name.charAt(2) || "?"}
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3 font-medium">{agent.name}</td>
                  <td className="px-4 py-3 text-slate-600">{agent.role}</td>
                  <td className="px-4 py-3">{agent.deals}+</td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs ${
                        agent.published ? "bg-green-100 text-green-800" : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {agent.published ? t("adminTeamPublished") : t("adminTeamHidden")}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => startEdit(agent)}
                        className="text-teal-700 hover:underline"
                      >
                        {t("adminEdit")}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(agent.id)}
                        className="text-red-600 hover:underline"
                      >
                        {t("adminDelete")}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
