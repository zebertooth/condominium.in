# AGENTS.md — Condominium.in.th

Instructions for AI coding agents working in this repository.

---

## Start here (every new session / after token restart)

1. Read [`ROADMAP.md`](./ROADMAP.md) — current phase + session log
2. Read [`CLAUDE.md`](./CLAUDE.md) — architecture, APIs, business rules
3. Verify locally: `npm run db:deploy && npm run build && npm run lint`
4. Production check: `GET https://www.condominium.in.th/api/health`
5. Deploy after changes: `npx vercel --prod`

> ## 🤝 HANDOFF (session 21 — **dashboard i18n EN**)
>
> **Production:** https://www.condominium.in.th (Vercel `next-js-oouu`, Node 24)  
> **Done this session:** Full EN/TH for owner **dashboard** — layout, quota, listings, verify, post form, package shop. Uses `useT()` / `useTf()` from `LocaleProvider`.
>
> **Next priorities:**
> 1. EN for **admin** panel + blog/area article bodies
> 2. Optional Vercel keys: OPENAI, SLIPOK, GA4
> 3. **Sponsored posts UI** — do NOT implement until user asks
> 4. Agent CRM: viewing scheduler

---

## Project at a glance

| Item | Value |
|------|-------|
| Production | **https://www.condominium.in.th** |
| Phase | **Phase 2** — prod keys live, paid ON, polish + CRM next |
| Paid | Auto-ON when `PROMPTPAY_ID` on Vercel (`PAID_FEATURES_ENABLED` env-gated) |
| Workspace | `C:\Users\NATTASIT\Projects\condominium` |

**Launch policy:** Thai = LINE + Email to post (2 free). Non-Thai blocked. SMS additive. Owner listings → direct contact; agent listings → platform CRM.

---

## Deploy workflow

```powershell
npm run build
npx vercel --prod
```

Redeploy after any Vercel env var change.

---

## Key paths

```
src/lib/user-properties.ts   getUserPropertyBySlugVisible — owner/admin preview
src/lib/packages.ts          PAID_FEATURES_ENABLED (PROMPTPAY_ID env-gated)
src/lib/integrations.ts      Provider status for /admin + /api/health
src/lib/line.ts              LINE Login (Developing channel = testers only)
src/components/dashboard/VerifyForm.tsx  LINE developing-status help
src/app/property/[slug]/page.tsx       Preview banner for pending listings
```

---

## Test credentials

| Role | Login | Password |
|------|-------|----------|
| Admin | `admin@condominium.in.th` | `admin123456` |

**Property flow:** Register (Thai) → verify LINE (Tester required) + Email → post → **admin approve** → public URL works.

---

## Do NOT (unless user asks)

- Implement sponsored posts UI
- Commit `.env` or create git commits
- Revert to SQLite

---

## Related

- [`ROADMAP.md`](./ROADMAP.md) — phase tracker
- [`CLAUDE.md`](./CLAUDE.md) — technical reference
- [`DEPLOYMENT.md`](./DEPLOYMENT.md) — Vercel + troubleshooting
