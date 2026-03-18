"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";

export default function NewContractPage() {
  const searchParams = useSearchParams();
  const { locale } = useLanguage();
  const proposalId = searchParams.get("proposalId");
  const [proposals, setProposals] = useState<Array<{ id: string; title: string }>>([]);
  const [selectedProposal, setSelectedProposal] = useState(proposalId ?? "");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loadingProposals, setLoadingProposals] = useState(true);
  const [proposalError, setProposalError] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [signed, setSigned] = useState(false);
  const [contractId, setContractId] = useState<string | null>(null);
  const [shareId, setShareId] = useState<string | null>(null);
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");

  const loadProposals = useCallback(async () => {
    setLoadingProposals(true);
    setProposalError(null);
    try {
      const r = await fetch("/api/proposals");
      if (!r.ok) throw new Error("Failed to load proposals");
      const d = await r.json();
      const accepted = Array.isArray(d) ? d.filter((p: { status: string; id: string; title: string }) => p.status === "accepted") : [];
      setProposals(accepted);
      if (proposalId && !accepted.find((p) => p.id === proposalId)) {
        setProposalError("Selected proposal not found or not accepted");
      }
    } catch (err) {
      setProposalError(err instanceof Error ? err.message : "Failed to load proposals");
      setProposals([]);
    } finally {
      setLoadingProposals(false);
    }
  }, [proposalId]);

  useEffect(() => {
    loadProposals();
  }, [loadProposals]);

  useEffect(() => {
    if (proposalId) setSelectedProposal(proposalId);
  }, [proposalId]);

  const generate = async () => {
    if (!selectedProposal) return;
    setGenerating(true);
    try {
      const r = await fetch("/api/contracts/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          proposalId: selectedProposal,
          locale: locale || "English" 
        }),
      });
      const d = await r.json();
      if (d.content) {
        setContent(d.content);
        setTitle(d.title ?? "Contract");
        setClientName(d.clientName ?? "Client");
        setClientEmail(d.clientEmail ?? "");
      }
    } finally {
      setGenerating(false);
    }
  };

  const save = async () => {
    if (!title.trim() || !content.trim()) return;
    setSaving(true);
    try {
      const p = proposals.find((x) => x.id === selectedProposal);
      const r = await fetch("/api/contracts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          proposalId: selectedProposal || null,
          title: title.trim(),
          content,
          clientName: clientName || "Client",
          clientEmail: clientEmail || null,
        }),
      });
      const d = await r.json();
      if (d.id) {
        setContractId(d.id);
        setShareId(d.share_id ?? null);
      }
    } finally {
      setSaving(false);
    }
  };

  const signAsFreelancer = async () => {
    if (!contractId) return;
    const name = window.prompt("Enter your full name to sign:");
    if (!name?.trim()) return;
    const r = await fetch(`/api/contracts/${contractId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ freelancer_signature: name.trim() }),
    });
    if (r.ok) {
      const updated = await r.json().catch(() => null);
      if (updated?.status === "signed") setSigned(true);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <Link href="/contracts" className="text-sm text-gold hover:underline">← Contracts</Link>
      <h1 className="font-serif text-2xl font-bold text-[#faf8f4]">New Contract</h1>

      {!content ? (
        <div className="rounded-xl border border-[#1e1e2e] bg-[#12121e] p-6 space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-[#888890]">Select an accepted proposal to generate a contract.</p>
            <button
              onClick={loadProposals}
              disabled={loadingProposals}
              className="text-xs text-gold hover:underline disabled:opacity-50"
            >
              {loadingProposals ? "Refreshing..." : "Refresh"}
            </button>
          </div>
          {loadingProposals ? (
            <div className="p-4 text-center text-[#888890] text-sm">Loading proposals...</div>
          ) : proposalError ? (
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">{proposalError}</div>
          ) : proposals.length === 0 ? (
            <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg text-sm text-[#888890]">
              <p>No accepted proposals found.</p>
              <p className="mt-2 text-xs text-[#666680]">Send a proposal to a client and have them accept it first.</p>
            </div>
          ) : null}
          <select
            value={selectedProposal}
            onChange={(e) => setSelectedProposal(e.target.value)}
            className="w-full rounded-lg border border-[#1e1e2e] bg-[#0a0a14] px-3 py-2 text-[#faf8f4]"
            disabled={proposals.length === 0}
          >
            <option value="">Select proposal</option>
            {proposals.map((p) => (
              <option key={p.id} value={p.id}>{p.title}</option>
            ))}
          </select>
          <button
            onClick={generate}
            disabled={!selectedProposal || generating || loadingProposals}
            className="rounded-lg bg-gold px-4 py-2 text-sm font-medium text-[#0a0a14] disabled:opacity-50"
          >
            {generating ? "Generating..." : "Generate Contract"}
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-lg border border-[#1e1e2e] bg-[#0a0a14] px-3 py-2 text-[#faf8f4]"
            placeholder="Contract title"
          />
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={20}
            className="w-full rounded-lg border border-[#1e1e2e] bg-[#0a0a14] px-3 py-2 text-[#faf8f4] font-mono text-sm resize-y"
          />
          <div className="flex gap-3">
            <button
              onClick={save}
              disabled={saving}
              className="rounded-lg bg-gold px-4 py-2 text-sm font-medium text-[#0a0a14] disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save"}
            </button>
            {contractId && (
              <>
                <button
                  onClick={signAsFreelancer}
                  className="rounded-lg border border-gold px-4 py-2 text-sm font-medium text-gold"
                >
                  Sign as Freelancer
                </button>
                {shareId && (
                  <div className="flex gap-3">
                    <Link
                      href={`/contracts/${contractId}`}
                      className="rounded-lg border border-[#1e1e2e] px-4 py-2 text-sm text-[#888890] hover:text-[#faf8f4]"
                    >
                      Manage & Send
                    </Link>
                    <Link
                      href={`/contract/${shareId}`}
                      className="rounded-lg border border-[#1e1e2e] px-4 py-2 text-sm text-[#888890] hover:text-[#faf8f4]"
                    >
                      Open Public Link
                    </Link>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
