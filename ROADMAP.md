# ROADMAP.md — Timeline & State Tracker

**Project:** Condominium.in.th  
**Last updated:** 2026-06-10 (session 19 — Vercel build fix)  
**Current phase:** **Agent & Operations** — CRM pipeline active, viewing scheduler online, payments turned on  

> ## Build status
> **Production:** https://next-js-two-beta.vercel.app (Vercel project `next-js-oouu`).  
> **DB:** Neon PostgreSQL — migrations through `20260609180000_analytics_matching`.  
> `npm run db:deploy` after pull if schema changed. `npm run build` must pass.

> **LAUNCH POLICY (current):** Paid features OFF (`PAID_FEATURES_ENABLED=false`). ID verification removed. Thai users verify **LINE + Email** to post (2 free listings). Non-Thai users verify email only and **cannot post** yet. Phone/SMS verification is wired (ThaiBulkSMS) but **additive** (not a posting gate yet).

> Update this file when completing features, changing priorities, or deploying.  
> Mark items: `[x]` done · `[~]` in progress · `[ ]` planned · `[-]` cancelled

---

## Model transfer snapshot (session 15)

| Area | State |
|------|--------|
| **Production** | Vercel live. Custom domain `condominium.in.th` not pointed yet. |
| **Database** | Neon + migrations: `init_postgres`, `analytics_matching`. |
| **i18n** | TH + EN switcher (cookie). ZH/JA/AR disabled in UI. Many pages still Thai-only. |
| **Lead routing** | `role=agent` → agent team form. `role=user` owner → direct contact + `MatchingEvent` log. |
| **Analytics** | `/admin/analytics` + CSV export. AI searches + property views tracked in DB. |
| **Sponsored posts** | **Do not implement** — future monetization layout (see below). |
| **Paid** | ON (`PAID_FEATURES_ENABLED=true`). PromptPay ID configured. |

**Startup order:** `AGENTS.md` → this file → `CLAUDE.md` → `DEPLOYMENT.md`

**First commands (if app 500s on DB):**
```powershell
powershell -ExecutionPolicy Bypass -File scripts\setup-neon.ps1
npm run dev
```

---

## Vision

Bangkok condo/house marketplace with:
- SEO-driven organic traffic
- AI property matching (BTS, budget, bedrooms)
- Verified owner self-listing (quota + paid upgrades)
- Human agent layer for viewings and closings

**Competitors referenced:** ddproperty.com, propertyhub.in.th, baania.com

---

## Phase overview

| Phase | Focus | Status | Target |
|-------|--------|--------|--------|
| **1** | Website, SEO, MVP listings, auth, admin | **Done** | 2026 Q2 |
| **Launch** | LINE+Email verify, paid OFF, Neon DB | **Done** | 2026 Q2 |
| **Deploy** | Vercel + DNS + prod env vars | **Done** (live, DNS done) | 2026 Q2 |
| **Post-launch** | Logout, i18n TH/EN, owner contact, analytics | **Done** | 2026 Q2 |
| **2** | Real provider keys, flip paid, SEO scale, sponsored UI | **In Progress** | 2026 Q3 |
| **3** | Agent CRM, owner portal, scheduling | Started | 2026 Q4 |
| **4** | Multilingual (ZH, JA, AR) | Planned | 2027 Q1 |

---

## Launch prep — Go-live without paid (DONE)

**Goal:** Ship the site to the public now; gather listings/leads without payments.

### Verification rework
- [x] Remove ID verification from the posting gate (`verify-id` route kept, unused in flow)
- [x] Add `User.isThai`, `User.lineVerified`, `User.lineUserId` to schema
- [x] LINE Login OAuth helper `src/lib/line.ts` + `/api/auth/line/start|callback`
- [x] Dev-only manual LINE verify `/api/auth/line/dev-verify` (when no channel keys)
- [x] Quota gate: Thai = LINE + Email to post; non-Thai = `postingBlocked`
- [x] Registration nationality selector (คนไทย / ชาวต่างชาติ); email required
- [x] Verify page/form rebuilt: LINE + Email; non-Thai notice; ID/phone removed
- [ ] Configure real LINE Login channel keys for production

