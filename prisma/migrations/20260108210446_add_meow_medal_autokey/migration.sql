/*
  Warnings:

  - A unique constraint covering the columns `[autoKey]` on the table `MeowMedal` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "MeowMedal" ADD COLUMN     "autoKey" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "MeowMedal_autoKey_key" ON "MeowMedal"("autoKey");
