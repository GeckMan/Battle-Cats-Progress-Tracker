-- AlterTable
ALTER TABLE "ChatMessage" ADD COLUMN "deletedAt" TIMESTAMP(3);
ALTER TABLE "ChatMessage" ADD COLUMN "deletedBy" TEXT;
