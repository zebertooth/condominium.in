# AGENTS.md — Condominium.in.th

Instructions for AI coding agents working in this repository.

---

## Start here (every new session / after token restart)

1. Read [`ROADMAP.md`](./ROADMAP.md) — current phase + session log
2. Read [`CLAUDE.md`](./CLAUDE.md) — architecture, APIs, business rules
3. Verify locally: `npm run db:deploy && npm run build && npm run lint`
4. Production check: `GET https://www.condominium.in.th/api/health`
5. Deploy: merge PR → `npx vercel --prod` or Vercel auto-deploy on `main`

> ## 🤝 HANDOFF (session 22 — **audit fixes + Vercel CI**)
>
> **Branch:** `session-21-audit-fixes` on GitHub (2 commits ahead of `main`)  
> **Production:** https://www.condominium.in.th — still on previous `main` deploy until PR merged  
>
> **Done session 21–22:**
> - Dashboard EN/TH i18n, property preview, integration status
> - Security audit fixes (register admin hijack, OTP empty body, owner lead validation, payment gates)
> - Vercel preview build fix: `scripts/vercel-build.mjs` skips migrate when `DATABASE_URL` missing
>
> **Vercel CI note:** Preview deployments need `DATABASE_URL` in Vercel → Settings → Environment Variables → **Preview** (same Neon string as Production) for full DB preview. Without it, build still passes but migrate + sitemap user listings are skipped.
>
> **Next priorities:**
> 1. Merge PR `session-21-audit-fixes` → `main`, deploy prod
> 2. EN for **admin** panel + blog/area article bodies
> 3. Optional keys: OPENAI, SLIPOK, GA4
> 4. Agent CRM: viewing scheduler
> 5. **Sponsored posts UI** — do NOT implement until user asks

---

## Project at a glance

| Item | Value |
|------|-------|
| Production | **https://www.condominium.in.th** |
| GitHub | https://github.com/zebertooth/condominium.in |
| Phase | **Phase 2** — audit done; merge + admin i18n next |
| Paid | Auto-ON when `PROMPTPAY_ID` on Vercel |

**Launch policy:** Thai = LINE + Email to post (2 free). Non-Thai blocked. Owner listings → direct contact.

---

## Deploy workflow

```powershell
npm run build
npx vercel --prod
```

Vercel runs `node scripts/vercel-build.mjs` (migrate only when `DATABASE_URL` is set).

---

## Key paths

```
scripts/vercel-build.mjs     Vercel CI build (conditional migrate)
src/lib/request.ts           Safe empty POST body parsing (OTP routes)
src/lib/user-properties.ts   Preview + safe JSON parse + slug uniqueness
src/app/api/leads/route.ts   Server-validated owner-direct inquiries
```

---

## Test credentials

Admin: `admin@condominium.in.th` / `admin123456` (created via `npm run db:seed` only — never via register)

---

## Do NOT (unless user asks)

- Implement sponsored posts UI
- Commit `.env`
- Auto-promote register users to admin

---

## Related

- [`ROADMAP.md`](./ROADMAP.md) — phase tracker + next step plan
- [`CLAUDE.md`](./CLAUDE.md) — technical reference
- [`DEPLOYMENT.md`](./DEPLOYMENT.md) — Vercel env + troubleshooting
