import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth-options";
import { prisma } from "@/lib/prisma";
import MedalsClient from "./MedalsClient";

export default async function MedalsPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");
  // @ts-expect-error
  const userId = session.user.id as string;

  const medals = await prisma.meowMedal.findMany({
    orderBy: [{ category: "asc" }, { sortOrder: "asc" }, { name: "asc" }],
  });

  // Ensure user rows exist
  const existing = await prisma.userMeowMedal.findMany({
    where: { userId, meowMedalId: { in: medals.map((m) => m.id) } },
    select: { meowMedalId: true },
  });
  const existingSet = new Set(existing.map((e) => e.meowMedalId));

  const missing = medals
    .filter((m) => !existingSet.has(m.id))
    .map((m) => ({ userId, meowMedalId: m.id }));

  if (missing.length) {
    await prisma.userMeowMedal.createMany({ data: missing });
  }

  const userRows = await prisma.userMeowMedal.findMany({
    where: { userId, meowMedalId: { in: medals.map((m) => m.id) } },
    select: { meowMedalId: true, earned: true },
  });

  const earnedById = new Map(userRows.map((r) => [r.meowMedalId, r.earned]));

const rows = medals.map((m) => ({
  id: m.id,
  name: m.name,
  description: m.description ?? "",
  earned: earnedById.get(m.id) ?? false,
  imageFile: m.imageFile ?? null,
}));



  if (rows.length === 0) {
    return (
      <div className="p-8 space-y-3">
        <h1 className="text-2xl font-semibold text-gray-100">Meow Medals</h1>
        <div className="text-sm text-gray-400">No medals found in the database yet.</div>
        <div className="text-sm text-gray-500">
          Run <span className="font-mono">npx prisma db seed</span> and refresh.
        </div>
      </div>
    );
  }

  const total = rows.length;
  const earned = rows.filter((r) => r.earned).length;

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-100">Meow Medals</h1>
          <div className="text-sm text-gray-400 mt-1">
            {earned}/{total} earned
          </div>
        </div>
      </div>

      <MedalsClient rows={rows} />
    </div>
  );
}
