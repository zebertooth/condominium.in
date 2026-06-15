"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { formatPrice, t, type Locale } from "@/lib/i18n";
import { localePath } from "@/lib/locale-routing";
import { formatNearbyStation } from "@/lib/locations";
import { resolveListingImage } from "@/lib/listing-images";
import { localizedPropertyDistrict, localizedPropertyTitle } from "@/lib/property-i18n";
import { showsRoomCounts } from "@/lib/property-types";
import type { Property } from "@/types/property";

interface PropertyListingCarouselProps {
  properties: Property[];
  locale: Locale;
}

function CarouselCard({ property, locale }: { property: Property; locale: Locale }) {
  const title = localizedPropertyTitle(property, locale);
  const district = localizedPropertyDistrict(property, locale);
  const coverImage = resolveListingImage(property.images);
  const href = localePath(`/property/${property.slug}`, locale);

  return (
    <article className="group flex h-full w-[82vw] max-w-[320px] shrink-0 snap-start flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md sm:w-[calc(50%-0.75rem)] sm:max-w-none lg:w-[calc(33.333%-1rem)]">
      <Link href={href} className="flex h-full flex-col touch-manipulation">
        <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
          <Image
            src={coverImage}
            alt={title}
            fill
            className="object-cover transition duration-300 group-hover:scale-105"
            sizes="(max-width: 640px) 320px, 33vw"
          />
          <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
            {property.featured && (
              <span className="rounded-full bg-violet-600 px-2 py-0.5 text-[10px] font-medium text-white">
                {t("statusFeatured", locale)}
              </span>
            )}
            <span className="rounded-full bg-teal-600 px-2 py-0.5 text-[10px] font-medium text-white">
              {property.listingType === "rent" ? t("rent", locale) : t("sale", locale)}
            </span>
            {property.btsStation && (
              <span className="rounded-full bg-white/90 px-2 py-0.5 text-[10px] font-medium text-slate-800">
                {formatNearbyStation(property.btsStation)}
              </span>
            )}
          </div>
        </div>
        <div className="flex flex-1 flex-col p-4">
          <p className="text-lg font-bold text-teal-700">
            {formatPrice(property.price, property.listingType, locale)}
          </p>
          <h3 className="mt-1 line-clamp-2 font-semibold text-slate-900">{title}</h3>
          <p className="mt-1 text-sm text-slate-500">
            {district}
            {property.btsStation ? ` · ${formatNearbyStation(property.btsStation)}` : ""}
          </p>
          {showsRoomCounts(property.propertyType) && (
            <p className="mt-auto pt-3 text-xs text-slate-500">
              {property.bedrooms} {t("bedrooms", locale)} · {property.bathrooms}{" "}
              {t("bathrooms", locale)} · {property.areaSqm} {t("sqm", locale)}
            </p>
          )}
        </div>
      </Link>
    </article>
  );
}

export function PropertyListingCarousel({ properties, locale }: PropertyListingCarouselProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);

  const updateButtons = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    const maxScroll = el.scrollWidth - el.clientWidth;
    setCanPrev(el.scrollLeft > 8);
    setCanNext(el.scrollLeft < maxScroll - 8);
  }, []);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    updateButtons();
    el.addEventListener("scroll", updateButtons, { passive: true });
    window.addEventListener("resize", updateButtons);
    return () => {
      el.removeEventListener("scroll", updateButtons);
      window.removeEventListener("resize", updateButtons);
    };
  }, [properties.length, updateButtons]);

  function scrollByPage(direction: 1 | -1) {
    const el = trackRef.current;
    if (!el) return;
    const amount = Math.max(el.clientWidth * 0.9, 280) * direction;
    el.scrollBy({ left: amount, behavior: "smooth" });
  }

  if (properties.length === 0) return null;

  return (
    <div className="relative">
      {canPrev && (
        <button
          type="button"
          onClick={() => scrollByPage(-1)}
          aria-label={t("carouselPrev", locale)}
          className="absolute -left-3 top-1/2 z-10 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-md transition hover:bg-slate-50 sm:flex"
        >
          ‹
        </button>
      )}
      {canNext && (
        <button
          type="button"
          onClick={() => scrollByPage(1)}
          aria-label={t("carouselNext", locale)}
          className="absolute -right-3 top-1/2 z-10 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-md transition hover:bg-slate-50 sm:flex"
        >
          ›
        </button>
      )}

      <div
        ref={trackRef}
        className="flex gap-4 overflow-x-auto overscroll-x-contain scroll-smooth pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [scroll-padding-inline:1rem] snap-x snap-mandatory touch-pan-x [&::-webkit-scrollbar]:hidden"
      >
        {properties.map((property) => (
          <CarouselCard key={property.id} property={property} locale={locale} />
        ))}
      </div>

      <div className="mt-4 flex justify-center gap-2 sm:hidden">
        <button
          type="button"
          disabled={!canPrev}
          onClick={() => scrollByPage(-1)}
          className="rounded-full border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 disabled:opacity-40"
        >
          {t("carouselPrev", locale)}
        </button>
        <button
          type="button"
          disabled={!canNext}
          onClick={() => scrollByPage(1)}
          className="rounded-full border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 disabled:opacity-40"
        >
          {t("carouselNext", locale)}
        </button>
      </div>
    </div>
  );
}
