import Link from "next/link";
import { redirect } from "next/navigation";
import { PropertyGrid } from "@/components/property/PropertyGrid";
import { getCurrentUser } from "@/lib/auth";
import { getUserSavedProperties, getUserSavedSlugs } from "@/lib/favorites";
import { t } from "@/lib/i18n";
import { getListingBySlug } from "@/lib/listings";
import { getLocale } from "@/lib/locale";
import { createMetadata } from "@/lib/seo";
import type { Property } from "@/types/property";

export async function generateMetadata() {
  return createMetadata({
    title: "รายการโปรด | Dashboard",
    description: "View and manage your saved property listings.",
    path: "/dashboard/saved",
  });
}

export default async function SavedPropertiesPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const locale = await getLocale();
  const nonTh = locale !== "th";

  const [saved, savedSlugs] = await Promise.all([
    getUserSavedProperties(user.id),
    getUserSavedSlugs(user.id),
  ]);

  const properties: Property[] = [];
  for (const s of saved) {
    const property = await getListingBySlug(s.propertySlug);
    if (property) properties.push(property);
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          {nonTh ? "Saved Properties" : "รายการโปรด"}
        </h1>
        <p className="mt-1 text-slate-600">
          {nonTh
            ? "Properties you have saved for later"
            : "ทรัพย์ที่คุณบันทึกไว้ดูภายหลัง"}
        </p>
      </div>

      {properties.length === 0 ? (
        <div className="rounded-xl border border-slate-200 bg-white p-8 text-center">
          <svg
            className="mx-auto h-12 w-12 text-slate-300"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
          <p className="mt-4 text-slate-600">
            {nonTh
              ? "You haven't saved any properties yet"
              : "คุณยังไม่ได้บันทึกทรัพย์ใดๆ"}
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <Link
              href="/buy"
              className="rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-teal-700"
            >
              {t("buyPageTitle", locale)}
            </Link>
            <Link
              href="/rent"
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
            >
              {t("rentPageTitle", locale)}
            </Link>
          </div>
        </div>
      ) : (
        <PropertyGrid
          properties={properties}
          locale={locale}
          showSaveButtons={true}
          savedSlugs={savedSlugs}
        />
      )}
    </div>
  );
}