### Paid features OFF for launch
- [x] `PAID_FEATURES_ENABLED = false` master flag in `src/lib/packages.ts`
- [x] `purchase` / `sponsor` APIs return 403 when disabled
- [x] PackageShop + sponsor button hidden in dashboard
- [x] Quota ignores package slots while disabled

### SMS (additive — done)
- [x] ThaiBulkSMS provider in `src/lib/notifications.ts` (preferred for TH, Twilio fallback, console dev)
- [x] Phone (SMS) OTP step re-added to verify flow for Thai users (additive)
- [x] `THAIBULKSMS_*` env placeholders
- [x] Phone verify stays additive (not a posting gate) — policy decided
- [ ] Add real ThaiBulkSMS keys + approved sender in prod (post-deploy)

---

## Deploy phase (ALMOST DONE)

- [x] Vercel production deploy (`vercel --prod`, Node 24)
- [x] `vercel-build` runs migrate deploy on build
- [x] Health check `/api/health`
- [~] Production env vars on Vercel (partial — verify `AUTH_SECRET`, `DATABASE_URL`)
- [ ] Point DNS `condominium.in.th` to Vercel
- [ ] LINE / Cloudinary / Resend / ThaiBulkSMS prod keys

---

## Post-launch features (DONE — session 15)

### Admin UX
- [x] Logout button in admin header (`LogoutButton` in `admin/layout.tsx`)

### Localization (TH + EN only)
- [x] Language switcher in public header (`LanguageSwitcher`, cookie `condo_locale`)
- [x] `src/lib/i18n.ts` — Thai + English translation tables
- [x] ZH / JA / AR hidden (deferred to Phase 4)
- [x] Full EN coverage on all pages (hero, homepage, buy, rent, blog, areas, admin pages done)

### Lead matching — owner vs agent
- [x] Non-agent listings (`role !== agent`) → owner direct contact on property page
- [x] `OwnerContactCard` — phone/email with click tracking
- [x] `Lead.contactMode` — `owner_direct` | `agent_team`
- [x] `MatchingEvent` model — logs views, clicks, inquiries
- [x] Notify owner on inquiry via email (via `sendEmail` in `/api/leads`) — session 17
- [x] Owner dashboard: inquiries + views per listing — session 16

### Analytics & admin dashboard
- [x] `SearchEvent` — AI search queries logged
- [x] `PropertyViewEvent` — page views logged
- [x] `/admin/analytics` — visual dashboard (bar charts)
- [x] CSV export — searches, views, matching, leads (`/api/admin/analytics/export`)
- [x] Browse/filter search logging — `/api/analytics/search-filter` + `PropertySearch` — session 17
- [ ] Charts over custom date ranges

---

## Future: Sponsored posts & monetization (DO NOT IMPLEMENT YET)

**User requirement:** When owners post, offer platform-managed premium packages and dedicated **Sponsored Posts** placement on homepage/search results.

**Design notes for future agent:**
- Reuse `UserProperty.isSponsored` + `sponsoredUntil` (already in schema)
- Dedicated homepage carousel / sidebar slot above organic listings
- Post-submit upsell flow in `/dashboard/post` after listing created
- Flip `PAID_FEATURES_ENABLED` + `PROMPTPAY_ID` before enabling purchase UI
- Analytics: track sponsored impression/click rates in `PropertyViewEvent.source`

**Status:** Documented only. No UI/layout work until user explicitly requests.

---

## Phase 1 — Foundation (DONE)

### Public website & SEO
- [x] Homepage with hero search
- [x] Buy (`/buy`) and rent (`/rent`) listing pages
- [x] Property detail (`/property/[slug]`)
- [x] BTS area guides — 5 stations (`/areas`, `/areas/[slug]`)
- [x] Blog — 3 SEO articles (`/blog`)
- [x] Agents page (`/agents`)
- [x] Contact page (`/contact`)
- [x] `sitemap.xml`, `robots.txt`, JSON-LD metadata
- [x] 6 static demo listings in `src/lib/properties.ts`
- [x] Thai typography (Noto Sans Thai)

