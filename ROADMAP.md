# ROADMAP.md — Timeline & State Tracker

**Project:** Condominium.in.th  
**Last updated:** 2026-06-09 (sessions 3–9)  
**Current phase:** Launch prep (paid OFF, LINE+Email verify) + Phase 2/3 slices  

> ## Build status
> Migrate + build + lint were run successfully (User.isThai/lineVerified/lineUserId + Lead applied). ✅  
> Sessions 6–9 are landed in codebase; session 9 includes Postgres + PromptPay integration.  
> Agent shell instability may still appear in this environment, so the next model should ask the user to run build/lint if shell output is unavailable.

> **LAUNCH POLICY (current):** Paid features OFF (`PAID_FEATURES_ENABLED=false`). ID verification removed. Thai users verify **LINE + Email** to post (2 free listings). Non-Thai users verify email only and **cannot post** yet. Phone/SMS verification is wired (ThaiBulkSMS) but **additive** (not a posting gate yet).

> Update this file when completing features, changing priorities, or deploying.  
> Mark items: `[x]` done · `[~]` in progress · `[ ]` planned · `[-]` cancelled

---

## Model transfer snapshot (session 9)

Use this section when handing off to the next AI model.

- Last verified by user: `npm run db:migrate`, `npm run build`, `npm run lint` all passed.
- DB direction: PostgreSQL adapter (`@prisma/adapter-pg`) and Neon chosen.
- Payments: PromptPay QR + slip verify flow implemented; still gated by `PAID_FEATURES_ENABLED` and `PROMPTPAY_ID`.
- Launch policy unchanged: Thai requires LINE+Email to post, non-Thai blocked, SMS additive.
- Immediate next operational step: production deploy (Neon connection string, Vercel env, DNS).

Next model startup order:
1. Read `AGENTS.md` handoff block.
2. Read `ROADMAP.md` "Up next" + "Blocked / needs decision".
3. Read `CLAUDE.md` API map + env section.
4. Ask user for any missing production credentials and proceed.

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
| **Launch** | LINE+Email verify, paid OFF, deploy | **In progress** | 2026 Q2 |
| **2** | Production infra, real AI, payments, SMS verify | Next | 2026 Q3 |
| **3** | Agent CRM, owner portal, scheduling | Started | 2026 Q4 |
| **4** | Multilingual (ZH, JA, AR) | Planned | 2027 Q1 |

---

## Launch prep — Go-live without paid (CURRENT)

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

### Next phase (in progress)
- [x] ThaiBulkSMS provider in `src/lib/notifications.ts` (preferred for TH, Twilio fallback, console dev)
- [x] Phone (SMS) OTP step re-added to verify flow for Thai users (additive)
- [x] `THAIBULKSMS_*` env placeholders
- [ ] Decide if phone verify should gate posting (currently optional/additive)
- [ ] Add real ThaiBulkSMS keys + approved sender in prod
- [ ] Enable listing for non-Thai users (policy decision)
- [ ] Flip `PAID_FEATURES_ENABLED` once payment gateway is live

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
- [x] Prisma 7 + SQLite (local dev)
- [x] Models: User, UserProperty, UserSubscription, PhoneOtp, EmailOtp
- [x] Migrations in `prisma/migrations/`

### Not in Phase 1 (intentionally deferred)
- [-] Production deployment
- [-] Real SMS / email
- [-] Real payments
- [-] Image file upload
- [-] PostgreSQL

---

## Phase 2 — Production & Intelligence (NEXT)

**Goal:** Deploy to `condominium.in.th`, real verification, real AI, real payments.

### Infrastructure
- [x] Migrate SQLite → PostgreSQL (Neon) — schema + adapter + seed updated (session 9)
- [x] Update `src/lib/db.ts` for `@prisma/adapter-pg`
- [ ] Deploy to Vercel (or similar)
- [ ] Point DNS `condominium.in.th`
- [ ] Production env vars (`AUTH_SECRET`, `DATABASE_URL`)
- [x] File storage for images — `src/lib/storage.ts` (Cloudinary signed upload + local-disk dev fallback), `POST /api/upload`, drag-to-upload UI in `ImageGalleryInput`

### Real verification
- [x] SMS OTP — ThaiBulkSMS (preferred) + Twilio fallback (`src/lib/notifications.ts`)
- [x] Email OTP — Resend (console fallback in dev)
- [ ] Remove `devCode` from API responses in production
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
- [ ] Flip `PAID_FEATURES_ENABLED = true` (when ready for real payments)
- [ ] Set PROMPTPAY_ID + SLIPOK keys in production env

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
- [ ] Agent dashboard (separate from owner/admin dashboard)

### Viewing scheduler
- [ ] Book viewing slot on property page
- [ ] Line / WhatsApp notification to agent
- [ ] Calendar integration (Google Calendar)

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

### In progress
```
(none in flight)
NEXT: Vercel deployment + DNS + Neon database provisioning (requires user's Neon connection string)
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

### Up next (recommended order)
```
1. PRODUCTION LAUNCH (Postgres swap DONE — remaining steps):
   - Provision Neon database + set DATABASE_URL in Vercel env
   - Run prisma migrate deploy (or migrate dev --name init_postgres) against Neon
   - npm run db:seed on production
   - Deploy to Vercel + point condominium.in.th DNS
   - Set prod env vars (AUTH_SECRET, ADMIN_*, PROMPTPAY_ID)
2. Flip PAID_FEATURES_ENABLED = true (once PROMPTPAY_ID is set)
3. Create real LINE Login channel; set LINE_LOGIN_* (+ prod callback URL)
4. Add real keys to prod env (OPENAI / RESEND / THAIBULKSMS / CLOUDINARY / SLIPOK)
5. Decide if phone verify should gate posting; enable non-Thai listing (policy)
6. Phase 3 cont.: agent dashboard, auto-assign by BTS area, viewing scheduler
7. Optional code: owner listing view-stats, admin audit log, AI listing summaries
```

### Blocked / needs decision (for next model — ask the user)
```
- DB provider: Neon CHOSEN ✓ — user needs to provision the database + provide connection string
- Payment provider: PromptPay direct DONE ✓ — need PROMPTPAY_ID + flip PAID_FEATURES_ENABLED
- Should phone (SMS) verification be REQUIRED to post, or stay additive? (user chose additive for now)
- When to allow non-Thai users to post listings (currently blocked by policy)
- Production API keys: OPENAI / RESEND / THAIBULKSMS / CLOUDINARY / LINE_LOGIN_* / SLIPOK
```

---

## Decision log

| Date | Decision | Rationale |
|------|----------|-----------|
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
