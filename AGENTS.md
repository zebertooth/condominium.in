# AGENTS.md — Condominium.in.th

Instructions for AI coding agents working in this repository.

---

## Start here (every new session / after token restart)

1. Read [`ROADMAP.md`](./ROADMAP.md) — current phase + session log
2. Read [`CLAUDE.md`](./CLAUDE.md) — architecture, APIs, business rules
3. Verify locally: `npm run db:deploy && npm run build && npm run lint`
4. Manual smoke: see [`DEPLOYMENT.md`](./DEPLOYMENT.md) § Local process checklist
5. Production check: `GET https://www.condominium.in.th/api/health`
6. Deploy: push `main` → `npx vercel --prod` or Vercel auto-deploy

> ## 🤝 HANDOFF (session 55 — **Phase 15 district/station SEO**)
>
> **Production:** https://www.condominium.in.th — deploy session 55 pending (local)
>
> **Session 55:**
> - Hub listing counts on `/districts` and `/stations`
> - Cross-links: home, `/areas`, blog review CTAs → districts/stations/map
> - Map deep-links on location filter chips (SelectedChoice)
> - AI search: district + full transit station parsing (LLM + rules)
>
> **Next:** Starter import on `/admin/ops`; set `OPENAI_API_KEY` on Vercel; fill AdSense slots

---

## Project at a glance

| Item | Value |
|------|-------|
| Production | **https://www.condominium.in.th** |
| GitHub | https://github.com/zebertooth/condominium.in |
| Phase | **Phase 15 done** — district/station hubs + location UX; user ops next |
| Monetization | **Sponsor boost only** — 1d ฿29 · 3d ฿79 · 7d ฿159 (PromptPay + SlipOK) |
| Listings | Unlimited after verify (Thai users); agents admin-capped |
| Admin sponsored | `/admin/sponsored` — 1/3/7 days + custom date |
| Compare | `/compare` — max 4; remove syncs localStorage |
| Locale | Unprefixed = Thai; `/en/*` … `/ar/*` prefixed |
| Paid | Auto-ON when `PROMPTPAY_ID` on Vercel |
| Ads | AdSense in `<head>`; units after cookie accept + slot IDs in `/admin/seo` |
| Security | Cloudflare Turnstile on login, register, contact |
| Crons | Mon 02:00 UTC alerts · daily 03:00 UTC sponsor reminders + expiry |
| SEO hubs | `/districts` (50) · `/stations` (137) · `/buy|rent/district/[slug]` |

**Launch policy:** Thai = LINE + Email to post (**unlimited**). Non-Thai blocked from posting. Owner listings → direct contact.

---

## Key paths

```
# Phase 15 — district/station SEO
src/lib/bangkok-districts-data.ts       50 districts
src/lib/transit-stations-data.ts        137 stations
src/lib/hub-listing-counts.ts           Per-hub buy/rent counts
src/components/property/LocationFilterPicker.tsx  District OR station choice
src/components/property/HubExploreLinks.tsx       Cross-link strip
src/app/districts/ src/app/stations/
src/app/buy/district/[slug]/ src/app/rent/district/[slug]/

# Phase 13A — monetization
src/components/dashboard/SponsorPaymentWizard.tsx
src/lib/payment-activation.ts
src/lib/promptpay.ts

# Core
src/lib/ai-search.ts                    OpenAI + rule fallback (district/station)
src/lib/listings.ts
src/lib/quota.ts
```

---

## Test credentials

Admin: `admin@condominium.in.th` / `admin123456` (via `npm run db:seed` only)

---

## Related

- [`ROADMAP.md`](./ROADMAP.md) · [`CLAUDE.md`](./CLAUDE.md) · [`DEPLOYMENT.md`](./DEPLOYMENT.md)