### AI search (MVP)
- [x] Natural language search UI (`/ai-search`)
- [x] Rule-based matcher (`src/lib/ai-search.ts`) — BTS, price, bedrooms
- [x] API route `POST /api/ai-search`
- [ ] OpenAI / LLM integration → **moved to Phase 2**

### User accounts & verification
- [x] Register with phone and/or email
- [x] Login with phone or email
- [x] Phone OTP (dev mode shows code on screen)
- [x] Email OTP (dev mode shows code on screen)
- [x] Thai ID card validation (checksum)
- [x] JWT session cookie auth
- [x] User dashboard (`/dashboard`)
- [x] Verification flow (`/dashboard/verify`)

### Owner listing system
- [x] Post property form (`/dashboard/post`)
- [x] Free quota: 2 listings per verified user
- [x] Paid packages: ฿100/+4 slots, ฿220/+10 slots (mock payment)
- [x] Sponsor boost: ฿50/7 days (mock payment)
- [x] Image gallery input — up to 10 URL previews
- [x] Map location — lat/lng + BTS presets + OSM preview
- [x] Property detail gallery + embedded map
- [x] Listings status workflow: `pending` → admin → `published`

### Admin panel
- [x] Admin dashboard (`/admin`) — stats overview
- [x] Manage users (`/admin/users`) — verify ID, promote admin
- [x] Manage properties (`/admin/properties`) — approve/reject/unpublish
- [x] Admin seed script (`npm run db:seed`)
- [x] Role-based access (`role: admin`)

### Database
- [x] Prisma 7 + PostgreSQL (Neon) — migrated from SQLite in session 11–12
- [x] Models: User, UserProperty, UserSubscription, PhoneOtp, EmailOtp, Lead
- [x] Migrations in `prisma/migrations/` (Postgres: `20260609150000_init_postgres`)

### Not in Phase 1 (intentionally deferred)
- [-] Production deployment
- [-] Real SMS / email
- [-] Real payments
- [-] Image file upload
- [-] PostgreSQL

---

## Phase 2 — Production & Intelligence (AFTER DEPLOY)

**Goal:** Real provider keys in production, flip paid features, scale SEO & AI.

### Infrastructure (deploy items → see Deploy phase above)
- [x] Migrate SQLite → PostgreSQL (Neon) — schema + adapter + seed (sessions 9, 11–12)
- [x] Update `src/lib/db.ts` for `@prisma/adapter-pg`
- [x] Neon project provisioned (Singapore); `DATABASE_URL` in `.env`
- [x] Fresh Postgres migration `20260609150000_init_postgres` + `scripts/setup-neon.ps1`
- [~] Apply migrations to Neon (`prisma migrate deploy` + `db:seed`) — user may still need to run
- [ ] Deploy to Vercel → **moved to Deploy phase**
- [ ] Point DNS `condominium.in.th` → **moved to Deploy phase**
- [ ] Production env vars on Vercel → **moved to Deploy phase**
- [x] File storage for images — `src/lib/storage.ts` (Cloudinary signed upload + local-disk dev fallback), `POST /api/upload`, drag-to-upload UI in `ImageGalleryInput`

### Real verification
- [x] SMS OTP — ThaiBulkSMS (preferred) + Twilio fallback (`src/lib/notifications.ts`)
- [x] Email OTP — Resend (console fallback in dev)
- [x] Remove `devCode` from API responses in production (gated by NODE_ENV !== "development")
- [ ] Optional: ID card photo upload + admin manual review

