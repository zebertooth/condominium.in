-- CreateTable
CREATE TABLE "Project" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "nameEn" TEXT NOT NULL DEFAULT '',
    "developer" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "district" TEXT NOT NULL DEFAULT '',
    "btsStation" TEXT,
    "amenities" TEXT NOT NULL DEFAULT '[]',
    "totalUnits" INTEGER,
    "completionDate" TIMESTAMP(3),
    "imageUrl" TEXT NOT NULL DEFAULT '',
    "description" TEXT NOT NULL DEFAULT '',
    "descriptionEn" TEXT NOT NULL DEFAULT '',
    "published" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Project_slug_key" ON "Project"("slug");

-- CreateIndex
CREATE INDEX "Project_published_idx" ON "Project"("published");

-- CreateIndex
CREATE INDEX "Project_district_idx" ON "Project"("district");

-- AlterTable
ALTER TABLE "UserProperty" ADD COLUMN "projectId" TEXT;

-- CreateIndex
CREATE INDEX "UserProperty_projectId_idx" ON "UserProperty"("projectId");

-- AddForeignKey
ALTER TABLE "UserProperty" ADD CONSTRAINT "UserProperty_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE SET NULL ON UPDATE CASCADE;
