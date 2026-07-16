-- CreateTable
-- Generic key/value store for app-wide facts, starting with the BCData
-- version last synced (see UnitsClient.tsx's "Unit data current to game
-- version..." footer note, previously a hardcoded string that went stale —
-- bug report from bvg_tbc, 2026-07-16).
CREATE TABLE "AppMeta" (
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AppMeta_pkey" PRIMARY KEY ("key")
);
