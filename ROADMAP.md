# ROADMAP.md — Timeline & State Tracker

**Project:** Condominium.in.th  
**Last updated:** 2026-06-14 (session 39 — inventory import + sponsor reminders)  
**Current phase:** **Post-Phase-7 ops** — live inventory + cron emails

> ## Build status
> **Production:** https://www.condominium.in.th (Vercel `next-js-oouu`, Node 22).  
> **GitHub:** `main` @ `301cde4` — auto-deploy on push (if Vercel connected).  
> **Local → Vercel:** `npx vercel --prod` after `npm run build` passes locally.  
> **Vercel CI:** `scripts/vercel-build.mjs` — Production-only migrate; Preview skips if no `DATABASE_URL`.

> **LAUNCH POLICY (current):** Paid features ON on production when `PROMPTPAY_ID` is set (auto). Local dev OFF unless `.env` has `PROMPTPAY_ID`. ID verification removed. Thai users verify **LINE + Email** to post (2 free listings). Non-Thai users verify email only and **cannot post** yet. Phone/SMS verification is wired (ThaiBulkSMS) but **additive** (not a posting gate yet).

> Update this file when completing features, changing priorities, or deploying.  
> Mark items: `[x]` done · `[~]` in progress · `[ ]` planned · `[-]` cancelled

---

## Model transfer snapshot (session 38)

| Area | State |
|------|--------|
| **Phase** | Phase 7 **complete** — user listing i18n + URL locale routing |
| **Homepage** | 3 sections: ประกาศแนะนำ / ประกาศล่าสุด / ยอดนิยม |
| **Admin** | `/admin/sponsored` — manage recommended listings (7/30/custom expiry) |
| **Locale** | Unprefixed public URLs = Thai; prefixed `/en/*` … `/ar/*`; cookie synced by middleware |
| **Cron** | `vercel.json` crons restored; `CRON_SECRET` must be single-line (no newlines) |
| **Next** | Verify crons on Vercel; AdSense/Resend ops; dashboard i18n polish |

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
| **Launch** | LINE+Email verify, paid env-gated, Neon DB | **Done** | 2026 Q2 |
| **Deploy** | Vercel + DNS + prod env vars | **Done** (live, DNS done) | 2026 Q2 |
| **Post-launch** | Logout, i18n TH/EN, owner contact, analytics | **Done** | 2026 Q2 |
| **2** | Real provider keys, flip paid, SEO scale, sponsored UI | **Done** (sponsor UI session 25) | 2026 Q3 |
| **3** | Agent CRM, owner portal, scheduling | Started | 2026 Q4 |
| **4** | Multilingual (ZH, JA, AR) | **Done** (UI + RTL + hreflang) | 2027 Q1 |
| **5** | Native ZH/JA/AR content (areas, blog, static listings) | **Done** | 2027 Q1 |
| **6** | Auth recovery, legal, cookie consent | **Done** | 2027 Q1 |
| **6b** | Brand logo, SEO admin, AdSense, favicon | **Done** (session 29) | 2027 Q1 |
| **6c** | Property categories, demo hide, highlights, feedback widget | **Done** (session 30) | 2027 Q1 |
| **6d** | Agent signup + admin sections (team/freelance/company) | **Done** (session 30) | 2027 Q1 |
| **L1** | Advanced filters, CSV import, real listings inventory | **Done** (session 31) | 2027 Q1 |
| **L2** | Favorites, map search, mortgage calculator, search alerts | **Done** (session 31) | 2027 Q1 |
| **L3** | Project pages, price history, agent reviews, social login | **Done** (session 34) | 2027 Q2 |
| **7** | User listing DB i18n + URL locale routing | **Done** (session 36) | 2027 Q2 |

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
- [x] Configure real LINE Login channel keys for production (Vercel env)

### Paid features (env-gated — ON in production)
- [x] `PAID_FEATURES_ENABLED` auto-ON when `PROMPTPAY_ID` set (`src/lib/packages.ts`)
- [x] `purchase` / `sponsor` APIs return 403 when disabled (no PROMPTPAY_ID)
- [x] PackageShop + sponsor visible on prod when paid enabled
- [x] Override: set `PAID_FEATURES_ENABLED=false` on Vercel to force-disable

### SMS (additive — done)
- [x] ThaiBulkSMS provider in `src/lib/notifications.ts` (preferred for TH, Twilio fallback, console dev)
- [x] Phone (SMS) OTP step re-added to verify flow for Thai users (additive)
- [x] `THAIBULKSMS_*` env placeholders
- [x] Phone verify stays additive (not a posting gate) — policy decided
- [x] Add real ThaiBulkSMS keys + approved sender in prod (Vercel env)

---

## Deploy phase (DONE)

- [x] Vercel production deploy (`vercel --prod`, Node 24)
- [x] `vercel-build` runs migrate deploy on build
- [x] Health check `/api/health` (verified on production)
- [x] DNS `condominium.in.th` / `www.condominium.in.th` → Vercel
- [x] Local changes pushed to Vercel (session 18 — `npx vercel --prod`)
- [x] Production env vars on Vercel (all credentials configured by user — session 19)

