-- AlterTable
ALTER TABLE "SearchAlert" ADD COLUMN "lastEngagedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- Default new alerts to weekly backup (instant + publish events are primary)
ALTER TABLE "SearchAlert" ALTER COLUMN "frequency" SET DEFAULT 'weekly';
