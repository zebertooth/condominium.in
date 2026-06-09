# CLAUDE.md — Condominium.in.th

Handoff guide for AI agents and developers continuing this project.

## Project summary

**Condominium.in.th** is a Thai real-estate marketplace (condos & houses, buy/rent) focused on Bangkok BTS areas. Inspired by DDproperty, PropertyHub, and Baania.

**Domain:** `condominium.in.th` (not deployed yet)

**Primary goals:**
1. SEO traffic (area pages, blog, structured data)
2. AI-assisted property search (natural language)
3. Owner self-listing with verification & quotas
4. Agent team for real-world viewings
5. Monetization via listing packages & sponsored posts

**Language:** Thai-first. i18n scaffold exists for Chinese, Japanese, Arabic (not implemented).

---

## Model transfer snapshot (session 9)

Quick state for the next AI model:

- Verified by user: migrate/build/lint passed after the latest schema changes.
- Runtime DB stack now targets PostgreSQL (`schema.prisma` + `src/lib/db.ts` with `PrismaPg`).
- Provider decision: Neon selected for production.
- PromptPay flow implemented (purchase/sponsor create pending payment + QR; confirm via slip; admin payment review).
- `PAID_FEATURES_ENABLED` still controls whether package/sponsor UI and APIs are active.
- Launch policy remains: Thai = LINE+Email gate, non-Thai cannot post yet, phone OTP additive.

Read order for the next model:
1. `AGENTS.md` (handoff + priorities)
2. `ROADMAP.md` (current phase + up next)
3. This file (`CLAUDE.md`) for API/env/details
4. `DEPLOYMENT.md` before production launch actions

---

## Tech stack

| Layer | Choice |
|-------|--------|
| Framework | Next.js 16 (App Router, Turbopack) |
| Language | TypeScript |
| Styling | Tailwind CSS 4 |
| Database | PostgreSQL via Prisma 7 (Neon for prod; SQLite migration complete) |
| DB adapter | `@prisma/adapter-pg` (pg Pool) |
| Auth | JWT session cookie (`jose`) + `bcryptjs` |
| Validation | Zod |
| Fonts | Noto Sans Thai (Google Fonts) |

**Important:** Prisma 7 requires driver adapter — see `src/lib/db.ts`. Do not use `new PrismaClient()` without adapter. Current adapter is `@prisma/adapter-pg` with `pg.Pool`.

**Important:** Next.js 16 may differ from training data. Check `node_modules/next/dist/docs/` and `AGENTS.md` before assuming APIs.

---

## Commands

```bash
npm install
npm run db:migrate    # apply Prisma migrations
npm run db:seed       # create default admin user
npm run dev           # http://localhost:3000
npm run build         # prisma generate + next build
npm run lint
```

---

## Environment variables (`.env`)

```env
DATABASE_URL="postgresql://user:pass@host/db?sslmode=require"
# For local dev with SQLite, the project previously used: file:./prisma/dev.db
# The schema now targets PostgreSQL — point this at a Neon instance
AUTH_SECRET="condominium-dev-secret-change-in-production"
NODE_ENV="development"
ADMIN_EMAIL="admin@condominium.in.th"
ADMIN_PASSWORD="admin123456"
```

Optional integrations (env-gated — blank = dev fallback):
```env
OPENAI_API_KEY=            # enables LLM AI search (else rule-based)
OPENAI_MODEL=gpt-4o-mini
NEXT_PUBLIC_GA_ID=         # GA4 analytics
RESEND_API_KEY=            # real email OTP (else console in dev)
EMAIL_FROM=
THAIBULKSMS_API_KEY=       # real SMS for TH numbers (preferred); else Twilio, else console
THAIBULKSMS_API_SECRET=
THAIBULKSMS_SENDER=
TWILIO_ACCOUNT_SID=        # SMS fallback
TWILIO_AUTH_TOKEN=
TWILIO_FROM=
CLOUDINARY_CLOUD_NAME=     # cloud image upload (else local public/uploads)
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
LINE_LOGIN_CHANNEL_ID=     # LINE verify (else dev-only manual verify)
LINE_LOGIN_CHANNEL_SECRET=
LINE_LOGIN_CALLBACK_URL=
```

Still pending: Flip `PAID_FEATURES_ENABLED` once `PROMPTPAY_ID` is set.

PromptPay payment (env-gated):
```env
PROMPTPAY_ID=                  # PromptPay phone or citizen ID for QR generation
SLIPOK_API_KEY=                # SlipOK slip verification (free 100/month; else admin manual)
SLIPOK_BRANCH_ID=
```

---

## Directory map

