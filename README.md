# Condominium.in.th

ตลาดคอนโดและบ้าน ซื้อ-เช่า ในกรุงเทพฯ เน้นย่านใกล้ BTS พร้อม AI ค้นหาอัจฉริยะและทีมเอเจนต์พาไปชมทรัพย์จริง

**Production:** [www.condominium.in.th](https://www.condominium.in.th)  
**GitHub:** [github.com/zebertooth/condominium.in](https://github.com/zebertooth/condominium.in) (`main`)

## Features

### Core Platform
- หน้าแรก + ค้นหาทรัพย์ (ซื้อ/เช่า) + **7 ประเภททรัพย์** (คอนโด, อพาร์ท, บ้าน, ทาวน์เฮ้าส์, ที่ดิน, อาคารพาณิชย์, NPA) + AI Search — **5 ภาษา**
- **Listing highlights** — nearby POI text for smarter AI matching
- **Demo listings** auto-hide when ≥3 real published listings exist

### Search & Discovery
- **Sort bar** — recommended, newest, price ↑↓ on `/buy` and `/rent`
- **Rich listing cards** — ฿/sqm, photo count, listed date, price-reduced badge
- **Advanced filters** — price, beds, BTS, district, sqm, furnishing
- **List/map toggle** — `?view=map` inline on buy/rent (Leaflet lazy-loaded)
- **SEO hub pages** — `/buy/bts/[station]`, `/rent/bts/[station]`, `/rent/under/[price]`, `/buy/2-bedroom`
- **Map search** — `/map` + inline map view
- **Save favorites** — heart icon + `/dashboard/saved`
- **Hybrid search alerts** — instant + on publish + weekly backup
- **Listing compare** — shortlist up to 4 at `/compare`
- **Project pages** — `/projects` + admin CRUD

### Editorial
- **Review blog** — Fact @, TOC, `/blog/reviews`, project-linked reviews
- **Blog hub** — TOL-style layout; category **บทความเกี่ยวกับบ้าน**; listing carousel
- **Newsletter** — signup on `/blog`, email on publish, unsubscribe flow
- **Homepage blog cards** — featured images on latest reviews/guides
- **Admin CMS** — Markdown editor + review fields at `/admin/blog`

### Tools
- **Mortgage calculator** — sale listings + `/tools/mortgage-calculator`
- **Admin CSV import** — bulk upload at `/admin/import`
- **Price history** — chart on property detail + “price reduced” badge

### Growth (L3 + Phase 11)
- **Agent reviews** — star ratings on `/agents`
- **Social login** — Google + Facebook OAuth
- **NPA hub** — `/npa`

### User Experience
- **Homepage** — ประกาศแนะนำ / ล่าสุด / ยอดนิยม + blog section
- **URL locale routing** — Thai unprefixed; `/en/buy`, etc.
- **Cloudflare Turnstile** — login, register, contact forms
- Owner dashboard + agent CRM — **5 ภาษา**

### Admin
- Approve listings, users, leads, payments, analytics, SEO + AdSense slots, agents
- **Ops checklist** — `/admin/ops` (cron, Resend, GSC, newsletter)
- **Sponsored** — `/admin/sponsored`

### Monetization
- **Sponsored posts** — PromptPay ฿50 / 7 days (env-gated)
- **Google AdSense** — script in `<head>`; units after cookie consent

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

Health check: `GET https://www.condominium.in.th/api/health`

## Phase 12 — what’s next (see ROADMAP.md)

Platform development (phases 1–11) is **complete**. Current focus:

| Priority | Task |
|----------|------|
| **Ops** | Fill all 9 AdSense slot IDs in `/admin/seo`; monitor GSC + crons |
| **Inventory** | Import CSV or grow owner posts (target ≥20 live listings) |
| **Editorial** | ~2 project reviews/month + 1 area roundup/month |
| **Optional** | OpenAI search key, PromptPay on prod, agent CRM scheduling |

**Timeline:** Jun–Dec 2026 — see [`ROADMAP.md`](./ROADMAP.md) § Phase 12.

## Documentation

| File | Purpose |
|------|---------|
| [AGENTS.md](./AGENTS.md) | AI agent handoff (start here) |
| [ROADMAP.md](./ROADMAP.md) | Phase status, Phase 12 timeline, session log |
| [CLAUDE.md](./CLAUDE.md) | Architecture & API reference |
| [DEPLOYMENT.md](./DEPLOYMENT.md) | Vercel + env vars + troubleshooting |
