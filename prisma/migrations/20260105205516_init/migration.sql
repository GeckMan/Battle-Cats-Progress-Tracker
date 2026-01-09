-- CreateEnum
CREATE TYPE "Visibility" AS ENUM ('PUBLIC', 'FRIENDS', 'PRIVATE');

-- CreateEnum
CREATE TYPE "FriendshipStatus" AS ENUM ('PENDING', 'ACCEPTED', 'BLOCKED');

-- CreateEnum
CREATE TYPE "TreasureStatus" AS ENUM ('NONE', 'PARTIAL', 'ALL');

-- CreateEnum
CREATE TYPE "ZombieStatus" AS ENUM ('NONE', 'PARTIAL', 'ALL');

-- CreateEnum
CREATE TYPE "LegendProgressStatus" AS ENUM ('NOT_STARTED', 'IN_PROGRESS', 'COMPLETED');

-- CreateEnum
CREATE TYPE "MilestoneCategory" AS ENUM ('CRAZED', 'MANIC', 'ADVENT', 'CATCLAW', 'OTHER');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT,
    "passwordHash" TEXT NOT NULL,
    "displayName" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PrivacySettings" (
    "userId" TEXT NOT NULL,
    "profileVisibility" "Visibility" NOT NULL DEFAULT 'PUBLIC',
    "progressVisibility" "Visibility" NOT NULL DEFAULT 'FRIENDS',

    CONSTRAINT "PrivacySettings_pkey" PRIMARY KEY ("userId")
);

