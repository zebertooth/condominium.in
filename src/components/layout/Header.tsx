import Link from "next/link";
import { HeaderAuth } from "@/components/layout/HeaderAuth";
import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";
import { SiteLogo, siteLogoAltText } from "@/components/brand/SiteLogo";
import { getCurrentUser } from "@/lib/auth";
import { t, type Locale } from "@/lib/i18n";

interface NavLink {
  href: string;
  label: string;
  highlight?: boolean;
}

function guestNavLinks(locale: Locale): NavLink[] {
  return [
    { href: "/buy", label: t("buy", locale) },
    { href: "/rent", label: t("rent", locale) },
    { href: "/projects", label: t("navProjects", locale) },
    { href: "/areas", label: t("areas", locale) },
    { href: "/ai-search", label: t("aiSearch", locale) },
    { href: "/map", label: t("navMap", locale) },
    { href: "/blog", label: t("blog", locale) },
    { href: "/agents", label: t("agents", locale) },
    { href: "/list-property", label: t("listProperty", locale), highlight: true },
  ];
}

function loggedInNavLinks(locale: Locale, role: string): NavLink[] {
  const links: NavLink[] = [
    { href: "/buy", label: t("buy", locale) },
    { href: "/rent", label: t("rent", locale) },
    { href: "/map", label: t("navMap", locale) },
    { href: "/projects", label: t("navProjects", locale) },
    { href: "/dashboard/saved", label: t("dashSaved", locale) },
    { href: "/dashboard/alerts", label: t("dashAlerts", locale) },
    { href: "/dashboard/post", label: t("dashPost", locale), highlight: true },
    { href: "/dashboard", label: t("dashboard", locale) },
  ];

  if (role === "agent" || role === "admin") {
    links.splice(links.length - 1, 0, {
      href: "/dashboard/agent",
      label: t("dashAgent", locale),
    });
  }

  return links;
}

function linkClassName(highlight?: boolean) {
  return highlight
    ? "rounded-lg bg-teal-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-teal-700"
    : "rounded-lg px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-teal-50 hover:text-teal-700";
}

function mobileLinkClassName(highlight?: boolean) {
  return highlight
    ? "shrink-0 rounded-full bg-teal-600 px-3 py-1.5 text-xs font-medium text-white"
    : "shrink-0 rounded-full bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-700";
}

export async function Header({ locale }: { locale: Locale }) {
  const user = await getCurrentUser();
  const links = user ? loggedInNavLinks(locale, user.role) : guestNavLinks(locale);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link href="/" className="shrink-0" aria-label={siteLogoAltText()}>
          <SiteLogo locale={locale} />
        </Link>

        <nav className="hidden items-center gap-1 lg:flex" aria-label={user ? "User menu" : "Main menu"}>
          {links.map((link) => (
            <Link key={link.href} href={link.href} className={linkClassName(link.highlight)}>
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <HeaderAuth user={user} locale={locale} />
          <LanguageSwitcher />
          {!user && (
            <Link
              href="/contact"
              className="hidden rounded-lg bg-teal-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-teal-700 sm:inline-flex"
            >
              {t("contact", locale)}
            </Link>
          )}
        </div>
      </div>

      <nav
        className="flex gap-1 overflow-x-auto border-t border-slate-100 px-4 py-2 lg:hidden"
        aria-label={user ? "User menu" : "Main menu"}
      >
        {links.map((link) => (
          <Link key={link.href} href={link.href} className={mobileLinkClassName(link.highlight)}>
            {link.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
