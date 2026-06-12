-- CreateTable
CREATE TABLE "SiteSettings" (
    "id" TEXT NOT NULL DEFAULT 'default',
    "homeTitle" TEXT NOT NULL,
    "homeDescription" TEXT NOT NULL,
    "homeTitleEn" TEXT NOT NULL DEFAULT '',
    "homeDescriptionEn" TEXT NOT NULL DEFAULT '',
    "keywords" TEXT NOT NULL DEFAULT '',
    "titleSuffix" TEXT NOT NULL DEFAULT '| Condominium.in.th',
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SiteSettings_pkey" PRIMARY KEY ("id")
);

-- Seed default SEO row
INSERT INTO "SiteSettings" (
    "id",
    "homeTitle",
    "homeDescription",
    "homeTitleEn",
    "homeDescriptionEn",
    "keywords",
    "titleSuffix",
    "updatedAt"
) VALUES (
    'default',
    'Condominium.in.th | ซื้อ-เช่าคอนโดใกล้ BTS กรุงเทพฯ',
    'ซื้อ-เช่าคอนโดและบ้านในกรุงเทพฯ ใกล้ BTS ค้นหาด้วย AI ทีมเอเจนต์พาไปชมทรัพย์จริง ลงประกาศฟรี',
    'Condominium.in.th | Buy & Rent Condos Near BTS Bangkok',
    'Bangkok condo & home marketplace near BTS. AI search, agent viewings, free owner listings.',
    'คอนโด,เช่าคอนโด,ซื้อคอนโด,คอนโดใกล้ BTS,condominium bangkok,rent condo bangkok,bts condo',
    '| Condominium.in.th',
    CURRENT_TIMESTAMP
) ON CONFLICT ("id") DO NOTHING;
