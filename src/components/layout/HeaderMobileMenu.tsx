import Link from "next/link";
import type { HeaderNavItem } from "@/components/layout/HeaderNav";

export function HeaderMobileNav({
  mainLinks,
  highlightLink,
}: {
  mainLinks: HeaderNavItem[];
  highlightLink?: HeaderNavItem;
}) {
  const links = highlightLink ? [...mainLinks, highlightLink] : mainLinks;

  return (
    <nav
      className="border-t border-slate-100/90 bg-slate-50/90 lg:hidden"
      aria-label="Main menu"
    >
      <div className="overflow-x-auto px-4 py-2.5 [scrollbar-width:thin] [&::-webkit-scrollbar]:h-1 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-slate-300">
        <div className="inline-flex min-w-full items-center justify-start gap-1.5 sm:justify-center">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={
                link.highlight
                  ? "shrink-0 whitespace-nowrap rounded-full bg-gradient-to-r from-teal-600 to-teal-500 px-4 py-2 text-[13px] font-semibold text-white shadow-sm shadow-teal-600/20"
                  : "shrink-0 whitespace-nowrap rounded-full border border-slate-200/80 bg-white px-3.5 py-2 text-[13px] font-medium text-slate-700 shadow-sm transition hover:border-teal-200 hover:text-teal-700"
              }
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
