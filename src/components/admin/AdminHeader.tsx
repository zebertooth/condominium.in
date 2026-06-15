"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { LogoutButton } from "@/components/auth/LogoutButton";

export type AdminNavItem = { href: string; label: string };

function navLinkClass(active: boolean, compact = false): string {
  const base = compact
    ? "block rounded-lg px-3 py-2 text-sm font-medium transition"
    : "rounded-lg px-3 py-1.5 text-sm whitespace-nowrap transition";
  return active
    ? `${base} bg-teal-600 text-white`
    : `${base} bg-slate-800 text-white hover:bg-slate-700`;
}

export function AdminHeader({
  items,
  backLabel,
}: {
  items: AdminNavItem[];
  backLabel: string;
}) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const isActive = (href: string) =>
    href === "/admin" ? pathname === "/admin" : pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header className="border-b border-slate-200 bg-slate-900 text-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <div className="min-w-0">
          <p className="truncate text-lg font-bold">Admin Panel</p>
          <p className="truncate text-xs text-slate-400">Condominium.in.th</p>
        </div>

        <button
          type="button"
          className="inline-flex shrink-0 items-center gap-2 rounded-lg border border-slate-600 px-3 py-2 text-sm font-medium lg:hidden"
          onClick={() => setMenuOpen((open) => !open)}
          aria-expanded={menuOpen}
          aria-controls="admin-mobile-nav"
        >
          <svg
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden
          >
            {menuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
          Menu
        </button>

        <div className="hidden shrink-0 items-center gap-2 lg:flex">
          <Link
            href="/"
            className="rounded-lg border border-slate-600 px-3 py-1.5 text-sm hover:bg-slate-800"
          >
            {backLabel}
          </Link>
          <LogoutButton className="rounded-lg border border-red-400/60 px-3 py-1.5 text-sm text-red-200 hover:bg-red-950/50" />
        </div>
      </div>

      <nav
        id="admin-mobile-nav"
        className={`border-t border-slate-800 lg:hidden ${menuOpen ? "block" : "hidden"}`}
        aria-label="Admin navigation"
      >
        <div className="mx-auto max-w-7xl grid grid-cols-2 gap-2 px-4 py-3 sm:grid-cols-3">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMenuOpen(false)}
              className={navLinkClass(isActive(item.href), true)}
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/"
            onClick={() => setMenuOpen(false)}
            className="rounded-lg border border-slate-600 px-3 py-2 text-sm font-medium hover:bg-slate-800 sm:col-span-1"
          >
            {backLabel}
          </Link>
          <div className="col-span-2 sm:col-span-3">
            <LogoutButton className="w-full rounded-lg border border-red-400/60 px-3 py-2 text-sm text-red-200 hover:bg-red-950/50" />
          </div>
        </div>
      </nav>

      <nav className="hidden border-t border-slate-800 lg:block" aria-label="Admin navigation">
        <div className="mx-auto max-w-7xl px-4 py-2 sm:px-6">
          <div className="flex flex-wrap gap-2">
            {items.map((item) => (
              <Link key={item.href} href={item.href} className={navLinkClass(isActive(item.href))}>
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </nav>
    </header>
  );
}
