/**
 * Shared autoKey parsers for the Meow Medal <-> Legend/Story auto-sync
 * system. Originally lived only in src/app/api/meow-medals/sync/route.ts
 * (the one-way Legend/Story -> Medal sync); extracted here so the reverse
 * direction (src/app/api/meow-medals/sync-reverse/route.ts, added
 * 2026-07-20 per Setredid's Discord suggestion) can reuse the exact same
 * key format instead of re-implementing it and risking the two directions
 * silently drifting apart.
 *
 * Key formats:
 *   story.treasures.<arc>.<chapterNumber>
 *   story.zombies.<arc>.<chapterNumber>
 *   legend.subchapter.<subchapterId>.clear
 *   legend.subchapter.<subchapterId>.crown.<N>
 *   legend.saga.<SOL|UL|ZL>.crown.<N>
 */

export function parseStoryAutoKey(key: string) {
  const parts = key.split(".");
  if (parts.length !== 4) return null;

  const [scope, kind, arc, chStr] = parts;
  if (scope !== "story") return null;
  if (kind !== "treasures" && kind !== "zombies") return null;

  const chapterNumber = Number(chStr);
  if (!Number.isFinite(chapterNumber)) return null;

  return { kind, arc, chapterNumber };
}

export function parseLegendAutoKey(key: string) {
  const parts = key.split(".");
  if (parts.length < 4) return null;
  if (parts[0] !== "legend") return null;

  // legend.subchapter.<id>.clear OR legend.subchapter.<id>.crown.<N>
  if (parts[1] === "subchapter") {
    const subchapterId = parts[2];
    const kind = parts[3];

    if (kind === "clear" && parts.length === 4) {
      return { type: "LEGEND_SUBCHAPTER_CLEAR" as const, subchapterId };
    }

    if (kind === "crown" && parts.length === 5) {
      const crown = Number(parts[4]);
      if (!Number.isFinite(crown)) return null;
      return { type: "LEGEND_SUBCHAPTER_CROWN" as const, subchapterId, crown };
    }

    return null;
  }

  // legend.saga.SOL.crown.<N>
  if (parts[1] === "saga") {
    const sagaKey = parts[2]; // SOL | UL | ZL
    const kind = parts[3];

    if (kind === "crown" && parts.length === 5) {
      const crown = Number(parts[4]);
      if (!Number.isFinite(crown)) return null;
      return { type: "LEGEND_SAGA_CROWN" as const, sagaKey, crown };
    }

    return null;
  }

  return null;
}
