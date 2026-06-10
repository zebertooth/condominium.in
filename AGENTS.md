# AGENTS.md — Condominium.in.th

Instructions for AI coding agents working in this repository.

---

## Start here (every new session / after token restart)

1. Read [`ROADMAP.md`](./ROADMAP.md) — current phase + session log
2. Read [`CLAUDE.md`](./CLAUDE.md) — architecture, APIs, business rules
3. Verify locally: `npm run db:deploy && npm run build && npm run lint`
4. Production check: `GET https://www.condominium.in.th/api/health`
5. Deploy: merge PR → `npx vercel --prod` or Vercel auto-deploy on `main`

> ## 🤝 HANDOFF (session 26 — **Phase 4 i18n: ZH / JA / AR**)
>
> **Production:** https://www.condominium.in.th  
> **User will handle:** ThaiBulkSMS production verify
>
> **Done this session:**
> - Enabled ZH / JA / AR in language switcher (cookie `condo_locale`)
> - Full UI translations (~331 keys each) in `src/lib/i18n/*-overrides.ts`
> - RTL layout for Arabic (`dir="rtl"` on `<html>`)
> - hreflang tags on all pages via `createMetadata()`
> - Blog/area/property content uses EN fields for non-Thai locales
>
> **Next priorities:**
> 1. ThaiBulkSMS production verify (user)
> 2. Optional Vercel keys: OPENAI, SLIPOK, GA4
> 3. Per-locale property/blog/area content fields (ZH/JA/AR native copy)

---

## Project at a glance

| Item | Value |
|------|-------|
| Production | **https://www.condominium.in.th** |
| GitHub | https://github.com/zebertooth/condominium.in |
| Phase | **Phase 4** — 5 locales live (TH/EN/ZH/JA/AR) |
| Paid | Auto-ON when `PROMPTPAY_ID` on Vercel |

**Launch policy:** Thai = LINE + Email to post (2 free). Non-Thai blocked. Owner listings → direct contact.

---

## Deploy workflow

```powershell
npm run build
npx vercel --prod
```

---

## Key paths

```
src/lib/i18n.ts                 Locale type + t() + activeLocales (5 langs)
src/lib/i18n/zh-overrides.ts    Simplified Chinese UI strings
src/lib/i18n/ja-overrides.ts    Japanese UI strings
src/lib/i18n/ar-overrides.ts    Arabic UI strings (+ RTL)
src/lib/locale-content.ts         usesEnglishContent(), isRtlLocale(), dateLocale()
src/lib/seo.ts                    hreflang alternates
```

---

## Test credentials

Admin: `admin@condominium.in.th` / `admin123456` (created via `npm run db:seed` only — never via register)

---

## Do NOT (unless user asks)

- Commit `.env`
- Auto-promote register users to admin

---

## Related

- [`ROADMAP.md`](./ROADMAP.md) — phase tracker + session log
- [`CLAUDE.md`](./CLAUDE.md) — technical reference
- [`DEPLOYMENT.md`](./DEPLOYMENT.md) — Vercel env + troubleshooting