### Real payments
- [x] PromptPay QR code generation (`src/lib/promptpay.ts` — `promptpay-qr` + `qrcode`)
- [x] Slip verification via SlipOK API + admin manual fallback
- [x] Payment confirmation endpoint (`/api/packages/confirm`)
- [x] Payment status check endpoint (`/api/packages/status`)
- [x] Admin payment management (`/admin/payments` + `/api/admin/payments`)
- [x] PackageShop UI rewrite with QR display + slip upload
- [x] Schema: paymentStatus, paymentMethod, transactionRef, slipUrl on UserSubscription
- [x] Quota system updated to only count confirmed payments
- [x] Flip `PAID_FEATURES_ENABLED = true` (when ready for real payments)
- [~] Set PROMPTPAY_ID + SLIPOK keys in production env (PromptPay ID set to 0863048177)

### AI upgrade
- [x] OpenAI API integration for `/api/ai-search` (env-gated, falls back to rule-based) — `src/lib/openai.ts`, `src/lib/ai-search.ts`
- [ ] Embed property descriptions for semantic search (optional: pgvector)
- [ ] AI-generated listing summaries for owners
- [x] Rate limiting on AI endpoints — `src/lib/rate-limit.ts` (also on /api/leads + OTP senders)

### Real verification (provider layer)
- [x] Provider abstraction `src/lib/notifications.ts` — `sendSms` (Twilio) + `sendEmail` (Resend), console fallback
- [x] OTP modules wired to providers; `devCode` only returned in development
- [ ] Add/confirm real provider keys in production env
- [ ] Optional: ID card photo upload + admin manual review

### SEO & content scale
- [x] More BTS area pages — added พร้อมพงษ์, ชิดลม, อารีย์, สยาม (now 9 areas) + coords/aliases
- [x] More blog articles — added investment guide + rental documents (now 5 posts)
- [x] Dynamic OG image — `src/app/api/og/route.tsx` (replaces missing static `og-image.jpg`)
- [x] Analytics (GA4) scaffold — `src/components/analytics/Analytics.tsx` (env-gated `NEXT_PUBLIC_GA_ID`)
- [ ] CMS or MDX blog pipeline (weekly articles)
- [ ] Google Search Console setup

### Admin enhancements
- [ ] Admin login separate from public (optional)
- [x] Bulk approve/reject — `POST /api/admin/properties/bulk`, checkboxes + bulk bar in `AdminPropertyTable`
- [x] Listing edit by admin — `PUT /api/admin/properties/[id]`, `/admin/properties/[id]/edit`, reuses `PostPropertyForm` (keeps status)
- [ ] Audit log for admin actions
- [ ] Dashboard charts (listings over time)

---

## Phase 3 — Agent & Operations

**Goal:** Human team can manage leads, viewings, and owner relationships.

### Agent CRM
- [x] Lead capture from contact form / property inquiry — `Lead` model, `POST /api/leads`, `src/components/lead/LeadForm.tsx`
- [x] Lead status pipeline: new → contacted → viewing → closed (+ lost) — admin `/admin/leads`
- [x] Assign lead to an agent (admin user) + agent note — `PATCH /api/admin/leads/[id]`
- [ ] Assign lead to agent automatically by BTS area
- [x] Agent dashboard (separate from owner/admin dashboard)

### Viewing scheduler
- [x] Book viewing slot on property page
- [~] Line / WhatsApp notification to agent (simulated in console)
- [~] Calendar integration (Google Calendar) (simulated in console)

### Owner portal
- [x] Edit own listings — `PUT /api/user/properties/[id]`, `/dashboard/edit/[id]`, reusable `PostPropertyForm`, edit goes back to `pending`
- [ ] View stats (views, inquiries) per listing
- [ ] Renewal reminders for sponsored posts
- [ ] Package expiry notifications

### Roles & quota (DONE)
- [x] Three roles: `user`, `agent`, `admin` — `User.role` + admin role selector
- [x] Admin = unlimited listings, no verification gate, can edit/check any user
- [x] Admin-settable per-account listing limit (`User.listingLimitOverride`)
- [x] Agent = admin-controlled limit (default 5), **cannot buy packages**, no verify gate
- [x] User (Thai) = 2 free after **LINE + Email** verify (ID no longer required)
- [x] User (non-Thai) = email verify only, **cannot post** (launch policy)

