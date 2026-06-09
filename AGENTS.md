# AGENTS.md — Condominium.in.th

Instructions for AI coding agents (Cursor, Claude, Copilot, etc.) working in this repository.

---

## Start here (every new session)

1. **Read** [`CLAUDE.md`](./CLAUDE.md) — architecture, business rules, API map, conventions
2. **Read** [`ROADMAP.md`](./ROADMAP.md) — what's done, current phase, what to build next (see the **session logs 3–8** + decision log)
3. **Verify** the project runs:
   ```bash
   npm install
   npm run build      # prisma generate + next build (migration already applied by user)
   npm run lint
   npm run dev
   ```
4. **Check** ROADMAP "In progress" — don't duplicate work already started
5. **Update** `ROADMAP.md` when you finish a feature (checkbox + date)

> ## 🤝 HANDOFF (as of session 9)
> Session 9 completed two major features:
>
> **Done & in the codebase:**
> - All items from sessions 1–8 (launch verify, LINE, paid OFF, SMS, owner edit, admin bulk/edit, rate limiting, lead CRM, etc.)
> - **PostgreSQL migration** — schema.prisma `sqlite` → `postgresql`, db.ts adapter `@prisma/adapter-pg` + pg Pool, seed.ts updated. Neon chosen.
> - **PromptPay payment integration** — QR generation (`promptpay-qr`), SlipOK slip verification, purchase/sponsor/confirm/status APIs, admin payment management page, PackageShop UI rewrite with QR + slip upload. `PAID_FEATURES_ENABLED` still `false` — flip once `PROMPTPAY_ID` is set.
>
> **NOT done (next, in priority order):**
> 1. **Production launch** — Provision Neon DB + set `DATABASE_URL` + `prisma migrate deploy` + Vercel deploy + DNS.
> 2. Flip `PAID_FEATURES_ENABLED = true` once `PROMPTPAY_ID` is configured.
> 3. Create real LINE Login channel; set `LINE_LOGIN_*` env vars.
> 4. Add real API keys to prod env (OPENAI / RESEND / THAIBULKSMS / CLOUDINARY / SLIPOK).
> 5. Optional: owner listing view-stats, admin audit log, AI listing summaries, agent dashboard.

---

## Project at a glance

| Item | Value |
|------|-------|
| Name | Condominium.in.th |
| Type | Bangkok condo/house marketplace (buy + rent) |
| Domain | `condominium.in.th` (not deployed) |
| Phase | **Launch prep** — paid OFF, LINE+Email verify (see ROADMAP) |
| Language | Thai-first UI |
| Workspace | `C:\Users\NATTASIT\Projects\condominium` |

> **Launch policy (read first):** Paid features are OFF (`PAID_FEATURES_ENABLED=false`). ID verification is removed. Thai users verify **LINE + Email** to post (2 free); non-Thai users can verify email but **cannot post yet**. Phone/SMS verification is wired (ThaiBulkSMS) but **additive** — not a posting gate. Schema already migrated (`User.isThai/lineVerified/lineUserId` + `Lead` exist).

---

## Documentation map

| File | Purpose | When to read |
|------|---------|--------------|
| **AGENTS.md** (this file) | Agent workflow & guardrails | First |
| **CLAUDE.md** | Deep technical context | Before coding |
| **ROADMAP.md** | Timeline & state tracker | Before choosing tasks |
| **DEPLOYMENT.md** | Production launch runbook | Before deploying |
| **README.md** | Human quick start | Setup only |

Do not duplicate long architecture docs here — keep them in `CLAUDE.md` and link instead.

---

## Agent workflow

### Before making changes

```
1. Understand the request against ROADMAP phase
2. Search codebase — prefer extending existing files in src/lib/
3. Read surrounding code for naming/style match
4. Small, focused diffs — no drive-by refactors
```

### While coding

- **Server components default** — `"use client"` only for forms, galleries, interactive UI
- **Logic in `src/lib/`** — not in page files
- **Auth** — use `getCurrentUser()` / `requireAdmin()` from `src/lib/auth.ts` and `src/lib/admin.ts`
- **Listings** — merge via `src/lib/listings.ts` (static + DB published only)
- **Prisma** — import from `@/generated/prisma/client`; use adapter in `src/lib/db.ts`
- **Thai copy** — user-facing strings in Thai unless doing i18n (Phase 4)

### After making changes

