# DEPLOYMENT.md — Launching Condominium.in.th

Step-by-step runbook to take the app from local SQLite to a live production deploy.
Read alongside `CLAUDE.md` (architecture) and `ROADMAP.md` (state).

---

## 0. Pre-flight (local)

```bash
npm run build     # must pass
npm run lint      # must be clean
```

Confirm these still work locally before touching production.

---

## 1. ~~Choose a production database~~ ✅ Neon (chosen)

SQLite (`file:./prisma/dev.db`) does not work on Vercel/serverless — the filesystem is ephemeral.

**Decision: Neon** — Serverless Postgres, generous free tier, scales to zero. Best fit for Vercel.

1. Sign up at https://neon.tech
2. Create a project + database
3. Copy the connection string (looks like `postgresql://user:pass@host/db?sslmode=require`)

---

## 2. ~~Switch Prisma to PostgreSQL~~ ✅ Done (session 9)

All code changes have been completed:
- `prisma/schema.prisma` → provider = `"postgresql"`
- `src/lib/db.ts` → `@prisma/adapter-pg` + `pg.Pool`
- `prisma/seed.ts` → `PrismaPg` adapter
- Dependencies: `@prisma/adapter-pg`, `pg` installed

### Remaining: run migrations against Neon
```bash
# Set DATABASE_URL in .env to your Neon connection string first
npx prisma migrate deploy        # applies existing migrations
# or, if migration history needs a reset for the new provider:
# npx prisma migrate dev --name init_postgres
npm run db:seed                  # create the admin user
```

---

## 3. Production environment variables

Set these in Vercel (Project → Settings → Environment Variables). Minimum to boot:

```env
DATABASE_URL=postgresql://...        # from step 1
AUTH_SECRET=<long random string>     # NOT the dev default
NODE_ENV=production
ADMIN_EMAIL=admin@condominium.in.th
ADMIN_PASSWORD=<strong password>
```

Enable features as keys become available (all optional — app degrades gracefully):
```env
OPENAI_API_KEY=                      # LLM AI search (else rule-based)
NEXT_PUBLIC_GA_ID=                   # GA4
RESEND_API_KEY= / EMAIL_FROM=        # real email OTP
THAIBULKSMS_API_KEY= / _API_SECRET= / _SENDER=   # real SMS (TH)
CLOUDINARY_CLOUD_NAME= / _API_KEY= / _API_SECRET=  # cloud image upload
LINE_LOGIN_CHANNEL_ID= / _CHANNEL_SECRET= / _CALLBACK_URL=  # LINE verify
PROMPTPAY_ID=                        # PromptPay phone/citizen ID for QR (enables paid features)
SLIPOK_API_KEY= / SLIPOK_BRANCH_ID=  # automated slip verification (else admin manual)
```

> `LINE_LOGIN_CALLBACK_URL` must be the **production** URL, e.g. `https://condominium.in.th/api/auth/line/callback`, and must be whitelisted in the LINE Developers console.

---

## 4. Deploy to Vercel

```bash
# from the repo root
vercel            # first run links/creates the project
vercel --prod     # production deploy
```
Or connect the GitHub repo in the Vercel dashboard for auto-deploys on push.

Build command is `npm run build` (already runs `prisma generate`). No special output config needed for Next.js.

---

## 5. DNS — point condominium.in.th

1. In Vercel → Project → Domains, add `condominium.in.th` (and `www`).
2. At your domain registrar, add the records Vercel shows (usually an `A` record to Vercel's IP or a `CNAME` to `cname.vercel-dns.com`).
3. Wait for SSL to provision (automatic).

---

## 6. Post-deploy smoke test

- [ ] Home, /buy, /rent, /property/[slug], /ai-search load
- [ ] Register (Thai) → verify LINE + Email → post listing → admin approves → appears public
- [ ] Register (non-Thai) → email verify → posting blocked notice
- [ ] Admin login (`ADMIN_EMAIL`) → approve/reject + bulk + edit listing
- [ ] `/sitemap.xml` and `/robots.txt` resolve
- [ ] Rate limiting: hammering /api/ai-search returns 429 after the limit
- [ ] Submit a lead from /contact → shows in /admin/leads

---

## 7. Known caveats

- **Rate limiter is in-memory** (`src/lib/rate-limit.ts`) → per-instance on serverless. For strict global limits, move to Upstash Redis.
- **Local image uploads** (`public/uploads`) don't persist on Vercel — configure Cloudinary before relying on uploads in prod.
- **Paid features are OFF** (`PAID_FEATURES_ENABLED=false`); wire a payment gateway before flipping.

---

## 8. Rollback

- Vercel keeps previous deployments — promote an earlier one from the dashboard to roll back instantly.
- DB migrations are forward-only; keep a backup/snapshot before `migrate deploy` on production data.
