import AppHeader from "@/components/AppHeader";

export default function AppGroupLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <AppHeader />
      {children}
    </div>
  );
}
