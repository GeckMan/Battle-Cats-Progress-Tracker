import AppSidebar from "@/components/AppSidebar";

export default function AppGroupLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-black">
      <AppSidebar />
      <main className="ml-52 flex-1 min-h-screen">
        {children}
      </main>
    </div>
  );
}