```
src/
├── app/                    # Next.js App Router pages & API routes
│   ├── admin/              # Admin panel (role=admin only)
│   │   ├── properties/     # list + [id]/edit (admin listing edit)
│   │   ├── users/, leads/  # manage users + lead pipeline
│   ├── dashboard/          # User dashboard (auth required)
│   │   ├── post/, verify/  # create listing, LINE+Email(+phone) verify
│   │   └── edit/[id]/      # owner edit own listing
│   ├── api/
│   │   ├── auth/           # register, login, logout, OTP (phone/email), verify-id (unused), line/{start,callback,dev-verify}
│   │   ├── admin/          # stats, users/[id], properties/[id] (PATCH+PUT), properties/bulk, leads/[id]
│   │   ├── user/           # properties (GET/POST), properties/[id] (PUT/DELETE), quota
│   │   ├── packages/       # purchase, sponsor, confirm, status (PromptPay flow)
│   │   ├── leads/          # public lead capture
│   │   ├── upload/         # image upload (Cloudinary/local)
│   │   ├── og/             # dynamic OG image
│   │   └── ai-search/      # OpenAI w/ rule fallback (rate-limited)
│   ├── property/[slug]/    # Public listing detail
│   ├── areas/, blog/, buy/, rent/, ai-search/, list-property/, contact/, ...
│   ├── sitemap.ts, robots.ts
│   └── layout.tsx
├── components/
│   ├── admin/              # AdminPropertyTable (bulk+edit), AdminUserTable, AdminLeadTable
│   ├── auth/               # RegisterForm (nationality), LoginForm, LogoutButton
│   ├── dashboard/          # VerifyForm, PostPropertyForm (create+edit), QuotaCard, PackageShop, MyProperties
│   ├── property/           # Cards, Gallery, Map, LocationPicker, ImageGalleryInput
│   ├── lead/               # LeadForm
│   ├── analytics/          # GA4 Analytics
│   ├── home/, layout/, seo/, ai/
├── lib/                    # Business logic (prefer adding here)
│   ├── db.ts               # Prisma singleton (better-sqlite3 adapter)
│   ├── auth.ts             # Session, getCurrentUser, hashPassword/IdCard
│   ├── admin.ts            # requireAdmin, getAdminUser, getAdminStats
│   ├── validation.ts       # Zod schemas (register, property, lead, ...)
│   ├── quota.ts            # Role/nationality-aware listing limits
│   ├── packages.ts         # Pricing + PAID_FEATURES_ENABLED flag
│   ├── promptpay.ts        # PromptPay QR generation + SlipOK verification
│   ├── line.ts             # LINE Login helper (env-gated)
│   ├── notifications.ts    # sendEmail (Resend) + sendSms (ThaiBulkSMS→Twilio→console)
│   ├── otp.ts, email-otp.ts
│   ├── openai.ts           # OpenAI chat client (REST)
│   ├── ai-search.ts        # LLM filter-extract + rule-based fallback
│   ├── storage.ts          # image upload (Cloudinary / local disk)
│   ├── rate-limit.ts       # in-memory fixed-window limiter + getClientIp
│   ├── leads.ts, lead-constants.ts   # CRM helpers (+ client-safe consts)
│   ├── listings.ts         # Merge static + DB published listings
│   ├── properties.ts       # Static seed listings (demo)
│   ├── user-properties.ts  # dbPropertyToListing, uniqueSlug
│   ├── locations.ts        # BTS coords, OSM embed URLs
│   ├── areas.ts, blog.ts, seo.ts, i18n.ts
├── types/property.ts
└── generated/prisma/       # Prisma client (auto-generated)

prisma/
├── schema.prisma           # User, UserProperty, UserSubscription, PhoneOtp, EmailOtp, Lead
├── migrations/
└── seed.ts                 # Admin user seed
```

---

## Data model (Prisma)

### User
- `email?` (required at register for launch) + `phone?` (optional, SMS verify is next phase)
- `isThai` (default true) — nationality, set at registration
- `lineVerified`, `emailVerified` — Thai users need **both** to post (launch policy)
- `phoneVerified` — reserved for next-phase SMS verification
- `idVerified` + `idCardHash` — **no longer required** for posting (kept for future/admin use)
- `role`: `"user"` | `"agent"` | `"admin"`
- `listingLimitOverride?` — admin-set per-account listing cap (main control for agents)
- `lineUserId?` — set when LINE Login is used

### Lead (Agent CRM)
- Captured from contact form & property inquiry (`source`: contact/property/ai-search)
- `status`: `new → contacted → viewing → closed | lost`
- `assignedToId` → an admin/agent user; `agentNote` free text
- Managed at `/admin/leads`

### UserProperty
- Owner-submitted listings
- `status`: `pending` → admin approves → `published` | `rejected` | `deleted`
- `images`: JSON string array (URLs only, no file upload yet)
- `latitude`, `longitude`: optional map coords
- Default status on create: **`pending`**

