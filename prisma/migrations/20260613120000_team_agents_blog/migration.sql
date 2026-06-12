CREATE TABLE IF NOT EXISTS "TeamAgent" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "role" TEXT NOT NULL,
  "roleEn" TEXT NOT NULL DEFAULT '',
  "areas" TEXT NOT NULL DEFAULT '[]',
  "languages" TEXT NOT NULL DEFAULT '[]',
  "deals" INTEGER NOT NULL DEFAULT 0,
  "imageUrl" TEXT NOT NULL DEFAULT '',
  "sortOrder" INTEGER NOT NULL DEFAULT 0,
  "published" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "TeamAgent_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "TeamAgent_published_sortOrder_idx" ON "TeamAgent"("published", "sortOrder");

CREATE TABLE IF NOT EXISTS "BlogArticle" (
  "id" TEXT NOT NULL,
  "slug" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "titleEn" TEXT NOT NULL DEFAULT '',
  "excerpt" TEXT NOT NULL,
  "excerptEn" TEXT NOT NULL DEFAULT '',
  "content" TEXT NOT NULL,
  "contentEn" TEXT NOT NULL DEFAULT '',
  "category" TEXT NOT NULL,
  "categoryEn" TEXT NOT NULL DEFAULT '',
  "imageUrl" TEXT NOT NULL DEFAULT '',
  "publishedAt" TIMESTAMP(3) NOT NULL,
  "readTime" INTEGER NOT NULL DEFAULT 5,
  "seoTitle" TEXT NOT NULL,
  "seoTitleEn" TEXT NOT NULL DEFAULT '',
  "seoDescription" TEXT NOT NULL,
  "seoDescriptionEn" TEXT NOT NULL DEFAULT '',
  "status" TEXT NOT NULL DEFAULT 'published',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "BlogArticle_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "BlogArticle_slug_key" ON "BlogArticle"("slug");
CREATE INDEX IF NOT EXISTS "BlogArticle_status_publishedAt_idx" ON "BlogArticle"("status", "publishedAt");
