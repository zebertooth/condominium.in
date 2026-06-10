# DEPLOYMENT.md — Launching Condominium.in.th

Step-by-step runbook to deploy to production.  
Read alongside `CLAUDE.md` (architecture) and `ROADMAP.md` (state).

**Current status (session 20):** Live at **https://www.condominium.in.th**. All Vercel credentials configured by user. Paid features auto-enabled. Property preview + LINE troubleshooting deployed.

---

## 0. Pre-flight (local against Neon)

```powershell
cd C:\Users\NATTASIT\Projects\condominium

# One-shot: clean empty migration dirs, generate, migrate deploy, seed
powershell -ExecutionPolicy Bypass -File scripts\setup-neon.ps1

# Or manually:
npx prisma generate
npm run db:deploy
npm run db:seed

npm run build
npm run lint
npm run dev
```

Open http://localhost:3000 — homepage must load without `table User does not exist`.

### Troubleshooting

| Error | Fix |
|-------|-----|
| `table public.User does not exist` | Run `scripts/setup-neon.ps1` or `npm run db:deploy` + `db:seed` |
| `P3015` missing migration.sql | Delete empty folders under `prisma/migrations/` (no `migration.sql` inside), then `db:deploy` |
| `P1013` invalid database string | `DATABASE_URL` must start with `postgresql://` — check `.env` |
| Provider mismatch sqlite/postgres | Run `npx prisma generate` after any schema provider change |
| Module not found `@/generated/prisma/client` | Run `npx prisma generate` |
| 404 on `/property/[slug]` | Listing `pending` — approve in `/admin/properties`, or login as owner to preview |
| LINE "400 Bad Request / developing status" | Add your LINE ID as **Tester** in [developers.line.biz](https://developers.line.biz) → Channel → Roles |
| LINE callback error | Set `LINE_LOGIN_CALLBACK_URL=https://www.condominium.in.th/api/auth/line/callback` on Vercel |

**Fallback:** `npx prisma db push` then `npm run db:seed` (skips migration history).

---

## 1. Database — Neon ✅ (provisioned)

- **Provider:** [Neon](https://neon.tech) — serverless Postgres, Singapore region
- **Connection string:** in `.env` as `DATABASE_URL`
- **Schema:** `prisma/schema.prisma` → `provider = "postgresql"` (no `url` line — Prisma 7 uses `prisma.config.ts`)
- **Runtime:** `src/lib/db.ts` → `@prisma/adapter-pg` + `pg.Pool`
- **Migration:** `prisma/migrations/20260609150000_init_postgres/migration.sql`

---

## 2. GitHub (if not done)

```powershell
git init
git branch -M main
git add .
git commit -m "Initial commit — Condominium.in.th launch prep"
git remote add origin https://github.com/YOUR_USER/condominium.git
git push -u origin main
```

> `.env` is gitignored — never commit secrets.

---

## 3. Vercel deploy

**After local changes work** (`npm run dev` + `npm run build` pass):

```powershell
cd C:\Users\NATTASIT\Projects\condominium
npm run build
npx vercel --prod
```

This runs `vercel-build` → `prisma migrate deploy` + `next build` on Vercel's servers against your Neon DB.

**First-time setup:**
```bash
npx vercel login
npx vercel link    # link to existing project next-js-oouu
npx vercel --prod
```

**GitHub auto-deploy (optional):** Connect `https://github.com/zebertooth/condominium.in` in Vercel dashboard for deploy-on-push.

**Build:** Vercel runs `vercel-build` automatically:
```json
"vercel-build": "prisma generate && prisma migrate deploy && next build"
```

**Health check after deploy:**
```bash
curl https://www.condominium.in.th/api/health
```
Expect: `status: ok`, `database: connected`, `paidFeatures: true` (if PROMPTPAY_ID set), `integrations` with provider flags.

**Admin panel:** `/admin` → Integration Status shows ✓ for each configured provider.

Copy env template from `.env.example` when setting Vercel variables.

---

## 4. Production environment variables (Vercel)

**Required:**

```env
DATABASE_URL=postgresql://...          # same Neon string (or separate prod branch)
AUTH_SECRET=<long-random-string>     # NOT the dev default
NODE_ENV=production
ADMIN_EMAIL=admin@condominium.in.th
ADMIN_PASSWORD=<strong-password>
```

**Enable when ready (all optional — app degrades gracefully):**

```env
OPENAI_API_KEY=
NEXT_PUBLIC_GA_ID=
RESEND_API_KEY=
EMAIL_FROM=
THAIBULKSMS_API_KEY=
THAIBULKSMS_API_SECRET=
THAIBULKSMS_SENDER=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
LINE_LOGIN_CHANNEL_ID=
LINE_LOGIN_CHANNEL_SECRET=
LINE_LOGIN_CALLBACK_URL=https://www.condominium.in.th/api/auth/line/callback
PROMPTPAY_ID=
SLIPOK_API_KEY=
SLIPOK_BRANCH_ID=
```

After `PROMPTPAY_ID` is set, paid features turn on automatically (`PAID_FEATURES_ENABLED` env-gated in `src/lib/packages.ts`). Set `PAID_FEATURES_ENABLED=false` on Vercel to force-disable.

---

## 5. DNS — point condominium.in.th ✅

DNS configured. Production URLs:
- https://www.condominium.in.th
- https://condominium.in.th (if apex configured)

To add/change domains: Vercel → Project → Domains.

---

## 6. Post-deploy smoke test

- [x] Home, /buy, /rent, /ai-search load
- [ ] Register (Thai) → verify LINE (Tester added in LINE Console) + Email → post
- [ ] Owner preview pending listing (logged in) → admin approves → `/property/[slug]` public
- [ ] Register (non-Thai) → email verify → posting blocked
- [ ] Admin login → approve/reject, bulk, edit listing
- [ ] /admin/leads — lead from /contact appears
- [ ] /sitemap.xml, /robots.txt
- [ ] Image upload works (needs Cloudinary on Vercel)
- [ ] Rate limit: /api/ai-search returns 429 when hammered

---

## 7. Known caveats

- **Rate limiter** is in-memory (`src/lib/rate-limit.ts`) — per-instance on serverless. Use Upstash Redis for strict global limits.
- **Local uploads** (`public/uploads`) don't persist on Vercel — configure Cloudinary.
- **Paid features** auto-ON when `PROMPTPAY_ID` set on Vercel.
- **LINE Developing channel** only allows Testers until channel is Published.
- **Pending listings** return 404 publicly until admin approves; owner can preview when logged in.
- **Rotate Neon password** if connection string was shared in chat.

---

## 8. Rollback

- Vercel: promote previous deployment from dashboard.
- DB: Neon supports point-in-time restore on paid plans; take snapshot before major migrations.
