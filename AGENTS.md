# AGENTS.md — Condominium.in.th

Instructions for AI coding agents working in this repository.

---

## Start here (every new session / after token restart)

1. Read [`ROADMAP.md`](./ROADMAP.md) — current phase + session log
2. Read [`CLAUDE.md`](./CLAUDE.md) — architecture, APIs, business rules
3. Verify locally: `npm run db:deploy && npm run build && npm run lint`
4. Production check: `GET https://www.condominium.in.th/api/health`
5. Deploy: merge PR → `npx vercel --prod` or Vercel auto-deploy on `main`

> ## 🤝 HANDOFF (session 46 — **Phase 11 complete**)
>
> **Production:** https://www.condominium.in.th  
> **GitHub `main`:** Phase 11 shipped — `de153ad` + session 46 newsletter
>
> **All dev phases (1 → 11) code-complete.** Remaining work is **ops + content**, not new platform features.
>
> **Phase 11 shipped:**
> - Compare, furnishing, Markdown blog editor, `/admin/ops`, `/market` links
> - Hybrid search alerts (instant + publish + weekly backup)
> - Blog newsletter signup + email on publish
> - art4d source credit, YouTube on articles, NPA in footer
>
> **User ops (backlog):**
> - AdSense slots in `/admin/seo` + `NEXT_PUBLIC_ADSENSE_CLIENT`
> - GSC: `GOOGLE_SITE_VERIFICATION` + submit sitemap
> - Editorial cadence: 2 reviews/month via `/admin/blog`

---

## Project at a glance

| Item | Value |
|------|-------|
| Production | **https://www.condominium.in.th** |
| GitHub | https://github.com/zebertooth/condominium.in |
| Phase | **Phase 11 done** — ops + editorial cadence ongoing |
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
| Tools | Mortgage calculator, favorites, hybrid search alerts, price history |
| Editorial | TOL reviews + **บทความเกี่ยวกับบ้าน** + listing carousel + newsletter |
| Search UX | Sort, rich cards, sqm/furnishing, list/map toggle, SEO BTS hubs |
| Social | Google + Facebook OAuth (env-gated) |

**Launch policy:** Thai = LINE + Email to post (2 free). Non-Thai blocked. Owner listings → direct contact.

---

## Key paths

```
# Phase 11
src/components/property/CompareProvider.tsx   Compare shortlist (max 4)
src/app/compare/page.tsx                      Compare table page
src/app/admin/ops/page.tsx                    Ops checklist (cron, Resend, GSC)
src/lib/search-alert-digest.ts                Hybrid alerts (instant + publish + weekly)
src/lib/newsletter-digest.ts                  Newsletter blast on blog publish
src/components/blog/NewsletterSignup.tsx      /blog subscribe form
src/components/admin/MarkdownEditor.tsx       Blog edit/preview tabs
src/components/blog/SourceCredit.tsx            art4d / partner credit footer

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
