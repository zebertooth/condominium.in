# Condominium.in.th

ตลาดคอนโดและบ้าน ซื้อ-เช่า ในกรุงเทพฯ เน้นย่านใกล้ BTS พร้อม AI ค้นหาอัจฉริยะและทีมเอเจนต์พาไปชมทรัพย์จริง

## Features (Phase 1)

- หน้าแรก + ค้นหาทรัพย์ (ซื้อ/เช่า)
- AI Search — บอกความต้องการเป็นภาษาพูด ระบบแนะนำทรัพย์
- หน้าย่านใกล้ BTS (SEO landing pages)
- บทความ SEO
- **ลงประกาศด้วยตัวเอง** — ยืนยันเบอร์โทร + บัตรประชาชน, ลงฟรี 2 รายการ
- **แพ็กเพิ่มประกาศ** — ฿100 = +4 ประกาศ / 30 วัน
- **ประกาศเด่น (สปอนเซอร์)** — ฿50 / 7 วัน
- หน้าทีมเอเจนต์
- Sitemap, robots.txt, JSON-LD structured data

## Tech Stack

- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS 4
- Thai-first (i18n structure ready for ZH, JA, AR)

## Getting Started

```bash
npm install
npm run db:migrate   # สร้าง SQLite database
npm run dev
```

### ทดสอบลงประกาศ

1. ไปที่ `/register` สมัครด้วยเบอร์โทรหรืออีเมล
2. ไปที่ `/dashboard/verify` — ยืนยัน OTP (โหมด dev แสดงรหัสบนหน้าจอ) + บัตรประชาชน
3. ไปที่ `/dashboard/post` — เพิ่มรูปแกลเลอรี + ตำแหน่งแผนที่ แล้วส่งประกาศ
4. แอดมินอนุมัติที่ `/admin/properties` ก่อนเผยแพร่บนเว็บ

### Admin Panel

```bash
npm run db:seed   # สร้างแอดมินเริ่มต้น
```

- URL: `/admin`
- Email: `admin@condominium.in.th`
- Password: `admin123456` (เปลี่ยนใน `.env`)

จัดการผู้ใช้ อนุมัติ/ปฏิเสธประกาศ และยืนยันบัตรประชาชน

Open [http://localhost:3000](http://localhost:3000)

## Deploy

Deploy to Vercel and point domain `condominium.in.th` to the deployment.

Set environment variables when adding real AI (Phase 2):

```
OPENAI_API_KEY=your_key
```

## Roadmap

| Doc | Audience |
|-----|----------|
| **[AGENTS.md](./AGENTS.md)** | AI agents — workflow & guardrails (read first) |
| **[CLAUDE.md](./CLAUDE.md)** | Architecture & technical deep dive |
| **[ROADMAP.md](./ROADMAP.md)** | Timeline, state tracker, priorities |

| Phase | Status |
|-------|--------|
| 1 — Website, SEO, auth, admin, owner listings | Done |
| 2 — Deploy, PostgreSQL, real AI, payments, OTP | Next |
| 3 — Agent CRM, viewing scheduler | Planned |
| 4 — Multilingual (ZH, JA, AR) | Planned |
