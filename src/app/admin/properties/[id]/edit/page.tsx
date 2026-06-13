import Link from "next/link";
import { redirect } from "next/navigation";
import { PostPropertyForm } from "@/components/dashboard/PostPropertyForm";
import { getAdminUser } from "@/lib/admin";
import { prisma } from "@/lib/db";
import { t } from "@/lib/i18n";
import { getLocale } from "@/lib/locale";
import { dbPropertyToListing } from "@/lib/user-properties";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminEditPropertyPage({ params }: PageProps) {
  const locale = await getLocale();
  const admin = await getAdminUser();
  if (!admin) redirect("/login");

  const { id } = await params;
  const property = await prisma.userProperty.findUnique({
    where: { id },
    include: { project: { select: { slug: true, name: true, nameEn: true } } },
  });
  if (!property) redirect("/admin/properties");

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">{t("adminEditPropertyTitle", locale)}</h1>
        <Link href="/admin/properties" className="text-sm text-teal-700 hover:underline">
          {t("adminBack", locale)}
        </Link>
      </div>
      <p className="mb-6 text-sm text-slate-600">{t("adminEditPropertyNote", locale)}</p>
      <PostPropertyForm
        initial={dbPropertyToListing(property)}
        propertyId={property.id}
        endpoint={`/api/admin/properties/${property.id}`}
        method="PUT"
        redirectTo="/admin/properties"
        adminEdit
      />
    </div>
  );
}
