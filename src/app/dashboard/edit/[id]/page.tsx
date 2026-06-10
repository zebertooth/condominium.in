import { redirect } from "next/navigation";
import { PostPropertyForm } from "@/components/dashboard/PostPropertyForm";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { t } from "@/lib/i18n";
import { getLocale } from "@/lib/locale";
import { dbPropertyToListing } from "@/lib/user-properties";

interface EditPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditPropertyPage({ params }: EditPageProps) {
  const [user, locale] = await Promise.all([getCurrentUser(), getLocale()]);
  if (!user) redirect("/login");

  const { id } = await params;
  const property = await prisma.userProperty.findFirst({
    where: { id, userId: user.id, status: { not: "deleted" } },
  });

  if (!property) redirect("/dashboard");

  return (
    <div>
      <h2 className="mb-2 text-xl font-bold text-slate-900">{t("editListingTitle", locale)}</h2>
      <p className="mb-6 text-sm text-slate-600">{t("editListingDesc", locale)}</p>
      <PostPropertyForm initial={dbPropertyToListing(property)} propertyId={property.id} />
    </div>
  );
}
