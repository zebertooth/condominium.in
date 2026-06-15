export function renderBlogContent(content: string) {
  return content.split("\n\n").map((block, i) => {
    if (block.startsWith("**") && block.includes("**")) {
      const title = block.replace(/\*\*/g, "").trim();
      const id = slugifyHeading(title);
      return (
        <h2 key={i} id={id} className="mt-8 scroll-mt-24 text-xl font-bold text-slate-900">
          {title}
        </h2>
      );
    }
    const html = block
      .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
      .replace(/\n/g, "<br />");
    return (
      <p
        key={i}
        className="mt-3 leading-relaxed text-slate-700"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    );
  });
}

export function slugifyHeading(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\u0E00-\u0E7F\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .slice(0, 60);
}

export function youtubeEmbedUrl(url: string): string | null {
  if (!url) return null;
  try {
    const u = new URL(url);
    if (u.hostname.includes("youtu.be")) {
      const id = u.pathname.replace("/", "");
      return id ? `https://www.youtube.com/embed/${id}` : null;
    }
    if (u.hostname.includes("youtube.com")) {
      const id = u.searchParams.get("v");
      return id ? `https://www.youtube.com/embed/${id}` : null;
    }
  } catch {
    return null;
  }
  return null;
}
