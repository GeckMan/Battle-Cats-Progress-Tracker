import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth-options";
import { prisma } from "@/lib/prisma";

/**
 * Easter egg tracker — counts unique users who have unleashed the Battle Cat.
 *
 * The hasUnleashedCat field is added via migration but the local Prisma client
 * (checked into src/generated/) won't know about it until Vercel runs
 * `prisma generate`. We use $queryRaw / $executeRaw to avoid TS errors.
 */

/** GET — return total count and whether the current user has unleashed */
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const [countResult, userResult] = await Promise.all([
    prisma.$queryRaw<[{ count: bigint }]>`
      SELECT COUNT(*) as count FROM "User" WHERE "hasUnleashedCat" = true
    `,
    prisma.$queryRaw<[{ hasUnleashedCat: boolean }?]>`
      SELECT "hasUnleashedCat" FROM "User" WHERE "id" = ${session.user.id}
    `,
  ]);

  return NextResponse.json({
    count: Number(countResult[0]?.count ?? 0),
    hasUnleashed: userResult[0]?.hasUnleashedCat ?? false,
  });
}

/** POST — mark current user as having unleashed the cat (idempotent) */
export async function POST() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await prisma.$executeRaw`
    UPDATE "User" SET "hasUnleashedCat" = true WHERE "id" = ${session.user.id}
  `;

  const countResult = await prisma.$queryRaw<[{ count: bigint }]>`
    SELECT COUNT(*) as count FROM "User" WHERE "hasUnleashedCat" = true
  `;

  return NextResponse.json({
    count: Number(countResult[0]?.count ?? 0),
    hasUnleashed: true,
  });
}