---

## Post-launch features (DONE — session 15)

### Admin UX
- [x] Logout button in admin header (`LogoutButton` in `admin/layout.tsx`)

### Localization (TH + EN only)
- [x] Language switcher in public header (`LanguageSwitcher`, cookie `condo_locale`)
- [x] `src/lib/i18n.ts` — Thai + English translation tables
- [x] ZH / JA / AR hidden (deferred to Phase 4)
- [x] Full EN coverage — home, buy, rent, blog, areas, contact, dashboard, **admin panel** (session 24)

### Lead matching — owner vs agent
- [x] Non-agent listings (`role !== agent`) → owner direct contact on property page
- [x] `OwnerContactCard` — phone/email with click tracking
- [x] `Lead.contactMode` — `owner_direct` | `agent_team`
- [x] `MatchingEvent` model — logs views, clicks, inquiries
- [x] Notify owner on inquiry via email (via `sendEmail` in `/api/leads`) — session 17
- [x] Owner dashboard: inquiries + views + contact clicks per listing (all-time + 30-day) — session 16 + 25

### Analytics & admin dashboard
- [x] `SearchEvent` — AI search queries logged
- [x] `PropertyViewEvent` — page views logged
- [x] `/admin/analytics` — visual dashboard (bar charts)
- [x] CSV export — searches, views, matching, leads (`/api/admin/analytics/export`)
- [x] Browse/filter search logging — `/api/analytics/search-filter` + `PropertySearch` — session 17
- [ ] Charts over custom date ranges

---

## Sponsored posts & monetization (DONE — session 25)

- [x] `UserProperty.isSponsored` + `sponsoredUntil` — active sponsor via `isActiveSponsor()`
- [x] Owner purchase flow — `/api/packages/sponsor` + PromptPay checkout in `PackageShop`
- [x] Featured badge on `PropertyCard` + property detail page
- [x] Sort boost — featured listings first on `/`, `/buy`, `/rent`
- [x] Homepage featured section (`getFeaturedListings()`)
- [x] Post-submit upsell banner (`/dashboard?posted=1`)
- [x] Owner dashboard — sponsor button, expiry date, block duplicate pending orders
- [x] Analytics — `PropertyViewEvent.source` = `sponsored` for featured listing views
- [ ] Dedicated carousel / sidebar slots (optional polish)
- [x] Renewal reminders for sponsored posts — email 3d + 1d before expiry; cron `/api/cron/sponsor-reminders`

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
- [x] Apply migrations to Neon (`prisma migrate deploy` + `db:seed`)
- [x] Deploy to Vercel
- [x] Point DNS `condominium.in.th`
- [x] Production env vars on Vercel (all credentials configured — session 19)
- [x] File storage for images — `src/lib/storage.ts` (Cloudinary signed upload + local-disk dev fallback), `POST /api/upload`, drag-to-upload UI in `ImageGalleryInput`

### Real verification
- [x] SMS OTP — ThaiBulkSMS (preferred) + Twilio fallback (`src/lib/notifications.ts`)
- [x] Email OTP — Resend with on-screen fallback if delivery fails
- [x] Remove public LINE troubleshooting UI from verify page
- [~] ThaiBulkSMS production delivery verify — **skipped for now** (user request)
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
- [x] `PAID_FEATURES_ENABLED` auto-ON when `PROMPTPAY_ID` set (session 19)
- [x] PROMPTPAY_ID set on Vercel (paid live on prod)
- [ ] SLIPOK keys optional (admin manual slip approval works without)

### AI upgrade
- [x] OpenAI API integration for `/api/ai-search` (env-gated, falls back to rule-based) — `src/lib/openai.ts`, `src/lib/ai-search.ts`
- [ ] Embed property descriptions for semantic search (optional: pgvector)
- [ ] AI-generated listing summaries for owners
- [x] Rate limiting on AI endpoints — `src/lib/rate-limit.ts` (also on /api/leads + OTP senders)

### Real verification (provider layer)
- [x] Provider abstraction `src/lib/notifications.ts` — `sendSms` (Twilio) + `sendEmail` (Resend), console fallback
- [x] OTP modules wired to providers; `devCode` only returned in development
- [x] Real provider keys on Vercel (session 19) — check `/api/health` integrations
- [ ] Optional: ID card photo upload + admin manual review

### SEO & content scale
- [x] More BTS area pages — added พร้อมพงษ์, ชิดลม, อารีย์, สยาม (now 9 areas) + coords/aliases
- [x] More blog articles — added investment guide + rental documents (now 5 posts)
- [x] Dynamic OG image — `src/app/api/og/route.tsx` (replaces missing static `og-image.jpg`)
- [x] Analytics (GA4) scaffold — `src/components/analytics/Analytics.tsx` (env-gated `NEXT_PUBLIC_GA_ID`)
- [ ] CMS or MDX blog pipeline (weekly articles)
- [ ] Google Search Console setup

### UX fixes (session 20–23)
- [x] Owner/admin preview for `pending` listings on `/property/[slug]` (`getUserPropertyBySlugVisible`)
- [x] Preview banner (TH/EN); contact hidden until published
- [x] Removed LINE Developing-channel help box from `/dashboard/verify` (user request)
- [x] OTP email/SMS fallback codes when providers fail (session 23)

