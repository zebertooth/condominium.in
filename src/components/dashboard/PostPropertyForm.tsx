"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useT } from "@/components/i18n/LocaleProvider";
import { ImageGalleryInput } from "@/components/property/ImageGalleryInput";
import { LocationPicker } from "@/components/property/LocationPicker";
import {
  findStationId,
  getStationById,
  getStationCoords,
  STATION_CATEGORY_ORDER,
  stationsByCategory,
} from "@/lib/locations";
import { LOCALE_FORM_GROUPS } from "@/lib/property-locale-fields";
import {
  PROPERTY_TYPES,
  showsRoomCounts,
} from "@/lib/property-types";
import type { Property, PropertyType } from "@/types/property";

const DEFAULT_IMAGE = "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80";

const CATEGORY_LABEL_KEYS = {
  bts: "stationGroupBts",
  mrt: "stationGroupMrt",
  gold: "stationGroupGold",
  brt: "stationGroupBrt",
  train: "stationGroupTrain",
  airport: "stationGroupAirport",
} as const;

interface PostPropertyFormProps {
  initial?: Property;
  propertyId?: string;
  endpoint?: string;
  method?: "POST" | "PUT";
  redirectTo?: string;
  adminEdit?: boolean;
  showAgentManaged?: boolean;
}

