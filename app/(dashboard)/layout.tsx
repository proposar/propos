import { Sidebar } from "@/components/dashboard/Sidebar";
import { TopBar } from "@/components/dashboard/TopBar";
import { BottomNav } from "@/components/dashboard/BottomNav";
import { OnboardingGuard } from "@/components/OnboardingGuard";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <OnboardingGuard>
      <div className="min-h-screen bg-[#0a0a14] flex">
        <Sidebar />
        <div className="flex-1 flex flex-col min-w-0 md:ml-60 pb-20 md:pb-0">
          <TopBar />
          <main className="flex-1 p-4 md:p-6">{children}</main>
        </div>
        <BottomNav />
      </div>
    </OnboardingGuard>
  );
}