-- CreateTable
CREATE TABLE "Friendship" (
    "id" TEXT NOT NULL,
    "requesterId" TEXT NOT NULL,
    "addresseeId" TEXT NOT NULL,
    "status" "FriendshipStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Friendship_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StoryChapter" (
    "id" TEXT NOT NULL,
    "arc" TEXT NOT NULL,
    "chapterNumber" INTEGER NOT NULL,
    "displayName" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL,

    CONSTRAINT "StoryChapter_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserStoryProgress" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "storyChapterId" TEXT NOT NULL,
    "cleared" BOOLEAN NOT NULL DEFAULT false,
    "treasures" "TreasureStatus" NOT NULL DEFAULT 'NONE',
    "zombies" "ZombieStatus" NOT NULL DEFAULT 'NONE',
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserStoryProgress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LegendSaga" (
    "id" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL,

    CONSTRAINT "LegendSaga_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LegendSubchapter" (
    "id" TEXT NOT NULL,
    "sagaId" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL,

    CONSTRAINT "LegendSubchapter_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserLegendProgress" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "subchapterId" TEXT NOT NULL,
    "status" "LegendProgressStatus" NOT NULL DEFAULT 'NOT_STARTED',
    "crownMax" INTEGER,
    "notes" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserLegendProgress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Milestone" (
    "id" TEXT NOT NULL,
    "category" "MilestoneCategory" NOT NULL,
    "displayName" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL,

    CONSTRAINT "Milestone_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserMilestoneProgress" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "milestoneId" TEXT NOT NULL,
    "cleared" BOOLEAN NOT NULL DEFAULT false,
    "notes" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserMilestoneProgress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserCatclawProgress" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "currentRank" TEXT,
    "bestRank" TEXT,
    "notes" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserCatclawProgress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MeowMedal" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "requirementText" TEXT,
    "description" TEXT,
    "category" TEXT,
    "sortOrder" INTEGER,
    "sourceUrl" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MeowMedal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserMeowMedal" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "meowMedalId" TEXT NOT NULL,
    "earned" BOOLEAN NOT NULL DEFAULT false,
    "earnedAt" TIMESTAMP(3),
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserMeowMedal_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "Friendship_addresseeId_status_idx" ON "Friendship"("addresseeId", "status");

-- CreateIndex
CREATE INDEX "Friendship_requesterId_status_idx" ON "Friendship"("requesterId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "Friendship_requesterId_addresseeId_key" ON "Friendship"("requesterId", "addresseeId");

-- CreateIndex
CREATE INDEX "StoryChapter_sortOrder_idx" ON "StoryChapter"("sortOrder");

-- CreateIndex
CREATE UNIQUE INDEX "StoryChapter_arc_chapterNumber_key" ON "StoryChapter"("arc", "chapterNumber");

-- CreateIndex
CREATE INDEX "UserStoryProgress_userId_idx" ON "UserStoryProgress"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "UserStoryProgress_userId_storyChapterId_key" ON "UserStoryProgress"("userId", "storyChapterId");

-- CreateIndex
CREATE INDEX "LegendSaga_sortOrder_idx" ON "LegendSaga"("sortOrder");

-- CreateIndex
CREATE INDEX "LegendSubchapter_sagaId_sortOrder_idx" ON "LegendSubchapter"("sagaId", "sortOrder");

-- CreateIndex
CREATE UNIQUE INDEX "LegendSubchapter_sagaId_displayName_key" ON "LegendSubchapter"("sagaId", "displayName");

-- CreateIndex
CREATE INDEX "UserLegendProgress_userId_idx" ON "UserLegendProgress"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "UserLegendProgress_userId_subchapterId_key" ON "UserLegendProgress"("userId", "subchapterId");

-- CreateIndex
CREATE INDEX "Milestone_category_sortOrder_idx" ON "Milestone"("category", "sortOrder");

-- CreateIndex
CREATE INDEX "UserMilestoneProgress_userId_idx" ON "UserMilestoneProgress"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "UserMilestoneProgress_userId_milestoneId_key" ON "UserMilestoneProgress"("userId", "milestoneId");

-- CreateIndex
CREATE UNIQUE INDEX "UserCatclawProgress_userId_key" ON "UserCatclawProgress"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "MeowMedal_name_key" ON "MeowMedal"("name");

-- CreateIndex
CREATE INDEX "UserMeowMedal_userId_idx" ON "UserMeowMedal"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "UserMeowMedal_userId_meowMedalId_key" ON "UserMeowMedal"("userId", "meowMedalId");

-- AddForeignKey
ALTER TABLE "PrivacySettings" ADD CONSTRAINT "PrivacySettings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Friendship" ADD CONSTRAINT "Friendship_requesterId_fkey" FOREIGN KEY ("requesterId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Friendship" ADD CONSTRAINT "Friendship_addresseeId_fkey" FOREIGN KEY ("addresseeId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserStoryProgress" ADD CONSTRAINT "UserStoryProgress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserStoryProgress" ADD CONSTRAINT "UserStoryProgress_storyChapterId_fkey" FOREIGN KEY ("storyChapterId") REFERENCES "StoryChapter"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LegendSubchapter" ADD CONSTRAINT "LegendSubchapter_sagaId_fkey" FOREIGN KEY ("sagaId") REFERENCES "LegendSaga"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserLegendProgress" ADD CONSTRAINT "UserLegendProgress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserLegendProgress" ADD CONSTRAINT "UserLegendProgress_subchapterId_fkey" FOREIGN KEY ("subchapterId") REFERENCES "LegendSubchapter"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserMilestoneProgress" ADD CONSTRAINT "UserMilestoneProgress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserMilestoneProgress" ADD CONSTRAINT "UserMilestoneProgress_milestoneId_fkey" FOREIGN KEY ("milestoneId") REFERENCES "Milestone"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserCatclawProgress" ADD CONSTRAINT "UserCatclawProgress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserMeowMedal" ADD CONSTRAINT "UserMeowMedal_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserMeowMedal" ADD CONSTRAINT "UserMeowMedal_meowMedalId_fkey" FOREIGN KEY ("meowMedalId") REFERENCES "MeowMedal"("id") ON DELETE CASCADE ON UPDATE CASCADE;
