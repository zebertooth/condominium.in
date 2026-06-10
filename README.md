# Condominium.in.th

ตลาดคอนโดและบ้าน ซื้อ-เช่า ในกรุงเทพฯ เน้นย่านใกล้ BTS พร้อม AI ค้นหาอัจฉริยะและทีมเอเจนต์พาไปชมทรัพย์จริง

**Production:** [www.condominium.in.th](https://www.condominium.in.th)  
**GitHub:** [github.com/zebertooth/condominium.in](https://github.com/zebertooth/condominium.in)

## Features

- หน้าแรก + ค้นหาทรัพย์ (ซื้อ/เช่า) + AI Search — TH/EN
- Owner dashboard — bilingual (verify LINE+Email, post, PromptPay packages)
- แอดมินอนุมัติประกาศ + analytics + integration status
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

Vercel CI runs `node scripts/vercel-build.mjs` (migrates DB only when `DATABASE_URL` is set).

## Next steps (see ROADMAP.md)

1. Merge PR `session-21-audit-fixes` → `main`
2. Admin panel EN i18n
3. Agent CRM / viewing scheduler

## Documentation

| File | Purpose |
|------|---------|
| [AGENTS.md](./AGENTS.md) | AI handoff |
| [ROADMAP.md](./ROADMAP.md) | Phase status + next step plan |
| [CLAUDE.md](./CLAUDE.md) | Architecture |
| [DEPLOYMENT.md](./DEPLOYMENT.md) | Vercel + env vars |
