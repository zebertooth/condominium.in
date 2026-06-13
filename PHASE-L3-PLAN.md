# Phase L3 — Growth Features Plan

**Created:** 2026-06-14 (session 31)  
**Prerequisites:** Phase L1+L2 complete, session 31 migrations deployed

---

## Overview

Phase L3 focuses on differentiation and growth features that position Condominium.in.th ahead of competitors like DDproperty and PropertyHub.

---

## Must-Have Features

### 1. Project/Development Pages
**Goal:** Group listings by condo project (e.g., "The Line Sukhumvit 101", "Noble Ploenchit")

**Database:**
- `Project` model: name, developer, location, amenities, totalUnits, completionDate
- Add `projectId` to `UserProperty`
- Migration for new model + foreign key

**Frontend:**
- `/projects` — listing of all projects (filter by area/developer)
- `/projects/[slug]` — project detail with units for sale/rent
- Project badge on `PropertyCard` when part of a project

**Admin:**
- `/admin/projects` — CRUD for projects
- Project picker in post/edit listing form

**Priority:** HIGH (major competitor feature)

### 2. Price History Logging
**Goal:** Track listing price changes over time for transparency

**Database:**
- `PriceHistory` model: propertyId, price, date, changeType
- Trigger on `UserProperty` update to log changes

**Frontend:**
- Price history chart on property detail page
- "Price reduced" badge when recent drop
- Optional: `/trends` or `/market` page with area aggregates

**Priority:** HIGH (builds trust)

---

## Should-Have Features

### 3. Agent Reviews / Ratings
**Goal:** Allow buyers to rate agents after transactions

**Database:**
- `AgentReview` model: agentId, userId, rating (1-5), comment, status
- Link `TeamAgent` to real `User` accounts

**Frontend:**
- Review form after lead status = "closed"
- Agent profile page with star rating display
- Review moderation in admin

**Priority:** MEDIUM (requires completed transactions)

### 4. Social Login
**Goal:** Reduce friction for user registration

**Implementation:**
- Google OAuth (NextAuth or custom)
- Facebook OAuth
- Keep LINE Login as primary for Thai users
- Link social accounts to existing email accounts

**Priority:** MEDIUM (UX improvement)

---

## Nice-to-Have Features

### 5. NPA Hub Page
**Goal:** Dedicated page for bank-owned / auction properties

**Frontend:**
- `/npa` — filter `propertyType=npa`
- Bank badges, reference links
- SEO landing copy

**Priority:** LOW (requires NPA inventory first)

### 6. Virtual Tours / Video
**Goal:** Embed video tours for premium listings

**Implementation:**
- `UserProperty.videoUrl` field
- YouTube/Vimeo embed on detail page
- Optional: 360° viewer integration

**Priority:** LOW (nice-to-have)

### 7. In-App Messaging
**Goal:** Real-time chat between buyers and owners/agents

**Implementation:**
- Message model (sender, receiver, listing, content)
- WebSocket or polling for real-time
- Push notifications

**Priority:** LOW (complex, requires infrastructure)

---

## Implementation Order

| Step | Feature | Est. Effort | Priority |
|------|---------|-------------|----------|
| 1 | Deploy session 31 + smoke test | 1h | CRITICAL |
| 2 | Configure Resend email (DNS + env) | 2h | HIGH |
| 3 | Project/Development model + admin CRUD | 4h | HIGH |
| 4 | Project pages (`/projects`, `/projects/[slug]`) | 4h | HIGH |
| 5 | Link listings to projects (UI) | 2h | HIGH |
| 6 | PriceHistory model + logging | 2h | HIGH |
| 7 | Price chart on property detail | 3h | HIGH |
| 8 | Agent reviews model + admin | 3h | MEDIUM |
| 9 | Agent profile pages | 2h | MEDIUM |
| 10 | Social login (Google) | 4h | MEDIUM |
| 11 | Social login (Facebook) | 2h | MEDIUM |
| 12 | NPA hub page | 2h | LOW |

---

## Database Schema Preview

```prisma
model Project {
  id            String   @id @default(cuid())
  name          String
  nameEn        String?
  slug          String   @unique
  developer     String
  location      String
  district      String?
  btsStation    String?
  amenities     String?  // JSON array
  totalUnits    Int?
  completionDate DateTime?
  imageUrl      String?
  description   String?
  descriptionEn String?
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
  properties    UserProperty[]
}

model PriceHistory {
  id          String   @id @default(cuid())
  propertyId  String
  price       Float
  changeType  String   // "initial", "reduced", "increased"
  createdAt   DateTime @default(now())
  property    UserProperty @relation(fields: [propertyId], references: [id])
  @@index([propertyId])
}

model AgentReview {
  id        String   @id @default(cuid())
  agentId   String   // TeamAgent.id or User.id
  userId    String
  rating    Int      // 1-5
  comment   String?
  status    String   @default("pending") // pending, approved, rejected
  createdAt DateTime @default(now())
  @@index([agentId])
}
```

---

## Success Metrics

- Projects: ≥10 active projects with ≥3 listings each
- Price History: 50% of listings have price changes logged
- Reviews: ≥20 agent reviews
- Social Login: 30% of new registrations via Google/Facebook

---

## Dependencies

- **Resend email:** Required for search alerts (must configure first)
- **Agent accounts:** Agent reviews require linking TeamAgent → User
- **Real inventory:** Projects need real developer listings to be meaningful

---

*This plan supersedes Phase C. Phase 7 (user listing i18n) moves to after L3.*
