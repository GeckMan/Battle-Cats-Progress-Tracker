-- CreateEnum
CREATE TYPE "UnitCategory" AS ENUM ('NORMAL', 'SPECIAL', 'RARE', 'SUPER_RARE', 'UBER_RARE', 'LEGEND_RARE');

-- CreateTable
CREATE TABLE "Unit" (
    "id" TEXT NOT NULL,
    "unitNumber" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "category" "UnitCategory" NOT NULL,
    "formCount" INTEGER NOT NULL DEFAULT 3,
    "sortOrder" INTEGER NOT NULL,

    CONSTRAINT "Unit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserUnitProgress" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "unitId" TEXT NOT NULL,
    "formLevel" INTEGER NOT NULL DEFAULT 0,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserUnitProgress_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Unit_unitNumber_key" ON "Unit"("unitNumber");
CREATE INDEX "Unit_category_sortOrder_idx" ON "Unit"("category", "sortOrder");
CREATE UNIQUE INDEX "UserUnitProgress_userId_unitId_key" ON "UserUnitProgress"("userId", "unitId");
CREATE INDEX "UserUnitProgress_userId_idx" ON "UserUnitProgress"("userId");

-- AddForeignKey
ALTER TABLE "UserUnitProgress" ADD CONSTRAINT "UserUnitProgress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "UserUnitProgress" ADD CONSTRAINT "UserUnitProgress_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "Unit"("id") ON DELETE CASCADE ON UPDATE CASCADE;
