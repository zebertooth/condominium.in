# AGENTS.md — Condominium.in.th

Instructions for AI coding agents working in this repository.

---

## Start here (every new session / after token restart)

1. Read [`ROADMAP.md`](./ROADMAP.md) — current phase + session log
2. Read [`CLAUDE.md`](./CLAUDE.md) — architecture, APIs, business rules
3. Verify locally: `npm run db:deploy && npm run build && npm run lint`
4. Production check: `GET https://www.condominium.in.th/api/health`
5. Deploy: merge PR → `npx vercel --prod` or Vercel auto-deploy on `main`

> ## 🤝 HANDOFF (session 30 — **Phase C next**)
>
> **Production:** https://www.condominium.in.th — 5 locales live  
> **GitHub `main`:** highlights shipped; session 30 work may need push
>
> **Done through session 30:**
> - Phase 6b: brand, SEO admin, AdSense, favicon
> - **7 property types** + category filter + `highlights` for AI search
> - **Demo hide** when ≥3 published user listings
> - **Floating feedback widget** + agent signup on `/agents#join-agent`
> - **`/admin/agents`** — applications + profiles by **team / freelance / company**
>
> **Next priorities (Phase C):**
> 1. **Admin CSV listing import** + agent bulk post
> 2. **`/npa` hub** for bank-owned inventory
> 3. Deploy session 30 migrations to production
> 4. **Phase 7:** user listing DB i18n (after Phase C)
> 5. ThaiBulkSMS / AdSense / GA4 (user ops)

---

## Project at a glance

| Item | Value |
|------|-------|
| Production | **https://www.condominium.in.th** |
| GitHub | https://github.com/zebertooth/condominium.in |
| Phase | **Phase C** — CSV import, `/npa` hub → then Phase 7 listing i18n |
| Paid | Auto-ON when `PROMPTPAY_ID` on Vercel |
| Ads | AdSense when `NEXT_PUBLIC_ADSENSE_CLIENT` + slot IDs + cookie accept |

**Launch policy:** Thai = LINE + Email to post (2 free). Non-Thai blocked. Owner listings → direct contact.

---

## Key paths

```
src/components/brand/SiteLogo.tsx       DD-style logo + SiteLogoMark
src/app/icon.svg                        Favicon (Next.js file metadata)
src/lib/site-settings.ts                SiteSettings fetch + home meta resolve
src/lib/seo.ts                          createRootMetadata(), createMetadata()
src/app/admin/seo/                      Admin SEO + AdSense slot editor
src/lib/adsense.ts                      9-slot catalog + EMPTY_AD_SLOTS
src/components/ads/                     AdPlacement, AdSlot, AdSenseScript
src/lib/password-reset.ts               Email reset token + Resend link
src/lib/content/legal.ts                Privacy + terms (TH/EN)
src/components/layout/CookieConsent.tsx Banner; gates GA4 + AdSense
src/components/layout/LanguageSwitcher.tsx  Flag dropdown (5 locales)
src/lib/locale-content.ts               resolveLocalized + area/blog/property helpers
src/lib/property-types.ts              7 listing categories + labels
src/lib/demo-listings.ts               Hide static demos when real inventory ≥3
src/lib/agent-application.ts           team / freelance / company agent categories
src/app/admin/agents/                  Applications + tabbed profile editor
src/components/layout/FloatingFeedbackWidget.tsx  Feedback + agent signup tabs
src/components/agents/AgentInterestForm.tsx       Public agent application form
```

---

## Test credentials

Admin: `admin@condominium.in.th` / `admin123456` (via `npm run db:seed` only)

---

## Related

- [`ROADMAP.md`](./ROADMAP.md) · [`CLAUDE.md`](./CLAUDE.md) · [`DEPLOYMENT.md`](./DEPLOYMENT.md)
