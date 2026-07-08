import { getServerSession } from "next-auth/next";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/lib/auth-options";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/admin/login-attempts
 *
 * Returns recent login attempts (success and failure) for security review.
 * Admin only. Optional query params:
 *   failedOnly=true   — only return failed attempts
 *   limit=<n>          — max rows to return (default 100, max 500)
 */
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if ((session.user as any).role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const failedOnly = searchParams.get("failedOnly") === "true";
    const limit = Math.min(500, Math.max(1, Number(searchParams.get("limit") ?? 100)));

    // @ts-ignore – LoginAttempt model added in new migration
    const attempts = await (prisma as any).loginAttempt.findMany({
      where: failedOnly ? { success: false } : undefined,
      orderBy: { createdAt: "desc" },
      take: limit,
    });

    // Surface IPs with repeated recent failures — a simple brute-force signal
    const since = new Date(Date.now() - 60 * 60 * 1000); // last hour
    // @ts-ignore
    const recentFailures: any[] = await (prisma as any).loginAttempt.findMany({
      where: { success: false, createdAt: { gte: since } },
      select: { ip: true },
    });
    const failureCounts = new Map<string, number>();
    for (const r of recentFailures) {
      failureCounts.set(r.ip, (failureCounts.get(r.ip) ?? 0) + 1);
    }
    const suspiciousIps = Array.from(failureCounts.entries())
      .filter(([, count]) => count >= 5)
      .map(([ip, count]) => ({ ip, failuresLastHour: count }))
      .sort((a, b) => b.failuresLastHour - a.failuresLastHour);

    return NextResponse.json({
      attempts: attempts.map((a: any) => ({
        id: a.id,
        username: a.username,
        ip: a.ip,
        success: a.success,
        createdAt: a.createdAt,
      })),
      suspiciousIps,
    });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
