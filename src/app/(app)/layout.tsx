import AppSidebar from "@/components/AppSidebar";
import RightPanelWrapper from "@/components/RightPanelWrapper";

export default function AppGroupLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-black">
      <AppSidebar />
      <main className="flex-1 min-h-screen md:ml-52">
        {children}
      </main>
      <RightPanelWrapper />
    </div>
  );
}
