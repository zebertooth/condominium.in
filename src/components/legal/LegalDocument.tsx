import type { LegalSection } from "@/lib/content/legal";

export function LegalDocument({ sections }: { sections: LegalSection[] }) {
  return (
    <div className="prose prose-slate max-w-none space-y-8">
      {sections.map((section) => (
        <section key={section.id} id={section.id}>
          <h2 className="text-xl font-semibold text-slate-900">{section.title}</h2>
          <div className="mt-3 space-y-3 text-sm leading-relaxed text-slate-700">
            {section.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
