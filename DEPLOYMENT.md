# DEPLOYMENT.md — Launching Condominium.in.th

Step-by-step runbook to deploy to production.  
Read alongside `CLAUDE.md` (architecture) and `ROADMAP.md` (state).

**Current status (session 15):** Live on Vercel (`next-js-two-beta.vercel.app`). Neon migrated through `analytics_matching`. Custom domain pending.

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

**Option A — GitHub (recommended):** Connect `https://github.com/zebertooth/condominium.in` in Vercel dashboard → Import → set env vars → Deploy.

**Option B — CLI:**
```bash
npx vercel login
npx vercel link
npx vercel --prod
```

**Build:** Vercel runs `vercel-build` automatically:
```json
"vercel-build": "prisma generate && prisma migrate deploy && next build"
```

**Health check after deploy:** `GET /api/health` → `{ "status": "ok", "database": "connected" }`

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
LINE_LOGIN_CALLBACK_URL=https://condominium.in.th/api/auth/line/callback
PROMPTPAY_ID=
SLIPOK_API_KEY=
SLIPOK_BRANCH_ID=
```

After `PROMPTPAY_ID` is set, flip `PAID_FEATURES_ENABLED = true` in `src/lib/packages.ts`.

---

## 5. DNS — point condominium.in.th

1. Vercel → Project → Domains → add `condominium.in.th` and `www`
2. At domain registrar, add DNS records Vercel shows (A or CNAME)
3. Wait for SSL (automatic)

---

## 6. Post-deploy smoke test

- [ ] Home, /buy, /rent, /property/[slug], /ai-search load
- [ ] Register (Thai) → verify LINE + Email → post → admin approves → public
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
- **Paid features OFF** until `PAID_FEATURES_ENABLED=true` and `PROMPTPAY_ID` set.
- **Rotate Neon password** if connection string was shared in chat.

---

## 8. Rollback

- Vercel: promote previous deployment from dashboard.
- DB: Neon supports point-in-time restore on paid plans; take snapshot before major migrations.
