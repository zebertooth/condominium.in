"use client";

import { useT } from "@/components/i18n/LocaleProvider";
import Image from "next/image";
import { useCallback, useState } from "react";
import { PropertyImageLightbox } from "@/components/property/PropertyImageLightbox";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80";

export function PropertyImageGallery({ images, title }: { images: string[]; title: string }) {
  const t = useT();
  const list = images.length > 0 ? images : [FALLBACK_IMAGE];
  const [active, setActive] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const openLightbox = useCallback((index: number) => {
    setActive(index);
    setLightboxOpen(true);
  }, []);

  return (
    <>
      <div className="space-y-3">
        <button
          type="button"
          onClick={() => openLightbox(active)}
          aria-label={t("galleryExpand")}
          className="group relative block aspect-[4/3] w-full overflow-hidden rounded-2xl bg-slate-100 text-left"
        >
          <Image
            src={list[active]}
            alt={`${title} - ${active + 1}`}
            fill
            className="object-cover transition duration-300 group-hover:scale-[1.02]"
            priority
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
          <div className="absolute inset-0 bg-black/0 transition group-hover:bg-black/10" />
          <span className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full bg-black/55 text-white opacity-90 backdrop-blur-sm transition group-hover:bg-black/70">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5" aria-hidden>
              <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
          {list.length > 1 && (
            <>
              <span className="absolute bottom-3 right-3 rounded-full bg-black/60 px-3 py-1 text-sm text-white tabular-nums">
                {active + 1} / {list.length}
              </span>
              <span className="absolute bottom-3 left-3 rounded-full bg-black/60 px-3 py-1 text-sm text-white">
                {t("galleryViewAll")}
              </span>
            </>
          )}
        </button>

        {list.length > 1 && (
          <div className="flex gap-2 overflow-x-auto pb-1">
            {list.map((src, i) => (
              <button
                key={src + i}
                type="button"
                onClick={() => openLightbox(i)}
                aria-label={`${t("galleryPhoto")} ${i + 1}`}
                aria-current={i === active ? "true" : undefined}
                className={`relative h-20 w-28 shrink-0 overflow-hidden rounded-xl border-2 transition ${
                  i === active
                    ? "border-teal-600 ring-2 ring-teal-200"
                    : "border-transparent opacity-80 hover:opacity-100"
                }`}
              >
                <Image src={src} alt="" fill className="object-cover" sizes="112px" />
              </button>
            ))}
          </div>
        )}
      </div>

      {lightboxOpen && (
        <PropertyImageLightbox
          images={list}
          title={title}
          index={active}
          onClose={() => setLightboxOpen(false)}
          onIndexChange={setActive}
        />
      )}
    </>
  );
}