export function PostPropertyForm({
  initial,
  propertyId,
  endpoint,
  method,
  redirectTo = "/dashboard",
  adminEdit = false,
  showAgentManaged = false,
}: PostPropertyFormProps = {}) {
  const router = useRouter();
  const t = useT();
  const isEdit = Boolean(propertyId);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [agentManaged, setAgentManaged] = useState(initial?.agentManaged ?? false);
  const [propertyType, setPropertyType] = useState<PropertyType>(initial?.propertyType ?? "condo");
  const [images, setImages] = useState<string[]>(initial?.images ?? []);
  const [latitude, setLatitude] = useState<number | null>(initial?.latitude ?? null);
  const [longitude, setLongitude] = useState<number | null>(initial?.longitude ?? null);
  const [nearbyStationId, setNearbyStationId] = useState(
    findStationId(initial?.btsStation) || "",
  );
  const [projectId, setProjectId] = useState(initial?.projectId ?? "");
  const [projectOptions, setProjectOptions] = useState<
    { id: string; name: string; nameEn: string }[]
  >([]);

  useEffect(() => {
    fetch("/api/projects")
      .then((res) => res.json())
      .then((data) => setProjectOptions(data.projects ?? []))
      .catch(() => setProjectOptions([]));
  }, []);

  function applyCoords(lat: number, lng: number) {
    setLatitude(lat);
    setLongitude(lng);
  }

  function handleStationChange(stationId: string) {
    setNearbyStationId(stationId);
    const coords = getStationCoords(stationId);
    if (coords) applyCoords(coords.lat, coords.lng);
  }

  function handlePinMoved() {
    setNearbyStationId("");
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const form = new FormData(e.currentTarget);
    const finalImages = images.length > 0 ? images : [DEFAULT_IMAGE];
    const station = getStationById(nearbyStationId);

    const url = endpoint ?? (isEdit ? `/api/user/properties/${propertyId}` : "/api/user/properties");
    const httpMethod = method ?? (isEdit ? "PUT" : "POST");

    const res = await fetch(url, {
      method: httpMethod,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: form.get("title"),
        description: form.get("description"),
        titleEn: form.get("titleEn"),
        descriptionEn: form.get("descriptionEn"),
        titleZh: form.get("titleZh"),
        descriptionZh: form.get("descriptionZh"),
        titleJa: form.get("titleJa"),
        descriptionJa: form.get("descriptionJa"),
        titleAr: form.get("titleAr"),
        descriptionAr: form.get("descriptionAr"),
        highlights: String(form.get("highlights") || ""),
        listingType: form.get("listingType"),
        propertyType,
        price: Number(form.get("price")),
        bedrooms: Number(form.get("bedrooms")),
        bathrooms: Number(form.get("bathrooms")),
        areaSqm: Number(form.get("areaSqm")),
        landSqWah: form.get("landSqWah") ? Number(form.get("landSqWah")) : undefined,
        floor: form.get("floor") ? Number(form.get("floor")) : undefined,
        district: form.get("district"),
        btsStation: station?.label || undefined,
        address: form.get("address"),
        latitude: latitude ?? undefined,
        longitude: longitude ?? undefined,
        npaBank: String(form.get("npaBank") || "") || undefined,
        npaReferenceUrl: String(form.get("npaReferenceUrl") || "") || undefined,
        features: String(form.get("features") || "").split(",").map((f) => f.trim()).filter(Boolean),
        furnishing: String(form.get("furnishing") || "unknown"),
        images: finalImages,
        projectId: projectId || null,
        ...(showAgentManaged ? { agentManaged } : {}),
      }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error ?? (isEdit ? t("formEditFail") : t("formPostFail")));
      return;
    }

    if (!isEdit && httpMethod === "POST") {
      router.push("/dashboard?posted=1");
    } else {
      router.push(redirectTo);
    }
    router.refresh();
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

      <details className="rounded-xl border border-slate-200 bg-slate-50/80 p-4">
        <summary className="cursor-pointer text-sm font-semibold text-slate-800">
          {t("formTranslationsSection")}
        </summary>
        <p className="mt-2 text-xs text-slate-600">{t("formTranslationsHint")}</p>
        <div className="mt-4 space-y-6">
          {LOCALE_FORM_GROUPS.map((group) => (
            <div key={group.locale} className="space-y-3 border-t border-slate-200 pt-4 first:border-t-0 first:pt-0">
              <p className="text-sm font-medium text-teal-800">{t(group.labelKey)}</p>
              <div>
                <label className="block text-xs font-medium text-slate-600">{t("formLocaleTitle")}</label>
                <input
                  name={group.titleKey}
                  defaultValue={initial?.[group.titleKey as keyof Property] as string | undefined}
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600">{t("formLocaleDescription")}</label>
                <textarea
                  name={group.descriptionKey}
                  rows={3}
                  defaultValue={initial?.[group.descriptionKey as keyof Property] as string | undefined}
                  className={inputClass}
                />
              </div>
            </div>
          ))}
        </div>
      </details>

      <div>
        <label className="block text-sm font-medium text-slate-700">{t("formHighlights")}</label>
        <p className="mt-1 text-xs text-slate-500">{t("formHighlightsHint")}</p>
        <textarea
          name="highlights"
          rows={4}
          maxLength={2000}
          placeholder={t("formHighlightsPlaceholder")}
          defaultValue={initial?.highlights ?? ""}
          className={inputClass}
        />
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
          <label className="block text-sm font-medium text-slate-700">{t("formPropertyType")}</label>
          <select
            value={propertyType}
            onChange={(e) => setPropertyType(e.target.value as PropertyType)}
            className={inputClass}
          >
            {PROPERTY_TYPES.map((type) => (
              <option key={type} value={type}>
                {t(`propertyType_${type}` as Parameters<typeof t>[0])}
              </option>
            ))}
          </select>
        </div>
      </div>

      {projectOptions.length > 0 && (
        <div>
          <label className="block text-sm font-medium text-slate-700">{t("formProject")}</label>
          <select
            value={projectId}
            onChange={(e) => setProjectId(e.target.value)}
            className={inputClass}
          >
            <option value="">{t("formProjectNone")}</option>
            {projectOptions.map((project) => (
              <option key={project.id} value={project.id}>
                {project.nameEn || project.name}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-slate-700">{t("formPrice")}</label>
          <input name="price" type="number" required min={1} defaultValue={initial?.price} className={inputClass} />
        </div>
        {propertyType === "land" && (
          <div>
            <label className="block text-sm font-medium text-slate-700">{t("formLandSqWah")}</label>
            <input
              name="landSqWah"
              type="number"
              min={0.01}
              step="0.01"
              defaultValue={initial?.landSqWah}
              className={inputClass}
            />
          </div>
        )}
      </div>

      {propertyType === "npa" && (
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-slate-700">{t("formNpaBank")}</label>
            <input name="npaBank" placeholder="เช่น กสิกรไทย, กรุงเทพ" defaultValue={initial?.npaBank} className={inputClass} />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">{t("formNpaReferenceUrl")}</label>
            <input
              name="npaReferenceUrl"
              type="url"
              placeholder="https://..."
              defaultValue={initial?.npaReferenceUrl}
              className={inputClass}
            />
          </div>
        </div>
      )}

      <div className={`grid gap-4 ${showsRoomCounts(propertyType) ? "sm:grid-cols-3" : "sm:grid-cols-1"}`}>
        {showsRoomCounts(propertyType) && (
          <>
            <div>
              <label className="block text-sm font-medium text-slate-700">{t("bedrooms")}</label>
              <input name="bedrooms" type="number" required min={0} defaultValue={initial?.bedrooms ?? 1} className={inputClass} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">{t("bathrooms")}</label>
              <input name="bathrooms" type="number" required min={0} defaultValue={initial?.bathrooms ?? 1} className={inputClass} />
            </div>
          </>
        )}
        {!showsRoomCounts(propertyType) && (
          <>
            <input type="hidden" name="bedrooms" value={0} />
            <input type="hidden" name="bathrooms" value={0} />
          </>
        )}
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
          <label className="block text-sm font-medium text-slate-700">{t("formNearbyStation")}</label>
          <select
            value={nearbyStationId}
            onChange={(e) => handleStationChange(e.target.value)}
            className={inputClass}
          >
            <option value="">{t("formSelect")}</option>
            {STATION_CATEGORY_ORDER.map((category) => {
              const group = stationsByCategory(category);
              if (group.length === 0) return null;
              return (
                <optgroup key={category} label={t(CATEGORY_LABEL_KEYS[category])}>
                  {group.map((station) => (
                    <option key={station.id} value={station.id}>
                      {station.label}
                    </option>
                  ))}
                </optgroup>
              );
            })}
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
        onChange={applyCoords}
        onPinMoved={handlePinMoved}
      />

      <div>
        <label className="block text-sm font-medium text-slate-700">{t("formFloor")}</label>
        <input name="floor" type="number" defaultValue={initial?.floor} className={inputClass} />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700">{t("formFurnishing")}</label>
        <select
          name="furnishing"
          defaultValue={initial?.furnishing ?? "unknown"}
          className={inputClass}
        >
          <option value="unknown">{t("furnishingUnknown")}</option>
          <option value="furnished">{t("furnishingFurnished")}</option>
          <option value="partially">{t("furnishingPartially")}</option>
          <option value="unfurnished">{t("furnishingUnfurnished")}</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700">{t("formFeatures")}</label>
        <input name="features" placeholder={t("formFeaturesPlaceholder")} defaultValue={initial?.features?.join(", ")} className={inputClass} />
      </div>

      {showAgentManaged && (
        <div className="rounded-xl border border-teal-100 bg-teal-50/60 p-4">
          <label className="flex cursor-pointer items-start gap-3">
            <input
              type="checkbox"
              checked={agentManaged}
              onChange={(e) => setAgentManaged(e.target.checked)}
              className="mt-1 h-4 w-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500"
            />
            <span>
              <span className="block text-sm font-medium text-slate-900">{t("agentManagedLabel")}</span>
              <span className="mt-1 block text-xs text-slate-600">{t("agentManagedHint")}</span>
            </span>
          </label>
        </div>
      )}

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
