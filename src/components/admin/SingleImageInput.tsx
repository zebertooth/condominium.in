"use client";

import Image from "next/image";
import { useRef, useState } from "react";

const MAX_FILE_BYTES = 5 * 1024 * 1024;
const ACCEPTED = "image/jpeg,image/png,image/webp,image/gif";

export function SingleImageInput({
  imageUrl,
  onChange,
  label = "รูปภาพปก",
}: {
  imageUrl: string;
  onChange: (url: string) => void;
  label?: string;
}) {
  const [urlInput, setUrlInput] = useState("");
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function applyUrl() {
    const url = urlInput.trim();
    if (!url) return;
    try {
      new URL(url);
    } catch {
      setError("URL รูปภาพไม่ถูกต้อง");
      return;
    }
    onChange(url);
    setUrlInput("");
    setError("");
  }

  async function handleFile(file: File | undefined) {
    if (!file) return;
    setError("");
    if (file.size > MAX_FILE_BYTES) {
      setError(`"${file.name}" ใหญ่เกิน 5MB`);
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "อัปโหลดรูปไม่สำเร็จ");
        return;
      }
      onChange(data.url);
    } catch {
      setError("อัปโหลดรูปไม่สำเร็จ ลองใหม่อีกครั้ง");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-slate-700">{label}</label>

      <input
        ref={fileInputRef}
        type="file"
        accept={ACCEPTED}
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />
      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        disabled={uploading}
        className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-teal-300 bg-teal-50 px-4 py-4 text-sm font-medium text-teal-700 hover:border-teal-400 hover:bg-teal-100 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {uploading ? "กำลังอัปโหลด..." : "อัปโหลดรูปจากเครื่อง (JPG, PNG, WebP, GIF — สูงสุด 5MB)"}
      </button>

      <div className="flex items-center gap-3 text-xs text-slate-400">
        <span className="h-px flex-1 bg-slate-200" />
        หรือวาง URL รูปภาพ
        <span className="h-px flex-1 bg-slate-200" />
      </div>

      <div className="flex gap-2">
        <input
          type="url"
          value={urlInput}
          onChange={(e) => setUrlInput(e.target.value)}
          placeholder="https://... URL รูปภาพ"
          className="flex-1 rounded-xl border border-slate-300 px-4 py-3 outline-none ring-teal-500 focus:ring-2"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              applyUrl();
            }
          }}
        />
        <button
          type="button"
          onClick={applyUrl}
          className="shrink-0 rounded-xl bg-slate-800 px-4 py-3 text-sm font-medium text-white hover:bg-slate-900"
        >
          ใช้ URL
        </button>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      {imageUrl ? (
        <div className="relative aspect-[16/9] max-w-md overflow-hidden rounded-xl bg-slate-100">
          <Image src={imageUrl} alt="Preview" fill className="object-cover" sizes="400px" />
          <button
            type="button"
            onClick={() => onChange("")}
            className="absolute right-2 top-2 rounded-full bg-red-600 px-2 py-1 text-xs text-white"
          >
            ลบ
          </button>
        </div>
      ) : (
        <p className="rounded-xl border border-dashed border-slate-300 p-4 text-center text-sm text-slate-500">
          ยังไม่มีรูปปก
        </p>
      )}
    </div>
  );
}
