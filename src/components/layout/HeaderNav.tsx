import Link from "next/link";

export interface HeaderNavItem {
  href: string;
  label: string;
  highlight?: boolean;
}

interface HeaderNavProps {
  mainLinks: HeaderNavItem[];
  highlightLink?: HeaderNavItem;
}

export function navLinkClass(highlight?: boolean) {
  if (highlight) {
    return "shrink-0 whitespace-nowrap rounded-full bg-gradient-to-r from-teal-600 to-teal-500 px-3.5 py-1.5 text-[13px] font-semibold text-white shadow-sm shadow-teal-600/20 transition hover:from-teal-700 hover:to-teal-600 hover:shadow-md active:scale-[0.98] sm:px-4 sm:py-2 sm:text-sm";
  }
  return "nav-link shrink-0 whitespace-nowrap text-[13px] font-medium text-slate-600 sm:text-sm";
}

export function HeaderNav({ mainLinks, highlightLink }: HeaderNavProps) {
  return (
    <nav className="hidden min-w-0 lg:block" aria-label="Main menu">
      <div className="flex flex-wrap items-center justify-center gap-0.5 xl:gap-1">
        {mainLinks.map((link) => (
          <Link key={link.href} href={link.href} className={navLinkClass(link.highlight)}>
            {link.label}
          </Link>
        ))}
        {highlightLink && (
          <Link href={highlightLink.href} className={navLinkClass(true)}>
            {highlightLink.label}
          </Link>
        )}
      </div>
    </nav>
  );
}
