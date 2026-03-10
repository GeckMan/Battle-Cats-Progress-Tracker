import type { TreasureStatus, ZombieStatus } from "../generated/prisma/client";



export function fractionFromTreasure(t: TreasureStatus) {
  if (t === "ALL") return 1;
  if (t === "PARTIAL") return 0.5;
  return 0;
}

export function fractionFromZombie(z: ZombieStatus) {
  if (z === "ALL") return 1;
  if (z === "PARTIAL") return 0.5;
  return 0;
}

export function storyChapterPercent(opts: {
  cleared: boolean;
  treasures: TreasureStatus;
  zombies: ZombieStatus;
}) {
  const clearedPart = opts.cleared ? 1 : 0;
  const t = fractionFromTreasure(opts.treasures);
  const z = fractionFromZombie(opts.zombies);

  // 70/15/15 weighting
  const pct = 100 * (0.7 * clearedPart + 0.15 * t + 0.15 * z);
  return Math.round(pct);
}

export function legendSubchapterPercent(opts: {
  sagaName: string;
  subchapterSortOrder: number;
  crownMax: number | null;
}) {
  const crown = Math.max(0, Math.min(opts.crownMax ?? 0, 4)); // safety clamp
  const isZL = opts.sagaName === "Zero Legends";
  const maxCrown = isZL ? (opts.subchapterSortOrder === 1 ? 2 : 1) : 4;

  const pct = (Math.min(crown, maxCrown) / maxCrown) * 100;
  return Math.round(pct);
}