### UserSubscription
- Paid packages for extra listing slots (payment is **mocked**)

### Static listings
- `src/lib/properties.ts` — 6 demo listings, always merged in `src/lib/listings.ts`

---

## Key business rules

### Launch policy (current)
- **Paid features OFF** — `PAID_FEATURES_ENABLED = false` in `src/lib/packages.ts` disables package purchase + sponsor (API returns 403, UI hidden). Flip to `true` once a payment gateway is live.
- **ID verification removed** from the posting gate.
- **SMS/phone verification deferred** to next phase (ThaiBulkSMS).

### Verification by role/nationality
- **admin** — unlimited listings; no verification needed; can edit/check any user.
- **agent** — listing cap = `listingLimitOverride ?? AGENT_DEFAULT_LIMIT` (5); **cannot buy packages**; no verification gate (admin-managed).
- **user (Thai)** — must verify **LINE + Email** to post → 2 free listings.
- **user (non-Thai)** — may verify email to use the site/contact agents, but **cannot post listings** (`postingBlocked`); enabled in a later phase.

LINE verification: real LINE Login OAuth when `LINE_LOGIN_*` env set (`src/lib/line.ts`, `/api/auth/line/start|callback`); dev-only manual fallback (`/api/auth/line/dev-verify`) otherwise.

Quota flags live on `getUserQuota()`: `requiresVerification`, `postingBlocked`, `canBuyPackages`, `unlimited`, `fullyVerified` (= eligible to post).

### Listing quota
- **Free:** 2 active listings for verified Thai users (`pending` + `published` count)
- **Agent:** admin-set cap (default 5), no packages
- **Admin:** unlimited
- **Packages/Sponsor:** defined in `src/lib/packages.ts` but **disabled at launch** (`PAID_FEATURES_ENABLED`)

### Listing visibility
- User posts → `pending`
- Admin approves at `/admin/properties` → `published`
- Only `published` user listings appear on `/buy`, `/rent`, AI search, `/property/[slug]`

### Admin access
- `role === "admin"` on User
- Seed: `npm run db:seed` or register with `ADMIN_EMAIL`
- Layout guard: `src/app/admin/layout.tsx` → `getAdminUser()`
- Admin manages roles + per-user listing limits + lead pipeline at `/admin/users` and `/admin/leads`
- To create an **agent**: `/admin/users` → set role to `agent` + listing limit

### Auth session
- Cookie: `condo_session` (httpOnly JWT, 7 days)
- `getCurrentUser()` in server components / API routes
- No middleware.ts yet — each route checks auth individually

---

## API routes reference

| Method | Path | Auth | Purpose |
|--------|------|------|---------|
| POST | `/api/auth/register` | — | Create user |
| POST | `/api/auth/login` | — | Login (phone or email) |
| POST | `/api/auth/logout` | — | Clear session |
| GET | `/api/auth/me` | user | Profile + quota |
| POST | `/api/auth/send-otp` | user | Phone OTP |
| POST | `/api/auth/verify-phone` | user | Verify phone |
| POST | `/api/auth/send-email-otp` | user | Email OTP |
| POST | `/api/auth/verify-email` | user | Verify email |
| POST | `/api/auth/verify-id` | user | Verify Thai ID (no longer in flow) |
| GET | `/api/auth/line/start` | user | Begin LINE Login OAuth |
| GET | `/api/auth/line/callback` | user | LINE OAuth callback → mark verified |
| POST | `/api/auth/line/dev-verify` | user | Dev-only manual LINE verify |
| POST | `/api/upload` | user | Image upload (Cloudinary or local) |
| POST | `/api/leads` | — | Capture lead (contact/property) |
| GET/POST | `/api/user/properties` | user | List / create property |
| PUT | `/api/user/properties/[id]` | user | Edit own listing (resets to `pending`) |
| DELETE | `/api/user/properties/[id]` | user | Soft-delete |
| GET | `/api/user/quota` | user | Quota info |
| POST | `/api/packages/purchase` | user | Create pending order + PromptPay QR |
| POST | `/api/packages/sponsor` | user | Create sponsor order + PromptPay QR |
| POST | `/api/packages/confirm` | user | Upload slip + verify payment |
| GET | `/api/packages/status?id=` | user | Check payment status |
| GET | `/api/admin/stats` | admin | Dashboard counts |
| GET/PATCH | `/api/admin/users` + `/[id]` | admin | Manage users (role, listing limit, verify) |
| GET/PATCH/PUT | `/api/admin/properties` + `/[id]` | admin | Approve/reject (PATCH) + full edit (PUT) |
| POST | `/api/admin/properties/bulk` | admin | Bulk status update (approve/reject many) |
| PATCH | `/api/admin/leads/[id]` | admin | Lead status / assign / note |
| GET/PATCH | `/api/admin/payments` | admin | List / approve / reject PromptPay payments |
| POST | `/api/ai-search` | — | AI search (OpenAI w/ rule-based fallback) |

