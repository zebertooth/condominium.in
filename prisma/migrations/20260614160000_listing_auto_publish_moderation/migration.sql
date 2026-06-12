-- Auto-publish listings; admin review queue instead of pending gate
ALTER TABLE "UserProperty" ADD COLUMN "needsReview" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "UserProperty" ADD COLUMN "moderationFlags" TEXT NOT NULL DEFAULT '[]';

-- Legacy pending listings: publish and flag for admin recheck
UPDATE "UserProperty"
SET "status" = 'published',
    "needsReview" = true,
    "moderationFlags" = '["legacy_pending"]'
WHERE "status" = 'pending';

CREATE INDEX "UserProperty_needsReview_status_idx" ON "UserProperty"("needsReview", "status");
