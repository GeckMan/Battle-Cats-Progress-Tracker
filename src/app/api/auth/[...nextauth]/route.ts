import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { checkRateLimit, getClientIp, rateLimitResponse } from "@/lib/rate-limit";

const handler = NextAuth(authOptions);

export { handler as GET };

// Wrap POST to add rate limiting on login attempts
export async function POST(req: Request) {
  // Rate limit: 10 login attempts per 15 minutes per IP
  const ip = getClientIp(req);
  const rl = await checkRateLimit(`login:${ip}`, 10, 15 * 60 * 1000);
  if (rl.limited) return rateLimitResponse(rl.retryAfterMs);

  return handler(req as any);
}
