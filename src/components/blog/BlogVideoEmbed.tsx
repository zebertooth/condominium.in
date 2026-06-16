import { youtubeEmbedUrl } from "@/lib/blog-render";

interface BlogVideoEmbedProps {
  url: string;
  title: string;
  className?: string;
}

export function BlogVideoEmbed({ url, title, className = "" }: BlogVideoEmbedProps) {
  const embedUrl = youtubeEmbedUrl(url);
  if (!embedUrl) return null;

  return (
    <div className={`aspect-video overflow-hidden rounded-2xl bg-black ${className}`.trim()}>
      <iframe
        src={embedUrl}
        title={title}
        className="h-full w-full"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
}
