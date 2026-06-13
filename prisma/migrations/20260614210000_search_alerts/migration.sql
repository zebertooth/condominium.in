-- CreateTable
CREATE TABLE "SearchAlert" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "listingType" TEXT NOT NULL,
    "filters" TEXT NOT NULL DEFAULT '{}',
    "frequency" TEXT NOT NULL DEFAULT 'daily',
    "active" BOOLEAN NOT NULL DEFAULT true,
    "lastSentAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SearchAlert_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "SearchAlert_userId_idx" ON "SearchAlert"("userId");

-- CreateIndex
CREATE INDEX "SearchAlert_active_frequency_idx" ON "SearchAlert"("active", "frequency");
