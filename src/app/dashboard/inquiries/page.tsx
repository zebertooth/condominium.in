import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { t } from "@/lib/i18n";
import { getLocale } from "@/lib/locale";
import { dateLocale } from "@/lib/locale-content";

export default async function OwnerInquiriesPage() {
  const [user, locale] = await Promise.all([getCurrentUser(), getLocale()]);
  if (!user) redirect("/login");

  const leads = await prisma.lead.findMany({
    where: {
      ownerUserId: user.id,
      contactMode: "owner_direct",
    },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900">{t("inquiriesPageTitle", locale)}</h2>
        <p className="mt-1 text-sm text-slate-600">{t("inquiriesPageDesc", locale)}</p>
      </div>

      {leads.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-slate-600">
          {t("inquiriesEmpty", locale)}
        </div>
      ) : (
        <div className="space-y-4">
          {leads.map((lead) => {
            const contact = [lead.phone, lead.email].filter(Boolean).join(" · ") || "—";
            const dateStr = lead.createdAt.toLocaleString(dateLocale(locale), {
              day: "numeric",
              month: "short",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            });

            return (
              <article
                key={lead.id}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-slate-900">{lead.name}</p>
                    <p className="mt-1 text-xs text-slate-500">
                      {t("inquiryDate", locale)}: {dateStr}
                    </p>
                  </div>
                  {lead.propertySlug && (
                    <Link
                      href={`/property/${lead.propertySlug}`}
                      className="text-sm font-medium text-teal-700 hover:underline"
                    >
                      {lead.propertyTitle ?? lead.propertySlug}
                    </Link>
                  )}
                </div>

                <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
                  <div>
                    <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">
                      {t("inquiryContact", locale)}
                    </dt>
                    <dd className="mt-1 text-slate-800">{contact}</dd>
                  </div>
                  {lead.viewingDate && (
                    <div>
                      <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">
                        {t("inquiryViewing", locale)}
                      </dt>
                      <dd className="mt-1 text-slate-800">
                        {lead.viewingDate}
                        {lead.viewingTime ? ` · ${lead.viewingTime}` : ""}
                      </dd>
                    </div>
                  )}
                </dl>

                <div className="mt-4 rounded-xl bg-slate-50 px-4 py-3">
                  <p className="text-xs font-medium text-slate-500">{t("inquiryMessage", locale)}</p>
                  <p className="mt-1 whitespace-pre-wrap text-sm text-slate-800">{lead.message}</p>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
