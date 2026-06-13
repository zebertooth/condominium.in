# Condominium.in.th

ตลาดคอนโดและบ้าน ซื้อ-เช่า ในกรุงเทพฯ เน้นย่านใกล้ BTS พร้อม AI ค้นหาอัจฉริยะและทีมเอเจนต์พาไปชมทรัพย์จริง

**Production:** [www.condominium.in.th](https://www.condominium.in.th)  
**GitHub:** [github.com/zebertooth/condominium.in](https://github.com/zebertooth/condominium.in) (`main`)

## Features

### Core Platform
- หน้าแรก + ค้นหาทรัพย์ (ซื้อ/เช่า) + **7 ประเภททรัพย์** (คอนโด, อพาร์ท, บ้าน, ทาวน์เฮ้าส์, ที่ดิน, อาคารพาณิชย์, NPA) + AI Search — **5 ภาษา**
- **Listing highlights** — nearby POI text for smarter AI matching (e.g. schools, malls)
- **Demo listings** auto-hide when ≥3 real published listings exist

### Search & Discovery (Session 31+)
- **Advanced filters** — price range, bedrooms, BTS station, district on buy/rent pages
- **Map search** — Leaflet map at `/map` with property pins + popups
- **Save favorites** — heart icon on property cards + `/dashboard/saved`
- **Search alerts** — subscribe to matching listings + `/dashboard/alerts`
- **Project pages** — `/projects` + detail pages; admin CRUD at `/admin/projects`

### Tools (Session 31+)
- **Mortgage calculator** — down payment, interest rate, loan term on sale listings
- **Standalone calculator** — `/tools/mortgage-calculator`
- **Admin CSV import** — bulk upload listings at `/admin/import`

### Growth (Phase L3 — complete)
- **Price history** — timeline/chart on property detail + “price reduced” badge
- **Search alert emails** — Vercel cron digest (daily/weekly)
- **Agent reviews** — star ratings on `/agents` + admin moderation
- **Social login** — Google + Facebook OAuth on login/register
- **NPA hub** — `/npa` bank-owned listings

### User Experience
- **Header nav** — text-only links; mobile two-row layout; logged-in top nav = public links only
- **Hero AI showcase** — interactive demo on homepage
- **Cloudflare Turnstile CAPTCHA** — login, register, contact/lead forms (spam protection)
- **Floating feedback widget** — site feedback + agent signup (bottom corner)
- **Agents page** — profiles grouped by team / freelance / company; signup form at `#join-agent`
- **Brand logo** — DDproperty-style header + teal building favicon
- Owner dashboard — verify LINE+Email, post listings, stats, sponsor boost — **5 ภาษา**
- Agent CRM — `/dashboard/agent`, viewing scheduler, lead pipeline

### Admin
- Admin panel — approve listings, users, leads, payments, analytics, **SEO + AdSense slots**, **agent applications & profiles by category** — **5 ภาษา**
- **Admin SEO editor** — home title/description/keywords without redeploy
- **Google AdSense** — 9 ad placements; slot IDs editable at `/admin/seo`

### Content & Localization
- Blog (5 articles) + 9 BTS area guides — **native ZH/JA/AR content** (+ TH/EN base)
- Email OTP (Resend) + LINE Login on production; SMS optional (ThaiBulkSMS, sender `CDMNINTH`)
- **Forgot password** — email reset link (all roles; no SMS)
- **Privacy / Terms** + cookie consent (GA4 `G-9MRZ57SWS1` + AdSense opt-in on "Accept all")

### Monetization
- **Sponsored posts** — ฿50 / 7 days, featured badge + sort boost (PromptPay)
- Owner direct contact + security-hardened lead routing

## Local setup

```powershell
npm install
powershell -ExecutionPolicy Bypass -File scripts\setup-neon.ps1
npm run dev
```

## Deploy

```powershell
npm run build
npx vercel --prod
```

Vercel CI runs `node scripts/vercel-build.mjs` (Production-only migrate; auto-derives Neon direct URL; Node 22.x).

Health check: `GET https://www.condominium.in.th/api/health`

## Next steps (see ROADMAP.md)

1. **Phase 7** — per-locale listing title/description in DB + post/edit UI
2. Optional URL locale routing (`/en/buy`)
3. **Ops:** `CRON_SECRET`, Google/Facebook OAuth credentials, Resend DNS

## Documentation

| File | Purpose |
|------|---------|
| [AGENTS.md](./AGENTS.md) | AI agent handoff (start here) |
| [ROADMAP.md](./ROADMAP.md) | Phase status + session log |
| [PHASE-L3-PLAN.md](./PHASE-L3-PLAN.md) | Phase L3 build order + priorities |
| [CLAUDE.md](./CLAUDE.md) | Architecture & API reference |
| [DEPLOYMENT.md](./DEPLOYMENT.md) | Vercel + env vars + troubleshooting |
