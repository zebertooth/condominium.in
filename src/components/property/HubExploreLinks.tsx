import Link from "next/link";
import { localePath } from "@/lib/locale-routing";
import type { Locale } from "@/lib/i18n";

interface HubExploreLinksProps {
  locale: Locale;
  className?: string;
}

/** Compact cross-links between area guides, districts, stations, and map search. */
export function HubExploreLinks({ locale, className }: HubExploreLinksProps) {
  const nonTh = locale !== "th";
  const lp = (path: string) => localePath(path, locale);

  const links = [
    { href: lp("/areas"), label: nonTh ? "BTS area guides" : "คู่มือย่าน BTS" },
    { href: lp("/districts"), label: nonTh ? "50 districts" : "50 เขตกรุงเทพฯ" },
    { href: lp("/stations"), label: nonTh ? "Transit stations" : "สถานีรถไฟฟ้า" },
    { href: lp("/map"), label: nonTh ? "Map search" : "ค้นหาบนแผนที่" },
  ];

  return (
    <nav
      className={`flex flex-wrap gap-2 ${className ?? ""}`}
      aria-label={nonTh ? "Explore locations" : "สำรวจพื้นที่"}
    >
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:border-teal-300 hover:bg-teal-50 hover:text-teal-800"
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );
}
