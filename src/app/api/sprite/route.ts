import { NextRequest, NextResponse } from "next/server";
import { createHash } from "crypto";

/**
 * Proxy for Battle Cats wiki sprite images.
 *
 * Miraheze blocks hotlinking, so we fetch the image server-side from their
 * static CDN and return it with aggressive caching headers.
 *
 * Query params:
 *   u  – unit number  (e.g. 209)
 *   f  – form letter   (f | c | s | u)
 */

const VALID_FORM_LETTERS = new Set(["f", "c", "s", "u"]);

function staticCdnUrl(filename: string): string {
  const md5 = createHash("md5").update(filename).digest("hex");
  return `https://static.miraheze.org/battlecatswiki/${md5[0]}/${md5.slice(0, 2)}/${filename}`;
}

export async function GET(req: NextRequest) {
  const u = req.nextUrl.searchParams.get("u");
  const f = req.nextUrl.searchParams.get("f") ?? "f";

  if (!u || !/^\d{1,4}$/.test(u)) {
    return NextResponse.json({ error: "invalid unit number" }, { status: 400 });
  }
  if (!VALID_FORM_LETTERS.has(f)) {
    return NextResponse.json({ error: "invalid form letter" }, { status: 400 });
  }

  const num = String(Number(u)).padStart(3, "0");
  const filename = `Uni${num}_${f}00.png`;
  const url = staticCdnUrl(filename);

  try {
    const upstream = await fetch(url, {
      headers: { "User-Agent": "BattleCatsProgressTracker/1.0" },
      next: { revalidate: 604800 }, // ISR: revalidate weekly
    });

    if (!upstream.ok) {
      // If zero-padded name fails, try without padding for units < 100
      if (Number(u) < 100) {
        const altFilename = `Uni${Number(u)}_${f}00.png`;
        const altUrl = staticCdnUrl(altFilename);
        const altUpstream = await fetch(altUrl, {
          headers: { "User-Agent": "BattleCatsProgressTracker/1.0" },
          next: { revalidate: 604800 },
        });
        if (altUpstream.ok) {
          const body = await altUpstream.arrayBuffer();
          return new NextResponse(body, {
            status: 200,
            headers: {
              "Content-Type": "image/png",
              "Cache-Control": "public, max-age=604800, s-maxage=604800, stale-while-revalidate=86400",
            },
          });
        }
      }

      return new NextResponse(null, { status: 404 });
    }

    const body = await upstream.arrayBuffer();
    return new NextResponse(body, {
      status: 200,
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "public, max-age=604800, s-maxage=604800, stale-while-revalidate=86400",
      },
    });
  } catch {
    return new NextResponse(null, { status: 502 });
  }
}