### Admin enhancements
- [ ] Admin login separate from public (optional)
- [x] Bulk approve/reject — `POST /api/admin/properties/bulk`, checkboxes + bulk bar in `AdminPropertyTable`
- [x] Listing edit by admin — `PUT /api/admin/properties/[id]`, `/admin/properties/[id]/edit`, reuses `PostPropertyForm` (keeps status)
- [x] Admin panel EN/TH i18n — overview, properties, users, leads, payments, analytics (session 24)
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
- [x] View stats (views, inquiries, contact clicks) per listing — `getOwnerPropertyStats()` + `MyProperties` (session 25)
- [x] Renewal reminders for sponsored posts — email 3d + 1d before expiry; cron `/api/cron/sponsor-reminders`
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

## Phase 4 — Internationalization (DONE — session 26)

**Goal:** Serve expat buyers/renters in Chinese, Japanese, Arabic.

- [x] TH + EN UI via cookie (`condo_locale`) + `src/lib/i18n.ts` (~331 keys × 5 locales)
- [x] ZH / JA / AR enabled in language switcher
- [x] Full UI translations — `zh-overrides.ts`, `ja-overrides.ts`, `ar-overrides.ts`
- [x] RTL layout for Arabic (`dir="rtl"` on `<html>`)
- [x] hreflang tags (`th-TH`, `en-US`, `zh-Hans`, `ja-JP`, `ar-SA`) via `createMetadata()`
- [x] Blog + area guide EN content for non-Thai locales (`usesEnglishContent()`)
- [x] Property cards/detail use `titleEn` for non-Thai locales
- [x] Native ZH/JA/AR area/blog/static listing content — session 27
- [ ] i18n URL routing (`/th`, `/en`, `/zh`, …) — optional future
- [ ] User-submitted property fields per locale in DB

---

## Phase 6 — Auth recovery & legal (DONE — session 28)

**Goal:** Forgot password (email-only, all roles), privacy/terms pages, cookie consent.

- [x] `PasswordResetToken` model + migration
- [x] `POST /api/auth/forgot-password` + `POST /api/auth/reset-password` (rate-limited, no user enumeration)
- [x] `/forgot-password` + `/reset-password?token=…` pages
- [x] Login link “ลืมรหัสผ่าน?” — email reset only (no SMS quota)
- [x] `/privacy` + `/terms` (TH/EN content, cookie section)
- [x] Cookie consent banner — essential vs analytics; GA4 gated on consent
- [x] Footer legal links + register terms notice

---

## Phase 6b — Brand, SEO admin & AdSense (DONE — session 29)

**Goal:** Professional brand identity, editable SEO metadata, monetization via AdSense.

### Brand & favicon
- [x] `SiteLogo` — DDproperty-style: teal building mark + name + tagline (`src/components/brand/SiteLogo.tsx`)
- [x] `public/logo.svg` — mark-only SVG for schema/OG references
- [x] Favicon — `src/app/icon.svg` + `src/app/apple-icon.svg` (Next.js file metadata)
- [x] Metadata icons in `src/lib/seo.ts` aligned with logo mark

### SEO admin
- [x] `SiteSettings` model + migration (`20260612190000_site_settings`)
- [x] Admin page `/admin/seo` + `GET/PATCH /api/admin/site-settings`
- [x] Dynamic root metadata via `getSiteSettings()` + `createRootMetadata()` / `createMetadata()`
- [x] Home title/description (TH + EN), keywords, title suffix editable in admin

### Google AdSense
- [x] `SiteSettings` ad slot ID fields + migration (`20260612210000_adsense_slots`)
- [x] Slot catalog — 9 positions in `src/lib/adsense.ts` (home, buy/rent, property, blog, footer)
- [x] `AdPlacement`, `AdSlot`, `AdSenseScript` components
- [x] Placements wired on home, buy/rent (top + in-feed every 6 cards), property, blog, footer
- [x] Admin SEO form section to paste AdSense unit slot IDs
- [x] AdSense + GA4 load only after cookie “Accept all” (`CookieConsent.tsx`)
- [x] Env: `NEXT_PUBLIC_ADSENSE_CLIENT=ca-pub-…`

### UX polish
- [x] Language switcher — dropdown with flag + locale code (`LanguageSwitcher.tsx`)
- [x] ThaiBulkSMS default sender `CDMNINTH` in env + docs
- [x] Admin dashboard duplicate React key fix (`/admin/users` card `id`)

---

## Phase 6c — Categories, demos & feedback (DONE — session 30)

**Goal:** DDproperty-style listing types, smarter AI search text, hide demos when real inventory exists, capture feedback and agent interest.

### Property categories (Phase A)
- [x] Expand `propertyType`: condo, apartment, house, townhouse, land, commercial, npa
- [x] Fields: `landSqWah`, `npaBank`, `npaReferenceUrl`, `highlights` (nearby POI text for AI)
- [x] Migration `20260614000000_property_categories`
- [x] `src/lib/property-types.ts` + category filter on `/buy` and `/rent`
- [x] Post form type selector + conditional fields
- [x] AI search + listings filter by category

