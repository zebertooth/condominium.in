-- Phase 9: editorial review blog fields
ALTER TABLE "BlogArticle" ADD COLUMN IF NOT EXISTS "articleType" TEXT NOT NULL DEFAULT 'guide';
ALTER TABLE "BlogArticle" ADD COLUMN IF NOT EXISTS "projectId" TEXT;
ALTER TABLE "BlogArticle" ADD COLUMN IF NOT EXISTS "authorName" TEXT NOT NULL DEFAULT '';
ALTER TABLE "BlogArticle" ADD COLUMN IF NOT EXISTS "authorTitle" TEXT NOT NULL DEFAULT '';
ALTER TABLE "BlogArticle" ADD COLUMN IF NOT EXISTS "reviewNumber" INTEGER;
ALTER TABLE "BlogArticle" ADD COLUMN IF NOT EXISTS "factsJson" TEXT NOT NULL DEFAULT '{}';
ALTER TABLE "BlogArticle" ADD COLUMN IF NOT EXISTS "sectionsJson" TEXT NOT NULL DEFAULT '[]';
ALTER TABLE "BlogArticle" ADD COLUMN IF NOT EXISTS "galleryUrls" TEXT NOT NULL DEFAULT '[]';
ALTER TABLE "BlogArticle" ADD COLUMN IF NOT EXISTS "videoUrl" TEXT NOT NULL DEFAULT '';
ALTER TABLE "BlogArticle" ADD COLUMN IF NOT EXISTS "relatedSlugs" TEXT NOT NULL DEFAULT '[]';

CREATE INDEX IF NOT EXISTS "BlogArticle_articleType_status_publishedAt_idx"
  ON "BlogArticle"("articleType", "status", "publishedAt");
CREATE INDEX IF NOT EXISTS "BlogArticle_projectId_idx" ON "BlogArticle"("projectId");

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'BlogArticle_projectId_fkey'
  ) THEN
    ALTER TABLE "BlogArticle"
      ADD CONSTRAINT "BlogArticle_projectId_fkey"
      FOREIGN KEY ("projectId") REFERENCES "Project"("id")
      ON DELETE SET NULL ON UPDATE CASCADE;
  END IF;
END $$;
