-- CreateTable
CREATE TABLE "EmailOtp" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "expiresAt" DATETIME NOT NULL,
    "used" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "phone" TEXT,
    "phoneVerified" BOOLEAN NOT NULL DEFAULT false,
    "email" TEXT,
    "emailVerified" BOOLEAN NOT NULL DEFAULT false,
    "fullName" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'user',
    "idCardHash" TEXT,
    "idVerified" BOOLEAN NOT NULL DEFAULT false,
    "idSubmittedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_User" ("createdAt", "fullName", "id", "idCardHash", "idSubmittedAt", "idVerified", "passwordHash", "phone", "phoneVerified", "updatedAt") SELECT "createdAt", "fullName", "id", "idCardHash", "idSubmittedAt", "idVerified", "passwordHash", "phone", "phoneVerified", "updatedAt" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_phone_key" ON "User"("phone");
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE UNIQUE INDEX "User_idCardHash_key" ON "User"("idCardHash");
CREATE TABLE "new_UserProperty" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "listingType" TEXT NOT NULL,
    "propertyType" TEXT NOT NULL DEFAULT 'condo',
    "price" INTEGER NOT NULL,
    "priceUnit" TEXT NOT NULL,
    "bedrooms" INTEGER NOT NULL,
    "bathrooms" INTEGER NOT NULL,
    "areaSqm" REAL NOT NULL,
    "floor" INTEGER,
    "district" TEXT NOT NULL,
    "btsStation" TEXT,
    "address" TEXT NOT NULL,
    "latitude" REAL,
    "longitude" REAL,
    "features" TEXT NOT NULL DEFAULT '[]',
    "images" TEXT NOT NULL DEFAULT '[]',
    "status" TEXT NOT NULL DEFAULT 'pending',
    "isSponsored" BOOLEAN NOT NULL DEFAULT false,
    "sponsoredUntil" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "UserProperty_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_UserProperty" ("address", "areaSqm", "bathrooms", "bedrooms", "btsStation", "createdAt", "description", "district", "features", "floor", "id", "images", "isSponsored", "listingType", "price", "priceUnit", "propertyType", "slug", "sponsoredUntil", "status", "title", "updatedAt", "userId") SELECT "address", "areaSqm", "bathrooms", "bedrooms", "btsStation", "createdAt", "description", "district", "features", "floor", "id", "images", "isSponsored", "listingType", "price", "priceUnit", "propertyType", "slug", "sponsoredUntil", "status", "title", "updatedAt", "userId" FROM "UserProperty";
DROP TABLE "UserProperty";
ALTER TABLE "new_UserProperty" RENAME TO "UserProperty";
CREATE UNIQUE INDEX "UserProperty_slug_key" ON "UserProperty"("slug");
CREATE INDEX "UserProperty_userId_idx" ON "UserProperty"("userId");
CREATE INDEX "UserProperty_status_idx" ON "UserProperty"("status");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE INDEX "EmailOtp_email_idx" ON "EmailOtp"("email");