---

## OTP / payments (dev mode)

- Email OTP: real send via Resend when configured, else **logged/returned as `devCode`** in development (`src/lib/notifications.ts`)
- SMS OTP: ThaiBulkSMS (preferred) → Twilio → console fallback; `devCode` only in development
- LINE: real OAuth when configured, else dev-only manual verify button
- Payments: PromptPay QR + slip upload integrated; **`PAID_FEATURES_ENABLED = false`** until `PROMPTPAY_ID` is set; admin can manually approve/reject slips at `/admin/payments`

---

## SEO

- Metadata via `src/lib/seo.ts` → `createMetadata()`
- JSON-LD in layout + property/blog pages
- Dynamic sitemap: `src/app/sitemap.ts`
- Area landing pages: `/areas/[slug]` (5 BTS stations)
- Blog: 3 SEO articles in `src/lib/blog.ts`

---

## Coding conventions

1. **Minimize scope** — small focused diffs; match existing patterns
2. **Server components by default** — `"use client"` only for forms, gallery, map picker, AI search UI
3. **Business logic in `src/lib/`** — not in page files
4. **Thai UI copy** — user-facing text in Thai unless i18n phase
5. **Images** — `next.config.ts` allows `images.unsplash.com`; extend `remotePatterns` for new hosts
6. **Prisma imports** — `import { PrismaClient } from "@/generated/prisma/client"`
7. **No commits** unless user explicitly asks

---

## Status of integrations

Done / env-gated (work in dev, need keys for prod):
- [x] Image file upload — Cloudinary or local fallback (`src/lib/storage.ts`)
- [x] OpenAI AI search with rule-based fallback (`src/lib/openai.ts`)
- [x] Email OTP via Resend (console fallback)
- [x] LINE verification via LINE Login (dev fallback)
- [x] Agent CRM lead capture + pipeline (`/admin/leads`)
- [x] GA4 analytics scaffold + dynamic OG image

Partially done:
- [~] SMS phone verification — ThaiBulkSMS + Twilio provider wired (`src/lib/notifications.ts`); phone OTP step is additive in verify flow (does not yet gate posting). Add `THAIBULKSMS_*` keys for prod.

Not done yet (do not assume these exist):
- [x] ~~Payment gateway (Omise / PromptPay)~~ **Done** — PromptPay QR + SlipOK; `PAID_FEATURES_ENABLED` still `false`
- [ ] Non-Thai user listing (blocked by policy for now)
- [ ] ~~PostgreSQL production DB (SQLite only)~~ **Done** — schema + adapter swapped to PostgreSQL (Neon)
- [ ] Viewing scheduler / agent dashboard
- [ ] Multilingual pages (ZH, JA, AR)
- [ ] Deployment to `condominium.in.th`
- [ ] `middleware.ts` for auth

---

## Common tasks for next agent

### Add a new BTS area page
1. Add entry in `src/lib/areas.ts`
2. Sitemap auto-includes from `areaGuides`
3. Optionally add coords in `src/lib/locations.ts`

### Change listing packages
Edit `src/lib/packages.ts` — `FREE_PROPERTY_LIMIT`, `LISTING_PACKAGES`, `SPONSOR_PACKAGE`

### Wire real OpenAI search
1. Add `OPENAI_API_KEY` to env
2. Replace or augment `src/lib/ai-search.ts`
3. Keep `runAISearch()` async interface used by `/api/ai-search`

### Migrate to PostgreSQL
1. Change `datasource` in `schema.prisma`
2. Swap SQLite adapter for `@prisma/adapter-pg` in `src/lib/db.ts`
3. Run migrations on production DB

### Deploy (Vercel)
- SQLite file DB **does not work** on serverless — must migrate to PostgreSQL before production
- Set `AUTH_SECRET`, `DATABASE_URL`, `ADMIN_EMAIL` in Vercel env

---

## Test accounts

| Role | Login | Password |
|------|-------|----------|
| Admin | `admin@condominium.in.th` | `admin123456` |

Create regular users via `/register`.

---

## Related docs

- `AGENTS.md` — **start here for AI agents** (workflow, guardrails, priorities)
- `ROADMAP.md` — timeline, phase status, what to build next
- `DEPLOYMENT.md` — production launch runbook (Postgres + Vercel + DNS)
- `README.md` — quick start for humans

---

## Product vision (full)

```
Owner path:  register → verify → post listing → admin approve → live on site
Buyer path:  browse / AI search → contact agent → schedule viewing
Agent path:  team receives lead → shortlist → real viewing → close deal
Revenue:     free 2 listings → paid packages → sponsored posts
```

When in doubt, read `ROADMAP.md` for current phase and priorities.
