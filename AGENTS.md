# AGENTS.md — Condominium.in.th

Instructions for AI coding agents working in this repository.

---

## Start here (every new session / after token restart)

1. Read [`ROADMAP.md`](./ROADMAP.md) — current phase + session log
2. Read [`CLAUDE.md`](./CLAUDE.md) — architecture, APIs, business rules
3. Verify locally: `npm run db:deploy && npm run build && npm run lint`
4. Production check: `GET https://www.condominium.in.th/api/health`
5. Deploy: merge PR → `npx vercel --prod` or Vercel auto-deploy on `main`

> ## 🤝 HANDOFF (session 45 — **Phase 11 in progress**)
>
> **Production:** https://www.condominium.in.th  
> **GitHub `main`:** Phase 11 code local — commit + deploy pending
>
> **Done (Phase 11 code):**
> - `/admin/ops` — cron/AdSense/GSC checklist
> - `furnishing` enum on listings + post form + CSV
> - Markdown blog editor (edit/preview) in admin
> - Compare shortlist (4 max) + `/compare` page
> - `/market` linked from area pages + review articles
> - Editorial seed: Life Asoke Hype review #2 + Sukhumvit area roundup
>
> **User ops still needed:**
> - `CRON_SECRET`, `GOOGLE_SITE_VERIFICATION`, AdSense slots on Vercel
> - GSC: submit sitemap + request indexing
> - `npm run db:deploy` for furnishing migration

---

## Project at a glance

| Item | Value |
|------|-------|
| Production | **https://www.condominium.in.th** |
| GitHub | https://github.com/zebertooth/condominium.in |
| Phase | **Phase 11** — ops + editorial scale |
| Homepage | 3 sections: recommended / latest / popular (`HomeListingsSection`) |
| Admin sponsored | `/admin/sponsored` — manage ประกาศแนะนำ (7/30/custom days) |
| Locale | Unprefixed = Thai; `/en/*` … `/ar/*` prefixed; middleware `x-condo-locale` |
| Paid | Auto-ON when `PROMPTPAY_ID` on Vercel |
| Ads | AdSense when `NEXT_PUBLIC_ADSENSE_CLIENT` + slot IDs + cookie accept |
| Search | Advanced filters + Leaflet map at `/map` |
| Projects | `/projects` + admin CRUD (L3 partial) |
| Header | Two-row mobile nav (text links); desktop inline nav; hero AI showcase |
| Security | Cloudflare Turnstile on login, register, contact forms |
| Analytics | GA4 after cookie consent (`G-9MRZ57SWS1`) |
| Tools | Mortgage calculator, favorites, search alerts, price history |
| Editorial | TOL reviews + **บทความเกี่ยวกับบ้าน** + listing carousel on blog |
| Search UX | Sort, rich cards, sqm/furnishing, list/map toggle, SEO BTS hubs |
| Social | Google + Facebook OAuth (env-gated) |

**Launch policy:** Thai = LINE + Email to post (2 free). Non-Thai blocked. Owner listings → direct contact.

---

## Key paths

```
# Phase 9 (planned) — Editorial review blog
PHASE-9-PLAN.md                           Competitive analysis + build order
src/components/blog/ReviewArticleLayout.tsx  Fact @, TOC, listing CTA (planned)
src/app/blog/reviews/                     Project reviews hub (planned)

# Session 42 — Phase 8 dashboard i18n + SEO fix
src/components/admin/AdminSeoForm.tsx     Load once; no reset on keystroke
src/components/i18n/LocaleProvider.tsx    useT/useTf stable via useCallback
src/app/dashboard/agent/page.tsx          Agent CRM i18n
src/components/dashboard/AgentLeadTable.tsx
src/app/dashboard/saved/ + alerts/        Full 5-locale dashboard flows

# Session 38 — Locale fix + cron deploy
src/middleware.ts                         Unprefixed → Thai; /en/* rewrite; LOCALE_HEADER
src/components/i18n/LocalizedLink.tsx     Client links preserve locale prefix
src/lib/cron-auth.ts                      readCronSecret() strips control chars
vercel.json                               Cron schedules (restored after CRON_SECRET fix)

# Session 37 — Homepage + admin sponsored
src/components/home/HomeListingsSection.tsx   Recommended / latest / popular sections
src/lib/listings.ts                           getRecommended/Latest/PopularListings()
src/app/admin/sponsored/                      Admin ประกาศแนะนำ panel
src/components/admin/AdminSponsoredPanel.tsx  7/30 days + custom date (กำหนดเอง)
src/lib/sponsored.ts                          isActiveSponsor() (client-safe)
public/inventory/                             starter-*.csv sample imports

# Phase 7 — User listing i18n
src/lib/locale-routing.ts                 localePath, stripLocaleFromPath, hreflang helpers
src/lib/property-locale-fields.ts       Locale field helpers
src/lib/locale-content.ts               Owner listing fallback in localizedProperty*
src/components/dashboard/PostPropertyForm.tsx  Translations section
prisma/migrations/20260615000000_user_property_i18n/

# Session 34 — Phase L3 growth features
src/lib/price-history.ts                  PriceHistory log + reduced badge helpers
src/lib/search-alert-digest.ts            Cron digest email logic
src/lib/google-oauth.ts / facebook-oauth.ts  Social login
src/lib/oauth-users.ts                    Login/register via OAuth
src/components/property/PriceHistoryPanel.tsx  Property detail chart
src/app/api/cron/search-alerts/route.ts   Vercel cron endpoint
src/app/api/agent-reviews/route.ts        User review submission
src/app/admin/reviews/                    Review moderation
src/app/npa/                              NPA hub page
vercel.json                               Cron schedules

# Session 33 — Security & analytics
src/lib/captcha.ts                         Server verify + requireCaptcha() helper
src/components/security/TurnstileField.tsx Widget + useCaptchaGate() hook
src/components/security/TurnstileScript.tsx Site-wide script preload
src/app/api/captcha/config/route.ts       Runtime site key (production-safe)
src/lib/ga.ts                              GA4 measurement ID + loader helpers
scripts/vercel-build.mjs                   Migrate retries + Neon direct URL derive

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

- [`ROADMAP.md`](./ROADMAP.md) · [`CLAUDE.md`](./CLAUDE.md) · [`PHASE-9-PLAN.md`](./PHASE-9-PLAN.md) · [`DEPLOYMENT.md`](./DEPLOYMENT.md)
