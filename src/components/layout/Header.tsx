import Link from "next/link";
import { HeaderAuth } from "@/components/layout/HeaderAuth";
import { HeaderNav, type HeaderNavItem } from "@/components/layout/HeaderNav";
import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";
import { SiteLogo, siteLogoAltText } from "@/components/brand/SiteLogo";
import { getCurrentUser } from "@/lib/auth";
import { t, type Locale } from "@/lib/i18n";

function guestNav(locale: Locale): {
  mainLinks: HeaderNavItem[];
  highlightLink: HeaderNavItem;
} {
  return {
    mainLinks: [
      { href: "/buy", label: t("buy", locale) },
      { href: "/rent", label: t("rent", locale) },
      { href: "/projects", label: t("navProjects", locale) },
      { href: "/map", label: t("navMap", locale) },
      { href: "/ai-search", label: t("aiSearch", locale) },
      { href: "/blog", label: t("blog", locale) },
    ],
    highlightLink: { href: "/list-property", label: t("listProperty", locale), highlight: true },
  };
}

function loggedInNav(
  locale: Locale,
  role: string,
): {
  mainLinks: HeaderNavItem[];
  highlightLink: HeaderNavItem;
} {
  const mainLinks: HeaderNavItem[] = [
    { href: "/buy", label: t("buy", locale) },
    { href: "/rent", label: t("rent", locale) },
    { href: "/map", label: t("navMap", locale) },
    { href: "/projects", label: t("navProjects", locale) },
    { href: "/ai-search", label: t("aiSearch", locale) },
    { href: "/dashboard/saved", label: t("dashSaved", locale) },
    { href: "/dashboard/alerts", label: t("dashAlerts", locale) },
    { href: "/dashboard", label: t("dashboard", locale) },
  ];

  if (role === "agent" || role === "admin") {
    mainLinks.splice(mainLinks.length - 1, 0, {
      href: "/dashboard/agent",
      label: t("dashAgent", locale),
    });
  }

  mainLinks.push({ href: "/blog", label: t("blog", locale) });

  return {
    mainLinks,
    highlightLink: { href: "/dashboard/post", label: t("dashPost", locale), highlight: true },
  };
}

export async function Header({ locale }: { locale: Locale }) {
  const user = await getCurrentUser();
  const nav = user ? loggedInNav(locale, user.role) : guestNav(locale);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/95 shadow-[0_1px_0_rgba(15,23,42,0.04)] backdrop-blur-md">
      <div className="mx-auto flex max-w-[100rem] items-center gap-2 px-4 py-2.5 sm:gap-3 sm:px-6 lg:gap-4">
        <Link href="/" className="min-w-0 shrink-0" aria-label={siteLogoAltText()}>
          <SiteLogo locale={locale} />
        </Link>

        <div className="min-w-0 flex-1">
          <HeaderNav mainLinks={nav.mainLinks} highlightLink={nav.highlightLink} />
        </div>

        <div className="flex shrink-0 items-center gap-2 sm:gap-2.5">
          <HeaderAuth user={user} locale={locale} />
          <div className="hidden h-6 w-px bg-slate-200 sm:block" aria-hidden />
          <LanguageSwitcher />
          {!user && (
            <Link
              href="/contact"
              className="hidden rounded-full bg-gradient-to-r from-teal-600 to-teal-500 px-3.5 py-2 text-sm font-semibold text-white shadow-sm shadow-teal-600/20 transition hover:from-teal-700 hover:to-teal-600 lg:inline-flex"
            >
              {t("contact", locale)}
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
