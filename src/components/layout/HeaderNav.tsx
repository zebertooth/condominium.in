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

function navLinkClass(highlight?: boolean) {
  if (highlight) {
    return "shrink-0 whitespace-nowrap rounded-full bg-gradient-to-r from-teal-600 to-teal-500 px-3.5 py-1.5 text-[13px] font-semibold text-white shadow-sm shadow-teal-600/20 transition hover:from-teal-700 hover:to-teal-600 sm:px-4 sm:py-2 sm:text-sm";
  }
  return "shrink-0 whitespace-nowrap rounded-full px-3 py-1.5 text-[13px] font-medium text-slate-600 transition hover:bg-slate-100 hover:text-teal-700 sm:px-3.5 sm:py-2 sm:text-sm";
}

export function HeaderNav({ mainLinks, highlightLink }: HeaderNavProps) {
  return (
    <nav
      className="min-w-0 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      aria-label="Main menu"
    >
      <div className="inline-flex min-w-full items-center justify-center gap-0.5 sm:gap-1">
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
