import Image from "next/image";
import Link from "next/link";
import {
  getPublishedProjects,
  localizedProjectName,
} from "@/lib/projects";
import { getLocale } from "@/lib/locale";
import { localePath } from "@/lib/locale-routing";
import { createMetadata } from "@/lib/seo";
import { t } from "@/lib/i18n";
import { formatNearbyStation } from "@/lib/locations";

const DEFAULT_IMAGE =
  "https://images.unsplash.com/photo-1545324418-cc403a4ad993?w=800&q=80";

export async function generateMetadata() {
  return createMetadata({
    title: "โครงการคอนโดและบ้าน | Condominium.in.th",
    description:
      "ค้นหาโครงการคอนโดและบ้านในกรุงเทพฯ ดูยูนิตที่เปิดขายและให้เช่าในแต่ละโครงการ",
    path: "/projects",
    keywords: ["โครงการคอนโด", "คอนโดใหม่", "โครงการบ้าน", "condo project bangkok"],
  });
}

export default async function ProjectsPage() {
  const [projects, locale] = await Promise.all([getPublishedProjects(), getLocale()]);
  const nonTh = locale !== "th";
  const lp = (path: string) => localePath(path, locale);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">{t("projectsTitle", locale)}</h1>
        <p className="mt-2 text-slate-600">{t("projectsSubtitle", locale)}</p>
      </div>

      {projects.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center">
          <p className="text-slate-600">{t("projectsEmpty", locale)}</p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => {
            const name = localizedProjectName(project, locale);
            return (
              <Link
                key={project.id}
                href={lp(`/projects/${project.slug}`)}
                className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md"
              >
                <div className="relative aspect-[16/10] bg-slate-100">
                  <Image
                    src={project.imageUrl || DEFAULT_IMAGE}
                    alt={name}
                    fill
                    className="object-cover transition duration-300 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>
                <div className="p-5">
                  <h2 className="text-lg font-bold text-slate-900 group-hover:text-teal-700">{name}</h2>
                  <p className="mt-1 text-sm text-teal-700">{project.developer}</p>
                  <p className="mt-2 text-sm text-slate-600">
                    {project.district || project.location}
                    {project.btsStation ? ` · ${formatNearbyStation(project.btsStation)}` : ""}
                  </p>
                  <p className="mt-3 text-sm font-medium text-slate-800">
                    {project.listingCount ?? 0}{" "}
                    {nonTh ? "listings" : "ประกาศ"}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
