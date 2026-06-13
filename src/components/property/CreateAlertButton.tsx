"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { type Locale } from "@/lib/i18n";

interface CreateAlertButtonProps {
  listingType: "sale" | "rent";
  locale: Locale;
}

export function CreateAlertButton({ listingType, locale }: CreateAlertButtonProps) {
  const searchParams = useSearchParams();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [frequency, setFrequency] = useState<"daily" | "weekly">("daily");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const nonTh = locale !== "th";

  const filters = {
    district: searchParams.get("district") || undefined,
    btsStation: searchParams.get("bts") || undefined,
    minPrice: searchParams.get("price")?.split("-")[0]
      ? parseInt(searchParams.get("price")!.split("-")[0])
      : undefined,
    maxPrice: searchParams.get("price")?.split("-")[1]
      ? parseInt(searchParams.get("price")!.split("-")[1])
      : undefined,
    bedrooms: searchParams.get("beds") ? parseInt(searchParams.get("beds")!) : undefined,
    propertyCategory: searchParams.get("category") || undefined,
  };

  const hasFilters = Object.values(filters).some(Boolean);

  async function handleCreate() {
    if (!name.trim()) {
      setError(nonTh ? "Please enter a name" : "กรุณาใส่ชื่อ");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/user/alerts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          listingType,
          filters,
          frequency,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Failed to create alert");
        return;
      }

      setSuccess(true);
      setTimeout(() => {
        setOpen(false);
        setSuccess(false);
        setName("");
      }, 2000);
    } catch {
      setError(nonTh ? "Network error" : "เกิดข้อผิดพลาดในการเชื่อมต่อ");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 rounded-lg border border-teal-200 bg-teal-50 px-4 py-2 text-sm font-medium text-teal-700 transition hover:bg-teal-100"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
          />
        </svg>
        {nonTh ? "Create Alert" : "สร้างการแจ้งเตือน"}
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
            <h2 className="text-lg font-bold text-slate-900">
              {nonTh ? "Create Search Alert" : "สร้างการแจ้งเตือนการค้นหา"}
            </h2>
            <p className="mt-1 text-sm text-slate-600">
              {nonTh
                ? "Get notified when new properties match your search"
                : "รับการแจ้งเตือนเมื่อมีทรัพย์ใหม่ตรงกับการค้นหา"}
            </p>

            {success ? (
              <div className="mt-6 rounded-lg bg-green-50 p-4 text-center">
                <svg
                  className="mx-auto h-8 w-8 text-green-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <p className="mt-2 font-medium text-green-800">
                  {nonTh ? "Alert created!" : "สร้างการแจ้งเตือนแล้ว!"}
                </p>
              </div>
            ) : (
              <>
                <div className="mt-4 space-y-4">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-700">
                      {nonTh ? "Alert Name" : "ชื่อการแจ้งเตือน"}
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder={nonTh ? "e.g. 2BR Asoke under 5M" : "เช่น 2 ห้องนอน อโศก ต่ำกว่า 5 ล้าน"}
                      className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 outline-none ring-teal-500 focus:ring-2"
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-700">
                      {nonTh ? "Frequency" : "ความถี่"}
                    </label>
                    <div className="flex gap-3">
                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          checked={frequency === "daily"}
                          onChange={() => setFrequency("daily")}
                          className="text-teal-600"
                        />
                        <span className="text-sm text-slate-700">
                          {nonTh ? "Daily" : "ทุกวัน"}
                        </span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          checked={frequency === "weekly"}
                          onChange={() => setFrequency("weekly")}
                          className="text-teal-600"
                        />
                        <span className="text-sm text-slate-700">
                          {nonTh ? "Weekly" : "ทุกสัปดาห์"}
                        </span>
                      </label>
                    </div>
                  </div>

                  {hasFilters && (
                    <div className="rounded-lg bg-slate-50 p-3">
                      <p className="text-xs font-medium text-slate-500 uppercase">
                        {nonTh ? "Current Filters" : "ตัวกรองปัจจุบัน"}
                      </p>
                      <ul className="mt-1 space-y-1 text-sm text-slate-700">
                        {filters.btsStation && (
                          <li>BTS: {filters.btsStation}</li>
                        )}
                        {filters.district && (
                          <li>{nonTh ? "District" : "เขต"}: {filters.district}</li>
                        )}
                        {filters.bedrooms && (
                          <li>{filters.bedrooms} {nonTh ? "Bedrooms" : "ห้องนอน"}</li>
                        )}
                        {(filters.minPrice || filters.maxPrice) && (
                          <li>
                            {nonTh ? "Price" : "ราคา"}: {filters.minPrice?.toLocaleString() || "0"} -{" "}
                            {filters.maxPrice?.toLocaleString() || "∞"}
                          </li>
                        )}
                      </ul>
                    </div>
                  )}
                </div>

                {error && (
                  <p className="mt-4 text-sm text-red-600">{error}</p>
                )}

                <div className="mt-6 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    className="flex-1 rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                  >
                    {nonTh ? "Cancel" : "ยกเลิก"}
                  </button>
                  <button
                    type="button"
                    onClick={handleCreate}
                    disabled={loading}
                    className="flex-1 rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-teal-700 disabled:opacity-50"
                  >
                    {loading
                      ? nonTh
                        ? "Creating..."
                        : "กำลังสร้าง..."
                      : nonTh
                        ? "Create Alert"
                        : "สร้างการแจ้งเตือน"}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
