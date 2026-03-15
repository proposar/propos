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
    client_email?: string | null;
    freelancer_signature?: string | null;
    client_signature?: string | null;
    proposal_id?: string | null;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [sendingEmail, setSendingEmail] = useState(false);

  useEffect(() => {
    fetch(`/api/contracts/${id}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => { setContract(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="p-8 text-[#888890]">Loading...</div>;
  if (!contract) return <div className="p-8 text-[#888890]">Contract not found.</div>;

  const publicShareUrl = typeof window !== "undefined" ? `${window.location.origin}/contract/${contract.share_id}` : "";
  const ownerSigningUrl = publicShareUrl
    ? `${publicShareUrl}?returnTo=${encodeURIComponent(`/contracts/${id}`)}`
    : "";
  const clientEmail = contract.client_email ?? "";
  const canCreateInvoice = contract.status === "signed" && contract.proposal_id;

  const handleFreelancerSign = async () => {
    const name = window.prompt("Enter your full name to sign as freelancer:");
    if (!name?.trim()) return;

    const response = await fetch(`/api/contracts/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ freelancer_signature: name.trim() }),
    });

    if (!response.ok) return;
    const updated = await response.json().catch(() => null);
    if (updated) setContract(updated);
  };

  const handleSendEmail = async () => {
    const to = window.prompt("Client email", clientEmail);
    if (!to?.trim()) return;
    const message = window.prompt("Optional personal message", "") ?? "";

    setSendingEmail(true);
    try {
      const response = await fetch("/api/emails/send-contract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contractId: id, to: to.trim(), message }),
      });
      const data = await response.json().catch(() => null);
      if (response.ok && data?.sent) {
        setContract((prev) => (prev ? { ...prev, status: prev.status === "draft" ? "sent" : prev.status } : prev));
        alert("Contract email sent");
      } else {
        alert(data?.error ?? "Failed to send contract email");
      }
    } finally {
      setSendingEmail(false);
    }
  };

  const handleSendWhatsApp = async () => {
    const text = `Hi ${contract.client_name},\n\nPlease review and e-sign the contract:\n${publicShareUrl}\n\nThanks.`;
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank", "noopener,noreferrer");

    await fetch(`/api/contracts/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        status: contract.status === "draft" ? "sent" : contract.status,
        sent_at: new Date().toISOString(),
      }),
    }).catch(() => {});
  };

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
              href={`/invoices/new?title=${encodeURIComponent(contract.title)}&clientName=${encodeURIComponent(contract.client_name)}&clientEmail=${encodeURIComponent(contract.client_email ?? "")}`}
              className="inline-flex items-center rounded-lg bg-gold px-4 py-2 text-xs font-medium text-[#0a0a14] hover:bg-[#e8c76a]"
            >
              Create Invoice (Manual)
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
        {ownerSigningUrl && (
          <Link href={ownerSigningUrl} target="_blank" rel="noopener noreferrer" className="rounded-lg border border-gold px-4 py-2 text-sm font-medium text-gold">
            Review as Freelancer
          </Link>
        )}
        <button
          type="button"
          onClick={handleSendEmail}
          disabled={sendingEmail}
          className="rounded-lg border border-[#1e1e2e] px-4 py-2 text-sm text-[#888890] hover:text-[#faf8f4] disabled:opacity-50"
        >
          {sendingEmail ? "Sending..." : "Send Email"}
        </button>
        <button
          type="button"
          onClick={handleSendWhatsApp}
          className="rounded-lg border border-[#1e1e2e] px-4 py-2 text-sm text-[#888890] hover:text-[#faf8f4]"
        >
          Send WhatsApp
        </button>
        {!contract.freelancer_signature && (
          <button
            type="button"
            onClick={handleFreelancerSign}
            className="rounded-lg border border-gold px-4 py-2 text-sm font-medium text-gold"
          >
            Sign as Freelancer
          </button>
        )}
        <button
          type="button"
          onClick={() => { navigator.clipboard.writeText(publicShareUrl); }}
          className="rounded-lg border border-[#1e1e2e] px-4 py-2 text-sm text-[#888890] hover:text-[#faf8f4]"
        >
          Copy link
        </button>
      </div>
    </div>
  );
}