### Team structure
- [ ] Agent profiles linked to real accounts (not static mock on `/agents`)
- [ ] Agent performance metrics
- [ ] Multi-property viewing tour planner

---

## Phase 4 — Internationalization

**Goal:** Serve expat buyers/renters in Chinese, Japanese, Arabic.

- [ ] i18n routing (`/th`, `/en`, `/zh`, `/ja`, `/ar`) or next-intl
- [ ] Translate UI strings (scaffold in `src/lib/i18n.ts`)
- [ ] Translated property fields (title, description)
- [ ] hreflang tags for SEO
- [ ] RTL layout for Arabic

---

## State tracker (living checklist)

Use this section for week-to-week progress. Move items between columns.

### Done (2026-06-09)
```
Website scaffold, SEO pages, static listings
User auth (phone/email OTP, ID verify)
Owner posting with quota + packages
Admin panel (users, property approval)
Image gallery + map on listings
SQLite + Prisma 7 working locally
```

### Done (2026-06-09, session 9 — Postgres migration + PromptPay)
```
Switched schema.prisma provider sqlite → postgresql
Swapped db.ts adapter: @prisma/adapter-better-sqlite3 → @prisma/adapter-pg + pg Pool
Updated prisma/seed.ts to use PrismaPg adapter
Installed @prisma/adapter-pg + pg dependencies
User chose Neon as the production PostgreSQL provider

PromptPay payment integration:
- src/lib/promptpay.ts (QR gen + SlipOK verification)
- /api/packages/purchase → creates pending order + QR
- /api/packages/sponsor → creates pending order + QR
- /api/packages/confirm → slip upload + auto/manual verify
- /api/packages/status → payment status check
- /api/admin/payments → admin approve/reject pending payments
- /admin/payments page + AdminPaymentTable component
- UserSubscription schema: +paymentStatus, paymentMethod, transactionRef, slipUrl
- Quota now filters by paymentStatus='confirmed'
- Admin dashboard shows pending payment count
- PackageShop.tsx rewritten with QR display + slip upload UX
prisma generate + next build + lint all green
```

### Done (2026-06-10, session 18 — Paid Features + Agent CRM)
```
Enabled paid features (PAID_FEATURES_ENABLED=true) with PromptPay ID 0863048177
Added viewingDate and viewingTime optional fields to Lead model in Postgres
Developed property page viewing scheduler widget inside LeadForm component
Built dedicated Agent CRM Dashboard (/dashboard/agent) with stats cards, AgentLeadTable, and viewing agenda list
Configured agent-based lead updating API permissions
```

### In progress
```
1. Prod integration keys (LINE, Cloudinary, Resend, ThaiBulkSMS)
```

### Done (2026-06-10, session 17 — Phase 2 i18n + notifications + analytics)
```
EN translations expanded: hero, homepage, buy, rent pages, areas section, CTA buttons
i18n keys added for buy/rent/hero/homepage/blog/areas/search-filters (35+ new keys)
Owner inquiry email notification (sendEmail fires on owner_direct lead — /api/leads)
Browse filter search event logging (/api/analytics/search-filter + PropertySearch)
```

### Done (2026-06-09, session 16 — dashboard stats & partial i18n)
```
DNS condominium.in.th pointed to Vercel
Owner listing stats in dashboard (views & inquiries count in MyProperties)
Added EN translation keys (dashboard, login, property card types)
```

### Done (2026-06-09, session 15 — post-launch features)
```
Admin logout button
TH/EN language switcher (zh/ja/ar hidden)
Owner direct contact for non-agent listings + MatchingEvent logging
SearchEvent + PropertyViewEvent analytics models
/admin/analytics dashboard + CSV export
Migration 20260609180000_analytics_matching
```

