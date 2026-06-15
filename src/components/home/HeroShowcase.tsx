"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { useLocale, useT } from "@/components/i18n/LocaleProvider";
import { localePath } from "@/lib/locale-routing";
import { getHeroDemos } from "@/lib/hero-showcase";

const ROTATE_MS = 7000;
const TYPE_MS = 28;

export function HeroShowcase() {
  const locale = useLocale();
  const t = useT();
  const demos = getHeroDemos(locale);
  const [index, setIndex] = useState(0);
  const [typed, setTyped] = useState("");
  const [showResponse, setShowResponse] = useState(false);
  const [paused, setPaused] = useState(false);

  const demo = demos[index] ?? demos[0];

  const goTo = useCallback(
    (next: number) => {
      setIndex((next + demos.length) % demos.length);
      setTyped("");
      setShowResponse(false);
    },
    [demos.length],
  );

  useEffect(() => {
    if (paused || !demo) return;

    if (typed.length < demo.query.length) {
      const timer = window.setTimeout(() => {
        setTyped(demo.query.slice(0, typed.length + 1));
      }, TYPE_MS);
      return () => window.clearTimeout(timer);
    }

    const revealTimer = window.setTimeout(() => setShowResponse(true), 400);
    return () => window.clearTimeout(revealTimer);
  }, [demo, paused, typed]);

  useEffect(() => {
    if (paused) return;
    const timer = window.setInterval(() => goTo(index + 1), ROTATE_MS);
    return () => window.clearInterval(timer);
  }, [goTo, index, paused]);

  if (!demo) return null;

  return (
    <div
      className="relative w-full"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="absolute -inset-3 rounded-[2rem] bg-white/10 blur-2xl" aria-hidden />

      <div className="relative overflow-hidden rounded-2xl border border-white/20 bg-white/10 shadow-2xl shadow-teal-950/30 backdrop-blur-md">
        <div className="relative h-40 overflow-hidden sm:h-44 lg:h-36 xl:h-40">
          <Image
            src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=900&q=80"
            alt=""
            fill
            className="object-cover transition duration-[8000ms] ease-out hover:scale-105"
            sizes="(max-width: 1024px) 100vw, 520px"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-teal-950/80 via-teal-900/30 to-transparent" />
          <div className="absolute left-4 top-4 flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-300 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
            </span>
            <span className="rounded-full bg-black/30 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-white/90">
              {t("heroShowcaseLive")}
            </span>
          </div>
          <div className="absolute bottom-3 left-4 right-4 flex flex-wrap gap-1.5">
            {["BTS อโศก", "BTS เอกมัย", "BTS สาทร"].map((chip) => (
              <span
                key={chip}
                className="rounded-full bg-white/15 px-2.5 py-0.5 text-[11px] font-medium text-white backdrop-blur-sm"
              >
                {chip}
              </span>
            ))}
          </div>
        </div>

        <div className="border-b border-white/10 bg-white/5 px-4 py-2.5">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-rose-400/90" />
            <span className="h-2.5 w-2.5 rounded-full bg-amber-400/90" />
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/90" />
            <span className="ml-2 truncate text-xs text-white/70">{t("heroShowcaseLabel")}</span>
          </div>
        </div>

        <div className="space-y-3 p-4 sm:p-5">
          <div className="flex justify-end">
            <div className="max-w-[92%] rounded-2xl rounded-tr-sm bg-white px-3.5 py-2.5 text-sm leading-snug text-slate-800 shadow-lg">
              {typed}
              {typed.length < demo.query.length && (
                <span className="ml-0.5 inline-block h-4 w-0.5 animate-pulse bg-teal-600 align-middle" />
              )}
            </div>
          </div>

          <div
            className={`space-y-3 transition-all duration-500 ${
              showResponse ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
            }`}
          >
            <div className="flex gap-2">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-teal-500 text-xs font-bold text-white">
                AI
              </span>
              <p className="rounded-2xl rounded-tl-sm bg-teal-800/60 px-3.5 py-2.5 text-sm leading-snug text-teal-50">
                {demo.response}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {demo.listings.map((listing) => (
                <div
                  key={listing.title}
                  className="overflow-hidden rounded-xl border border-white/15 bg-white/95 shadow-md"
                >
                  <div className="relative h-20 sm:h-24">
                    <Image
                      src={listing.image}
                      alt=""
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 50vw, 240px"
                    />
                  </div>
                  <div className="p-2.5">
                    <p className="truncate text-xs font-semibold text-slate-900">{listing.title}</p>
                    <p className="mt-0.5 truncate text-[11px] text-slate-500">{listing.meta}</p>
                    <p className="mt-1 text-sm font-bold text-teal-700">{listing.price}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between gap-3 pt-1">
            <div className="flex gap-1.5">
              {demos.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  aria-label={`Demo ${i + 1}`}
                  onClick={() => goTo(i)}
                  className={`h-1.5 rounded-full transition-all ${
                    i === index ? "w-5 bg-white" : "w-1.5 bg-white/40 hover:bg-white/70"
                  }`}
                />
              ))}
            </div>
            <Link
              href={localePath("/ai-search", locale)}
              className="rounded-full bg-white px-3.5 py-1.5 text-xs font-semibold text-teal-800 shadow transition hover:bg-teal-50 sm:text-sm"
            >
              {t("heroShowcaseTry")}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
