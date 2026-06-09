import Link from "next/link";
import { HeaderAuth } from "@/components/layout/HeaderAuth";
import { t } from "@/lib/i18n";

const navLinks = [
  { href: "/buy", label: t("buy") },
  { href: "/rent", label: t("rent") },
  { href: "/areas", label: t("areas") },
  { href: "/ai-search", label: t("aiSearch") },
  { href: "/blog", label: t("blog") },
  { href: "/agents", label: t("agents") },
  { href: "/dashboard/post", label: t("listProperty") },
];

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link href="/" className="flex shrink-0 flex-col">
          <span className="text-lg font-bold text-teal-700 sm:text-xl">
            {t("siteName")}
          </span>
          <span className="hidden text-xs text-slate-500 sm:block">
            {t("tagline")}
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {navLinks.map((link) => (
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
          <div className="hidden items-center gap-1 rounded-lg border border-slate-200 px-2 py-1 text-xs text-slate-500 sm:flex">
            <span className="rounded bg-teal-100 px-1.5 py-0.5 font-medium text-teal-800">
              TH
            </span>
            <span>ZH</span>
            <span>JA</span>
            <span>AR</span>
          </div>
          <Link
            href="/contact"
            className="rounded-lg bg-teal-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-teal-700"
          >
            {t("contact")}
          </Link>
        </div>
      </div>

      <nav className="flex gap-1 overflow-x-auto border-t border-slate-100 px-4 py-2 lg:hidden">
        {navLinks.map((link) => (
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
