"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const COLUMNS = [
  { id: "draft", label: "Draft" },
  { id: "sent", label: "Sent" },
  { id: "viewed", label: "Viewed" },
  { id: "accepted", label: "Accepted" },
  { id: "declined", label: "Closed Lost" },
];

export default function PipelinePage() {
  const [proposals, setProposals] = useState<Array<{
    id: string;
    title: string;
    client_name: string;
    project_type: string;
    status: string;
    budget_amount: number | null;
    budget_currency: string;
    sent_at: string | null;
    accepted_at: string | null;
    created_at: string;
  }>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/proposals")
      .then((r) => r.json())
      .then((d) => { setProposals(Array.isArray(d) ? d : []); })
      .finally(() => setLoading(false));
  }, []);

  const byStatus = COLUMNS.reduce((acc, col) => {
    if (col.id === "declined") {
      acc[col.id] = proposals.filter((p) => p.status === "declined" || p.status === "expired");
    } else {
      acc[col.id] = proposals.filter((p) => p.status === col.id);
    }
    return acc;
  }, {} as Record<string, typeof proposals>);

  const totalValue = proposals
    .filter((p) => ["sent", "viewed", "accepted"].includes(p.status))
    .reduce((s, p) => s + (p.budget_amount ?? 0), 0);
  const wonCount = proposals.filter((p) => p.status === "accepted").length;
  const closedCount = proposals.filter((p) => ["accepted", "declined"].includes(p.status)).length;
  const winRate = closedCount > 0 ? Math.round((wonCount / closedCount) * 100) : 0;

  return (
    <div className="space-y-6">
      <h1 className="font-serif text-2xl font-bold text-[#faf8f4]">Pipeline</h1>
      <div className="flex flex-wrap gap-4">
        <div className="rounded-lg border border-[#1e1e2e] bg-[#12121e] px-4 py-3">
          <p className="text-xs text-[#888890]">Pipeline value</p>
          <p className="text-lg font-semibold text-[#faf8f4]">
            ${totalValue.toLocaleString()}
          </p>
        </div>
        <div className="rounded-lg border border-[#1e1e2e] bg-[#12121e] px-4 py-3">
          <p className="text-xs text-[#888890]">Won this month</p>
          <p className="text-lg font-semibold text-emerald-400">{wonCount}</p>
        </div>
        <div className="rounded-lg border border-[#1e1e2e] bg-[#12121e] px-4 py-3">
          <p className="text-xs text-[#888890]">Conversion rate</p>
          <p className="text-lg font-semibold text-[#faf8f4]">{winRate}%</p>
        </div>
      </div>
      <div className="flex gap-4 overflow-x-auto pb-4">
        {COLUMNS.map((col) => (
          <div key={col.id} className="flex-shrink-0 w-72 rounded-xl border border-[#1e1e2e] bg-[#12121e]">
            <div className="p-4 border-b border-[#1e1e2e]">
              <h3 className="font-medium text-[#faf8f4]">{col.label}</h3>
              <p className="text-xs text-[#888890]">{(byStatus[col.id] ?? []).length} proposals</p>
            </div>
            <div className="p-2 min-h-[200px] space-y-2">
              {loading ? (
                <div className="p-4 text-[#888890] text-sm">Loading...</div>
              ) : (byStatus[col.id] ?? []).length === 0 ? (
                <div className="p-4 text-[#888890] text-sm">No proposals</div>
              ) : (
                (byStatus[col.id] ?? []).map((p) => {
                  const days = p.sent_at
                    ? Math.floor((Date.now() - new Date(p.sent_at).getTime()) / 86400000)
                    : p.created_at
                    ? Math.floor((Date.now() - new Date(p.created_at).getTime()) / 86400000)
                    : 0;
                  return (
                    <Link
                      key={p.id}
                      href={`/proposals/${p.id}`}
                      className="block rounded-lg border border-[#1e1e2e] bg-[#0a0a14] p-3 hover:border-gold/30 transition-colors"
                    >
                      <p className="font-medium text-[#faf8f4] text-sm truncate">{p.title}</p>
                      <p className="text-xs text-[#888890] mt-1">{p.client_name}</p>
                      <p className="text-xs text-gold mt-1">
                        {p.budget_amount != null ? `${p.budget_currency} ${p.budget_amount.toLocaleString()}` : "—"} · {days}d
                      </p>
                    </Link>
                  );
                })
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
