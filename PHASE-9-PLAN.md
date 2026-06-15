# Phase 9–10 Plan — Editorial + Marketplace UX

**Updated:** 2026-06-14 (session 43 — competitive review)  
**Status:** **Phase 9+10 complete** · Phase 11 next · Phase 8 complete · Phase 10 follows Phase 9 core

Read order: [`AGENTS.md`](./AGENTS.md) → [`ROADMAP.md`](./ROADMAP.md) → this file.

---

## Competitive landscape (recheck)

| Competitor | Strength | Weakness vs us | Our response |
|------------|----------|----------------|--------------|
| **[DDproperty](https://www.ddproperty.com/)** | 50k+ listings, filters (price/beds/sqm/furnishing), sort, map toggle, SEO URL hubs | No AI search, no owner-direct, weak expat i18n, agent-heavy | **Phase 10:** sort + rich cards + filters. **Keep:** AI, 5 locales, owner path |
| **[Think of Living](https://thinkofliving.com/)** | 1,000+ project reviews, Fact @ specs, TOC, area roundups, video, architect editorial | No rental marketplace, no live listings funnel | **Phase 9:** review blog platform linked to `/projects` + `/buy`/`/rent` |
| **PropertyHub / Baania** | Listing volume, agent network | Generic nationwide | Stay **Bangkok BTS niche** — depth over breadth |

**Do NOT:** scrape competitor listings or copy TOL articles. Original site visits + owner/agent inventory only.

---

## What we already do better (keep investing)

| Feature | Status | Notes |
|---------|--------|-------|
| AI natural-language search | ✅ | DD/TOL don’t lead with this — hero differentiator |
| 5-locale UI + owner listing i18n | ✅ | Expats (JA/ZH) — TOL is Thai-first |
| Owner direct + LINE verify | ✅ | TOL/DD push agents |
| Price history + “price reduced” badge | ✅ | Not visible on DD cards |
| Search alerts + favorites + map | ✅ | Parity with DD app features |
| Project pages + NPA hub + `/market` | ✅ | Link reviews here in Phase 9 |
| Integrated marketplace | ✅ | **Review → project → live listing → contact** (unique) |

---

## Must-have (before scaling marketing spend)

These are **table stakes** for credibility next to DD + TOL:

| # | Feature | Phase | Why must-have |
|---|---------|-------|---------------|
| 1 | **Project review articles** (Fact box, TOC, author, photos) | **9** | SEO moat + trust; TOL’s core product |
| 2 | **Blog taxonomy** — review / preview / guide / area | **9** | Users must find “รีวิว” vs “คู่มือ” |
| 3 | **Review ↔ project ↔ listings funnel** | **9** | Only we can close review → transaction |
| 4 | **Sort on `/buy` + `/rent`** (price, newest, recommended) | **10** | Expected on every listing site |
| 5 | **Rich listing cards** — ฿/sqm, photo count, listed date | **10** | DD shows these on every card |
| 6 | **Ops verified** — crons, Resend, AdSense slots | **8–9** | Emails + revenue without broken prod |

---

## Should-have (high ROI, after must-have)

| Feature | Phase | Notes |
|---------|-------|-------|
| Map/list toggle on buy/rent (same filters) | 10 | DD’s most-used discovery pattern |
| Min sqm + furnishing filters | 10 | Common Bangkok rent criteria |
| SEO landing URLs (`/rent/bts/asoke`, `/rent/under-25000`) | 10 | DD-style long-tail traffic |
| Rich blog editor (Markdown/TipTap + multi-image) | 9b | Needed for long reviews |
| YouTube embed on review articles | 9b | TOL video series |
| Homepage “รีวิวโครงการล่าสุด” section | 9 | Discovery like TOL condo hub |
| Area roundup articles (link `/areas`) | 9 | “Low rise สุขุมวิท 2026” style |

---

## Nice-to-have (later)

- Blog save / newsletter signup
- Compare listings shortlist (DD app)
- MRT line filters + extended area guides
- Mobile app
- User-submitted reviews (moderated)

---

## Phase 9 — Editorial platform (Think of Living style)

**Goal:** Turn `/blog` into a **property media hub** — guides + **project reviews** — that drives SEO and links to live inventory.

**Positioning:** *“Think of Living depth for Bangkok BTS — with live listings, AI search, and 5 languages.”*

### 9A — Schema + admin (week 1)

Extend `BlogArticle` (migration):

```
articleType     guide | project_review | project_preview | area_review | news
projectId?      → Project (optional FK)
authorName      String
authorTitle?    String
reviewNumber?   Int          // e.g. รีวิวฉบับที่ 1
factsJson       String       // developer, units, ฿/sqm, BTS m, completion…
sectionsJson?   String       // [{ id, title }] for TOC anchors
galleryUrls     String       // JSON array
videoUrl?       String
relatedSlugs?   String       // JSON array of listing slugs
```

Admin (`AdminBlogForm`):

- Article type selector
- Project picker (from `/admin/projects`)
- Fact @ fields (structured form → `factsJson`)
- Multi-image upload (Cloudinary)
- Author name

### 9B — Public review template (week 1–2)

New layout for `articleType === project_review`:

| Block | TOL equivalent |
|-------|----------------|
| Hero + category badge + author + review # | Title area |
| **Fact @** sticky sidebar | Bullet spec box |
| **TOC** jump links | สรุป · ทำเล · โครงการ · ห้องตัวอย่าง |
| Rich body sections | Long-form content |
| **เหมาะกับใคร** callout | Target buyer |
| **Listings in this project** | PropertyGrid from `relatedSlugs` / projectId |
| CTA → AI search, contact agent | Conversion |

Routes:

- `/blog` — hub with featured review hero
- `/blog/reviews` — project reviews only
- `/blog/guides` — how-to articles (existing 5 posts)
- `/blog/project/[slug]` — all articles for one project

### 9C — Content seed (week 2+, editorial)

Publish **1 pilot review** for an existing starter project (e.g. Noble Reform Phayathai):

1. Site visit or desk research from project DB + `/market` averages
2. Fact @ from CSV/project admin data
3. Link 2–3 live listings on site
4. Cross-link `/areas/phayathai`, `/projects/[slug]`

**Target cadence:** 2 project reviews / month + 1 area roundup / month.

### 9D — Rich editor (optional, week 3)

Replace plain textarea with Markdown or TipTap (H2/H3, lists, inline images). Until then: structured sections in admin + `**bold**` body.

---

## Phase 10 — Marketplace UX (DDproperty parity)

**Goal:** Search/listing UX matches buyer expectations on DD — without nationwide inventory.

### 10A — Sort + cards (must-have)

- `?sort=recommended|newest|price_asc|price_desc` on `/buy`, `/rent`
- `filterListings()` + URL persistence
- `PropertyCard`: photo count, `publishedAt` (“listed X days ago”), ฿/sqm

### 10B — Filters + discovery

- Min/max sqm, furnishing (enum on `UserProperty` or features JSON)
- Map toggle on results page (reuse `PropertyListingsMap`, same query params)

### 10C — SEO hubs

Static or dynamic routes for top combos:

- `/rent/bts/[station]`, `/buy/bts/[station]`
- `/rent/under-[price]`, `/buy/2-bedroom`

Link from area pages + blog reviews.

---

## Implementation order (recommended)

```
Week 1–2   Phase 9A+9B  Blog schema, review template, /blog/reviews hub
Week 2     Phase 9C     First pilot project review (content + links)
Week 3     Phase 10A    Sort + rich cards
Week 4     Phase 10B    Sqm/furnishing filters OR map toggle (pick one)
Ongoing    Phase 11     Ops, 2 reviews/month, rich editor, furnishing DB field
```

---

## Phase 11 — Growth & ops (NEXT)

See [`ROADMAP.md`](./ROADMAP.md) Phase 11 section.

| Priority | Task |
|----------|------|
| **Ops** | Verify crons, AdSense slots, GSC sitemap |
| **Editorial** | 2 project reviews/month + area roundups |
| **Product** | Rich blog editor, `furnishing` on UserProperty, compare shortlist |

---

## Success metrics

| Metric | Target (3 months post Phase 9) |
|--------|--------------------------------|
| Published project reviews | ≥ 6 |
| Organic blog sessions | Track in GA4 |
| Click-through review → listing | ≥ 5% of review page views |
| Listing contact from review CTA | Track `source=blog` on leads |

---

## Key files (planned)

```
prisma/schema.prisma                    BlogArticle extensions
src/components/blog/ReviewArticleLayout.tsx
src/components/blog/FactSheet.tsx
src/components/blog/ArticleToc.tsx
src/app/blog/reviews/page.tsx
src/app/blog/guides/page.tsx
src/app/blog/project/[slug]/page.tsx
src/components/admin/AdminBlogForm.tsx  articleType, project, facts, gallery
src/lib/blog-articles.ts                typed helpers
Phase 10:
src/lib/listings.ts                     sortListings()
src/components/property/PropertyCard.tsx
src/components/property/ListingSortBar.tsx
```

---

## Related docs

- [`ROADMAP.md`](./ROADMAP.md) — phase status + session log
- [`AGENTS.md`](./AGENTS.md) — agent handoff
- [`CLAUDE.md`](./CLAUDE.md) — BlogArticle model reference (update after 9A)
