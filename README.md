# Condominium.in.th

ตลาดคอนโดและบ้าน ซื้อ-เช่า ในกรุงเทพฯ เน้นย่านใกล้ BTS พร้อม AI ค้นหาอัจฉริยะและทีมเอเจนต์พาไปชมทรัพย์จริง

**Production:** [www.condominium.in.th](https://www.condominium.in.th)  
**GitHub:** [github.com/zebertooth/condominium.in](https://github.com/zebertooth/condominium.in) (`main`)

## Features

- หน้าแรก + ค้นหาทรัพย์ (ซื้อ/เช่า) + **7 ประเภททรัพย์** (คอนโด, อพาร์ท, บ้าน, ทาวน์เฮ้าส์, ที่ดิน, อาคารพาณิชย์, NPA) + AI Search — **5 ภาษา**
- **Listing highlights** — nearby POI text for smarter AI matching (e.g. schools, malls)
- **Demo listings** auto-hide when ≥3 real published listings exist
- **Floating feedback widget** — site feedback + agent signup (bottom corner)
- **Agents page** — profiles grouped by team / freelance / company; signup form at `#join-agent`
- **Brand logo** — DDproperty-style header + teal building favicon
- Owner dashboard — verify LINE+Email, post listings, stats, sponsor boost — **5 ภาษา**
- Agent CRM — `/dashboard/agent`, viewing scheduler, lead pipeline
- Admin panel — approve listings, users, leads, payments, analytics, **SEO + AdSense slots**, **agent applications & profiles by category** — **5 ภาษา**
- Blog (5 articles) + 9 BTS area guides — **native ZH/JA/AR content** (+ TH/EN base)
- Email OTP (Resend) + LINE Login on production; SMS optional (ThaiBulkSMS, sender `CDMNINTH`)
- **Forgot password** — email reset link (all roles; no SMS)
- **Privacy / Terms** + cookie consent (GA4 + AdSense opt-in on “Accept all”)
- **Google AdSense** — 9 ad placements; slot IDs editable at `/admin/seo`
- **Admin SEO editor** — home title/description/keywords without redeploy
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

Vercel CI runs `node scripts/vercel-build.mjs` (Production-only migrate when `DATABASE_URL` set; Preview skips migrate).

Health check: `GET https://www.condominium.in.th/api/health`

## Next steps (see ROADMAP.md — Phase C)

1. **Admin CSV import** + agent bulk post for real inventory
2. **`/npa` hub** — bank-owned / auction listings
3. Deploy session 30 DB migrations to production
4. **Phase 7:** user listing i18n in DB (title/description per locale)
5. ThaiBulkSMS production verify; AdSense slot IDs (user)

## Documentation

| File | Purpose |
|------|---------|
| [AGENTS.md](./AGENTS.md) | AI agent handoff (start here) |
| [ROADMAP.md](./ROADMAP.md) | Phase status + session log |
| [CLAUDE.md](./CLAUDE.md) | Architecture & API reference |
| [DEPLOYMENT.md](./DEPLOYMENT.md) | Vercel + env vars + troubleshooting |
