import Link from "next/link";
import { HeaderAuth } from "@/components/layout/HeaderAuth";
import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";
import { SiteLogo, siteLogoAltText } from "@/components/brand/SiteLogo";
import { t, type Locale } from "@/lib/i18n";

function navLinks(locale: Locale) {
  return [
    { href: "/buy", label: t("buy", locale) },
    { href: "/rent", label: t("rent", locale) },
    { href: "/projects", label: t("navProjects", locale) },
    { href: "/areas", label: t("areas", locale) },
    { href: "/ai-search", label: t("aiSearch", locale) },
    { href: "/blog", label: t("blog", locale) },
    { href: "/agents", label: t("agents", locale) },
    { href: "/dashboard/post", label: t("listProperty", locale) },
  ];
}

export function Header({ locale }: { locale: Locale }) {
  const links = navLinks(locale);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link href="/" className="shrink-0" aria-label={siteLogoAltText()}>
          <SiteLogo locale={locale} />
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-lg px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-teal-50 hover:text-teal-700"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <HeaderAuth />
          <LanguageSwitcher />
          <Link
            href="/contact"
            className="rounded-lg bg-teal-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-teal-700"
          >
            {t("contact", locale)}
          </Link>
        </div>
      </div>

      <nav className="flex gap-1 overflow-x-auto border-t border-slate-100 px-4 py-2 lg:hidden">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="shrink-0 rounded-full bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-700"
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
