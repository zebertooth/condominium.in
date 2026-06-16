import { getAdminUser } from "@/lib/admin";
import { prisma } from "@/lib/db";
import { countActiveNewsletterSubscribers } from "@/lib/newsletter-digest";
import { t, tf } from "@/lib/i18n";
import { getLocale } from "@/lib/locale";

export const dynamic = "force-dynamic";

export default async function AdminNewsletterPage() {
  const locale = await getLocale();
  await getAdminUser();

  const [subscribers, activeCount] = await Promise.all([
    prisma.newsletterSubscriber.findMany({
      orderBy: { createdAt: "desc" },
      take: 200,
    }),
    countActiveNewsletterSubscribers(),
  ]);

  const dateLoc = locale === "en" ? "en-US" : "th-TH";

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900">{t("adminNewsletterTitle", locale)}</h1>
      <p className="mt-1 text-slate-600">{t("adminNewsletterDesc", locale)}</p>

      <p className="mt-4 rounded-xl bg-teal-50 px-4 py-3 text-sm text-teal-900">
        {tf("adminNewsletterActiveCount", locale, { count: activeCount })}
      </p>

      <div className="mt-8 overflow-x-auto rounded-xl border border-slate-200 bg-white">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-slate-200 bg-slate-50 text-slate-600">
            <tr>
              <th className="px-4 py-3 font-medium">{t("adminNewsletterEmail", locale)}</th>
              <th className="px-4 py-3 font-medium">{t("adminNewsletterLocale", locale)}</th>
              <th className="px-4 py-3 font-medium">{t("adminNewsletterStatus", locale)}</th>
              <th className="px-4 py-3 font-medium">{t("adminNewsletterJoined", locale)}</th>
            </tr>
          </thead>
          <tbody>
            {subscribers.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-slate-500">
                  {t("adminNewsletterEmpty", locale)}
                </td>
              </tr>
            ) : (
              subscribers.map((sub) => (
                <tr key={sub.id} className="border-b border-slate-100 last:border-0">
                  <td className="px-4 py-3 font-medium text-slate-900">{sub.email}</td>
                  <td className="px-4 py-3 text-slate-600">{sub.locale}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                        sub.active ? "bg-emerald-100 text-emerald-800" : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {sub.active
                        ? t("adminNewsletterActive", locale)
                        : t("adminNewsletterInactive", locale)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-600">
                    {sub.createdAt.toLocaleDateString(dateLoc, {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
