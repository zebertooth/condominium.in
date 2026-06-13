import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PropertyGrid } from "@/components/property/PropertyGrid";
import { formatNearbyStation } from "@/lib/locations";
import { t } from "@/lib/i18n";
import { getLocale } from "@/lib/locale";
import {
  getProjectListings,
  getPublishedProjectBySlug,
  localizedProjectDescription,
  localizedProjectName,
} from "@/lib/projects";
import { createMetadata } from "@/lib/seo";

const DEFAULT_IMAGE =
  "https://images.unsplash.com/photo-1545324418-cc403a4ad993?w=800&q=80";

interface ProjectDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ProjectDetailPageProps) {
  const { slug } = await params;
  const project = await getPublishedProjectBySlug(slug);
  if (!project) {
    return createMetadata({
      title: "Project not found",
      description: "Project page",
      path: `/projects/${slug}`,
    });
  }

  return createMetadata({
    title: `${project.name} | Condominium.in.th`,
    description: project.description || `${project.developer} — ${project.location}`,
    path: `/projects/${project.slug}`,
  });
}

export default async function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  const { slug } = await params;
  const project = await getPublishedProjectBySlug(slug);
  if (!project) notFound();

  const [listings, locale] = await Promise.all([getProjectListings(project.id), getLocale()]);
  const nonTh = locale !== "th";
  const name = localizedProjectName(project, locale);
  const description = localizedProjectDescription(project, locale);
  const saleListings = listings.filter((l) => l.listingType === "sale");
  const rentListings = listings.filter((l) => l.listingType === "rent");

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="relative aspect-[21/9] bg-slate-100">
          <Image
            src={project.imageUrl || DEFAULT_IMAGE}
            alt={name}
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
        </div>
        <div className="p-6 sm:p-8">
          <p className="text-sm font-medium text-teal-700">{t("projectBadge", locale)}</p>
          <h1 className="mt-1 text-3xl font-bold text-slate-900">{name}</h1>
          <p className="mt-2 text-lg text-slate-700">
            {t("projectDeveloper", locale)}: {project.developer}
          </p>
          <p className="mt-1 text-slate-600">
            {project.location}
            {project.district ? ` · ${project.district}` : ""}
            {project.btsStation ? ` · ${formatNearbyStation(project.btsStation)}` : ""}
          </p>

          <div className="mt-4 flex flex-wrap gap-4 text-sm text-slate-600">
            {project.totalUnits && (
              <span>
                {t("projectUnits", locale)}: {project.totalUnits.toLocaleString()}
              </span>
            )}
            {project.completionDate && (
              <span>
                {t("projectCompletion", locale)}: {project.completionDate}
              </span>
            )}
            <span>
              {listings.length} {nonTh ? "listings" : "ประกาศ"}
            </span>
          </div>

          {description && <p className="mt-6 whitespace-pre-line text-slate-700">{description}</p>}

          {project.amenities.length > 0 && (
            <div className="mt-6">
              <h2 className="font-semibold text-slate-900">{t("projectAmenities", locale)}</h2>
              <div className="mt-2 flex flex-wrap gap-2">
                {project.amenities.map((item) => (
                  <span key={item} className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="mt-10 space-y-10">
        {saleListings.length > 0 && (
          <section>
            <h2 className="mb-4 text-xl font-bold text-slate-900">
              {t("buy", locale)} ({saleListings.length})
            </h2>
            <PropertyGrid properties={saleListings} locale={locale} />
          </section>
        )}

        {rentListings.length > 0 && (
          <section>
            <h2 className="mb-4 text-xl font-bold text-slate-900">
              {t("rent", locale)} ({rentListings.length})
            </h2>
            <PropertyGrid properties={rentListings} locale={locale} />
          </section>
        )}

        {listings.length === 0 && (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
            <p className="text-slate-600">
              {nonTh
                ? "No listings in this project yet."
                : "ยังไม่มีประกาศในโครงการนี้"}
            </p>
            <Link href="/buy" className="mt-4 inline-block text-teal-700 hover:underline">
              {t("buy", locale)}
            </Link>
          </div>
        )}
      </div>

      <div className="mt-10">
        <Link href="/projects" className="text-sm font-medium text-teal-700 hover:underline">
          ← {t("navProjects", locale)}
        </Link>
      </div>
    </div>
  );
}
