# Phase L3 — Growth Features Plan

**Updated:** 2026-06-14 (session 34)  
**Status:** **COMPLETE** — all core L3 features shipped

---

## Progress summary

| Feature | Status |
|---------|--------|
| Project pages | **Done** |
| Header / hero UX | **Done** |
| Turnstile CAPTCHA + GA4 | **Done** (session 33) |
| Price history | **Done** |
| Alert email digests | **Done** (code + cron; user sets Resend + CRON_SECRET) |
| Agent reviews | **Done** |
| Social login | **Done** (Google + Facebook, env-gated) |
| NPA hub | **Done** (`/npa`) |

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
- **Vercel env:** `CRON_SECRET`, `RESEND_API_KEY`, `EMAIL_FROM`

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

## Deferred to Phase 7+

- `/market` area price trends
- Link `TeamAgent.userId` to platform agent accounts
- Virtual tours, in-app chat, mobile app

---

*Next: **Phase 7** — user listing i18n. See `ROADMAP.md`.*
