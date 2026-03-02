import { getServerSession } from "next-auth/next";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/lib/auth-options";
import { prisma } from "@/lib/prisma";
import type { Visibility } from "@/generated/prisma/client";

const VALID_VISIBILITY: Visibility[] = ["PUBLIC", "FRIENDS", "PRIVATE"];

export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const userId = session.user.id as string;

  const body = await req.json();
  const { profileVisibility, progressVisibility } = body as {
    profileVisibility?: unknown;
    progressVisibility?: unknown;
  };

  const patch: Partial<{ profileVisibility: Visibility; progressVisibility: Visibility }> = {};

  if (profileVisibility !== undefined) {
    if (!VALID_VISIBILITY.includes(profileVisibility as Visibility)) {
      return NextResponse.json({ error: "Invalid profileVisibility value" }, { status: 400 });
    }
    patch.profileVisibility = profileVisibility as Visibility;
  }

  if (progressVisibility !== undefined) {
    if (!VALID_VISIBILITY.includes(progressVisibility as Visibility)) {
      return NextResponse.json({ error: "Invalid progressVisibility value" }, { status: 400 });
    }
    patch.progressVisibility = progressVisibility as Visibility;
  }

  if (Object.keys(patch).length === 0) {
    return NextResponse.json({ error: "No valid fields provided" }, { status: 400 });
  }

  const updated = await prisma.privacySettings.upsert({
    where: { userId },
    update: patch,
    create: {
      userId,
      profileVisibility: patch.profileVisibility ?? "PUBLIC",
      progressVisibility: patch.progressVisibility ?? "FRIENDS",
    },
    select: { profileVisibility: true, progressVisibility: true },
  });

  return NextResponse.json({ ok: true, ...updated });
}
