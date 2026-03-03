import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth-options";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if ((session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const adminId = session.user.id as string;
  const body = await req.json();
  const { userId, role } = body as { userId?: string; role?: string };

  if (!userId || !role) {
    return NextResponse.json({ error: "userId and role are required" }, { status: 400 });
  }

  if (role !== "ADMIN" && role !== "USER") {
    return NextResponse.json({ error: "role must be ADMIN or USER" }, { status: 400 });
  }

  if (userId === adminId) {
    return NextResponse.json({ error: "Cannot change your own role" }, { status: 400 });
  }

  const target = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, username: true, role: true },
  });

  if (!target) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  // @ts-ignore – role field added in migration
  await (prisma as any).user.update({
    where: { id: userId },
    data: { role },
  });

  const action = role === "ADMIN" ? "promoted to Admin" : "demoted to User";
  return NextResponse.json({
    success: true,
    message: `@${target.username} has been ${action}`,
  });
}
