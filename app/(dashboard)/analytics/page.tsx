import AnalyticsDashboard from "@/components/AnalyticsDashboard";

export const metadata = {
  title: "Analytics",
  description: "Your proposal analytics and performance insights",
};

export default function AnalyticsPage() {
  return (
    <div className="min-h-screen bg-[#0a0a14]">
      <main className="max-w-7xl mx-auto px-6 py-8">
        <AnalyticsDashboard />
      </main>
    </div>
  );
}
