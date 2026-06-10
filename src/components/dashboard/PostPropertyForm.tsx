"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useT } from "@/components/i18n/LocaleProvider";
import { ImageGalleryInput } from "@/components/property/ImageGalleryInput";
import { LocationPicker } from "@/components/property/LocationPicker";
import { BTS_LOCATIONS } from "@/lib/locations";
import type { Property } from "@/types/property";

const DEFAULT_IMAGE = "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80";

interface PostPropertyFormProps {
  initial?: Property;
  propertyId?: string;
  endpoint?: string;
  method?: "POST" | "PUT";
  redirectTo?: string;
  adminEdit?: boolean;
}

export function PostPropertyForm({
  initial,
  propertyId,
  endpoint,
  method,
  redirectTo = "/dashboard",
  adminEdit = false,
}: PostPropertyFormProps = {}) {
  const router = useRouter();
  const t = useT();
  const isEdit = Boolean(propertyId);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<string[]>(initial?.images ?? []);
  const [latitude, setLatitude] = useState<number | null>(initial?.latitude ?? null);
  const [longitude, setLongitude] = useState<number | null>(initial?.longitude ?? null);
  const [btsStation, setBtsStation] = useState(initial?.btsStation ?? "");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const form = new FormData(e.currentTarget);
    const finalImages = images.length > 0 ? images : [DEFAULT_IMAGE];

    const url = endpoint ?? (isEdit ? `/api/user/properties/${propertyId}` : "/api/user/properties");
    const httpMethod = method ?? (isEdit ? "PUT" : "POST");

    const res = await fetch(url, {
      method: httpMethod,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: form.get("title"),
        description: form.get("description"),
        listingType: form.get("listingType"),
        propertyType: "condo",
        price: Number(form.get("price")),
        bedrooms: Number(form.get("bedrooms")),
        bathrooms: Number(form.get("bathrooms")),
        areaSqm: Number(form.get("areaSqm")),
        floor: form.get("floor") ? Number(form.get("floor")) : undefined,
        district: form.get("district"),
        btsStation: btsStation || undefined,
        address: form.get("address"),
        latitude: latitude ?? undefined,
        longitude: longitude ?? undefined,
        features: String(form.get("features") || "").split(",").map((f) => f.trim()).filter(Boolean),
        images: finalImages,
      }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error ?? (isEdit ? t("formEditFail") : t("formPostFail")));
      return;
    }

    router.push(redirectTo);
    router.refresh();
  }

  function handleBtsChange(station: string) {
    setBtsStation(station);
    const loc = BTS_LOCATIONS[station];
    if (loc) {
      setLatitude(loc.lat);
      setLongitude(loc.lng);
    }
  }

  const inputClass = "mt-1 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none ring-teal-500 focus:ring-2";

  return (
    <form onSubmit={handleSubmit} className="space-y-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      {error && <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

      <div>
        <label className="block text-sm font-medium text-slate-700">{t("formTitle")}</label>
        <input name="title" required defaultValue={initial?.title} className={inputClass} />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700">{t("formDescription")}</label>
        <textarea name="description" required rows={4} minLength={20} defaultValue={initial?.description} className={inputClass} />
      </div>

      <ImageGalleryInput images={images} onChange={setImages} />

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-slate-700">{t("formType")}</label>
          <select name="listingType" defaultValue={initial?.listingType ?? "rent"} className={inputClass}>
            <option value="rent">{t("rent")}</option>
            <option value="sale">{t("sale")}</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700">{t("formPrice")}</label>
          <input name="price" type="number" required min={1} defaultValue={initial?.price} className={inputClass} />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <label className="block text-sm font-medium text-slate-700">{t("bedrooms")}</label>
          <input name="bedrooms" type="number" required min={0} defaultValue={initial?.bedrooms} className={inputClass} />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700">{t("bathrooms")}</label>
          <input name="bathrooms" type="number" required min={1} defaultValue={initial?.bathrooms} className={inputClass} />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700">{t("sqm")}</label>
          <input name="areaSqm" type="number" required min={1} defaultValue={initial?.areaSqm} className={inputClass} />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-slate-700">{t("formDistrict")}</label>
          <input name="district" required defaultValue={initial?.district} className={inputClass} />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700">{t("formBts")}</label>
          <select
            value={btsStation}
            onChange={(e) => handleBtsChange(e.target.value)}
            className={inputClass}
          >
            <option value="">{t("formSelect")}</option>
            {Object.keys(BTS_LOCATIONS).map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700">{t("formAddress")}</label>
        <input name="address" required defaultValue={initial?.address} className={inputClass} />
      </div>

      <LocationPicker
        latitude={latitude}
        longitude={longitude}
        btsStation={btsStation}
        onChange={(lat, lng) => {
          setLatitude(lat);
          setLongitude(lng);
        }}
      />

      <div>
        <label className="block text-sm font-medium text-slate-700">{t("formFloor")}</label>
        <input name="floor" type="number" defaultValue={initial?.floor} className={inputClass} />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700">{t("formFeatures")}</label>
        <input name="features" placeholder={t("formFeaturesPlaceholder")} defaultValue={initial?.features?.join(", ")} className={inputClass} />
      </div>

      <button type="submit" disabled={loading} className="w-full rounded-xl bg-teal-600 py-3 font-medium text-white hover:bg-teal-700 disabled:opacity-50">
        {loading
          ? isEdit ? t("formSaving") : t("formSubmitting")
          : adminEdit
            ? t("formSubmitEditAdmin")
            : isEdit
              ? t("formSubmitEditPending")
              : t("formSubmitNew")}
      </button>
    </form>
  );
}
