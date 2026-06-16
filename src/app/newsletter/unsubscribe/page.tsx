import Link from "next/link";
import { notFound } from "next/navigation";
import { unsubscribeNewsletterEmail } from "@/lib/newsletter-unsubscribe";
import { t } from "@/lib/i18n";
import { getLocale } from "@/lib/locale";
import { localePath } from "@/lib/locale-routing";
import { createMetadata } from "@/lib/seo";

interface PageProps {
  searchParams: Promise<{ email?: string; token?: string }>;
}

export async function generateMetadata() {
  return createMetadata({
    title: "Unsubscribe newsletter",
    description: "Unsubscribe from Condominium.in.th blog newsletter.",
    path: "/newsletter/unsubscribe",
  });
}

export default async function NewsletterUnsubscribePage({ searchParams }: PageProps) {
  const params = await searchParams;
  const email = params.email?.trim();
  const token = params.token?.trim();

  if (!email || !token) notFound();

  const locale = await getLocale();
  const lp = (path: string) => localePath(path, locale);
  const ok = await unsubscribeNewsletterEmail(email, token);

  return (
    <div className="mx-auto max-w-lg px-4 py-16 sm:px-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        {ok ? (
          <>
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
              ✓
            </div>
            <h1 className="mt-4 text-xl font-bold text-slate-900">
              {t("newsletterUnsubscribedTitle", locale)}
            </h1>
            <p className="mt-2 text-slate-600">{t("newsletterUnsubscribedDesc", locale)}</p>
          </>
        ) : (
          <>
            <h1 className="text-xl font-bold text-slate-900">
              {t("newsletterUnsubscribeInvalid", locale)}
            </h1>
            <p className="mt-2 text-slate-600">{t("newsletterUnsubscribeInvalidDesc", locale)}</p>
          </>
        )}
        <Link
          href={lp("/blog")}
          className="mt-6 inline-block rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-700"
        >
          {t("blog", locale)}
        </Link>
      </div>
    </div>
  );
}
