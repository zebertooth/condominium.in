import { redirect } from "next/navigation";
import { InquiriesList } from "@/components/dashboard/InquiriesList";
import { getCurrentUser } from "@/lib/auth";
import { t, tf } from "@/lib/i18n";
import { getLocale } from "@/lib/locale";
import { getOwnerUnreadInquiryCount, listOwnerInquiries } from "@/lib/owner-inquiries";

export default async function OwnerInquiriesPage() {
  const [user, locale] = await Promise.all([getCurrentUser(), getLocale()]);
  if (!user) redirect("/login");

  const [leads, unreadCount] = await Promise.all([
    listOwnerInquiries(user.id),
    getOwnerUnreadInquiryCount(user.id),
  ]);

  const rows = leads.map((lead) => ({
    id: lead.id,
    name: lead.name,
    phone: lead.phone,
    email: lead.email,
    message: lead.message,
    propertySlug: lead.propertySlug,
    propertyTitle: lead.propertyTitle,
    viewingDate: lead.viewingDate,
    viewingTime: lead.viewingTime,
    status: lead.status,
    createdAt: lead.createdAt.toISOString(),
  }));

  return (
    <div className="space-y-6">
      <div>
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="text-xl font-bold text-slate-900">{t("inquiriesPageTitle", locale)}</h2>
          {unreadCount > 0 && (
            <span className="rounded-full bg-teal-600 px-2.5 py-0.5 text-xs font-semibold text-white">
              {tf("inquiryUnreadBadge", locale, { count: unreadCount })}
            </span>
          )}
        </div>
        <p className="mt-1 text-sm text-slate-600">{t("inquiriesPageDesc", locale)}</p>
      </div>

      {rows.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-slate-600">
          {t("inquiriesEmpty", locale)}
        </div>
      ) : (
        <InquiriesList inquiries={rows} locale={locale} />
      )}
    </div>
  );
}
