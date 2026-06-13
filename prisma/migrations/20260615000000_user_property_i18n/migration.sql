-- Phase 7: per-locale owner listing title + description

ALTER TABLE "UserProperty" ADD COLUMN "titleEn" TEXT NOT NULL DEFAULT '';
ALTER TABLE "UserProperty" ADD COLUMN "descriptionEn" TEXT NOT NULL DEFAULT '';
ALTER TABLE "UserProperty" ADD COLUMN "titleZh" TEXT NOT NULL DEFAULT '';
ALTER TABLE "UserProperty" ADD COLUMN "descriptionZh" TEXT NOT NULL DEFAULT '';
ALTER TABLE "UserProperty" ADD COLUMN "titleJa" TEXT NOT NULL DEFAULT '';
ALTER TABLE "UserProperty" ADD COLUMN "descriptionJa" TEXT NOT NULL DEFAULT '';
ALTER TABLE "UserProperty" ADD COLUMN "titleAr" TEXT NOT NULL DEFAULT '';
ALTER TABLE "UserProperty" ADD COLUMN "descriptionAr" TEXT NOT NULL DEFAULT '';

-- Backfill EN from Thai base (existing listings)
UPDATE "UserProperty"
SET "titleEn" = "title", "descriptionEn" = "description"
WHERE "titleEn" = '' AND "descriptionEn" = '';
