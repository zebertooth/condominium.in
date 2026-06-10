# Condominium.in.th

ตลาดคอนโดและบ้าน ซื้อ-เช่า ในกรุงเทพฯ เน้นย่านใกล้ BTS พร้อม AI ค้นหาอัจฉริยะและทีมเอเจนต์พาไปชมทรัพย์จริง

**Production:** [www.condominium.in.th](https://www.condominium.in.th)  
**GitHub:** [github.com/zebertooth/condominium.in](https://github.com/zebertooth/condominium.in) (`main`)

## Features

- หน้าแรก + ค้นหาทรัพย์ (ซื้อ/เช่า) + AI Search — **5 ภาษา (TH/EN/ZH/JA/AR)**
- Owner dashboard — verify LINE+Email, post listings, stats, sponsor boost — **5 ภาษา**
- Agent CRM — `/dashboard/agent`, viewing scheduler, lead pipeline
- Admin panel — approve listings, users, leads, payments, analytics — **5 ภาษา**
- Blog (5 articles) + 9 BTS area guides — **TH + EN content** (ZH/JA/AR UI uses EN articles)
- Email OTP (Resend) + LINE Login on production; SMS optional (ThaiBulkSMS wired — user to verify prod next)
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

## Next steps (see ROADMAP.md)

1. ThaiBulkSMS production verify (user)
2. Native ZH/JA/AR blog/area/property content
3. Optional Vercel keys: OPENAI, SLIPOK, GA4

## Documentation

| File | Purpose |
|------|---------|
| [AGENTS.md](./AGENTS.md) | AI agent handoff (start here) |
| [ROADMAP.md](./ROADMAP.md) | Phase status + session log |
| [CLAUDE.md](./CLAUDE.md) | Architecture & API reference |
| [DEPLOYMENT.md](./DEPLOYMENT.md) | Vercel + env vars + troubleshooting |
