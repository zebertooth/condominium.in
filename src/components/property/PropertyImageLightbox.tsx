"use client";

import { useT } from "@/components/i18n/LocaleProvider";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";

interface PropertyImageLightboxProps {
  images: string[];
  title: string;
  index: number;
  onClose: () => void;
  onIndexChange: (index: number) => void;
}

function NavButton({
  direction,
  onClick,
  label,
}: {
  direction: "prev" | "next";
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="absolute top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm transition hover:bg-black/70 sm:h-14 sm:w-14"
      style={direction === "prev" ? { left: "max(0.75rem, env(safe-area-inset-left))" } : { right: "max(0.75rem, env(safe-area-inset-right))" }}
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-6 w-6" aria-hidden>
        {direction === "prev" ? (
          <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
        ) : (
          <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
        )}
      </svg>
    </button>
  );
}

export function PropertyImageLightbox({
  images,
  title,
  index,
  onClose,
  onIndexChange,
}: PropertyImageLightboxProps) {
  const t = useT();
  const [mounted, setMounted] = useState(false);
  const total = images.length;
  const current = images[index] ?? images[0];

  const goPrev = useCallback(() => {
    onIndexChange(index === 0 ? total - 1 : index - 1);
  }, [index, total, onIndexChange]);

  const goNext = useCallback(() => {
    onIndexChange(index === total - 1 ? 0 : index + 1);
  }, [index, total, onIndexChange]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowLeft") goPrev();
      if (event.key === "ArrowRight") goNext();
    };

    document.addEventListener("keydown", onKey);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [onClose, goPrev, goNext]);

  if (!mounted || !current) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex flex-col bg-black/95"
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <div className="flex shrink-0 items-center justify-between gap-3 px-4 py-3 pt-[max(0.75rem,env(safe-area-inset-top))] text-white">
        <p className="min-w-0 truncate text-sm font-medium sm:text-base">
          {title}
        </p>
        <div className="flex shrink-0 items-center gap-3">
          {total > 1 && (
            <span className="rounded-full bg-white/10 px-3 py-1 text-sm tabular-nums">
              {index + 1} / {total}
            </span>
          )}
          <button
            type="button"
            onClick={onClose}
            aria-label={t("closeBtn")}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 transition hover:bg-white/20"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5" aria-hidden>
              <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>

      <div className="relative min-h-0 flex-1">
        <button
          type="button"
          aria-label={t("galleryCloseBackdrop")}
          className="absolute inset-0"
          onClick={onClose}
        />
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center px-14 py-4 sm:px-20">
          <div className="relative h-full w-full max-h-[85vh] max-w-6xl">
            <Image
              src={current}
              alt={`${title} - ${index + 1}`}
              fill
              className="pointer-events-none object-contain"
              sizes="100vw"
              priority
            />
          </div>
        </div>
        {total > 1 && (
          <>
            <NavButton direction="prev" onClick={goPrev} label={t("galleryPrev")} />
            <NavButton direction="next" onClick={goNext} label={t("galleryNext")} />
          </>
        )}
      </div>

      {total > 1 && (
        <div className="shrink-0 border-t border-white/10 px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
          <div className="mx-auto flex max-w-4xl gap-2 overflow-x-auto pb-1">
            {images.map((src, i) => (
              <button
                key={src + i}
                type="button"
                onClick={() => onIndexChange(i)}
                aria-label={`${t("galleryPhoto")} ${i + 1}`}
                aria-current={i === index ? "true" : undefined}
                className={`relative h-16 w-24 shrink-0 overflow-hidden rounded-lg border-2 transition sm:h-20 sm:w-28 ${
                  i === index ? "border-teal-400 ring-2 ring-teal-400/40" : "border-transparent opacity-70 hover:opacity-100"
                }`}
              >
                <Image src={src} alt="" fill className="object-cover" sizes="112px" />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>,
    document.body,
  );
}
