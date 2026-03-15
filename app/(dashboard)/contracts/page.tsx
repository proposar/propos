"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const statusStyles: Record<string, string> = {
  draft: "bg-[#1e1e2e] text-[#888890]",
  sent: "bg-blue-500/20 text-blue-400",
  signed: "bg-emerald-500/20 text-emerald-400",
  declined: "bg-red-500/20 text-red-400",
};

export default function ContractsPage() {
  const [contracts, setContracts] = useState<Array<{ id: string; title: string; status: string; client_name: string; created_at: string }>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadContracts = () => {
    setLoading(true);
    setError(null);
    fetch("/api/contracts?limit=200")
      .then(async (r) => {
        const d = await r.json().catch(() => null);
        if (!r.ok) {
          throw new Error(d?.error ?? "Unable to load contracts");
        }
        setContracts(Array.isArray(d) ? d : []);
      })
      .catch((e) => {
        setContracts([]);
        setError(e instanceof Error ? e.message : "Unable to load contracts");
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadContracts();
  }, []);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="font-serif text-2xl font-bold text-[#faf8f4]">Contracts</h1>
        <Link href="/contracts/new" className="rounded-lg bg-gold px-4 py-2 text-sm font-medium text-[#0a0a14] hover:bg-[#e8c76a]">
          New Contract
        </Link>
      </div>
      <div className="rounded-xl border border-[#1e1e2e] bg-[#12121e] overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-[#888890]">Loading...</div>
        ) : error ? (
          <div className="p-8 text-center text-[#888890]">
            <p className="text-red-400">{error}</p>
            <button
              type="button"
              onClick={loadContracts}
              className="mt-4 inline-block text-gold hover:underline"
            >
              Retry
            </button>
          </div>
        ) : contracts.length === 0 ? (
          <div className="p-8 text-center text-[#888890]">
            <p>No contracts yet.</p>
            <Link href="/contracts/new" className="mt-4 inline-block text-gold hover:underline">
              Create your first contract
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-[#888890] border-b border-[#1e1e2e]">
                  <th className="p-4">Title</th>
                  <th className="p-4">Client</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Created</th>
                  <th className="p-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {contracts.map((c) => (
                  <tr key={c.id} className="border-b border-[#1e1e2e]/50 hover:bg-[#0a0a14]/30">
                    <td className="p-4 font-medium text-[#faf8f4]">{c.title}</td>
                    <td className="p-4 text-[#888890]">{c.client_name}</td>
                    <td className="p-4">
                      <span className={`rounded-full px-2 py-0.5 text-xs capitalize ${statusStyles[c.status] ?? ""}`}>
                        {c.status}
                      </span>
                    </td>
                    <td className="p-4 text-[#888890]">{new Date(c.created_at).toLocaleDateString()}</td>
                    <td className="p-4">
                      <Link href={`/contracts/${c.id}`} className="text-gold hover:underline text-xs">View</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
