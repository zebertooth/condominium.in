# Condominium.in.th

ตลาดคอนโดและบ้าน ซื้อ-เช่า ในกรุงเทพฯ เน้นย่านใกล้ BTS พร้อม AI ค้นหาอัจฉริยะและทีมเอเจนต์พาไปชมทรัพย์จริง

**Production:** [next-js-two-beta.vercel.app](https://next-js-two-beta.vercel.app) · Domain `condominium.in.th` (DNS pending)

## Features

- หน้าแรก + ค้นหาทรัพย์ (ซื้อ/เช่า) + AI Search
- หน้าย่านใกล้ BTS (9 areas) + บทความ SEO (5 posts)
- ลงประกาศด้วยตัวเอง — คนไทยยืนยัน LINE + อีเมล, ลงฟรี 2 รายการ
- แอดมินอนุมัติประกาศ + bulk approve + แก้ไขประกาศ
- Lead CRM — ฟอร์มติดต่อ + inquiry บนหน้าทรัพย์
- Owner direct contact — ประกาศจากเจ้าของติดต่อได้โดยตรง (ไม่ใช่เอเจนต์)
- Analytics admin — `/admin/analytics` + CSV export
- ภาษา TH / EN — สลับได้ที่ header
- PromptPay ชำระแพ็ก (ปิดอยู่จนกว่าจะตั้ง `PROMPTPAY_ID`)
- Sitemap, robots.txt, JSON-LD, dynamic OG images

## Tech Stack

- Next.js 16 (App Router) + TypeScript + Tailwind CSS 4
- PostgreSQL (Neon) + Prisma 7 + `@prisma/adapter-pg`
- JWT auth, Zod validation, Thai-first UI

## Getting Started

### Prerequisites

- Node.js 20+
- Neon PostgreSQL database ([neon.tech](https://neon.tech) — free tier)
- `DATABASE_URL` in `.env` (see `.env` example in `CLAUDE.md`)

### Setup

```powershell
npm install

# Create tables on Neon + seed admin user
powershell -ExecutionPolicy Bypass -File scripts\setup-neon.ps1

npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Admin login

| Field | Value |
|-------|-------|
| URL | `/admin` |
| Email | `admin@condominium.in.th` |
| Password | `admin123456` (change in `.env`) |

### Test flows

**Thai user:** `/register` (คนไทย) → `/dashboard/verify` (LINE dev button + Email OTP) → `/dashboard/post` → `/admin/properties` (approve)

**Non-Thai:** `/register` (Non-Thai) → verify email → posting blocked (by design)

## Commands

| Command | Purpose |
|---------|---------|
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm run lint` | ESLint |
| `npm run db:deploy` | Apply migrations to Neon |
| `npm run db:seed` | Create/update admin user |
| `scripts/setup-neon.ps1` | One-shot Neon setup (Windows) |

## Deploy

See **[DEPLOYMENT.md](./DEPLOYMENT.md)** for Vercel + DNS + production env vars.

## Documentation

| File | Purpose |
|------|---------|
| [AGENTS.md](./AGENTS.md) | AI agent workflow + handoff |
| [CLAUDE.md](./CLAUDE.md) | Architecture, API map, business rules |
| [ROADMAP.md](./ROADMAP.md) | Phase status + what's next |
| [DEPLOYMENT.md](./DEPLOYMENT.md) | Production launch runbook |
