import type { BlogSection } from "@/types/property";
import type { Locale } from "@/lib/i18n";
import { t } from "@/lib/i18n";

interface ArticleTocProps {
  sections: BlogSection[];
  locale: Locale;
}

export function ArticleToc({ sections, locale }: ArticleTocProps) {
  if (sections.length === 0) return null;

  return (
    <nav className="rounded-2xl border border-slate-200 bg-white p-5">
      <h2 className="text-sm font-bold text-slate-900">{t("blogToc", locale)}</h2>
      <ol className="mt-3 space-y-2">
        {sections.map((section, index) => (
          <li key={section.id}>
            <a
              href={`#${section.id}`}
              className="text-sm text-teal-700 hover:underline"
            >
              {index + 1}. {section.title}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
