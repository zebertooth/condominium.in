import Link from "next/link";
import { HeaderAuth } from "@/components/layout/HeaderAuth";
import { HeaderMobileNav } from "@/components/layout/HeaderMobileMenu";
import { HeaderNav, type HeaderNavItem } from "@/components/layout/HeaderNav";
import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";
import { SiteLogo, siteLogoAltText } from "@/components/brand/SiteLogo";
import { getCurrentUser } from "@/lib/auth";
import { t, type Locale } from "@/lib/i18n";

function ContactIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}

function publicNavLinks(locale: Locale): HeaderNavItem[] {
  return [
    { href: "/buy", label: t("buy", locale) },
    { href: "/rent", label: t("rent", locale) },
    { href: "/projects", label: t("navProjects", locale) },
    { href: "/map", label: t("navMap", locale) },
    { href: "/npa", label: t("navNpa", locale) },
    { href: "/market", label: t("navMarket", locale) },
    { href: "/ai-search", label: t("aiSearch", locale) },
    { href: "/blog", label: t("blog", locale) },
  ];
}

function guestNav(locale: Locale): {
  mainLinks: HeaderNavItem[];
  highlightLink: HeaderNavItem;
} {
  return {
    mainLinks: publicNavLinks(locale),
    highlightLink: { href: "/list-property", label: t("listProperty", locale), highlight: true },
  };
}

function loggedInNav(locale: Locale): {
  mainLinks: HeaderNavItem[];
  highlightLink?: HeaderNavItem;
} {
  return {
    mainLinks: publicNavLinks(locale),
  };
}

export async function Header({ locale }: { locale: Locale }) {
  const user = await getCurrentUser();
  const nav = user ? loggedInNav(locale) : guestNav(locale);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/95 shadow-[0_1px_0_rgba(15,23,42,0.04)] backdrop-blur-md">
      {/* Row 1: logo + account (mobile & desktop) */}
      <div className="mx-auto flex max-w-[100rem] items-center gap-2 px-4 py-2.5 sm:gap-3 sm:px-6 lg:gap-4">
        <Link href="/" className="min-w-0 shrink-0" aria-label={siteLogoAltText()}>
          <SiteLogo locale={locale} className="max-w-[11rem] sm:max-w-none" />
        </Link>

        {/* Desktop main menu — inline on row 1 */}
        <div className="hidden min-w-0 flex-1 lg:block">
          <HeaderNav mainLinks={nav.mainLinks} highlightLink={nav.highlightLink} />
        </div>

        <div className="ml-auto flex shrink-0 items-center gap-1.5 sm:gap-2">
          <HeaderAuth user={user} locale={locale} />
          {!user && (
            <Link
              href="/contact"
              title={t("contact", locale)}
              aria-label={t("contact", locale)}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-r from-teal-600 to-teal-500 text-sm font-semibold text-white shadow-sm shadow-teal-600/20 transition hover:from-teal-700 hover:to-teal-600 sm:w-auto sm:gap-1.5 sm:px-3.5"
            >
              <ContactIcon className="h-4 w-4 shrink-0 sm:hidden" />
              <span className="hidden sm:inline">{t("contact", locale)}</span>
            </Link>
          )}
          <div className="hidden h-6 w-px bg-slate-200 sm:block" aria-hidden />
          <LanguageSwitcher />
        </div>
      </div>

      {/* Row 2: main menu scroll strip (mobile & tablet only) */}
      <HeaderMobileNav mainLinks={nav.mainLinks} highlightLink={nav.highlightLink} />
    </header>
  );
}
