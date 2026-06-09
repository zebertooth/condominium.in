"use client";

import Image from "next/image";
import { useRef, useState } from "react";

const MAX_IMAGES = 10;
const MAX_FILE_BYTES = 5 * 1024 * 1024;
const ACCEPTED = "image/jpeg,image/png,image/webp,image/gif";

export function ImageGalleryInput({
  images,
  onChange,
}: {
  images: string[];
  onChange: (images: string[]) => void;
}) {
  const [urlInput, setUrlInput] = useState("");
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function addImage() {
    const url = urlInput.trim();
    if (!url) return;

    try {
      new URL(url);
    } catch {
      setError("URL รูปภาพไม่ถูกต้อง");
      return;
    }

    if (images.length >= MAX_IMAGES) {
      setError(`เพิ่มรูปได้สูงสุด ${MAX_IMAGES} รูป`);
      return;
    }

    if (images.includes(url)) {
      setError("รูปนี้มีอยู่แล้ว");
      return;
    }

    onChange([...images, url]);
    setUrlInput("");
    setError("");
  }

  async function handleFiles(fileList: FileList | null) {
    if (!fileList || fileList.length === 0) return;
    setError("");

    const files = Array.from(fileList);
    let current = [...images];

    setUploading(true);
    try {
      for (const file of files) {
        if (current.length >= MAX_IMAGES) {
          setError(`เพิ่มรูปได้สูงสุด ${MAX_IMAGES} รูป`);
          break;
        }
        if (file.size > MAX_FILE_BYTES) {
          setError(`"${file.name}" ใหญ่เกิน 5MB`);
          continue;
        }

        const formData = new FormData();
        formData.append("file", file);

        const res = await fetch("/api/upload", { method: "POST", body: formData });
        const data = await res.json();

        if (!res.ok) {
          setError(data.error ?? "อัปโหลดรูปไม่สำเร็จ");
          continue;
        }

        current = [...current, data.url];
        onChange(current);
      }
    } catch {
      setError("อัปโหลดรูปไม่สำเร็จ ลองใหม่อีกครั้ง");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  function removeImage(index: number) {
    onChange(images.filter((_, i) => i !== index));
  }

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-slate-700">
        รูปภาพ (แกลเลอรี) — {images.length}/{MAX_IMAGES}
      </label>

      <input
        ref={fileInputRef}
        type="file"
        accept={ACCEPTED}
        multiple
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />
      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        disabled={uploading || images.length >= MAX_IMAGES}
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
              addImage();
            }
          }}
        />
        <button
          type="button"
          onClick={addImage}
          className="shrink-0 rounded-xl bg-slate-800 px-4 py-3 text-sm font-medium text-white hover:bg-slate-900"
        >
          เพิ่มรูป
        </button>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      {images.length > 0 ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {images.map((src, i) => (
            <div key={src + i} className="group relative aspect-[4/3] overflow-hidden rounded-xl bg-slate-100">
              <Image src={src} alt={`รูป ${i + 1}`} fill className="object-cover" sizes="200px" />
              <button
                type="button"
                onClick={() => removeImage(i)}
                className="absolute right-2 top-2 rounded-full bg-red-600 px-2 py-1 text-xs text-white opacity-90 hover:opacity-100"
              >
                ลบ
              </button>
              {i === 0 && (
                <span className="absolute bottom-2 left-2 rounded bg-teal-600 px-2 py-0.5 text-xs text-white">
                  รูปหลัก
                </span>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="rounded-xl border border-dashed border-slate-300 p-6 text-center text-sm text-slate-500">
          ยังไม่มีรูป — อัปโหลดจากเครื่องหรือเพิ่ม URL รูปภาพเพื่อดูตัวอย่างแกลเลอรี
        </p>
      )}
    </div>
  );
}
