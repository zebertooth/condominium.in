# Phase L3 — Growth Features Plan

**Updated:** 2026-06-14 (session 32)  
**Status:** In progress — project pages complete; price history next

---

## Overview

Phase L3 focuses on differentiation and growth features that position Condominium.in.th ahead of competitors like DDproperty and PropertyHub.

**Completed prerequisites:** Phase L1+L2 deployed; session 31 migrations live; header/hero UX (session 32).

---

## Progress summary

| Feature | Status | Notes |
|---------|--------|-------|
| Project pages | **Done** | Model, admin CRUD, `/projects`, `/projects/[slug]` |
| Header / hero UX | **Done** | Text nav, mobile row-2 strip, AI showcase, contact beside login |
| Price history | **Next** | Model + logging + property detail chart |
| Alert email digests | Planned | Requires Resend DNS + Vercel cron |
| Agent reviews | Planned | After price history |
| Social login | Planned | Google first, then Facebook |
| NPA hub | Optional | `/npa` when inventory exists |

---

## 1. Project/Development Pages — DONE

- [x] `Project` model + `UserProperty.projectId`
- [x] `/admin/projects` — CRUD
- [x] `/projects` listing + `/projects/[slug]` detail
- [ ] Project badge on `PropertyCard` when linked (polish)
- [ ] Project picker in owner post/edit form (if not wired)

---

## 2. Price History Logging — NEXT (High priority)

**Goal:** Track listing price changes for transparency and SEO trust signals.

**Database:**
- `PriceHistory` model: `propertyId`, `price`, `listingType`, `changeType`, `createdAt`
- Log on create + whenever admin/owner updates price

**Frontend:**
- Mini chart or timeline on `/property/[slug]`
- "Price reduced" badge when recent drop
- Optional later: `/market` area aggregates

**Est. effort:** 4–6 hours

---

## 3. Search Alert Email Digests — High priority

**Goal:** Make `/dashboard/alerts` useful — notify users of new matching listings.

**Implementation:**
1. User configures Resend DNS + `RESEND_API_KEY` / `EMAIL_FROM` on Vercel
2. Vercel cron (daily + weekly) → query active `SearchAlert` rows
3. Run filter logic against new listings since `lastSentAt`
4. Send digest via `sendEmail()` from `src/lib/notifications.ts`
5. Update `lastSentAt`

**Est. effort:** 3–4 hours (code) + user DNS setup

---

## 4. Agent Reviews / Ratings — Medium priority

**Goal:** Buyer ratings after closed leads; display on agent profiles.

**Database:** `AgentReview` — agentId, userId, rating 1–5, comment, status  
**Frontend:** Review prompt when lead → closed; stars on `/agents` profiles  
**Admin:** Moderation queue

**Dependency:** Link `TeamAgent` to real `User` accounts (Phase 3 carryover)

**Est. effort:** 6–8 hours

---

## 5. Social Login — Medium priority

**Goal:** Lower registration friction for expat buyers.

- Google OAuth (custom or NextAuth)
- Facebook OAuth
- Keep LINE Login primary for Thai users
- Merge accounts by email when possible

**Est. effort:** 6–8 hours

---

## 6. Optional polish

| Item | Effort | When |
|------|--------|------|
| `/npa` hub page | 2h | When NPA inventory ≥5 listings |
| Virtual tour / video URL on listings | 2h | Low priority |
| In-app messaging | Large | Phase 8+ |

---

## Recommended build order (session 32+)

```
Week 1 — Trust & retention
├── PriceHistory model + migration
├── Log price on create/update (user + admin edit APIs)
├── Price history UI on property detail
└── "Price reduced" badge

Week 2 — Alerts & engagement
├── Resend DNS verification (user)
├── /api/cron/search-alerts (Vercel cron)
├── Digest email template (TH/EN)
└── Smoke test alert flow

Week 3 — Social proof
├── AgentReview model + admin moderation
├── Review form after lead closed
└── Star rating on agent profiles

Week 4 — Acquisition
├── Google OAuth
├── Facebook OAuth
└── Account linking by email
```

---

## Success metrics

- Projects: ≥10 active projects with ≥3 listings each
- Price history: 50% of user listings have ≥1 price event
- Alerts: ≥20 active alerts; ≥50% open rate on digests
- Reviews: ≥20 approved agent reviews
- Social login: 30% of new registrations via Google/Facebook

---

## Dependencies

| Dependency | Blocks | Owner |
|------------|--------|-------|
| Resend DNS verified | Alert digests, reliable OTP | User |
| Real listing inventory | Meaningful price trends | User/agents |
| Closed leads | Agent reviews | Ops |
| Google/Facebook app credentials | Social login | User |

---

*Phase 7 (user listing i18n) follows L3. See `ROADMAP.md` for full timeline.*
