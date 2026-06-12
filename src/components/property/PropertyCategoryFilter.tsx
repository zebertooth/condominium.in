"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useT } from "@/components/i18n/LocaleProvider";
import {
  PROPERTY_CATEGORIES,
  parsePropertyCategory,
  type PropertyCategory,
} from "@/lib/property-types";

export function PropertyCategoryFilter() {
  const t = useT();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const current = parsePropertyCategory(searchParams.get("category"));

  function setCategory(category: PropertyCategory) {
    const params = new URLSearchParams(searchParams.toString());
    if (category === "all") params.delete("category");
    else params.set("category", category);
    const qs = params.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname);
  }

  return (
    <div className="flex flex-wrap gap-2">
      {PROPERTY_CATEGORIES.map((category) => {
        const active = current === category;
        const labelKey = `category_${category}` as Parameters<typeof t>[0];
        return (
          <button
            key={category}
            type="button"
            onClick={() => setCategory(category)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition ${
              active
                ? "bg-teal-600 text-white shadow-sm"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            {t(labelKey)}
          </button>
        );
      })}
    </div>
  );
}