### Demo listing policy (Phase B)
- [x] `isDemo: true` on static listings in `src/lib/properties.ts`
- [x] `src/lib/demo-listings.ts` — hide demos when published user count ≥ 3
- [x] Demo badge/banner, empty-state CTA, health check `demoListings` status

### Feedback & outreach
- [x] `FloatingFeedbackWidget` — bottom-corner feedback + agent signup tabs
- [x] Lead sources: `feedback`, `agent_interest`
- [x] `/agents#join-agent` with `AgentInterestForm`
- [x] Migration `20260614120000_lead_agent_type` — `Lead.agentType`

---

## Phase 6d — Agent categories (DONE — session 30)

**Goal:** Separate team, freelance, and company agents on public `/agents` and admin `/admin/agents`.

- [x] `TeamAgent.agentCategory` — `team` | `freelance` | `company` (migration `20260614140000_team_agent_category`)
- [x] `src/lib/agent-application.ts` — labels, hints, `groupByAgentCategory()`
- [x] Signup form — applicant picks category; stored on `Lead.agentType`
- [x] `/admin/agents` — **ใบสมัครเอเจนต์** (recent `agent_interest` leads) + **โปรไฟล์บนเว็บ** (tabbed by category)
- [x] Public `/agents` — profiles grouped by category sections
- [ ] Link published profiles to real `User` accounts with `role: agent` (Phase 3)

---

## Phase L1 — Production Ready (DONE — session 31)

**Goal:** Essential features for credibility and usability.

### Advanced Search Filters
- [x] `AdvancedFilters` component with BTS, district, price range, bedrooms
- [x] URL-based filtering on `/buy` and `/rent` pages
- [x] Filter analytics logging (`/api/analytics/search-filter`)

### CSV Import
- [x] `src/lib/csv-import.ts` — parser + validator
- [x] Admin CSV import at `/admin/import`
- [x] Sample CSV download + format guide
- [x] Bulk create listings as `published` (admin-owned)

### Real Listings Inventory
- [x] CSV import enables bulk upload of real listings
- [x] Demo hide when ≥3 published user listings (from Phase 6c)

---

## Phase L2 — Competitive Features (DONE — session 31)

**Goal:** Feature parity with DDproperty and competitors.

### Save Favorites / Wishlist
- [x] `SavedProperty` model + migration
- [x] `/api/user/favorites` — toggle save/unsave
- [x] `SaveButton` heart icon component on `PropertyCard`
- [x] `/dashboard/saved` page with saved listings
- [x] Buy/rent pages show save buttons for logged-in users

### Map-Based Search
- [x] `PropertyListingsMap` component with Leaflet
- [x] `/map` page with property pins + popups
- [x] Rent/sale toggle + category + advanced filters
- [x] "View on map" links on buy/rent pages

### Mortgage Calculator
- [x] `MortgageCalculator` component with:
  - Property price input
  - Down payment slider (5-50%)
  - Interest rate input
  - Loan term selector (10-30 years)
  - Monthly payment + breakdown display
- [x] Added to property detail pages (sale listings)
- [x] Standalone page at `/tools/mortgage-calculator`

### Search Alerts
- [x] `SearchAlert` model + migration
- [x] `/api/user/alerts` — CRUD for alerts
- [x] `CreateAlertButton` modal on buy/rent pages
- [x] `/dashboard/alerts` page with alerts management
- [x] Max 10 alerts per user

---

## Phase L3 — Growth Features (COMPLETE)

**Goal:** Differentiation and advanced features.

### Project/Development Pages
- [x] `Project` model — name, developer, location, amenities
- [x] Link `UserProperty` to projects (`projectId`)
- [x] `/projects` listing page + `/projects/[slug]` detail
- [x] Project badge on property cards when linked

### Price History / Trends
- [x] `PriceHistory` model — track listing price changes
- [x] Log on create + owner/admin edit + CSV import
- [x] Price history chart on property detail page
- [x] “Price reduced” badge (30-day window)
- [ ] Area price trend aggregation + `/market` page (Phase 8+)

### Agent Reviews / Ratings
- [x] `AgentReview` model — user ratings with admin moderation
- [x] Review form on `/agents` (logged-in users)
- [x] Star ratings on agent profiles (approved reviews)
- [x] `/admin/reviews` moderation queue
- [ ] Link published `TeamAgent` to real `User` accounts (optional)

### Social Login
- [x] Google OAuth (`/api/auth/google/start|callback`)
- [x] Facebook OAuth (`/api/auth/facebook/start|callback`)
- [x] Account merge by email when possible
- [x] Keep LINE as primary for Thai users

### Search Alert Digests
- [x] `/api/cron/search-alerts` — daily + weekly via `vercel.json`
- [x] Resend email when `RESEND_API_KEY` + `EMAIL_FROM` set
- [ ] User: verify Resend DNS on production

### Security & Analytics (session 33)
- [x] Cloudflare Turnstile CAPTCHA
- [x] GA4 analytics after cookie consent
- [x] Vercel migrate hardening — Node 22.x

