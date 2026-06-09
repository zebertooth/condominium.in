# AGENTS.md — Condominium.in.th

Instructions for AI coding agents (Cursor, Claude, Copilot, etc.) working in this repository.

---

## Start here (every new session)

1. **Read** [`CLAUDE.md`](./CLAUDE.md) — architecture, business rules, API map, conventions
2. **Read** [`ROADMAP.md`](./ROADMAP.md) — what's done, current phase, what to build next
3. **Verify** the project runs:
   ```bash
   npm install
   npx prisma generate
   npm run db:deploy
   npm run build
   npm run lint
   npm run dev
   ```
4. **Check** ROADMAP "In progress" — don't duplicate work already started
5. **Update** `ROADMAP.md` when you finish a feature (checkbox + date)

> ## 🤝 HANDOFF (session 17 — **Phase 2 in progress**)
>
> **Deployed:** Vercel production live (`condominium.in.th` DNS done). Neon Postgres migrated through `20260609180000_analytics_matching`.
>
> **Done this session:**
> - **i18n expansion:** 35+ new translation keys added; hero, homepage, `/buy`, `/rent` pages fully bilingual (TH+EN). Areas name shows EN when locale=en.
> - **Owner inquiry notification:** When an owner-direct inquiry is submitted, the owner gets an email (via Resend when configured, console fallback in dev).
> - **Browse filter analytics:** `/api/analytics/search-filter` endpoint + `PropertySearch` logs filter events to `SearchEvent` table. Admin analytics now includes browse searches.
>
> **NOT done (next priorities):**
> 1. Set Production keys on Vercel: `LINE_LOGIN_*`, `CLOUDINARY_*`, `RESEND_*`, `THAIBULKSMS_*`
> 2. Flip `PAID_FEATURES_ENABLED` to true when `PROMPTPAY_ID` is set
> 3. EN translations for: blog pages, areas pages, admin UI
> 4. Agent CRM: viewing scheduler, agent dashboard
> 5. **Sponsored posts layout** — planned, do NOT implement until user asks

---

## Project at a glance

| Item | Value |
|------|-------|
| Name | Condominium.in.th |
| Type | Bangkok condo/house marketplace (buy + rent) |
| Production | Vercel — `https://next-js-two-beta.vercel.app` |
| Phase | **Post-launch features** — i18n, analytics, owner contact done; sponsored posts planned |
| Language | Thai-first + EN switcher (partial coverage) |
| Workspace | `C:\Users\NATTASIT\Projects\condominium` |

> **Launch policy:** Paid OFF. Thai = LINE+Email to post. Non-Thai blocked. SMS additive. Agent listings → platform lead flow; owner listings → direct contact.

---

## Documentation map

| File | Purpose |
|------|---------|
| **AGENTS.md** (this file) | Agent workflow & handoff |
| **CLAUDE.md** | Deep technical context |
| **ROADMAP.md** | Timeline & state tracker |
| **DEPLOYMENT.md** | Production runbook |
| **README.md** | Human quick start |

---

## Agent workflow

### Before making changes
1. Understand request against ROADMAP phase
2. Search codebase — prefer extending `src/lib/`
3. Small, focused diffs

### After making changes
```bash
npm run build
npm run lint
npm run db:deploy   # if schema changed
```
Update `ROADMAP.md` checkboxes + decision log.

### Do NOT (unless user asks)
- Create git commits / deploy
- Implement **sponsored posts UI** (future roadmap only)
- Revert to SQLite
- Commit `.env` or secrets

---

## Priority queue

When user says "continue" without specifics:

1. Custom domain + prod env vars on Vercel
2. Complete EN translations across all pages
3. Owner listing stats in dashboard
4. Flip paid features when `PROMPTPAY_ID` ready
5. **Sponsored posts** — design only until explicitly requested
6. Agent CRM: viewing scheduler, agent dashboard
7. Phase 4: ZH/JA/AR i18n (currently disabled in UI)

---

## Key paths (new in session 15)

```
src/lib/locale.ts              Cookie-based locale (th/en)
src/lib/i18n.ts                TH + EN translations
src/lib/analytics.ts           Search/view aggregation + CSV helper
src/lib/matching.ts            Owner contact event logging
src/components/layout/LanguageSwitcher.tsx
src/components/property/OwnerContactCard.tsx
src/components/property/PropertyContactSection.tsx
src/app/admin/analytics/       Analytics dashboard
src/app/api/analytics/         property-view, matching
src/app/api/admin/analytics/export/  CSV download
```

---

## Test credentials

| Role | Login | Password |
|------|-------|----------|
| Admin | `admin@condominium.in.th` | `admin123456` |

**Owner-direct contact test:** Register as Thai user → post listing → admin approve → open `/property/[slug]` → see owner contact card (if poster `role !== agent`).

---

## Related

- Architecture → [`CLAUDE.md`](./CLAUDE.md)
- Phase status → [`ROADMAP.md`](./ROADMAP.md)
