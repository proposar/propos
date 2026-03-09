export default function DashboardLoading() {
  return (
    <div className="space-y-8 animate-pulse">
      <div className="h-8 w-48 rounded-lg bg-[#1e1e2e]" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-24 rounded-xl bg-[#12121e] border border-[#1e1e2e]" />
        ))}
      </div>
      <div className="h-64 rounded-xl bg-[#12121e] border border-[#1e1e2e]" />
    </div>
  );
}
