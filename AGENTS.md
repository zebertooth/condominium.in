# AGENTS.md — Condominium.in.th

Instructions for AI coding agents working in this repository.

---

## Start here (every new session / after token restart)

1. Read [`ROADMAP.md`](./ROADMAP.md) — current phase + session log
2. Read [`CLAUDE.md`](./CLAUDE.md) — architecture, APIs, business rules
3. Verify locally: `npm run db:deploy && npm run build && npm run lint`
4. Production check: `GET https://www.condominium.in.th/api/health`
5. Deploy: merge PR → `npx vercel --prod` or Vercel auto-deploy on `main`

> ## 🤝 HANDOFF (session 25 — **owner stats + sponsored posts UI**)
>
> **Production:** https://www.condominium.in.th — OTP/LINE verified OK  
> **User will handle next:** ThaiBulkSMS production verify → then Phase 4 i18n
>
> **Done this session:**
> - Owner listing stats: views, inquiries, contact clicks (all-time + 30-day) in dashboard
> - Sponsored posts UI: featured badges, buy/rent sort boost, sponsor purchase flow polish
> - Post-submit sponsor upsell banner; active sponsor expiry handling
>
> **Next priorities:**
> 1. ThaiBulkSMS production verify (user)
> 2. Phase 4 locales (ZH / JA / AR)
> 3. Optional Vercel keys: OPENAI, SLIPOK, GA4

---

## Project at a glance

| Item | Value |
|------|-------|
| Production | **https://www.condominium.in.th** |
| GitHub | https://github.com/zebertooth/condominium.in |
| Phase | **Phase 3 → 4** — ThaiBulkSMS verify → multilingual |
| Paid | Auto-ON when `PROMPTPAY_ID` on Vercel |

**Launch policy:** Thai = LINE + Email to post (2 free). Non-Thai blocked. Owner listings → direct contact.

---

## Deploy workflow

```powershell
npm run build
npx vercel --prod
```

Vercel runs `node scripts/vercel-build.mjs` (migrate only when `DATABASE_URL` is set).

---

## Key paths

```
scripts/vercel-build.mjs       Vercel CI build (conditional migrate)
src/lib/analytics.ts           getOwnerPropertyStats() + admin summary
src/lib/user-properties.ts     isActiveSponsor(), listing conversion
src/lib/listings.ts            Featured-first sort on buy/rent/home
src/components/dashboard/      MyProperties stats, SponsorUpsellBanner
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
