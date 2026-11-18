import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth-options";
import { prisma } from "@/lib/prisma";
import AppSidebar from "@/components/AppSidebar";
import RightPanelWrapper from "@/components/RightPanelWrapper";
import { ThemeProvider, type Theme } from "@/lib/theme-context";
import NervScanLine from "@/components/NervScanLine";
import WhatsNew from "@/components/WhatsNew";
import { CURRENT_UPDATE } from "@/lib/whats-new";

export default async function AppGroupLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  const userId = (session?.user?.id as string) ?? "";
  const userRole = ((session?.user as any)?.role as string) ?? "USER";

  // Fetch user's theme preference for server-side initial render
  let initialTheme: Theme = "default";
  let showWhatsNew = false;
  if (userId) {
    // Same lookup as before, plus the one-time "What's new" check (src/lib/whats-new.ts).
    const user = (await (prisma as any).user.findUnique({
      where: { id: userId },
      select: { theme: true, seenUpdateId: true, createdAt: true },
    })) as { theme: string | null; seenUpdateId: string | null; createdAt: Date } | null;
    if (user?.theme === "nerv") initialTheme = "nerv";
    showWhatsNew =
      !!user &&
      user.seenUpdateId !== CURRENT_UPDATE.id &&
      user.createdAt < new Date(CURRENT_UPDATE.releasedAt); // brand-new accounts skip it
  }

  return (
    <ThemeProvider initialTheme={initialTheme}>
      <div className="flex min-h-screen bg-black">
        {/* Logged-out visitors (e.g. on /about) get no background polling: every
            poll would just be a 401 that still costs a function invocation. */}
        <AppSidebar loggedIn={!!userId} />
        <main className="flex-1 min-h-screen md:ml-52">
          {children}
        </main>
        {userId && <RightPanelWrapper currentUserId={userId} currentUserRole={userRole} />}
        {showWhatsNew && <WhatsNew update={CURRENT_UPDATE} />}
      </div>
      <NervScanLine />
    </ThemeProvider>
  );
}
