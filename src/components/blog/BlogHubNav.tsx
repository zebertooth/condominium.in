import Link from "next/link";
import type { Locale } from "@/lib/i18n";
import { t, type TranslationKey } from "@/lib/i18n";
import { localePath } from "@/lib/locale-routing";

interface BlogHubNavProps {
  locale: Locale;
  active: "all" | "reviews" | "guides";
}

export function BlogHubNav({ locale, active }: BlogHubNavProps) {
  const tabs: { id: BlogHubNavProps["active"]; href: string; labelKey: TranslationKey }[] = [
    { id: "all", href: "/blog", labelKey: "blogHubAll" },
    { id: "reviews", href: "/blog/reviews", labelKey: "blogHubReviews" },
    { id: "guides", href: "/blog/guides", labelKey: "blogHubGuides" },
  ];

  return (
    <nav className="mt-6 flex flex-wrap gap-2">
      {tabs.map((tab) => (
        <Link
          key={tab.id}
          href={localePath(tab.href, locale)}
          className={`rounded-full px-4 py-2 text-sm font-medium transition ${
            active === tab.id
              ? "bg-teal-600 text-white"
              : "bg-white text-slate-700 ring-1 ring-slate-200 hover:bg-teal-50"
          }`}
        >
          {t(tab.labelKey, locale)}
        </Link>
      ))}
    </nav>
  );
}
