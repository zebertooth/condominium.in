import Image from "next/image";
import Link from "next/link";
import type { Locale, TranslationKey } from "@/lib/i18n";
import { t } from "@/lib/i18n";
import { localePath } from "@/lib/locale-routing";

interface BlogCategoryBrowseProps {
  locale: Locale;
}

const TILES: {
  href: string;
  labelKey: TranslationKey;
  descKey: TranslationKey;
  image: string;
}[] = [
  {
    href: "/blog/reviews",
    labelKey: "blogHubReviews",
    descKey: "blogTileReviewsDesc",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80",
  },
  {
    href: "/blog/guides",
    labelKey: "blogHubGuides",
    descKey: "blogTileGuidesDesc",
    image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800&q=80",
  },
  {
    href: "/buy",
    labelKey: "buy",
    descKey: "blogTileBuyDesc",
    image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80",
  },
];

export function BlogCategoryBrowse({ locale }: BlogCategoryBrowseProps) {
  return (
    <section>
      <h2 className="text-center text-xl font-bold text-slate-900 sm:text-2xl">
        {t("blogBrowseByType", locale)}
      </h2>
      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        {TILES.map((tile) => (
          <Link
            key={tile.href}
            href={localePath(tile.href, locale)}
            className="group relative aspect-[16/10] overflow-hidden rounded-xl bg-slate-200 shadow-sm"
          >
            <Image
              src={tile.image}
              alt=""
              fill
              className="object-cover transition duration-300 group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, 33vw"
            />
            <div className="absolute inset-0 bg-black/45 transition group-hover:bg-black/55" />
            <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center text-white">
              <span className="text-lg font-bold sm:text-xl">{t(tile.labelKey, locale)}</span>
              <span className="mt-1 max-w-[200px] text-xs text-white/85 sm:text-sm">
                {t(tile.descKey, locale)}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