### Done (2026-06-09, session 3 — launch prep)
```
Removed ID verification from posting gate
LINE Login OAuth (start/callback) + dev-only manual verify fallback
User.isThai / lineVerified / lineUserId schema fields
Role/nationality-aware quota: Thai=LINE+Email, non-Thai blocked
Registration nationality selector + email required
Verify page/form rebuilt (LINE + Email, ID/phone removed)
Paid features master-disabled (PAID_FEATURES_ENABLED) across APIs + UI
Docs updated: CLAUDE.md, AGENTS.md, ROADMAP.md, .env (LINE keys)
```

### Done (2026-06-09, session 2)
```
OpenAI AI search w/ graceful fallback (env-gated)
Notification provider abstraction (Twilio SMS + Resend email), console fallback
4 new BTS area pages (พร้อมพงษ์, ชิดลม, อารีย์, สยาม) + coords/aliases
3 new demo listings for new areas
2 new SEO blog articles
Dynamic OG image route + GA4 analytics scaffold
```

### Done (2026-06-09, session 4 — SMS phase)
```
ThaiBulkSMS SMS provider (preferred for TH) + Twilio fallback in notifications.ts
Phone (SMS) OTP step re-added to verify flow for Thai users (additive)
THAIBULKSMS_* env placeholders + docs updated
Lint fixes: AISearchClient setState-in-effect, verify-phone unused import
```

### Done (2026-06-09, session 5 — owner edit)
```
Owner can edit own listings (PUT /api/user/properties/[id])
Reusable PostPropertyForm (create + edit), /dashboard/edit/[id] page
"แก้ไข" button in MyProperties; edited listing returns to pending for re-approval
```

### Done (2026-06-09, session 6 — admin bulk)
```
Bulk approve/reject for admin (POST /api/admin/properties/bulk)
Checkboxes + select-all + bulk action bar in AdminPropertyTable
```

### Done (2026-06-09, session 7 — admin edit)
```
Admin listing edit (PUT /api/admin/properties/[id], keeps current status)
/admin/properties/[id]/edit page; PostPropertyForm now endpoint-configurable
"แก้ไข" link in AdminPropertyTable
```

### Done (2026-06-09, session 8 — hardening + deploy doc)
```
In-memory rate limiter (src/lib/rate-limit.ts)
Applied to /api/ai-search (20/min/IP), /api/leads (5/min/IP), OTP senders (3/5min/user)
DEPLOYMENT.md runbook (Postgres migration + Vercel checklist)
```

### Done (2026-06-09, session 11–12 — Neon live)
```
Neon PostgreSQL provisioned (ap-southeast-1, user connection string in .env)
schema.prisma → postgresql (Prisma 7: url only in prisma.config.ts)
db.ts + seed.ts → @prisma/adapter-pg + pg.Pool
Removed old SQLite migration SQL; added 20260609150000_init_postgres
scripts/setup-neon.ps1 + npm run db:deploy
Fixed PrismaBetterSqlite3 → PrismaBetterSqlite3 naming during SQLite hotfix (reverted to pg)
```

### Done (2026-06-09, session 13 — docs handoff)
```
All markdown docs updated for Deploy phase:
- Launch prep marked DONE; new Deploy phase section in ROADMAP
- DEPLOYMENT.md runbook (Neon setup, Vercel, DNS, smoke test)
- README.md refreshed (Neon, LINE+Email verify, doc links)
- CLAUDE.md: removed stale SQLite refs; deploy as current task
- AGENTS.md handoff → session 13 Deploy phase
```

### Up next (recommended order — DEPLOY PHASE)
```
1. LOCAL NEON SETUP (if not done):
   powershell -ExecutionPolicy Bypass -File scripts\setup-neon.ps1
   npm run dev  → confirm homepage loads, admin login works

2. VERCEL DEPLOY (see DEPLOYMENT.md):
   - Push repo to GitHub (git init + remote if needed)
   - vercel link + vercel --prod
   - Set env: DATABASE_URL, AUTH_SECRET, ADMIN_EMAIL, ADMIN_PASSWORD
   - Run prisma migrate deploy against prod Neon (or same DB)
   - npm run db:seed on production Neon

3. DNS: point condominium.in.th to Vercel

4. POST-DEPLOY INTEGRATIONS:
   - LINE_LOGIN_* (prod callback URL)
   - CLOUDINARY_* (image uploads on Vercel)
   - RESEND / THAIBULKSMS for real OTP
   - PROMPTPAY_ID + SLIPOK → flip PAID_FEATURES_ENABLED

5. PHASE 3: agent dashboard, viewing scheduler, listing view-stats
```

