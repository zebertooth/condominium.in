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

> ## 🤝 HANDOFF (session 53 — **Phase 12 ops polish**)
>
> **Production:** https://www.condominium.in.th — deploy session 53 pending (local)
>
> **Session 53:**
> - `/admin/ops` — inventory goal (≥20 published), AdSense 9/9 slots, quick links
> - Owner viewing emails on `owner_direct` leads with date/time
>
> **Next:** Run `npm run db:import-inventory` on prod; paste AdSense slots; editorial cadence

---

## Project at a glance

| Item | Value |
|------|-------|
| Production | **https://www.condominium.in.th** |
| GitHub | https://github.com/zebertooth/condominium.in |
| Phase | **Phase 14 done (local)** — viewing emails + blog area CTAs; user ops next |
| Monetization | **Sponsor boost only** — 1d ฿29 · 3d ฿79 · 7d ฿159 (PromptPay + SlipOK) |
| Listings | Unlimited after verify (Thai users); agents admin-capped |
| Admin sponsored | `/admin/sponsored` — 1/3/7 days + custom date |
| Compare | `/compare` — max 4; remove syncs localStorage |
| Locale | Unprefixed = Thai; `/en/*` … `/ar/*` prefixed |
| Paid | Auto-ON when `PROMPTPAY_ID` on Vercel |
| Ads | AdSense in `<head>`; units after cookie accept + slot IDs in `/admin/seo` |
| Security | Cloudflare Turnstile on login, register, contact |
| Crons | Mon 02:00 UTC alerts · daily 03:00 UTC sponsor reminders + expiry |

**Launch policy:** Thai = LINE + Email to post (**unlimited**). Non-Thai blocked from posting. Owner listings → direct contact.

---

## Key paths

```
# Phase 13A — monetization
src/components/dashboard/SponsorPaymentWizard.tsx   4-step sponsor checkout modal
src/components/dashboard/DashboardClientArea.tsx    Wizard + MyProperties wiring
src/lib/payment-activation.ts                       Shared confirm + sponsor activate
src/lib/payment-notifications.ts                    Payment confirm + expiry emails
src/lib/sponsor-subscription.ts                     Tier packageId parsing
src/lib/promptpay.ts                                QR + SlipOK verify
src/app/dashboard/import/                           User CSV bulk import
src/app/api/user/import/                            User import API

# Phase 11–12
src/components/property/CompareProvider.tsx         Compare shortlist (max 4)
src/components/property/ComparePageClient.tsx       Compare table + remove fix
src/app/admin/ops/page.tsx                          Ops checklist
src/lib/search-alert-digest.ts                      Hybrid search alerts
src/components/property/PropertyListingsMapLazy.tsx Leaflet code-split

# Core
src/lib/quota.ts                                    Unlimited listings logic
src/lib/packages.ts                                 SPONSOR_PACKAGES + PAID_FEATURES_ENABLED
src/lib/site-settings.ts                            SEO + AdSense slots
```

---

## Test credentials

Admin: `admin@condominium.in.th` / `admin123456` (via `npm run db:seed` only)

---

## Related

- [`ROADMAP.md`](./ROADMAP.md) · [`CLAUDE.md`](./CLAUDE.md) · [`DEPLOYMENT.md`](./DEPLOYMENT.md)
