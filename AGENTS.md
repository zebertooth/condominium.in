# AGENTS.md — Condominium.in.th

Instructions for AI coding agents working in this repository.

---

## Start here (every new session / after token restart)

1. Read [`ROADMAP.md`](./ROADMAP.md) — current phase + session log
2. Read [`CLAUDE.md`](./CLAUDE.md) — architecture, APIs, business rules
3. Verify locally: `npm run db:deploy && npm run build && npm run lint`
4. Production check: `GET https://www.condominium.in.th/api/health`
5. Deploy: merge PR → `npx vercel --prod` or Vercel auto-deploy on `main`

> ## 🤝 HANDOFF (session 32 — **Phase L3 in progress**)
>
> **Production:** https://www.condominium.in.th — auto-deploy on `main` (commit `1d57fa0`+)
> **GitHub `main`:** L1+L2 deployed; header/hero UX session 32 local (nav text-only pending push)
>
> **Done through session 32:**
> - **Phase L1+L2:** Filters, CSV import, favorites, map, mortgage calc, search alerts
> - **Phase L3 (partial):** Project pages — `/projects`, `/projects/[slug]`, admin CRUD
> - **Header/hero UX:** Interactive AI showcase; mobile row-2 nav (no hamburger); contact beside login; text-only nav links
>
> **Next priorities (Phase L3):**
> 1. **Price history** — log changes + chart on property detail
> 2. **Search alert digests** — cron + Resend email (DNS + Vercel env)
> 3. **Agent reviews** — ratings after closed leads
> 4. **Social login** — Google, Facebook OAuth
> 5. **NPA hub** — `/npa` landing (optional)

---

## Project at a glance

| Item | Value |
|------|-------|
| Production | **https://www.condominium.in.th** |
| GitHub | https://github.com/zebertooth/condominium.in |
| Phase | **Phase L3** — price history, alert emails, agent reviews, social login |
| Paid | Auto-ON when `PROMPTPAY_ID` on Vercel |
| Ads | AdSense when `NEXT_PUBLIC_ADSENSE_CLIENT` + slot IDs + cookie accept |
| Search | Advanced filters + Leaflet map at `/map` |
| Projects | `/projects` + admin CRUD (L3 partial) |
| Header | Two-row mobile nav (text links); desktop inline nav; hero AI showcase |
| Tools | Mortgage calculator, favorites, search alerts |

**Launch policy:** Thai = LINE + Email to post (2 free). Non-Thai blocked. Owner listings → direct contact.

---

## Key paths

```
# Session 32 — Header & hero UX
src/components/layout/Header.tsx           Two-row mobile layout; contact beside login
src/components/layout/HeaderNav.tsx          Desktop nav; shared navLinkClass (text-only links)
src/components/layout/HeaderMobileMenu.tsx   Mobile row-2 scroll nav (text-only links)
src/components/layout/HeaderAuth.tsx       Login / avatar row
src/components/home/Hero.tsx               Search + interactive AI demo
src/components/home/HeroShowcase.tsx         Auto-typing AI showcase widget
src/lib/hero-showcase.ts                   Demo queries + sample cards (TH/EN)

# Session 31 — Launch Features
src/components/property/AdvancedFilters.tsx      Price, beds, BTS, district filters
src/components/property/SaveButton.tsx           Heart icon for favorites
src/components/property/PropertyListingsMap.tsx  Leaflet map with pins
src/components/property/MortgageCalculator.tsx   Loan calculator widget
src/components/property/CreateAlertButton.tsx    Modal for search alerts
src/lib/csv-import.ts                            CSV parser + validator
src/lib/favorites.ts                             getUserSavedSlugs, getUserSavedProperties
src/app/map/                                     Map search page
src/app/dashboard/saved/                         Saved properties page
src/app/dashboard/alerts/                        Search alerts management
src/app/admin/import/                            CSV import page
src/app/tools/mortgage-calculator/               Standalone calculator page

# Core
src/components/brand/SiteLogo.tsx       DD-style logo + SiteLogoMark
src/lib/site-settings.ts                SiteSettings fetch + home meta resolve
src/lib/property-types.ts              7 listing categories + labels
src/lib/demo-listings.ts               Hide static demos when real inventory ≥3
src/lib/agent-application.ts           team / freelance / company agent categories
src/components/layout/FloatingFeedbackWidget.tsx  Feedback + agent signup tabs
```

---

## Test credentials

Admin: `admin@condominium.in.th` / `admin123456` (via `npm run db:seed` only)

---

## Related

- [`ROADMAP.md`](./ROADMAP.md) · [`CLAUDE.md`](./CLAUDE.md) · [`DEPLOYMENT.md`](./DEPLOYMENT.md)