### Blocked / needs decision
```
- Neon tables applied? User must run setup-neon.ps1 if 500 / User table missing
- GitHub repo + Vercel project not created yet (user had no git installed earlier)
- PROMPTPAY_ID not set → paid features stay OFF
- LINE_LOGIN prod channel not configured
- Phone verify: stay additive (user chose) vs required later
- Non-Thai listing: still blocked by policy
```

---

## Decision log

| Date | Decision | Rationale |
|------|----------|-----------|
| 2026-06-10 | Conditional Vercel DB migrations | Run prisma migrate deploy during build only if DATABASE_URL is set; prevents build failure in Preview environments without DB access |
| 2026-06-09 | Next.js 16 + App Router | SEO, full-stack in one repo |
| 2026-06-09 | SQLite for local dev | Fast MVP; must migrate for prod |
| 2026-06-09 | Prisma 7 with better-sqlite3 adapter | Required by Prisma 7 |
| 2026-06-09 | JWT cookie sessions (not NextAuth) | Simple, sufficient for MVP |
| 2026-06-09 | Phone OR email verification | User flexibility |
| 2026-06-09 | 2 free listings + paid packages | Monetization + spam control |
| 2026-06-09 | Admin approval before publish | Quality control for UGC |
| 2026-06-09 | Rule-based AI first | No API cost during MVP |
| 2026-06-09 | Image URLs only (no upload) | Faster MVP; upload in Phase 2 |
| 2026-06-09 | Image upload: Cloudinary (signed) + local-disk fallback | Works in dev w/o keys; cloud-ready for prod via env |
| 2026-06-09 | Relaxed `propertySchema.images` to allow `/uploads/*` paths | Support locally-uploaded files alongside external URLs |
| 2026-06-09 | Phase 3 lead CRM uses single `Lead` model + admin pipeline | Capture inquiries early; agent dashboard/auto-assign later |
| 2026-06-09 | Agents = users with `role: admin` for now | Reuse existing roles; dedicated agent role can come in Phase 3 |
| 2026-06-09 | Dedicated `agent` role + `listingLimitOverride` | Admin assigns per-agent listing caps; agents can't self-buy |
| 2026-06-09 | Admin = unlimited listings, exempt from verify/quota | Internal staff; quota is for public users/agents |
| 2026-06-09 | Agent default listing limit = 5 (admin-overridable) | Sensible baseline above free users; admin tunes per agent |
| 2026-06-09 | OpenStreetMap embed for maps | No Google Maps API key needed |
| 2026-06-09 | OpenAI via REST fetch (no SDK) in `src/lib/openai.ts` | Avoid extra dep; easy graceful fallback |
| 2026-06-09 | AI search: LLM extracts filters, rule-based always fallback | Works with or without `OPENAI_API_KEY`; zero-cost default |
| 2026-06-09 | Notifications abstraction (Twilio/Resend) with console fallback | Swap real providers via env only; dev keeps `devCode` |
| 2026-06-09 | Dynamic OG image via `next/og` route (Latin text) | No static asset; avoids Thai-font embedding in ImageResponse |
| 2026-06-09 | Launch without paid features (`PAID_FEATURES_ENABLED=false`) | Go live fast; collect listings/leads before payment gateway |
| 2026-06-09 | Drop ID verification from posting gate | Lower friction; LINE+Email enough for launch trust |
| 2026-06-09 | Thai users verify LINE + Email to post | LINE is ubiquitous in TH; pairs with email for identity |
| 2026-06-09 | Non-Thai users: email verify only, cannot post | Focus listings on local owners until SMS/KYC for foreigners |
| 2026-06-09 | LINE Login OAuth env-gated + dev manual fallback | Testable now; just add channel keys for prod |
| 2026-06-09 | Phone/SMS verification deferred to next phase | ThaiBulkSMS not wired; email+LINE covers launch |
| 2026-06-09 | ThaiBulkSMS preferred SMS provider (Twilio fallback) | TH-local sender/pricing; Twilio kept as backup |
| 2026-06-09 | Phone verify re-added as additive (not a posting gate) | Don't break LINE+Email launch policy; can promote to required later |
| 2026-06-09 | Edited listings reset to `pending` re-approval | Prevent published content changing without moderation |
| 2026-06-09 | Edit keeps original slug | Preserve SEO URLs / inbound links |
| 2026-06-09 | Neon for production PostgreSQL | Serverless Postgres, best free tier for Vercel; user chose |
| 2026-06-09 | PromptPay direct for payments | User prefers direct PromptPay over Omise |
| 2026-06-09 | PromptPay QR via promptpay-qr + qrcode libs | Zero-cost EMVCo-compliant QR; no API dependency |
| 2026-06-09 | SlipOK for automated slip verification | Free 100/month; admin manual fallback when not configured |
| 2026-06-09 | Pending payment → slip upload → verify/admin review flow | No real-time webhook from Thai banks; slip is the standard approach |
| 2026-06-09 | Neon Postgres as sole DB (dev + prod) | User provisioned Neon; SQLite retired after migration churn |
| 2026-06-09 | Prisma 7: `url` only in `prisma.config.ts`, not `schema.prisma` | Required by Prisma 7 config model |
| 2026-06-09 | `scripts/setup-neon.ps1` for one-shot Neon table creation | Fixes empty migration dirs (P3015) + migrate deploy + seed |
| 2026-06-09 | TH/EN only for i18n launch; ZH/JA/AR hidden | User scope; full multilingual deferred |
| 2026-06-09 | Owner direct contact when `poster.role !== agent` | Agent listings use platform CRM; owners contacted directly |
| 2026-06-09 | Analytics in Postgres (not GA4-only) | Admin dashboard + CSV; works without `NEXT_PUBLIC_GA_ID` |
| 2026-06-09 | Sponsored posts UI deferred | User asked to plan only; schema fields exist |

