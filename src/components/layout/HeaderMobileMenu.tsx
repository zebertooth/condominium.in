import Link from "next/link";
import { navLinkClass, type HeaderNavItem } from "@/components/layout/HeaderNav";

export function HeaderMobileNav({
  mainLinks,
  highlightLink,
}: {
  mainLinks: HeaderNavItem[];
  highlightLink?: HeaderNavItem;
}) {
  const links = highlightLink ? [...mainLinks, highlightLink] : mainLinks;

  return (
    <nav className="border-t border-slate-100/90 bg-white lg:hidden" aria-label="Main menu">
      <div className="overflow-x-auto px-4 py-2 [scrollbar-width:thin] [&::-webkit-scrollbar]:h-1 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-slate-300">
        <div className="inline-flex min-w-full items-center justify-start gap-0.5 sm:justify-center sm:gap-1">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className={navLinkClass(link.highlight)}>
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