### Optional Enhancements
- [x] NPA hub page (`/npa`)
- [ ] Virtual tours / video embeds
- [ ] In-app chat/messaging
- [ ] Mobile app (React Native / Flutter)

**Do NOT:** scrape or copy listings from DDproperty or competitors — use owner posts, agent CRM, or licensed feeds only.

---

## Phase 7 — User listing i18n (DONE)

**Goal:** Owner-submitted listings readable in all 5 locales.

### Database i18n
- [x] Per-locale fields on `UserProperty` — `titleEn/Zh/Ja/Ar`, `descriptionEn/Zh/Ja/Ar`
- [x] Migration + backfill existing listings (EN ← Thai title/description)
- [x] Post/edit form — optional EN/ZH/JA/AR title + description (collapsible section)
- [x] Property detail + cards — localized owner fields with fallback chain (locale → en → th)
- [x] Admin edit form supports same fields
- [x] AI/search haystack includes all locale fields
- [x] CSV import — `titleEn` + `descriptionEn` columns

### SEO / routing
- [x] URL locale routing (`/en/buy`, `/zh/property/…`) — `src/middleware.ts` + `locale-routing.ts`
- [x] hreflang alternates per locale URL; canonical uses active locale path
- [x] Header, footer, language switcher navigate with locale prefix
- [x] Unprefixed public URLs force Thai (session 38) — prevents stale cookie locale on `/buy`, `/market`, etc.
- [x] `LocalizedLink` + language switcher read locale from URL prefix, not cookie alone

