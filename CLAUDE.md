# CLAUDE.md — Condominium.in.th

Handoff guide for AI agents and developers continuing this project.

## Project summary

**Condominium.in.th** is a Thai real-estate marketplace (condos & houses, buy/rent) focused on Bangkok BTS areas. Inspired by DDproperty (listings), Think of Living (reviews), PropertyHub, and Baania.

**Domain:** https://www.condominium.in.th (live on Vercel)

**Primary goals:**
1. SEO traffic (area pages, blog, structured data)
2. AI-assisted property search (natural language)
3. Owner self-listing with verification & quotas
4. Agent team for real-world viewings
5. Monetization via listing packages & sponsored posts

**Language:** Thai-first + **5 locales** (TH/EN/ZH/JA/AR). Thai = unprefixed URLs; other locales use `/en/`, `/zh/`, `/ja/`, `/ar/` prefix. Middleware sets `x-condo-locale` header.

---

## Model transfer snapshot (session 43)

| Item | Detail |
|------|--------|
| **Phase** | **Phase 9 next** — editorial review blog; **Phase 10** — DD-style search UX |
| **Locales** | TH unprefixed; EN/ZH/JA/AR via URL prefix; middleware forces Thai on unprefixed public pages |
| **Homepage** | 3 sections — ประกาศแนะนำ / ประกาศล่าสุด / ยอดนิยม (`HomeListingsSection`) |
| **Blog today** | 5 SEO guides + admin CMS — plain renderer; **no project reviews yet** |
| **Search** | Advanced filters + Leaflet map at `/map` — **no sort on buy/rent yet** (Phase 10) |
| **Differentiator** | AI search + review→listing funnel + 5 locales + BTS niche |
| **Competitors** | [DDproperty](https://www.ddproperty.com/) listings UX · [Think of Living](https://thinkofliving.com/) editorial |
| **Phase 8** | Dashboard i18n complete; SEO form fix deployed (`c163d9e`) |
| **Ops pending** | Cron verify, AdSense slots, GSC |

Read order: `AGENTS.md` → `ROADMAP.md` → [`PHASE-9-PLAN.md`](./PHASE-9-PLAN.md) → this file → `DEPLOYMENT.md`

---

## Tech stack

| Layer | Choice |
|-------|--------|
| Framework | Next.js 16 (App Router, Turbopack) |
| Language | TypeScript |
| Styling | Tailwind CSS 4 |
| Database | PostgreSQL via Prisma 7 (Neon — ap-southeast-1) |
| DB adapter | `@prisma/adapter-pg` (pg Pool) — URL in `prisma.config.ts` + `.env` |
| Auth | JWT session cookie (`jose`) + `bcryptjs` |
| Validation | Zod |
| Fonts | Noto Sans Thai (Google Fonts) |

**Important:** Prisma 7 requires driver adapter — see `src/lib/db.ts`. Do not use `new PrismaClient()` without adapter. Current adapter is `@prisma/adapter-pg` with `pg.Pool`.

**Important:** Next.js 16 may differ from training data. Check `node_modules/next/dist/docs/` and `AGENTS.md` before assuming APIs.

---

## Commands

```bash
npm install
npx prisma generate   # regenerate client after schema changes
npm run db:deploy     # apply migrations to Neon (production-safe)
npm run db:seed       # create/update admin user
npm run dev           # http://localhost:3000
npm run build         # prisma generate + next build
npm run lint
```

**First-time Neon setup (Windows):**
```powershell
powershell -ExecutionPolicy Bypass -File scripts\setup-neon.ps1
```

**If `P3015` (missing migration.sql):** delete empty folders under `prisma/migrations/` that lack `migration.sql`, then re-run `db:deploy`.

**Fallback if migrate deploy fails:** `npx prisma db push` then `npm run db:seed`.

---

## Environment variables (`.env`)

```env
DATABASE_URL="postgresql://user:pass@ep-xxx.region.aws.neon.tech/neondb?sslmode=require"
# Neon connection string — required for both local dev and production
# URL is read by prisma.config.ts (migrate) and src/lib/db.ts (runtime)
AUTH_SECRET="condominium-dev-secret-change-in-production"
NODE_ENV="development"
ADMIN_EMAIL="admin@condominium.in.th"
ADMIN_PASSWORD="admin123456"
```

Optional integrations (env-gated — blank = dev fallback):
```env
OPENAI_API_KEY=            # enables LLM AI search (else rule-based)
OPENAI_MODEL=gpt-4o-mini
NEXT_PUBLIC_GA_ID=         # optional override; default G-9MRZ57SWS1 in src/lib/ga.ts
NEXT_PUBLIC_ADSENSE_CLIENT=ca-pub-...  # AdSense publisher ID (loads after cookie consent)
NEXT_PUBLIC_TURNSTILE_SITE_KEY=  # Cloudflare Turnstile site key (else dev test keys)
TURNSTILE_SECRET_KEY=        # Turnstile secret for server verify
RESEND_API_KEY=            # real email OTP + password reset (else console in dev)
EMAIL_FROM=
THAIBULKSMS_API_KEY=       # real SMS for TH numbers (preferred); else Twilio, else console
THAIBULKSMS_API_SECRET=
THAIBULKSMS_SENDER=CDMNINTH  # approved sender; defaults to CDMNINTH if omitted
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

Still pending: Set optional keys on Vercel (OPENAI, SLIPOK, ADSENSE). Turnstile + GA4 wired on production. User to verify ThaiBulkSMS on production. Paste AdSense slot IDs at `/admin/seo`.

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
│   │   ├── import/         # CSV import page (session 31)
│   │   ├── sponsored/      # manage ประกาศแนะนำ (session 37)
│   │   ├── seo/            # home SEO + AdSense slot IDs (SiteSettings)
│   │   ├── users/, leads/  # manage users + lead pipeline
│   ├── dashboard/          # User dashboard (auth required)
│   │   ├── post/, verify/  # create listing, LINE+Email(+phone) verify
│   │   ├── saved/          # saved properties / favorites (session 31)
│   │   ├── alerts/         # search alert management (session 31)
│   │   ├── agent/          # agent CRM dashboard
│   │   └── edit/[id]/      # owner edit own listing
│   ├── map/                # Leaflet map search (session 31)
│   ├── tools/mortgage-calculator/  # standalone calculator (session 31)
│   ├── forgot-password/, reset-password/, privacy/, terms/
│   ├── icon.svg, apple-icon.svg  # favicon (Next.js file metadata)
│   ├── api/
│   │   ├── auth/           # register, login, logout, forgot/reset password, OTP, line/*
│   │   ├── admin/          # stats, users, properties, leads, payments, site-settings, import
│   │   ├── user/           # properties, quota, favorites, alerts (session 31)
│   │   ├── packages/       # purchase, sponsor, confirm, status (PromptPay flow)
│   │   ├── leads/          # public lead capture
│   │   ├── upload/         # image upload (Cloudinary/local)
│   │   ├── captcha/        # runtime Turnstile site key (session 33)
│   │   ├── og/             # dynamic OG image
│   │   └── ai-search/      # OpenAI w/ rule fallback (rate-limited)
│   ├── property/[slug]/    # Public listing detail (+ mortgage calculator for sale)
│   ├── areas/, blog/, buy/, rent/, ai-search/, list-property/, contact/, ...
│   ├── sitemap.ts, robots.ts
│   └── layout.tsx
├── components/
│   ├── admin/              # AdminPropertyTable, AdminSeoForm, AdminCsvImport, ...
│   ├── ads/                # AdPlacement, AdSlot, AdSenseScript
│   ├── auth/               # RegisterForm, LoginForm, LogoutButton
│   ├── brand/              # SiteLogo, SiteLogoMark
│   ├── dashboard/          # VerifyForm, PostPropertyForm, QuotaCard, PackageShop, AlertsList
│   ├── property/           # Cards, Gallery, Map, AdvancedFilters, SaveButton, MortgageCalculator
│   ├── lead/               # LeadForm
│   ├── security/           # TurnstileField, TurnstileScript (session 33)
│   ├── layout/             # Header, Footer, LanguageSwitcher, CookieConsent
│   ├── home/               # Hero, HomeListingsSection (session 37)
│   ├── i18n/               # LocalizedLink (session 38)
│   ├── seo/, ai/
├── lib/
│   ├── csv-import.ts       # CSV parser + validator (session 31)
│   ├── favorites.ts        # getUserSavedSlugs, getUserSavedProperties (session 31)
│   ├── sponsored.ts        # isActiveSponsor() (session 37)
│   ├── cron-auth.ts        # readCronSecret() — strip newlines (session 38)
│   ├── locale-routing.ts   # localePath, LOCALE_HEADER, hreflang (Phase 7)
│   ├── site-settings.ts    # getSiteSettings(), resolveHomeMeta(), ad slot mapping
│   ├── adsense.ts          # AD_SLOT_CATALOG (9 positions)
│   ├── password-reset.ts   # token hash, Resend reset email
│   ├── content/legal.ts    # privacy + terms copy (TH/EN)
│   ├── db.ts               # Prisma singleton (@prisma/adapter-pg)
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
│   ├── integrations.ts     # getIntegrationStatus() for /api/health + admin panel
│   ├── captcha.ts            # Turnstile verify + requireCaptcha() (session 33)
│   ├── ga.ts                 # GA4 measurement ID + loader (session 33)
│   ├── request.ts          # Safe empty POST body parsing (OTP routes)
│   ├── rate-limit.ts       # in-memory fixed-window limiter + getClientIp
│   ├── leads.ts, lead-constants.ts   # CRM helpers (+ locale-aware labels)
│   ├── listings.ts         # Merge static + DB published listings
│   ├── properties.ts       # Static seed listings (demo)
│   ├── user-properties.ts  # dbPropertyToListing, uniqueSlug
│   ├── locations.ts        # BTS coords, OSM embed URLs
│   ├── areas.ts, blog.ts, seo.ts, i18n.ts
├── middleware.ts           # Locale routing; unprefixed = Thai (session 38)
├── types/property.ts
└── generated/prisma/       # Prisma client (auto-generated)

prisma/
├── schema.prisma           # User, UserProperty, SavedProperty, SearchAlert, ...
├── migrations/
└── seed.ts                 # Admin user + default SiteSettings seed
```

---

## Data model (Prisma)

### User
- `email?` (required at register) + `phone?` (optional; SMS verify is additive, not a posting gate)
- `isThai` (default true) — nationality, set at registration
- `lineVerified`, `emailVerified` — Thai users need **both** to post (launch policy)
- `phoneVerified` — optional SMS step in verify flow (ThaiBulkSMS/Twilio)
- `idVerified` + `idCardHash` — **no longer required** for posting (kept for future/admin use)
- `role`: `"user"` | `"agent"` | `"admin"`
- `listingLimitOverride?` — admin-set per-account listing cap (main control for agents)
- `lineUserId?` — set when LINE Login is used

### Lead (Agent CRM)
- Captured from contact form & property inquiry (`source`: contact/property/ai-search)
- `contactMode`: `agent_team` (default) or `owner_direct` (owner-posted listings)
- `ownerUserId`, `posterRole` — set for owner-direct inquiries
- `status`: `new → contacted → viewing → closed | lost`
- Managed at `/admin/leads`

### SiteSettings (singleton row `id=default`)
- Home SEO: `homeTitle`, `homeDescription`, `homeTitleEn`, `homeDescriptionEn`, `keywords`, `titleSuffix`
- AdSense slot IDs: `adSlotHomeLeaderboard`, `adSlotHomeMid`, `adSlotListingTop`, `adSlotListingInfeed`, `adSlotPropertyTop`, `adSlotPropertySidebar`, `adSlotBlogTop`, `adSlotBlogInarticle`, `adSlotFooter`
- Edited at `/admin/seo`; read by `getSiteSettings()` for metadata + ad components

### PasswordResetToken
- Email-only password reset for all roles; 1-hour expiry; hashed token in DB

### UserProperty
- Owner-submitted listings
- `status`: `pending` → admin approves → `published` | `rejected` | `deleted`
- `images`: JSON string array (Cloudinary URLs or `/uploads/*` local paths)
- `isSponsored`, `sponsoredUntil`: sponsored placement (7-day boost via PromptPay; UI live)
- Poster `User.role` drives contact: `agent` → platform CRM; `user` → owner direct

### SearchEvent / PropertyViewEvent / MatchingEvent
- Analytics tables for admin dashboard + CSV export
- Matching: `owner_contact_view`, `owner_phone_click`, `owner_email_click`, `owner_inquiry`

### UserSubscription
- Paid packages for extra listing slots (PromptPay QR + slip upload; gated by `PAID_FEATURES_ENABLED`)

### SavedProperty (session 31)
- User favorites/wishlist
- `userId` + `propertySlug` unique constraint
- API: `/api/user/favorites` (toggle save/unsave)
- UI: heart icon on cards, `/dashboard/saved` page

### SearchAlert (session 31)
- Email alerts for matching new listings
- `name`, `listingType`, `filters` (JSON), `frequency` (daily/weekly)
- `active`, `lastSentAt` for digest scheduling
- API: `/api/user/alerts` (CRUD)
- UI: `/dashboard/alerts`, `CreateAlertButton` on buy/rent pages
- Max 10 alerts per user

### Static listings
- `src/lib/properties.ts` — 6 demo listings, always merged in `src/lib/listings.ts`

---

## Key business rules

### Launch policy (current)
- **Paid features ON** in production when `PROMPTPAY_ID` is set (`PAID_FEATURES_ENABLED` env-gated in `src/lib/packages.ts`). Override with `PAID_FEATURES_ENABLED=false` to force-disable.
- **ID verification removed** from the posting gate.
- **SMS/phone verification is additive** — ThaiBulkSMS/Twilio wired; does not gate posting. Production SMS verify skipped for now.

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
- **Packages/Sponsor:** active when `PROMPTPAY_ID` set on Vercel

### Listing visibility
- User posts → `pending`
- Admin approves at `/admin/properties` → `published`
- Only `published` listings appear on `/buy`, `/rent`, AI search, sitemap
- `/property/[slug]`: public sees **published** only; **owner** (logged in) and **admin** can preview `pending`/`rejected` with amber banner; contact form hidden until published

### Admin access
- `role === "admin"` on User
- Seed: `npm run db:seed` only — **never** promote via `/api/auth/register`
- Layout guard: `src/app/admin/layout.tsx` → non-admin redirected to `/dashboard`
- Admin UI bilingual (TH/EN) via site language cookie
- Admin manages roles + per-user listing limits + lead pipeline at `/admin/users` and `/admin/leads`
- To create an **agent**: `/admin/users` → set role to `agent` + listing limit

### Auth session
- Cookie: `condo_session` (httpOnly JWT, 7 days)
- `getCurrentUser()` in server components / API routes
- `src/middleware.ts` — locale routing for public pages (`x-condo-locale` header); auth still checked per route

---

## API routes reference

| Method | Path | Auth | Purpose |
|--------|------|------|---------|
| POST | `/api/auth/register` | — | Create user |
| POST | `/api/auth/login` | — | Login (phone or email) |
| POST | `/api/auth/forgot-password` | — | Email reset link (all roles; rate-limited) |
| POST | `/api/auth/reset-password` | — | Set new password from email token |
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
| POST | `/api/leads` | — | Capture lead (contact/property; contactMode owner_direct/agent_team) |
| POST | `/api/locale` | — | Set language cookie (th/en/zh/ja/ar) |
| GET/PATCH | `/api/admin/site-settings` | admin | Read/update home SEO + AdSense slot IDs |
| POST | `/api/analytics/property-view` | — | Log property page view |
| POST | `/api/analytics/matching` | — | Log owner contact interaction |
| GET | `/api/admin/analytics/export` | admin | CSV export (searches/views/matching/leads) |
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
| POST | `/api/admin/import` | admin | CSV import listings (session 31) |
| GET/POST | `/api/user/favorites` | user | List / toggle saved properties (session 31) |
| GET/POST/DELETE | `/api/user/alerts` | user | CRUD search alerts (session 31) |
| GET | `/api/captcha/config` | — | Runtime Turnstile site key (session 33) |
| POST | `/api/ai-search` | — | AI search (OpenAI w/ rule-based fallback) |

---

## OTP / payments

- **Email OTP:** Resend when `RESEND_API_KEY` + `EMAIL_FROM` set; on-screen fallback code if delivery fails (`src/lib/email-otp.ts`)
- **SMS OTP:** ThaiBulkSMS (preferred) → Twilio → console; on-screen fallback if delivery fails
- **LINE:** real OAuth when configured; dev-only manual verify when not
- **Payments:** PromptPay QR + slip upload; auto-enabled when `PROMPTPAY_ID` set; admin approve/reject at `/admin/payments`

---

## SEO & brand

- Metadata via `src/lib/seo.ts` → `createRootMetadata()` / `createMetadata()` (reads `SiteSettings`)
- Favicon: `src/app/icon.svg` + `apple-icon.svg`; mark also at `public/logo.svg`
- Brand header: `src/components/brand/SiteLogo.tsx`
- JSON-LD in layout + property/blog pages (`logo` URL → `/logo.svg`)
- Dynamic sitemap: `src/app/sitemap.ts`
- Area landing pages: `/areas/[slug]` (9 BTS stations)
- Blog: 5 SEO guides in `src/lib/blog.ts` + DB `BlogArticle` via `/admin/blog` — **Phase 9 adds project reviews**
- Admin SEO editor: `/admin/seo`

## Agents (public + admin)

- **Categories:** `team` | `freelance` | `company` — on `TeamAgent.agentCategory` and `Lead.agentType` (signup)
- **Public `/agents`:** published profiles grouped by category; signup at `#join-agent` (`AgentInterestForm`)
- **Admin `/admin/agents`:** two sections — recent `agent_interest` applications + tabbed profile editor (`AdminTeamAgentsPanel`)
- **Helpers:** `src/lib/agent-application.ts`, `src/lib/team-agents.ts`, `src/components/admin/AdminAgentApplications.tsx`
- **API:** `GET/POST /api/admin/team-agents`, `PATCH/DELETE /api/admin/team-agents/[id]`

## AdSense

- Env: `NEXT_PUBLIC_ADSENSE_CLIENT=ca-pub-…`
- Slot IDs stored in `SiteSettings`; catalog in `src/lib/adsense.ts`
- Script + ad units render only after cookie consent “Accept all”
- Placements: home (leaderboard + mid), buy/rent (top + in-feed every 6 cards), property (top + sidebar), blog (top + mid), footer

---

## Coding conventions

1. **Minimize scope** — small focused diffs; match existing patterns
2. **Server components by default** — `"use client"` only for forms, gallery, map picker, AI search UI
3. **Business logic in `src/lib/`** — not in page files
4. **Thai + English + Chinese + Japanese + Arabic UI** — use `src/lib/i18n.ts` keys + `useT()` / `t(key, locale)`
5. **Images** — `next.config.ts` allows `images.unsplash.com`; extend `remotePatterns` for new hosts
6. **Prisma imports** — `import { PrismaClient } from "@/generated/prisma/client"`
7. **No commits** unless user explicitly asks

---

## Status of integrations

Production (check `/api/health`):
- [x] Resend email OTP + password reset (`RESEND_API_KEY` + `EMAIL_FROM`)
- [x] LINE Login
- [x] Cloudinary uploads
- [x] PromptPay paid packages
- [x] Cloudflare Turnstile CAPTCHA (`NEXT_PUBLIC_TURNSTILE_SITE_KEY` + `TURNSTILE_SECRET_KEY`)
- [x] GA4 analytics (`G-9MRZ57SWS1`; cookie consent opt-in)
- [x] Cookie consent + AdSense opt-in scaffold
- [~] ThaiBulkSMS SMS — wired; sender `CDMNINTH`; user to verify production delivery
- [ ] OpenAI, SlipOK — optional keys not set
- [ ] AdSense — set `NEXT_PUBLIC_ADSENSE_CLIENT` + slot IDs in `/admin/seo` (user)

Done / env-gated:
- [x] Image file upload — Cloudinary or local fallback (`src/lib/storage.ts`)
- [x] OpenAI AI search with rule-based fallback (`src/lib/openai.ts`)
- [x] Agent CRM + viewing scheduler (`/dashboard/agent`, `/admin/leads`)
- [x] Dynamic OG image + admin-editable home SEO
- [x] Full 5-locale i18n (TH/EN/ZH/JA/AR) — public, dashboard, admin
- [x] Native ZH/JA/AR area/blog/static listing content
- [x] Brand logo + favicon; AdSense placement scaffold

**Done (session 31 — Phase L1+L2):**
- [x] Advanced search filters (price, beds, BTS, district)
- [x] Admin CSV listing import (`/admin/import`)
- [x] Save favorites / wishlist (`SavedProperty` + `/dashboard/saved`)
- [x] Leaflet map search (`/map`)
- [x] Mortgage calculator on sale listings + `/tools/mortgage-calculator`
- [x] Search alerts (`SearchAlert` + `/dashboard/alerts`)

**Done (session 32 — Phase L3 partial + header/hero UX):**
- [x] Project pages — `Project` model, `/projects`, `/projects/[slug]`, admin CRUD
- [x] Header overhaul — text-only nav, mobile row-2 strip, contact beside login, no hamburger
- [x] Interactive hero AI showcase on homepage

**Done (session 33 — security, analytics, deploy):**
- [x] Cloudflare Turnstile CAPTCHA — login, register, contact/lead forms
- [x] Runtime site key API (`/api/captcha/config`) for production
- [x] GA4 `G-9MRZ57SWS1` after cookie consent
- [x] Logged-in header: public nav only (dashboard in sub-nav)
- [x] Vercel migrate hardening — direct URL auto-derive, retries, Node 22.x

**Done (session 34 — Phase L3 complete):**
- [x] Price history — `PriceHistory` model, logging, property detail UI, reduced badge
- [x] Search alert cron — `/api/cron/search-alerts` + `vercel.json`
- [x] Agent reviews — `AgentReview`, `/admin/reviews`, stars on `/agents`
- [x] Social login — Google + Facebook OAuth
- [x] NPA hub — `/npa`

**Done (Phase 7 — user listing i18n + URL routing):**
- [x] `UserProperty` locale columns — title/description EN, ZH, JA, AR
- [x] Post/edit + admin forms — optional translations section
- [x] `localizedPropertyTitle/Description` fallback for owner listings
- [x] Migration `20260615000000_user_property_i18n` + EN backfill
- [x] CSV import — `titleEn` + `descriptionEn`
- [x] URL locale routing — `src/middleware.ts`, `src/lib/locale-routing.ts`, hreflang per locale

**Done (session 37 — homepage + admin sponsored):**
- [x] Homepage — recommended / latest / popular sections (`getRecommendedListings`, etc.)
- [x] Label **ประกาศแนะนำ** for sponsored/recommended listings
- [x] Admin `/admin/sponsored` — 7/30 days + custom date (กำหนดเอง)
- [x] Starter inventory CSVs in `public/inventory/`

**Done (session 38 — locale fix + cron deploy):**
- [x] Unprefixed public URLs always Thai; cookie reset; `getLocale()` from middleware header
- [x] `LocalizedLink` + language switcher use URL prefix
- [x] `src/lib/cron-auth.ts` — sanitize `CRON_SECRET`; crons restored in `vercel.json`

**Done (Phase 8 — dashboard i18n + polish):**
- [x] `/dashboard/saved`, `/dashboard/alerts`, `CreateAlertButton`, `AlertsList` — full 5-locale
- [x] `/dashboard/agent` + `AgentLeadTable` — agent CRM i18n
- [x] Admin SEO form — fields no longer reset while typing (`AdminSeoForm` + `LocaleProvider`)

**Next code tasks (Phase 9 — see [`PHASE-9-PLAN.md`](./PHASE-9-PLAN.md)):**
- [ ] Extend `BlogArticle` — `articleType`, `projectId`, `factsJson`, author, gallery, video
- [ ] Review article template — Fact @ box, TOC, listing CTA, “เหมาะกับใคร”
- [ ] Hubs — `/blog/reviews`, `/blog/guides`, homepage “รีวิวล่าสุด”
- [ ] Pilot project review for one BTS starter project

**Next code tasks (Phase 10):**
- [ ] Sort on `/buy` + `/rent` — `?sort=recommended|newest|price_asc|price_desc`
- [ ] Rich `PropertyCard` — ฿/sqm, photo count, listed date
- [ ] Optional: sqm/furnishing filters, map/list toggle, SEO filter landing URLs

**Ops (user):**
- [ ] Verify search-alert + sponsor-reminder crons with `CRON_SECRET`
- [ ] AdSense slot IDs in `/admin/seo`, GSC, ThaiBulkSMS production verify

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

### Add a new filter option to AdvancedFilters
1. Add option to dropdown arrays in `src/components/property/AdvancedFilters.tsx`
2. Update `SearchFilters` type in `src/types/property.ts` if needed
3. Update `applyFilters()` in `src/lib/listings.ts`

### Add a project review article (Phase 9)
1. Extend schema per [`PHASE-9-PLAN.md`](./PHASE-9-PLAN.md) §9A
2. Admin: pick `articleType=project_review`, link `projectId`, fill Fact @ fields
3. Public: `ReviewArticleLayout` renders TOC + Fact sheet + related listings
4. Cross-link `/projects/[slug]`, `/areas/[slug]`, live listing slugs

### Add listing sort (Phase 10)
1. Add `sortListings()` in `src/lib/listings.ts`
2. `ListingSortBar` on buy/rent — persist `?sort=` in URL
3. Enrich `PropertyCard` with sqm price, photo count, `publishedAt`

### Run search alert digests
Cron is configured in `vercel.json` (daily 01:00 UTC, weekly Mon 02:00 UTC). Requires `CRON_SECRET` (single line, no newlines) + Resend on Vercel. Manual trigger:

`GET /api/cron/search-alerts?frequency=daily&secret=YOUR_SECRET`

Logic: `src/lib/search-alert-digest.ts` → `src/app/api/cron/search-alerts/route.ts`

### Deploy to production (current phase)
See **`DEPLOYMENT.md`** for the full runbook. Summary:
1. Confirm Neon tables: `scripts/setup-neon.ps1` or `npm run db:deploy` + `db:seed`
2. `git init` + push to GitHub (if not done)
3. `vercel --prod` with `DATABASE_URL`, `AUTH_SECRET`, `ADMIN_*`
4. Point `condominium.in.th` DNS to Vercel
5. Add provider keys (LINE, Cloudinary, Resend, ThaiBulkSMS, PromptPay)

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
