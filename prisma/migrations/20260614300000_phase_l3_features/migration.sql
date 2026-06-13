-- Phase L3: price history, agent reviews, social login fields

CREATE TABLE "PriceHistory" (
    "id" TEXT NOT NULL,
    "propertyId" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "listingType" TEXT NOT NULL,
    "changeType" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PriceHistory_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "PriceHistory_propertyId_idx" ON "PriceHistory"("propertyId");
CREATE INDEX "PriceHistory_createdAt_idx" ON "PriceHistory"("createdAt");

ALTER TABLE "PriceHistory" ADD CONSTRAINT "PriceHistory_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "UserProperty"("id") ON DELETE CASCADE ON UPDATE CASCADE;

CREATE TABLE "AgentReview" (
    "id" TEXT NOT NULL,
    "teamAgentId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "leadId" TEXT,
    "rating" INTEGER NOT NULL,
    "comment" TEXT NOT NULL DEFAULT '',
    "status" TEXT NOT NULL DEFAULT 'pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AgentReview_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "AgentReview_userId_teamAgentId_key" ON "AgentReview"("userId", "teamAgentId");
CREATE INDEX "AgentReview_teamAgentId_status_idx" ON "AgentReview"("teamAgentId", "status");
CREATE INDEX "AgentReview_status_idx" ON "AgentReview"("status");

ALTER TABLE "AgentReview" ADD CONSTRAINT "AgentReview_teamAgentId_fkey" FOREIGN KEY ("teamAgentId") REFERENCES "TeamAgent"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "AgentReview" ADD CONSTRAINT "AgentReview_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "User" ADD COLUMN "googleId" TEXT;
ALTER TABLE "User" ADD COLUMN "facebookId" TEXT;

CREATE UNIQUE INDEX "User_googleId_key" ON "User"("googleId");
CREATE UNIQUE INDEX "User_facebookId_key" ON "User"("facebookId");

ALTER TABLE "TeamAgent" ADD COLUMN "userId" TEXT;

CREATE UNIQUE INDEX "TeamAgent_userId_key" ON "TeamAgent"("userId");
