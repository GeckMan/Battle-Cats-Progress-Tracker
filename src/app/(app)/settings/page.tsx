import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth-options";
import { prisma } from "@/lib/prisma";
import SettingsClient from "./SettingsClient";

export default async function SettingsPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");
  const userId = session.user.id as string;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      username: true,
      displayName: true,
      email: true,
      privacy: {
        select: { profileVisibility: true, progressVisibility: true },
      },
    },
  });

  if (!user) redirect("/login");

  return (
    <div className="p-4 pt-16 md:p-8 max-w-xl">
      <SettingsClient
        username={user.username}
        displayName={user.displayName}
        email={user.email}
        profileVisibility={user.privacy?.profileVisibility ?? "PUBLIC"}
        progressVisibility={user.privacy?.progressVisibility ?? "FRIENDS"}
      />
    </div>
  );
}
