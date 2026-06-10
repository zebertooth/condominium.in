# Condominium.in.th

ตลาดคอนโดและบ้าน ซื้อ-เช่า ในกรุงเทพฯ เน้นย่านใกล้ BTS พร้อม AI ค้นหาอัจฉริยะและทีมเอเจนต์พาไปชมทรัพย์จริง

**Production:** [www.condominium.in.th](https://www.condominium.in.th)

## Features

- หน้าแรก + ค้นหาทรัพย์ (ซื้อ/เช่า) + AI Search
- หน้าย่านใกล้ BTS (9 areas) + บทความ SEO (5 posts)
- ลงประกาศ — คนไทยยืนยัน LINE + อีเมล, ลงฟรี 2 รายการ
- แอดมินอนุมัติประกาศ → เผยแพร่สาธารณะ
- Owner direct contact + analytics admin + ภาษา TH/EN
- PromptPay แพ็กเกจ (เปิดอัตโนมัติเมื่อตั้ง `PROMPTPAY_ID` บน Vercel)

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

Health: https://www.condominium.in.th/api/health

## Test flows

| Flow | Steps |
|------|--------|
| **Thai user** | Register → `/dashboard/verify` (LINE + Email) → post → admin approve |
| **Pending listing** | Owner logged in → Dashboard → click title = **preview** (not public yet) |
| **Public listing** | Admin approves → `/property/[slug]` works for everyone |
| **LINE verify** | Add your LINE as **Tester** in [developers.line.biz](https://developers.line.biz) if channel is Developing |
| **Admin** | `/admin` — `admin@condominium.in.th` / `admin123456` |

## Troubleshooting

| Problem | Solution |
|---------|----------|
| 404 on `/property/...` | Listing still **pending** — approve in admin, or login as owner to preview |
| LINE "400 developing status" | Add LINE ID as Tester in LINE Developers Console → Roles |
| Paid packages missing locally | Set `PROMPTPAY_ID` in `.env` or test on production |

## Documentation

| File | Purpose |
|------|---------|
| [AGENTS.md](./AGENTS.md) | AI handoff (read first after token restart) |
| [ROADMAP.md](./ROADMAP.md) | Phase status + session log |
| [CLAUDE.md](./CLAUDE.md) | Architecture + API map |
| [DEPLOYMENT.md](./DEPLOYMENT.md) | Vercel runbook + env vars |