```bash
npm run build          # must pass before done
npm run lint           # if you touched TS/TSX
```

Update `ROADMAP.md`:
- Mark completed items `[x]`
- Update "Last updated" date
- Add decision log entry if architectural choice was made

### Do NOT (unless user asks)

- Create git commits
- Deploy or push to remote
- Add unrelated features outside ROADMAP scope
- Replace SQLite with PostgreSQL without full migration plan
- Add NextAuth — project uses custom JWT sessions
- Use `new PrismaClient()` without adapter
- Expose `devCode` OTP in production builds
- Commit `.env` or secrets

---

## Priority queue (from ROADMAP)

When the user says "continue" without specifics, prefer this order:

1. **Launch:** Deploy to Vercel (Neon DB provisioned) + `condominium.in.th` DNS
2. Flip `PAID_FEATURES_ENABLED = true` once `PROMPTPAY_ID` is set
3. Configure real LINE Login channel keys (`LINE_LOGIN_*`)
4. Add real keys to prod (OPENAI / RESEND / THAIBULKSMS / CLOUDINARY / SLIPOK)
5. Enable listing for non-Thai users (policy decision)
6. More BTS SEO area pages + blog content
7. Agent CRM enhancements (viewing scheduler, agent dashboard)

Already done (env-gated): PostgreSQL (Neon), PromptPay payments (QR + SlipOK), image upload (Cloudinary), OpenAI AI search, email OTP (Resend), SMS OTP (ThaiBulkSMS/Twilio), LINE verify, GA4, lead capture CRM, owner edit-listings.

---

## Key paths (quick navigation)

```
src/app/admin/          Admin panel (approve listings, manage users + leads + payments)
src/app/dashboard/      Owner dashboard (verify, post, quota)
src/app/api/auth/       Register, login, OTP, email/LINE verify
src/app/api/auth/line/  LINE Login OAuth (start, callback, dev-verify)
src/app/api/admin/      Admin APIs (users, properties, leads, payments)
src/app/api/user/       User properties & quota
src/app/api/packages/   Package purchase, sponsor, confirm, status (PromptPay)
src/app/api/leads/      Public lead capture
src/lib/auth.ts         Session & getCurrentUser
src/lib/quota.ts        Role-aware quota (LINE+Email gate, paid flag)
src/lib/line.ts         LINE Login helper (env-gated)
src/lib/packages.ts     Pricing + PAID_FEATURES_ENABLED flag
src/lib/promptpay.ts    PromptPay QR generation + SlipOK verification
src/lib/leads.ts        Lead CRM helpers (+ lead-constants.ts for client)
src/lib/listings.ts     Public listing aggregation
src/lib/ai-search.ts    OpenAI search w/ rule-based fallback
src/lib/db.ts           Prisma singleton (PostgreSQL via @prisma/adapter-pg)
prisma/schema.prisma    Database schema (PostgreSQL)
```

---

## Test credentials

| Role | Login | Password |
|------|-------|----------|
| Admin | `admin@condominium.in.th` | `admin123456` |

Seed admin: `npm run db:seed`

**Thai user flow to test:** `/register` (สัญชาติ: คนไทย) → `/dashboard/verify` (LINE + Email) → `/dashboard/post` → `/admin/properties` (approve)

**Non-Thai flow:** `/register` (Non-Thai) → verify email → posting is blocked (by design)

> Without a LINE channel, use the dev-only "ยืนยัน LINE (โหมดทดสอบ)" button on the verify page.

---

## Environment

Required in `.env`:

```env
DATABASE_URL="postgresql://user:pass@host/db?sslmode=require"
AUTH_SECRET="..."
ADMIN_EMAIL="admin@condominium.in.th"
ADMIN_PASSWORD="admin123456"
```

OTP and payments are **mocked in development** — see `CLAUDE.md` § OTP / payments.

---

## Next.js 16 rules

<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

---

## Handoff checklist (end of session)

When finishing a session for another model:

- [ ] `npm run build` passes
- [ ] `ROADMAP.md` updated (checkboxes, date, in-progress cleared)
- [ ] Non-obvious decisions added to ROADMAP decision log
- [ ] No secrets committed
- [ ] Tell user what was done + what's next (1–3 bullets)

---

## Related

- Full architecture → [`CLAUDE.md`](./CLAUDE.md)
- Phase status & backlog → [`ROADMAP.md`](./ROADMAP.md)
