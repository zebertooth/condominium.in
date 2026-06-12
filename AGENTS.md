# AGENTS.md — Condominium.in.th

Instructions for AI coding agents working in this repository.

---

## Start here (every new session / after token restart)

1. Read [`ROADMAP.md`](./ROADMAP.md) — current phase + session log
2. Read [`CLAUDE.md`](./CLAUDE.md) — architecture, APIs, business rules
3. Verify locally: `npm run db:deploy && npm run build && npm run lint`
4. Production check: `GET https://www.condominium.in.th/api/health`
5. Deploy: merge PR → `npx vercel --prod` or Vercel auto-deploy on `main`

> ## 🤝 HANDOFF (session 29 — **Phase 7 next**)
>
> **Production:** https://www.condominium.in.th — 5 locales live  
> **GitHub `main`:** @ `59711b7` (+ favicon files may need push)
>
> **Done through session 29:**
> - Phase 6: forgot/reset password, `/privacy`, `/terms`, cookie consent, GA4 opt-in
> - Brand: DD-style `SiteLogo`, `public/logo.svg`, favicon `src/app/icon.svg`
> - SEO admin: `SiteSettings` + `/admin/seo` — home meta + keywords editable in DB
> - AdSense: 9 placements, admin slot IDs, script gated on cookie consent
> - Language switcher: dropdown with flag + locale code
> - ThaiBulkSMS sender default `CDMNINTH`
>
> **Next priorities (Phase 7):**
> 1. **User listing DB i18n** — `UserProperty` title/description per locale + post/edit UI
> 2. Push any unpushed session 29 commits (favicon)
> 3. ThaiBulkSMS production verify (user)
> 4. AdSense: set `NEXT_PUBLIC_ADSENSE_CLIENT` + slot IDs in `/admin/seo` (user)
> 5. Optional: URL locale routing (`/zh/...`) after DB i18n

---

## Project at a glance

| Item | Value |
|------|-------|
| Production | **https://www.condominium.in.th** |
| GitHub | https://github.com/zebertooth/condominium.in |
| Phase | **Phase 7** — user listing DB i18n |
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
src/lib/content/*-locale.ts             Native ZH/JA/AR for areas, blog, static listings
```

---

## Test credentials

Admin: `admin@condominium.in.th` / `admin123456` (via `npm run db:seed` only)

---

## Related

- [`ROADMAP.md`](./ROADMAP.md) · [`CLAUDE.md`](./CLAUDE.md) · [`DEPLOYMENT.md`](./DEPLOYMENT.md)
