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
  // The Aku Realms has no new Treasures to collect and no Zombie Outbreak
  // stages, so weighting those in would cap it at 70% forever no matter
  // what — pass false here to make "cleared" the whole score instead.
  hasTreasuresAndZombies?: boolean;
}) {
  const clearedPart = opts.cleared ? 1 : 0;

  if (opts.hasTreasuresAndZombies === false) {
    return clearedPart * 100;
  }

  const t = fractionFromTreasure(opts.treasures);
  const z = fractionFromZombie(opts.zombies);

  // 70/15/15 weighting
  const pct = 100 * (0.7 * clearedPart + 0.15 * t + 0.15 * z);
  return Math.round(pct);
}

export function legendSubchapterPercent(opts: {
  crownMax: number | null;
  maxCrowns?: number | null;
}) {
  const crown = Math.max(0, Math.min(opts.crownMax ?? 0, 4)); // safety clamp
  const maxCrown = Math.max(1, opts.maxCrowns ?? 4); // from DB, default 4

  const pct = (Math.min(crown, maxCrown) / maxCrown) * 100;
  return Math.round(pct);
}
