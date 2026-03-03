import { getServerSession } from "next-auth/next";
import Link from "next/link";
import { redirect, notFound } from "next/navigation";
import { authOptions } from "@/lib/auth-options";
import { prisma } from "@/lib/prisma";
import FriendUnitsClient from "./FriendUnitsClient";

export default async function FriendUnitsPage(props: {
  params: Promise<{ username?: string }>;
}) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");
  const viewerId = session.user.id as string;

  const { username: raw } = await props.params;
  const username = decodeURIComponent(raw ?? "").trim();
  if (!username) notFound();

  const user = await prisma.user.findUnique({
    where: { username },
    select: { id: true, username: true, displayName: true, privacy: true },
  });
  if (!user) notFound();

  const isSelf = user.id === viewerId;
  const friendship = isSelf
    ? true
    : await prisma.friendship.findFirst({
        where: {
          status: "ACCEPTED",
          OR: [
            { requesterId: viewerId, addresseeId: user.id },
            { requesterId: user.id, addresseeId: viewerId },
          ],
        },
        select: { id: true },
      });

  if (!friendship) {
    return (
      <div className="p-4 pt-16 md:p-8 space-y-4">
        <Link href="/social" className="text-xs text-amber-600 hover:text-amber-400 transition-colors">← Back to Social</Link>
        <h1 className="text-2xl font-semibold text-gray-100">{user.displayName ?? user.username}</h1>
        <div className="text-sm text-gray-400">You must be friends to view this collection.</div>
      </div>
    );
  }

  const progressVis = user.privacy?.progressVisibility ?? "FRIENDS";
  if (!isSelf && progressVis === "PRIVATE") {
    return (
      <div className="p-4 pt-16 md:p-8 space-y-4">
        <Link href={`/social/${encodeURIComponent(user.username)}`} className="text-xs text-amber-600 hover:text-amber-400 transition-colors">← Back to Profile</Link>
        <h1 className="text-2xl font-semibold text-gray-100">{user.displayName ?? user.username}</h1>
        <div className="text-sm text-gray-400">This user&apos;s progress is private.</div>
      </div>
    );
  }

  return (
    <FriendUnitsClient
      userId={user.id}
      displayName={user.displayName ?? user.username}
      username={user.username}
    />
  );
}