---

## Metrics to track (post-launch)

| Metric | Tool | Phase |
|--------|------|-------|
| Organic traffic | GA4 / GSC | 2 |
| Listings published | Admin dashboard | 1 ✓ |
| User registrations | DB query | 1 ✓ |
| Verification completion rate | Custom | 2 |
| Package revenue | Payment provider | 2 |
| AI searches / day | API logs | 2 |

---

## How to update this file

When you complete work:
1. Move item from `[ ]` → `[x]` in the correct phase
2. Update **Last updated** date at top
3. Update **Current phase** if phase boundary crossed
4. Add row to **Decision log** for architectural choices
5. Update **In progress** / **Up next** in State tracker

When starting a new chat/session:
1. Read `CLAUDE.md` for architecture
2. Read this file for what's done and what's next
3. Run `npm run dev` and verify build before large changes

---

## Quick reference — file ownership

| Feature | Primary files |
|---------|---------------|
| Auth | `src/lib/auth.ts`, `src/app/api/auth/*` |
| Quota | `src/lib/quota.ts`, `src/lib/packages.ts` |
| Listings merge | `src/lib/listings.ts`, `src/lib/user-properties.ts` |
| AI search | `src/lib/ai-search.ts` |
| Admin | `src/lib/admin.ts`, `src/app/admin/*` |
| SEO | `src/lib/seo.ts`, `src/app/sitemap.ts` |
| Areas/Blog content | `src/lib/areas.ts`, `src/lib/blog.ts` |
| Map | `src/lib/locations.ts`, `src/components/property/PropertyMap.tsx` |
| Gallery | `src/components/property/PropertyImageGallery.tsx`, `ImageGalleryInput.tsx` |
| DB schema | `prisma/schema.prisma` |

---

*End of ROADMAP — keep this document current for smooth handoffs between models and developers.*