### User / ops (not code)
- [ ] ThaiBulkSMS production SMS delivery verify
- [ ] Optional Vercel keys: `OPENAI_API_KEY`, `SLIPOK_*`, `NEXT_PUBLIC_GA_ID`, `NEXT_PUBLIC_ADSENSE_CLIENT`
- [ ] Google Search Console + AdSense approval (user)

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
Enabled paid features with PromptPay ID 0863048177
Added viewingDate and viewingTime optional fields to Lead model
Built Agent CRM Dashboard (/dashboard/agent) with stats, pipeline, viewing agenda
Configured agent-based lead updating API permissions
```

### Next step plan (post-Phase-7)

| Step | Action | Owner | Priority |
|------|--------|-------|----------|
| **1** | **Import starter CSVs** — `/admin/import` on production (`public/inventory/starter-*.csv`) | User/Agent | **High** |
| **2** | **Verify alert cron** — confirm daily/weekly digests after `CRON_SECRET` fix | User | **High** |
| **3** | **JA/ZH i18n gaps** — `navProjects`, `navMap`, `marketTitle`, homepage section keys | Agent | Medium |
| **4** | **Sitemap locale URLs** — optional hreflang polish for `/en/*` variants | Agent | Low |
| **5** | **Resend DNS, AdSense slots, ThaiBulkSMS** — production integration checks | User | Medium |
| **6** | **`/market` area price trends** | Agent | Low |

### Done (2026-06-14, session 34 — Phase L3 complete)
```
Price history:
- PriceHistory model + migration 20260614300000_phase_l3_features
- src/lib/price-history.ts — log on create/edit/import
- PriceHistoryPanel on /property/[slug], priceReduced badge on cards

Search alert digests:
- src/lib/search-alert-digest.ts + /api/cron/search-alerts
- vercel.json crons (daily 01:00 UTC, weekly Mon 02:00 UTC)
- Requires CRON_SECRET + Resend on Vercel

Agent reviews:
- AgentReview model + /api/agent-reviews + /admin/reviews
- Star ratings on /agents, AgentReviewForm for logged-in users

Social login:
- Google + Facebook OAuth (env-gated)
- SocialLoginButtons on /login and /register

NPA hub: /npa page + nav link
```

### Done (2026-06-14, session 33 — CAPTCHA, GA4, deploy)
```
Cloudflare Turnstile CAPTCHA:
- src/lib/captcha.ts — server verify + requireCaptcha()
- TurnstileField + TurnstileScript + /api/captcha/config (runtime site key)
- Wired: login, register, LeadForm, FloatingFeedbackWidget, AgentInterestForm

Google Analytics 4:
- src/lib/ga.ts — G-9MRZ57SWS1 (override NEXT_PUBLIC_GA_ID)
- CookieConsent AnalyticsLoader — loads after "Accept all"

Header polish:
- Logged-in users: top nav = public links only; dashboard links in dashboard sub-nav

Vercel deploy hardening:
- scripts/vercel-build.mjs — auto-derive DIRECT_DATABASE_URL from pooled URL
- Migrate retries (5× backoff); package.json engines Node 22.x

Deployed: commits 88dfc33 → 41c6e0e on main
```

### Done (2026-06-14, session 39 — inventory import + sponsor reminders)
```
Inventory import CLI:
- src/lib/inventory-import.ts — shared listing + project CSV import
- scripts/import-inventory.ts — npm run db:import-inventory [--sponsor=3] [--force]
- Idempotent skip when ≥10 published listings / ≥5 projects

Sponsor renewal emails:
- Migration 20260614220000_sponsor_reminders (sponsorReminder3dAt, sponsorReminder1dAt)
- src/lib/sponsor-renewal-reminders.ts + /api/cron/sponsor-reminders
- vercel.json cron daily 03:00 UTC
- Emails 3 days and 1 day before sponsoredUntil expiry

i18n polish (sessions 39–40):
- JA/ZH/AR nav, market, map, NPA, project, favorites labels
```

### Done (2026-06-14, session 38 — locale fix + cron deploy)
```
Locale routing fix (30254d3):
- Unprefixed public URLs (/buy, /market, /rent, …) always Thai
- Middleware sets LOCALE_HEADER=th + resets locale cookie
- getLocale() reads middleware header only on public pages
- LocalizedLink + LanguageSwitcher use URL prefix, not stale cookie

Vercel deploy unblock (e9e2c8e → 301cde4):
- CRON_SECRET with newline chars blocked all deploys (including locale fix)
- src/lib/cron-auth.ts — readCronSecret() strips control characters
- Crons temporarily removed, then restored after user fixed CRON_SECRET
- vercel.json: daily 01:00 UTC, weekly Mon 02:00 UTC search-alert digests

Verified on production: /buy shows Thai UI after deploy
```

### Done (2026-06-14, session 37 — homepage sections + admin sponsored)
```
Homepage three sections (520485d):
- ประกาศแนะนำ (recommended/sponsored) — getRecommendedListings()
- ประกาศล่าสุด (latest) — getLatestListings()
- ยอดนิยม (popular) — getPopularListings() via PropertyViewEvent stats
- HomeListingsSection component; label renamed from sponsored-only to ประกาศแนะนำ

Admin sponsored management:
- /admin/sponsored + AdminSponsoredPanel
- Presets: 7 days, 30 days; custom date picker (กำหนดเอง)
- PATCH /api/admin/properties/[id] — isSponsored, sponsoredUntil
- src/lib/sponsored.ts — isActiveSponsor() extracted for client components

Inventory samples: public/inventory/starter-*.csv + import UI tabs
AdminHeader responsive polish; listing-images normalization in import path
```

### Done (2026-06-14, session 36 — Phase 7 user listing i18n)
```
UserProperty locale columns — titleEn/Zh/Ja/Ar, descriptionEn/Zh/Ja/Ar
Migration 20260615000000_user_property_i18n + EN backfill from Thai
Post/edit + admin forms — collapsible translations section
localizedPropertyTitle/Description fallback chain (locale → en → th)
CSV import — titleEn + descriptionEn columns
URL locale routing — middleware rewrite for /en/* … /ar/*; hreflang per locale
```

### Done (2026-06-14, session 32 — header/hero UX + nav polish)
```
Header navigation overhaul:
- Interactive hero AI showcase (HeroShowcase + hero-showcase.ts)
- Removed mobile hamburger drawer; row-2 horizontal scroll nav
- Contact button beside login (icon mobile, label sm+)
- Nav links text-only (no pill borders); highlight CTA keeps teal gradient
- Desktop inline centered nav on row 1

Deployed: commit 1d57fa0 (hamburger removal + contact row)
Local: nav text-only styling (HeaderNav + HeaderMobileNav shared navLinkClass)

All MD files updated for session 32 handoff
```

### Done (2026-06-14, session 31 — Launch Feature Roadmap L1+L2)
```
PHASE L1 — Production Ready:
- AdvancedFilters component (BTS, district, price range, bedrooms)
- URL-based filtering on /buy and /rent pages
- Admin CSV import at /admin/import with validation + sample download
- Filter analytics logging

PHASE L2 — Competitive Features:
- SavedProperty model + /api/user/favorites API
- SaveButton heart icon on PropertyCard
- /dashboard/saved page for favorites
- PropertyListingsMap with Leaflet at /map
- Property pins with popups + auto-fit bounds
- "View on map" links on buy/rent pages
- MortgageCalculator widget (down payment, interest, term)
- Calculator on sale property pages + /tools/mortgage-calculator
- SearchAlert model + /api/user/alerts API
- CreateAlertButton modal + /dashboard/alerts page
- Dashboard nav: Saved, Alerts links

Migrations: 20260614200000_saved_properties, 20260614210000_search_alerts
All MD files updated for session 31 handoff
```

### Done (2026-06-10, session 30 — categories, demos, agent sections)
```
Property categories: 7 types + land/NPA fields + highlights for AI search
Demo hide when ≥3 published user listings; demo badge + health check
FloatingFeedbackWidget (feedback + agent tabs); Lead.agentType on signup
/admin/agents: applications section + profile tabs (team / freelance / company)
Public /agents grouped by agentCategory; i18n agentCategory_* keys
Migrations: 20260614000000_property_categories, 20260614120000_lead_agent_type,
  20260614140000_team_agent_category
All MD files updated for session 30 handoff
```

### Done (2026-06-10, session 29 — brand, SEO admin, AdSense, favicon)
```
DD-style SiteLogo + public/logo.svg + app/icon.svg favicon
SiteSettings model — admin /admin/seo for home SEO + keywords
Dynamic metadata via getSiteSettings() + createRootMetadata()
AdSense: 9 slot positions, admin slot IDs, cookie-gated script
Language switcher dropdown (flag + locale code)
ThaiBulkSMS sender CDMNINTH default; admin dashboard key fix
Migrations: 20260612190000_site_settings, 20260612210000_adsense_slots
All MD files updated for session 29 handoff
```

### Done (2026-06-10, session 28 — Phase 6 auth + legal)
```
Email-only forgot/reset password (user, agent, admin) — PasswordResetToken + Resend link
/forgot-password, /reset-password, login forgot link
/privacy, /terms (TH/EN), cookie consent banner, GA4 consent gate
Footer legal links; register terms notice
```

### Done (2026-06-10, session 27 — Phase 5 native content)
```
Native ZH/JA/AR: 9 area guides, 5 blog posts (full content), 9 static listings
src/lib/content/*-locale.ts + resolveLocalized() in locale-content.ts
All MD files updated for session 27 handoff
```

### Done (2026-06-10, session 26 — Phase 4 i18n)
```
Enabled ZH / JA / AR in language switcher + cookie locale API
331 UI keys translated per locale (zh/ja/ar override files)
RTL for Arabic; hreflang on all pages; usesEnglishContent() helper
Property/blog/area pages use EN content fields for non-Thai locales
All MD files updated for session 26 handoff
```

### Done (2026-06-10, session 25 — owner stats + sponsored posts UI)
```
Owner stats: getOwnerPropertyStats() — views, inquiries, contact clicks (all-time + 30d)
MyProperties: stats legend, pending note, sponsored-until badge
Sponsored UI: PropertyCard + detail badges, featured-first sort on buy/rent/home
Post-submit sponsor upsell banner; isActiveSponsor() expiry; duplicate order guard
PropertyViewEvent.source=sponsored for featured listings
All MD files updated for session 25 handoff
```

### Done (2026-06-10, session 24 — admin panel EN i18n)
```
Full EN/TH for admin: overview, properties, users, leads, payments, analytics
Lead status/source labels locale-aware (lead-constants.ts)
Area detail pages show EN highlights
All MD files updated for session 24 handoff (docs refreshed: owner stats marked done, session log fixes)
```

### Done (2026-06-10, session 23 — merge + OTP fixes)
```
Merged day2-website PR + audit fixes + OTP delivery to main
OTP email/SMS: on-screen fallback when Resend/ThaiBulkSMS fails
Removed LINE Developing-channel help box from VerifyForm (user request)
Security audit, Vercel Production-only migrate
Production OTP/LINE verify confirmed OK by user
```

### Done (2026-06-10, session 22 — Vercel CI + audit)
```
Vercel preview fix: scripts/vercel-build.mjs (skip migrate without DATABASE_URL)
Sitemap graceful fallback when DB unavailable at build time
Security audit: register, OTP, leads, payments, admin auth, slug/sitemap fixes
Pushed to GitHub branch session-21-audit-fixes
```

### Done (2026-06-10, session 21 — dashboard i18n)
```
EN/TH for owner dashboard: layout, QuotaCard, MyProperties, VerifyForm,
PackageShop, PostPropertyForm, post/verify/edit pages
Added tf() helper + useTf() hook for interpolated strings
```

### Done (2026-06-10, session 20 — bugfixes + handoff)
```
Property 404 fix: owner/admin preview pending listings on /property/[slug]
Preview banner (TH/EN); contact hidden until published
getUserPropertyBySlugVisible() in user-properties.ts
Deployed to www.condominium.in.th
All MD files updated for token-restart handoff
```

### Done (2026-06-10, session 19 — prod keys + monetization)
```
All Vercel credentials configured by user
PAID_FEATURES_ENABLED auto-enables when PROMPTPAY_ID set
Integration status panel on /admin + /api/health
i18n: blog, areas, contact pages bilingual
Deployed to www.condominium.in.th
```

### Done (2026-06-10, session 18 — Vercel sync)
```
npx vercel --prod — production deployment synced with local codebase
Migrations applied on Vercel build (analytics_matching — no pending)
Health check OK on https://www.condominium.in.th/api/health
All MD files updated for session 18 handoff
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

### Blocked / needs user action (not code)
```
- LINE channel in Developing mode → add LINE ID as Tester in developers.line.biz
- Pending listings 404 for public → admin must approve at /admin/properties
- Optional keys not on Vercel: OPENAI, SLIPOK, GA4 (app works without)
- Phone verify: stay additive (policy); non-Thai posting still blocked
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
| 2026-06-09 | Neon Postgres as sole DB (dev + prod) | User provisioned Neon; SQLite retired after migration churn |
| 2026-06-09 | Prisma 7: `url` only in `prisma.config.ts`, not `schema.prisma` | Required by Prisma 7 config model |
| 2026-06-09 | `scripts/setup-neon.ps1` for one-shot Neon table creation | Fixes empty migration dirs (P3015) + migrate deploy + seed |
| 2026-06-09 | TH/EN only for i18n launch; ZH/JA/AR hidden | User scope; full multilingual deferred |
| 2026-06-09 | Owner direct contact when `poster.role !== agent` | Agent listings use platform CRM; owners contacted directly |
| 2026-06-09 | Analytics in Postgres (not GA4-only) | Admin dashboard + CSV; works without `NEXT_PUBLIC_GA_ID` |
| 2026-06-09 | Sponsored posts UI deferred | Schema only until session 25 |
| 2026-06-10 | Sponsored posts UI built | User requested — badges, sort boost, PromptPay flow |
| 2026-06-10 | SiteSettings in DB for SEO + AdSense slots | Admin-editable without redeploy |
| 2026-06-10 | AdSense/GA4 gated on cookie consent | GDPR-style; essential cookies only until accept |
| 2026-06-10 | Favicon via Next.js `app/icon.svg` | Reliable tab icon; matches brand mark |
| 2026-06-14 | Unprefixed URLs = Thai; cookie reset on public pages | Stale ja/en cookie leaked wrong locale on /buy, /market |
| 2026-06-14 | CRON_SECRET must be single-line on Vercel | Newline in secret blocked deploys (0x0a error) |
| 2026-06-14 | Homepage 3 sections + admin /admin/sponsored | DDproperty-style discovery; admin controls ประกาศแนะนำ |

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
| SEO | `src/lib/seo.ts`, `src/lib/site-settings.ts`, `src/app/admin/seo`, `src/app/sitemap.ts` |
| Brand | `src/components/brand/SiteLogo.tsx`, `public/logo.svg`, `src/app/icon.svg` |
| AdSense | `src/lib/adsense.ts`, `src/components/ads/*`, `SiteSettings` ad slot fields |
| Property types | `src/lib/property-types.ts`, `PropertyCategoryFilter`, post form |
| Demo listings | `src/lib/demo-listings.ts`, `src/lib/properties.ts` (`isDemo`) |
| Agent categories | `src/lib/agent-application.ts`, `/admin/agents`, `/agents` |
| Feedback widget | `src/components/layout/FloatingFeedbackWidget.tsx` |
| Password reset | `src/lib/password-reset.ts`, `/api/auth/forgot-password`, `/api/auth/reset-password` |
| Legal / cookies | `src/lib/content/legal.ts`, `src/components/layout/CookieConsent.tsx` |
| Areas/Blog content | `src/lib/areas.ts`, `src/lib/blog.ts` |
| Single-property map | `src/lib/locations.ts`, `src/components/property/PropertyMap.tsx` |
| Gallery | `src/components/property/PropertyImageGallery.tsx`, `ImageGalleryInput.tsx` |
| **Advanced filters** | `src/components/property/AdvancedFilters.tsx`, buy/rent pages |
| **CSV import** | `src/lib/csv-import.ts`, `/admin/import`, `/api/admin/import` |
| **Favorites** | `src/lib/favorites.ts`, `SaveButton.tsx`, `/api/user/favorites`, `/dashboard/saved` |
| **Map search** | `src/components/property/PropertyListingsMap.tsx`, `/map` |
| **Mortgage calc** | `src/components/property/MortgageCalculator.tsx`, `/tools/mortgage-calculator` |
| **Search alerts** | `src/app/api/user/alerts`, `CreateAlertButton.tsx`, `/dashboard/alerts` |
| **Projects** | `src/lib/projects.ts`, `/projects`, `/admin/projects`, `/api/admin/projects` |
| **Header / hero** | `Header.tsx`, `HeaderNav.tsx`, `HeaderMobileMenu.tsx`, `HeroShowcase.tsx` |
| **CAPTCHA** | `src/lib/captcha.ts`, `TurnstileField.tsx`, `/api/captcha/config` |
| **GA4** | `src/lib/ga.ts`, `CookieConsent.tsx` AnalyticsLoader |
| **Vercel build** | `scripts/vercel-build.mjs`, `prisma.config.ts`, `vercel.json` |
| **Price history** | `src/lib/price-history.ts`, `PriceHistoryPanel.tsx` |
| **Alert cron** | `src/lib/search-alert-digest.ts`, `/api/cron/search-alerts` |
| **Agent reviews** | `src/lib/agent-reviews.ts`, `/api/agent-reviews`, `/admin/reviews` |
| **Social OAuth** | `google-oauth.ts`, `facebook-oauth.ts`, `/api/auth/google/*`, `/api/auth/facebook/*` |
| **NPA hub** | `/npa` |
| **Homepage sections** | `HomeListingsSection.tsx`, `listings.ts` getRecommended/Latest/Popular |
| **Admin sponsored** | `/admin/sponsored`, `AdminSponsoredPanel.tsx`, `sponsored.ts` |
| **Locale middleware** | `middleware.ts`, `locale-routing.ts`, `LocalizedLink.tsx` |
| **Cron auth** | `cron-auth.ts`, `/api/cron/search-alerts` |
| **Phase 7 i18n** | `property-locale-fields.ts`, `locale-content.ts`, migration `20260615000000` |
| DB schema | `prisma/schema.prisma` |

---

*End of ROADMAP — keep this document current for smooth handoffs between models and developers.*
