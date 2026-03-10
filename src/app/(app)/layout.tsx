import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth-options";
import { prisma } from "@/lib/prisma";
import AppSidebar from "@/components/AppSidebar";
import RightPanelWrapper from "@/components/RightPanelWrapper";
import { ThemeProvider, type Theme } from "@/lib/theme-context";

export default async function AppGroupLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  const userId = (session?.user?.id as string) ?? "";
  const userRole = ((session?.user as any)?.role as string) ?? "USER";

  // Fetch user's theme preference for server-side initial render
  let initialTheme: Theme = "default";
  if (userId) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { theme: true },
    });
    if (user?.theme === "nerv") initialTheme = "nerv";
  }

  return (
    <ThemeProvider initialTheme={initialTheme}>
      <div className="flex min-h-screen bg-black">
        <AppSidebar />
        <main className="flex-1 min-h-screen md:ml-52">
          {children}
        </main>
        <RightPanelWrapper currentUserId={userId} currentUserRole={userRole} />
      </div>
    </ThemeProvider>
  );
}
