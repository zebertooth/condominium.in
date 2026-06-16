-- Phase 13A: one-time email when featured (sponsor) placement ends
ALTER TABLE "UserProperty" ADD COLUMN "sponsorExpiredNoticeAt" TIMESTAMP(3);
