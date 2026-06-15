# Phase L3 — Growth Features Plan

**Updated:** 2026-06-14 (session 43)  
**Status:** **COMPLETE** — all core L3 features shipped (session 34)

Phase 7 (user listing i18n + URL routing) **complete** (session 36). Phase 8 (dashboard i18n + SEO fix) **complete** (session 42). **Next:** [`PHASE-9-PLAN.md`](./PHASE-9-PLAN.md) — editorial review blog + marketplace UX.

---

## Progress summary

| Feature | Status |
|---------|--------|
| Project pages | **Done** |
| Header / hero UX | **Done** |
| Turnstile CAPTCHA + GA4 | **Done** (session 33) |
| Price history | **Done** |
| Alert email digests | **Done** (code + cron in `vercel.json`; user sets Resend + single-line `CRON_SECRET`) |
| Agent reviews | **Done** |
| Social login | **Done** (Google + Facebook, env-gated) |
| NPA hub | **Done** (`/npa`) |
| User listing i18n (Phase 7) | **Done** (session 36) |
| Homepage 3 sections | **Done** (session 37) |
| Admin `/admin/sponsored` | **Done** (session 37) |
| Locale unprefixed = Thai | **Done** (session 38) |
| Dashboard i18n (Phase 8) | **Done** (session 42) |

---

## Superseded by Phase 9–10

The items below were deferred; see [`PHASE-9-PLAN.md`](./PHASE-9-PLAN.md) for current priorities:

- Editorial project reviews (Phase 9)
- Sort + rich listing cards (Phase 10)
- SEO filter landing URLs (Phase 10)
- Map/list toggle on buy/rent (Phase 10)

---

## What shipped (session 34)

### Price history
- `PriceHistory` model + migration `20260614300000_phase_l3_features`
- Log on create, owner edit, admin edit, CSV import
- `PriceHistoryPanel` on property detail + “ลดราคา” badge on cards (30-day decrease)

### Search alert digests
- `src/lib/search-alert-digest.ts`
- `GET /api/cron/search-alerts?frequency=daily|weekly`
- `vercel.json` cron schedules
- **Vercel env:** `CRON_SECRET` (single line), `RESEND_API_KEY`, `EMAIL_FROM`

### Agent reviews
- `AgentReview` model (pending → approved/rejected)
- `POST /api/agent-reviews`, `/admin/reviews` moderation
- Star ratings on `/agents`

### Social login
- Google: `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_CALLBACK_URL`
- Facebook: `FACEBOOK_APP_ID`, `FACEBOOK_APP_SECRET`, `FACEBOOK_CALLBACK_URL`
- Buttons on `/login` and `/register`

### NPA hub
- `/npa` — filters NPA property type (sale + rent)

---

## Post-L3 / post-Phase-7 (sessions 36–38)

| Item | Detail |
|------|--------|
| Phase 7 i18n | Per-locale owner listing fields + URL routing |
| Homepage | ประกาศแนะนำ / ประกาศล่าสุด / ยอดนิยม |
| Admin sponsored | `/admin/sponsored` — 7/30/custom expiry |
| Locale fix | Unprefixed = Thai; middleware header + cookie sync |
| Cron deploy | `cron-auth.ts`; crons restored after `CRON_SECRET` fix |

---

## Deferred / next

- `/market` area price trends
- Sitemap locale URL variants
- JA/ZH nav/market i18n key gaps
- Link `TeamAgent.userId` to platform agent accounts
- Virtual tours, in-app chat, mobile app

---

*Next priorities: see [`ROADMAP.md`](./ROADMAP.md) and [`PHASE-9-PLAN.md`](./PHASE-9-PLAN.md).*
