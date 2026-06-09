-- Lead matching fields
ALTER TABLE "Lead" ADD COLUMN IF NOT EXISTS "contactMode" TEXT NOT NULL DEFAULT 'agent_team';
ALTER TABLE "Lead" ADD COLUMN IF NOT EXISTS "ownerUserId" TEXT;
ALTER TABLE "Lead" ADD COLUMN IF NOT EXISTS "posterRole" TEXT;

CREATE INDEX IF NOT EXISTS "Lead_contactMode_idx" ON "Lead"("contactMode");
CREATE INDEX IF NOT EXISTS "Lead_ownerUserId_idx" ON "Lead"("ownerUserId");

-- Analytics & matching events
CREATE TABLE IF NOT EXISTS "SearchEvent" (
    "id" TEXT NOT NULL,
    "query" TEXT NOT NULL,
    "listingType" TEXT,
    "btsStation" TEXT,
    "district" TEXT,
    "propertyType" TEXT,
    "filters" TEXT NOT NULL DEFAULT '{}',
    "resultCount" INTEGER NOT NULL DEFAULT 0,
    "source" TEXT NOT NULL DEFAULT 'ai-search',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "SearchEvent_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "PropertyViewEvent" (
    "id" TEXT NOT NULL,
    "propertySlug" TEXT NOT NULL,
    "propertyType" TEXT,
    "listingType" TEXT,
    "district" TEXT,
    "btsStation" TEXT,
    "source" TEXT NOT NULL DEFAULT 'direct',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "PropertyViewEvent_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "MatchingEvent" (
    "id" TEXT NOT NULL,
    "eventType" TEXT NOT NULL,
    "propertySlug" TEXT,
    "propertyTitle" TEXT,
    "ownerUserId" TEXT,
    "posterRole" TEXT,
    "leadId" TEXT,
    "visitorName" TEXT,
    "visitorPhone" TEXT,
    "visitorEmail" TEXT,
    "metadata" TEXT NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "MatchingEvent_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "SearchEvent_createdAt_idx" ON "SearchEvent"("createdAt");
CREATE INDEX IF NOT EXISTS "SearchEvent_btsStation_idx" ON "SearchEvent"("btsStation");
CREATE INDEX IF NOT EXISTS "SearchEvent_propertyType_idx" ON "SearchEvent"("propertyType");
CREATE INDEX IF NOT EXISTS "SearchEvent_source_idx" ON "SearchEvent"("source");

CREATE INDEX IF NOT EXISTS "PropertyViewEvent_propertySlug_idx" ON "PropertyViewEvent"("propertySlug");
CREATE INDEX IF NOT EXISTS "PropertyViewEvent_createdAt_idx" ON "PropertyViewEvent"("createdAt");
CREATE INDEX IF NOT EXISTS "PropertyViewEvent_district_idx" ON "PropertyViewEvent"("district");
CREATE INDEX IF NOT EXISTS "PropertyViewEvent_propertyType_idx" ON "PropertyViewEvent"("propertyType");

CREATE INDEX IF NOT EXISTS "MatchingEvent_eventType_idx" ON "MatchingEvent"("eventType");
CREATE INDEX IF NOT EXISTS "MatchingEvent_createdAt_idx" ON "MatchingEvent"("createdAt");
CREATE INDEX IF NOT EXISTS "MatchingEvent_propertySlug_idx" ON "MatchingEvent"("propertySlug");
CREATE INDEX IF NOT EXISTS "MatchingEvent_ownerUserId_idx" ON "MatchingEvent"("ownerUserId");
