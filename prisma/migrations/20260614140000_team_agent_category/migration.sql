-- AlterTable
ALTER TABLE "TeamAgent" ADD COLUMN "agentCategory" TEXT NOT NULL DEFAULT 'team';

CREATE INDEX "TeamAgent_agentCategory_published_sortOrder_idx" ON "TeamAgent"("agentCategory", "published", "sortOrder");
