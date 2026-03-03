import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth-options";
import ActivityClient from "./ActivityClient";

export default async function ActivityPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  return (
    <div className="p-8 space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-semibold text-gray-100">Activity</h1>
        <p className="text-sm text-gray-400 mt-1">Recent updates from you and your friends.</p>
      </div>
      <ActivityClient />
    </div>
  );
}
