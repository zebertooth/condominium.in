# Condominium.in.th

ตลาดคอนโดและบ้าน ซื้อ-เช่า ในกรุงเทพฯ เน้นย่านใกล้ BTS พร้อม AI ค้นหาอัจฉริยะและทีมเอเจนต์พาไปชมทรัพย์จริง

**Production:** [www.condominium.in.th](https://www.condominium.in.th)  
**GitHub:** [github.com/zebertooth/condominium.in](https://github.com/zebertooth/condominium.in) (`main` → `65dad74`)

## Features

### Core Platform
- หน้าแรก + ค้นหาทรัพย์ (ซื้อ/เช่า) + **7 ประเภททรัพย์** — **5 ภาษา**
- **Unlimited listings** after LINE+Email verify (Thai users)
- **Demo listings** auto-hide when ≥3 real published listings exist

### Search & Discovery
- Sort, rich cards, advanced filters, list/map toggle, SEO BTS hubs
- Favorites, hybrid alerts, **compare** (max 4 at `/compare`)
- Project pages — `/projects`

### Editorial
- TOL-style review blog, newsletter, homepage blog cards
- Admin Markdown CMS at `/admin/blog`

### Monetization (Phase 13A)
- **Sponsor boost only** — 1d ฿29 · 3d ฿79 · 7d ฿159 (PromptPay + SlipOK)
- 4-step checkout wizard on dashboard
- Listing slot packages **disabled**

### Admin
- Listings, users, leads, payments, SEO, agents, ops checklist
- **Sponsored** — `/admin/sponsored` (1/3/7 days + custom)
- **CSV import** — `/admin/import` and `/dashboard/import`

## Local setup

```powershell
npm install
powershell -ExecutionPolicy Bypass -File scripts\setup-neon.ps1
npm run db:deploy
npm run build
npm run dev
```

See [`DEPLOYMENT.md`](./DEPLOYMENT.md) for the **local process checklist** (compare, sponsor, import, etc.).

## Deploy

```powershell
npm run build
npx vercel --prod
```

Health: `GET https://www.condominium.in.th/api/health`

## Current phase — 13B (see ROADMAP.md)

| Priority | Task |
|----------|------|
| **Dev** | Lead nurture emails, owner inquiry alerts, post-inquiry UX |
| **Ops** | Inventory import, editorial cadence, GSC monitor |

## Documentation

| File | Purpose |
|------|---------|
| [AGENTS.md](./AGENTS.md) | AI agent handoff (start here) |
| [ROADMAP.md](./ROADMAP.md) | Phase status + session log |
| [CLAUDE.md](./CLAUDE.md) | Architecture & API reference |
| [DEPLOYMENT.md](./DEPLOYMENT.md) | Deploy + local smoke checklist |
