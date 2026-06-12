# AGENTS.md — Condominium.in.th

Instructions for AI coding agents working in this repository.

---

## Start here (every new session / after token restart)

1. Read [`ROADMAP.md`](./ROADMAP.md) — current phase + session log
2. Read [`CLAUDE.md`](./CLAUDE.md) — architecture, APIs, business rules
3. Verify locally: `npm run db:deploy && npm run build && npm run lint`
4. Production check: `GET https://www.condominium.in.th/api/health`
5. Deploy: merge PR → `npx vercel --prod` or Vercel auto-deploy on `main`

> ## 🤝 HANDOFF (session 28 — **Phase 6 auth + legal**)
>
> **Production:** https://www.condominium.in.th — 5 locales live  
> **User will handle:** ThaiBulkSMS production verify, optional Vercel keys
>
> **Done this session:**
> - Email-only forgot/reset password for all roles (`PasswordResetToken`, Resend link)
> - `/privacy`, `/terms`, cookie consent banner, GA4 gated on consent
> - Footer legal links; register terms notice
>
> **Next priorities:**
> 1. ThaiBulkSMS production verify (user)
> 2. Optional keys: OPENAI, SLIPOK, GA4 (user)
> 3. User-submitted listing translations in DB (schema fields)
> 4. URL locale routing (`/zh/...`) — optional SEO polish

---

## Project at a glance

| Item | Value |
|------|-------|
| Production | **https://www.condominium.in.th** |
| GitHub | https://github.com/zebertooth/condominium.in |
| Phase | **Phase 6** — listing DB i18n → optional URL routing |
| Paid | Auto-ON when `PROMPTPAY_ID` on Vercel |

**Launch policy:** Thai = LINE + Email to post (2 free). Non-Thai blocked. Owner listings → direct contact.

---

## Key paths

```
src/lib/password-reset.ts             Email reset token + Resend link
src/lib/content/legal.ts              Privacy + terms (TH/EN)
src/components/layout/CookieConsent.tsx  Banner + AnalyticsLoader (GA4 consent)
src/lib/locale-content.ts           resolveLocalized + area/blog/property helpers
src/lib/content/areas-locale.ts     9 area guides × ZH/JA/AR
src/lib/content/blog-locale.ts      5 blog posts × ZH/JA/AR (full content)
src/lib/content/properties-locale.ts  9 static listings × ZH/JA/AR
```

---

## Test credentials

Admin: `admin@condominium.in.th` / `admin123456` (via `npm run db:seed` only)

---

## Related

- [`ROADMAP.md`](./ROADMAP.md) · [`CLAUDE.md`](./CLAUDE.md) · [`DEPLOYMENT.md`](./DEPLOYMENT.md)
