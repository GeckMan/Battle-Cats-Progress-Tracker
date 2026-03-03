import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth-options";
import AppSidebar from "@/components/AppSidebar";
import RightPanelWrapper from "@/components/RightPanelWrapper";

export default async function AppGroupLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  const userId = (session?.user?.id as string) ?? "";
  const userRole = ((session?.user as any)?.role as string) ?? "USER";

  return (
    <div className="flex min-h-screen bg-black">
      <AppSidebar />
      <main className="flex-1 min-h-screen md:ml-52">
        {children}
      </main>
      <RightPanelWrapper currentUserId={userId} currentUserRole={userRole} />
    </div>
  );
}
