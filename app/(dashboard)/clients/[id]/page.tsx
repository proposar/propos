"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

interface Client {
  id: string;
  name: string;
  company: string | null;
  email: string | null;
  total_proposals: number;
  won_proposals: number;
  total_value: number;
  notes: string | null;
}

interface Proposal {
  id: string;
  title: string;
  project_type: string;
  status: string;
  budget_amount: number | null;
  budget_currency: string;
  sent_at: string | null;
  created_at: string;
}

export default function ClientDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [client, setClient] = useState<Client | null>(null);
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(true);

  const loadClient = useCallback(() => {
    fetch(`/api/clients/${id}`)
      .then((r) => r.json())
      .then((d) => {
        setClient(d);
        setNotes(d.notes ?? "");
      })
      .catch(() => router.push("/clients"));
  }, [id, router]);

  const loadProposals = useCallback(() => {
    fetch(`/api/clients/${id}/proposals`)
      .then((r) => r.json())
      .then((d) => setProposals(Array.isArray(d) ? d : []));
  }, [id]);

  useEffect(() => {
    loadClient();
    loadProposals();
  }, [loadClient, loadProposals]);

  useEffect(() => {
    if (!client) return;
    setLoading(false);
  }, [client]);

  const saveNotes = useCallback(() => {
    if (!id) return;
    fetch(`/api/clients/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ notes }),
    }).then(() => loadClient());
  }, [id, notes, loadClient]);

  useEffect(() => {
    const t = setTimeout(saveNotes, 1000);
    return () => clearTimeout(t);
  }, [notes, saveNotes]);

  if (loading || !client) {
    return <div className="p-8 text-[#888890]">Loading...</div>;
  }

  const statusColor: Record<string, string> = {
    draft: "bg-[#1e1e2e] text-[#888890]",
    sent: "bg-blue-500/20 text-blue-400",
    viewed: "bg-amber-500/20 text-amber-400",
    accepted: "bg-emerald-500/20 text-emerald-400",
    declined: "bg-red-500/20 text-red-400",
  };

  return (
    <div className="space-y-8">
      <Link href="/clients" className="text-sm text-gold hover:underline">← Clients</Link>

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl font-bold text-[#faf8f4]">{client.name}</h1>
          {client.company && <p className="text-[#888890]">{client.company}</p>}
          {client.email && <p className="text-sm text-[#888890]">{client.email}</p>}
        </div>
        <Link
          href={`/proposals/new?clientId=${id}&clientName=${encodeURIComponent(client.name)}`}
          className="rounded-lg bg-gold px-4 py-2 text-sm font-medium text-[#0a0a14] hover:bg-[#e8c76a]"
        >
          New Proposal for {client.name}
        </Link>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <div className="rounded-xl border border-[#1e1e2e] bg-[#12121e] p-4">
          <p className="text-sm text-[#888890]">Proposals sent</p>
          <p className="text-2xl font-bold text-[#faf8f4]">{client.total_proposals}</p>
        </div>
        <div className="rounded-xl border border-[#1e1e2e] bg-[#12121e] p-4">
          <p className="text-sm text-[#888890]">Won</p>
          <p className="text-2xl font-bold text-[#faf8f4]">{client.won_proposals}</p>
        </div>
        <div className="rounded-xl border border-[#1e1e2e] bg-[#12121e] p-4">
          <p className="text-sm text-[#888890]">Total value</p>
          <p className="text-2xl font-bold text-[#faf8f4]">${Number(client.total_value).toLocaleString()}</p>
        </div>
      </div>

      <div className="rounded-xl border border-[#1e1e2e] bg-[#12121e] p-6">
        <h2 className="font-semibold text-[#faf8f4] mb-4">Notes</h2>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={4}
          placeholder="Add notes about this client..."
          className="w-full rounded-lg border border-[#1e1e2e] bg-[#0a0a14] px-4 py-3 text-[#faf8f4] resize-none focus:outline-none focus:ring-2 focus:ring-gold/50"
        />
        <p className="text-xs text-[#888890] mt-2">Auto-saves as you type</p>
      </div>

      <div className="rounded-xl border border-[#1e1e2e] bg-[#12121e] p-6">
        <h2 className="font-semibold text-[#faf8f4] mb-4">Proposals</h2>
        {proposals.length === 0 ? (
          <p className="text-[#888890] text-sm">No proposals for this client yet.</p>
        ) : (
          <ul className="space-y-3">
            {proposals.map((p) => (
              <li key={p.id} className="flex items-center justify-between py-2 border-b border-[#1e1e2e]/50 last:border-0">
                <Link href={`/proposals/${p.id}`} className="font-medium text-[#faf8f4] hover:text-gold">
                  {p.title}
                </Link>
                <div className="flex items-center gap-3">
                  <span className={`rounded-full px-2 py-0.5 text-xs capitalize ${statusColor[p.status] ?? ""}`}>
                    {p.status}
                  </span>
                  {p.budget_amount != null && (
                    <span className="text-sm text-[#888890]">
                      {p.budget_currency} ${p.budget_amount.toLocaleString()}
                    </span>
                  )}
                  <span className="text-xs text-[#888890]">
                    {new Date(p.created_at).toLocaleDateString()}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
