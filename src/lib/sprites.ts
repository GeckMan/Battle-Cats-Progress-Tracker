/**
 * Unit sprite URLs.
 *
 * Sprites are mirrored into public/sprites/ by scripts/sync-unit-sprites.ts (run
 * by the Sync BCData workflow), so they're plain static files: no function
 * invocation per image (2026-11-18 CPU work; the Units page used to cost ~780
 * /api/sprite calls whenever the CDN cache was cold, e.g. after every deploy).
 * The /api/sprite proxy remains as a fallback for anything not mirrored yet
 * (a brand-new unit before the next sync), via onSpriteError.
 */

// Form index → letter used in the wiki's filenames (F1=f, F2=c, TF=s, UF=u)
const FORM_LETTER = ["f", "c", "s", "u"] as const;

function key(unitNumber: number, formIndex: number, unitName?: string): { u: number; f: string } {
  // Ancient Egg units: base & evolved forms share one egg sprite (non-standard
  // filename); True/Ultra forms follow the normal naming.
  if (unitName?.startsWith("Ancient Egg") && formIndex <= 1) return { u: 0, f: "m" };
  return { u: unitNumber, f: FORM_LETTER[formIndex] ?? "f" };
}

/** Static mirrored sprite (fast path). */
export function spriteUrl(unitNumber: number, formIndex: number, unitName?: string): string {
  const k = key(unitNumber, formIndex, unitName);
  return `/sprites/${k.u}_${k.f}.png`;
}

/** Live proxy to the wiki CDN (fallback path). */
export function proxySpriteUrl(unitNumber: number, formIndex: number, unitName?: string): string {
  const k = key(unitNumber, formIndex, unitName);
  return `/api/sprite?u=${k.u}&f=${k.f}`;
}

/**
 * <img onError> handler: static file → live proxy → previous form's sprite → hide.
 * Give the <img> a `key` of its src so the fallback stage resets when the form changes.
 */
export function onSpriteError(
  e: { currentTarget: HTMLImageElement },
  unitNumber: number,
  formIndex: number,
  unitName?: string
) {
  const img = e.currentTarget;
  const stage = img.dataset.spriteStage ?? "static";
  if (stage === "static") {
    img.dataset.spriteStage = "proxy";
    img.src = proxySpriteUrl(unitNumber, formIndex, unitName);
    return;
  }
  if (stage === "proxy" && formIndex > 0) {
    img.dataset.spriteStage = "previous";
    img.src = spriteUrl(unitNumber, formIndex - 1, unitName);
    return;
  }
  if (stage === "previous" && formIndex > 0) {
    img.dataset.spriteStage = "previous-proxy";
    img.src = proxySpriteUrl(unitNumber, formIndex - 1, unitName);
    return;
  }
  img.style.opacity = "0";
}
