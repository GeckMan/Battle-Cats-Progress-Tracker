import { prisma } from "@/lib/prisma";

/**
 * Database-backed rate limiting for Vercel serverless.
 *
 * Counts recent entries for a given key within a time window.
 * If under the limit, records a new entry and returns remaining attempts.
 * If over the limit, returns { limited: true }.
 *
 * Old entries (>24h) are cleaned up inline on each call (fire-and-forget).
 */
export async function checkRateLimit(
  key: string,
  maxAttempts: number,
  windowMs: number,
): Promise<{ limited: boolean; remaining: number; retryAfterMs?: number }> {
  const windowStart = new Date(Date.now() - windowMs);

  // Count recent attempts within the window
  // @ts-ignore
  const count = await (prisma as any).rateLimit.count({
    where: {
      key,
      createdAt: { gte: windowStart },
    },
  });

  if (count >= maxAttempts) {
    // Find the oldest entry in the window to calculate retry-after
    // @ts-ignore
    const oldest = await (prisma as any).rateLimit.findFirst({
      where: { key, createdAt: { gte: windowStart } },
      orderBy: { createdAt: "asc" },
      select: { createdAt: true },
    });
    const retryAfterMs = oldest
      ? oldest.createdAt.getTime() + windowMs - Date.now()
      : windowMs;

    return { limited: true, remaining: 0, retryAfterMs: Math.max(1000, retryAfterMs) };
  }

  // Record this attempt
  // @ts-ignore
  await (prisma as any).rateLimit.create({ data: { key } });

  // Fire-and-forget cleanup of entries older than 24 hours
  const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
  // @ts-ignore
  (prisma as any).rateLimit
    .deleteMany({ where: { createdAt: { lt: oneDayAgo } } })
    .catch(() => {}); // swallow errors — cleanup is best-effort

  return { limited: false, remaining: maxAttempts - count - 1 };
}

/** Extract client IP from request headers (Vercel sets x-forwarded-for) */
export function getClientIp(req: Request): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return "unknown";
}

/** Return a 429 Too Many Requests response */
export function rateLimitResponse(retryAfterMs?: number) {
  const retryAfterSec = Math.ceil((retryAfterMs ?? 60000) / 1000);
  return new Response(
    JSON.stringify({ error: "Too many requests. Please try again later." }),
    {
      status: 429,
      headers: {
        "Content-Type": "application/json",
        "Retry-After": String(retryAfterSec),
      },
    },
  );
}
