"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

export default function ContractDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [contract, setContract] = useState<{
    id: string;
    share_id: string;
    title: string;
    content: string;
    status: string;
    client_name: string;
    proposal_id?: string | null;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/contracts/${id}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => { setContract(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="p-8 text-[#888890]">Loading...</div>;
  if (!contract) return <div className="p-8 text-[#888890]">Contract not found.</div>;

  const shareUrl = typeof window !== "undefined" ? `${window.location.origin}/contract/${contract.share_id}` : "";
  const canCreateInvoice = contract.status === "signed" && contract.proposal_id;

  return (
    <div className="space-y-6 max-w-4xl">
      <Link href="/contracts" className="text-sm text-gold hover:underline">← Contracts</Link>
      <div className="flex justify-between items-start">
        <h1 className="font-serif text-2xl font-bold text-[#faf8f4]">{contract.title}</h1>
        <span className="rounded-full px-2 py-1 text-xs capitalize bg-[#1e1e2e] text-[#888890]">{contract.status}</span>
      </div>
      <p className="text-sm text-[#888890]">Client: {contract.client_name}</p>
      {contract.status === "signed" && (
        <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm text-[#e3f9f0]">
          <p className="font-medium mb-1">Contract signed</p>
          <p className="mb-3">Next step: create an invoice for this project so you can get paid.</p>
          {canCreateInvoice ? (
            <Link
              href={`/invoices/new?proposalId=${contract.proposal_id}`}
              className="inline-flex items-center rounded-lg bg-gold px-4 py-2 text-xs font-medium text-[#0a0a14] hover:bg-[#e8c76a]"
            >
              Create Invoice from Proposal
            </Link>
          ) : (
            <Link
              href="/invoices/new"
              className="inline-flex items-center rounded-lg bg-gold px-4 py-2 text-xs font-medium text-[#0a0a14] hover:bg-[#e8c76a]"
            >
              Create Invoice
            </Link>
          )}
        </div>
      )}
      <div className="rounded-xl border border-[#1e1e2e] bg-[#12121e] p-6">
        <div className="prose prose-invert prose-sm max-w-none whitespace-pre-wrap">{contract.content}</div>
      </div>
      <div className="flex gap-3">
        <Link href={`/contract/${contract.share_id}`} target="_blank" rel="noopener noreferrer" className="rounded-lg bg-gold px-4 py-2 text-sm font-medium text-[#0a0a14] hover:bg-[#e8c76a]">
          Open signing link
        </Link>
        <button
          type="button"
          onClick={() => { navigator.clipboard.writeText(shareUrl); }}
          className="rounded-lg border border-[#1e1e2e] px-4 py-2 text-sm text-[#888890] hover:text-[#faf8f4]"
        >
          Copy link
        </button>
      </div>
    </div>
  );
}
