"use client";

export function TableSkeleton({ rows = 5, cols = 5 }: { rows?: number; cols?: number }) {
  return (
    <div className="w-full animate-pulse">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#1e1e2e]">
              {Array.from({ length: cols }).map((_, i) => (
                <th key={i} className="p-4">
                  <div className="h-4 w-20 bg-[#1e1e2e] rounded" />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: rows }).map((_, i) => (
              <tr key={i} className="border-b border-[#1e1e2e]/50">
                {Array.from({ length: cols }).map((_, j) => (
                  <td key={j} className="p-4">
                    <div className={`h-4 ${j === 0 ? "w-32" : "w-24"} bg-[#1e1e2e]/60 rounded`} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
