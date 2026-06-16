# AGENTS.md — Condominium.in.th

Instructions for AI coding agents working in this repository.

---

## Start here (every new session / after token restart)

1. Read [`ROADMAP.md`](./ROADMAP.md) — current phase + session log
2. Read [`CLAUDE.md`](./CLAUDE.md) — architecture, APIs, business rules
3. Verify locally: `npm run db:deploy && npm run build && npm run lint`
4. Production check: `GET https://www.condominium.in.th/api/health`
5. Deploy: merge PR → `npx vercel --prod` or Vercel auto-deploy on `main`

> ## 🤝 HANDOFF (session 48 — **Phase 13B next**)
>
> **Production:** https://www.condominium.in.th — deploy Phase 13A pending push  
> **GitHub `main`:** local — Phase 13A monetization polish + prior session 31–47 work
>
> **Phase 13A shipped (monetization polish):**
> - SlipOK auto-verify fixed (`multipart/form-data`, `SLIPOK_BRANCH_ID`, amount check)
> - Shared `activateConfirmedSubscription()` — confirm route + admin approve + confirmation email
> - Sponsor renewal emails include tier pricing (฿29/79/159)
> - Cron: expiry notices + deactivate expired `isSponsored` (`sponsorExpiredNoticeAt` migration)
> - `/admin/ops` — PromptPay + SlipOK health checks
>
> **Next (Phase 13B):** lead nurture emails, inquiry follow-up, conversion UX

---

## Project at a glance

| Item | Value |
|------|-------|
| Production | **https://www.condominium.in.th** |
| GitHub | https://github.com/zebertooth/condominium.in |
| Phase | **Phase 13B** — lead nurture + conversion UX |
| Homepage | 3 sections + blog cards with images |
| Admin sponsored | `/admin/sponsored` — manage ประกาศแนะนำ (7/30/custom days) |
| Locale | Unprefixed = Thai; `/en/*` … `/ar/*` prefixed; middleware `x-condo-locale` |
| Paid | Auto-ON when `PROMPTPAY_ID` on Vercel |
| Ads | AdSense client in `<head>`; units after cookie “Accept all” + slot IDs in `/admin/seo` |
| Search | Advanced filters + Leaflet map at `/map` (lazy-loaded) |
| Projects | `/projects` + admin CRUD (L3 partial) |
| Security | Cloudflare Turnstile on login, register, contact forms |
| Analytics | GA4 after cookie consent (`G-9MRZ57SWS1`) |
| Tools | Mortgage calculator, favorites, hybrid search alerts, price history, compare |
| Editorial | TOL reviews + **บทความเกี่ยวกับบ้าน** + listing carousel + newsletter |
| Search UX | Sort, rich cards, sqm/furnishing, list/map toggle, SEO BTS hubs |
| Social | Google + Facebook OAuth (env-gated) |

**Launch policy:** Thai = LINE + Email to post (2 free). Non-Thai blocked. Owner listings → direct contact.

---

## Key paths

```
# Phase 11–12
src/components/property/CompareProvider.tsx   Compare shortlist (max 4)
src/app/compare/page.tsx                      Compare table page
src/app/admin/ops/page.tsx                    Ops checklist (cron, Resend, GSC)
src/lib/search-alert-digest.ts                Hybrid alerts (instant + publish + weekly)
src/lib/newsletter-digest.ts                  Newsletter blast on blog publish
src/lib/newsletter-unsubscribe.ts             Token unsubscribe flow
src/app/ads.txt/route.ts                        AdSense ads.txt
src/components/blog/NewsletterSignup.tsx      /blog subscribe form
src/components/property/PropertyListingsMapLazy.tsx  Leaflet code-split

# Core
src/components/brand/SiteLogo.tsx
src/lib/site-settings.ts
src/lib/property-types.ts
src/lib/demo-listings.ts
src/lib/agent-application.ts
src/components/layout/FloatingFeedbackWidget.tsx
```

---

## Test credentials

Admin: `admin@condominium.in.th` / `admin123456` (via `npm run db:seed` only)

---

## Related

- [`ROADMAP.md`](./ROADMAP.md) · [`CLAUDE.md`](./CLAUDE.md) · [`DEPLOYMENT.md`](./DEPLOYMENT.md)
