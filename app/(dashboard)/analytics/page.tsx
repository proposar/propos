import dynamic from "next/dynamic";

const AnalyticsDashboard = dynamic(
  () => import("@/components/AnalyticsDashboard"),
  { ssr: false, loading: () => (
    <div className="space-y-6">
      <h1 className="font-serif text-3xl font-bold text-[#faf8f4]">Analytics</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="rounded-xl border border-[#1e1e2e] bg-[#12121e] p-6 animate-pulse">
            <div className="h-8 bg-[#1e1e2e] rounded mb-2 w-1/3" />
            <div className="h-6 bg-[#1e1e2e] rounded" />
          </div>
        ))}
      </div>
    </div>
  ) }
);

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
