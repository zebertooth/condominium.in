"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useT } from "@/components/i18n/LocaleProvider";
import type { HeaderNavItem } from "@/components/layout/HeaderNav";

interface HeaderMobileMenuProps {
  mainLinks: HeaderNavItem[];
  highlightLink?: HeaderNavItem;
  showContact?: boolean;
}

function MenuIcon({ open }: { open: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      className="h-5 w-5"
      aria-hidden
    >
      {open ? (
        <>
          <path d="M6 6l12 12" />
          <path d="M18 6 6 18" />
        </>
      ) : (
        <>
          <path d="M4 7h16" />
          <path d="M4 12h16" />
          <path d="M4 17h16" />
        </>
      )}
    </svg>
  );
}

export function HeaderMobileMenu({
  mainLinks,
  highlightLink,
  showContact = false,
}: HeaderMobileMenuProps) {
  const t = useT();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;

    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const drawerLinks = highlightLink ? [...mainLinks, highlightLink] : mainLinks;

  return (
    <>
      <button
        type="button"
        className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:border-teal-300 hover:bg-teal-50 lg:hidden"
        aria-expanded={open}
        aria-controls="mobile-nav-drawer"
        aria-label={open ? t("navClose") : t("navMenu")}
        onClick={() => setOpen((value) => !value)}
      >
        <MenuIcon open={open} />
      </button>

      {open && (
        <div className="fixed inset-0 z-[300] lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-[1px]"
            aria-label={t("navClose")}
            onClick={() => setOpen(false)}
          />
          <nav
            id="mobile-nav-drawer"
            aria-label="Mobile menu"
            className="absolute right-0 top-0 flex h-full w-[min(100vw-3rem,20rem)] flex-col bg-white shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
              <p className="text-sm font-semibold text-slate-900">{t("navMenu")}</p>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="inline-flex h-8 w-8 items-center justify-center rounded-full text-slate-500 hover:bg-slate-100"
                aria-label={t("navClose")}
              >
                <MenuIcon open />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-3 py-3">
              <ul className="space-y-1">
                {drawerLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      onClick={() => setOpen(false)}
                      className={
                        link.highlight
                          ? "block rounded-xl bg-gradient-to-r from-teal-600 to-teal-500 px-4 py-3 text-sm font-semibold text-white shadow-sm"
                          : "block rounded-xl px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-teal-50 hover:text-teal-800"
                      }
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {showContact && (
              <div className="border-t border-slate-100 p-3">
                <Link
                  href="/contact"
                  onClick={() => setOpen(false)}
                  className="block rounded-xl bg-gradient-to-r from-teal-600 to-teal-500 px-4 py-3 text-center text-sm font-semibold text-white shadow-sm"
                >
                  {t("contact")}
                </Link>
              </div>
            )}
          </nav>
        </div>
      )}
    </>
  );
}

export function HeaderMobileQuickNav({
  mainLinks,
  highlightLink,
}: {
  mainLinks: HeaderNavItem[];
  highlightLink?: HeaderNavItem;
}) {
  const chips = highlightLink ? [...mainLinks, highlightLink] : mainLinks;

  return (
    <nav
      className="border-t border-slate-100/90 bg-slate-50/90 lg:hidden"
      aria-label="Quick menu"
    >
      <div className="overflow-x-auto px-4 py-2.5 [scrollbar-width:thin] [&::-webkit-scrollbar]:h-1 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-slate-300">
        <div className="inline-flex min-w-full items-center justify-center gap-1.5 snap-x snap-mandatory">
          {chips.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={
                link.highlight
                  ? "shrink-0 snap-start whitespace-nowrap rounded-full bg-gradient-to-r from-teal-600 to-teal-500 px-4 py-2 text-[13px] font-semibold text-white shadow-sm shadow-teal-600/20"
                  : "shrink-0 snap-start whitespace-nowrap rounded-full border border-slate-200/80 bg-white px-3.5 py-2 text-[13px] font-medium text-slate-700 shadow-sm transition hover:border-teal-200 hover:text-teal-700"
              }
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
