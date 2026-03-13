"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { ShareModal } from "@/components/proposal/ShareModal";

type ProposalStatus = "draft" | "sent" | "viewed" | "accepted" | "declined";

const statusStyles: Record<ProposalStatus, string> = {
  draft: "bg-[#1e1e2e] text-[#888890]",
  sent: "bg-blue-500/20 text-blue-400",
  viewed: "bg-amber-500/20 text-amber-400",
  accepted: "bg-emerald-500/20 text-emerald-400",
  declined: "bg-red-500/20 text-red-400",
};

export default function ProposalsPage() {
  const [proposals, setProposals] = useState<Array<{
    id: string;
    share_id: string | null;
    title: string;
    client_name: string;
    project_type: string;
    status: ProposalStatus;
    budget_amount: number | null;
    budget_currency: string;
    deliverables: string[] | null;
    sent_at: string | null;
    created_at: string;
  }>>([]);
  const [loading, setLoading] = useState(true);
  const [shareModal, setShareModal] = useState<{
    open: boolean;
    id: string;
    shareId: string | null;
    title: string;
    clientName: string;
    budgetAmount: number | null;
    budgetCurrency: string;
    deliverables: string[] | null;
  } | null>(null);

  useEffect(() => {
    fetch("/api/proposals?summary=1")
      .then((r) => r.json())
      .then((d) => { setProposals(Array.isArray(d) ? d : []); })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="font-serif text-2xl font-bold text-[#faf8f4]">Proposals</h1>
        <Link
          href="/proposals/new"
          className="rounded-lg bg-gold px-4 py-2 text-sm font-medium text-[#0a0a14] hover:bg-[#e8c76a]"
        >
          New Proposal
        </Link>
      </div>
      <div className="rounded-xl border border-[#1e1e2e] bg-[#12121e] overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-[#888890]">Loading...</div>
        ) : proposals.length === 0 ? (
          <div className="p-8 text-center text-[#888890]">
            <p>No proposals yet. Create your first one.</p>
            <Link href="/proposals/new" className="mt-4 inline-block text-gold hover:underline">
              New Proposal →
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-[#888890] border-b border-[#1e1e2e]">
                  <th className="p-4">Title</th>
                  <th className="p-4">Client</th>
                  <th className="p-4">Type</th>
                  <th className="p-4">Value</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Sent</th>
                  <th className="p-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {proposals.map((p) => (
                  <tr key={p.id} className="border-b border-[#1e1e2e]/50 hover:bg-[#0a0a14]/30">
                    <td className="p-4">
                      <Link href={`/proposals/${p.id}`} className="font-medium text-[#faf8f4] hover:text-gold">
                        {p.title}
                      </Link>
                    </td>
                    <td className="p-4 text-[#888890]">{p.client_name}</td>
                    <td className="p-4 text-[#888890]">{p.project_type}</td>
                    <td className="p-4 text-[#888890]">
                      {p.budget_amount != null ? `${p.budget_currency ?? "USD"} ${p.budget_amount.toLocaleString()}` : "—"}
                    </td>
                    <td className="p-4">
                      <span className={`rounded-full px-2 py-0.5 text-xs capitalize ${statusStyles[p.status] ?? ""}`}>
                        {p.status}
                      </span>
                    </td>
                    <td className="p-4 text-[#888890]">{p.sent_at ? new Date(p.sent_at).toLocaleDateString() : "—"}</td>
                    <td className="p-4 flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => setShareModal({
                          open: true,
                          id: p.id,
                          shareId: p.share_id,
                          title: p.title,
                          clientName: p.client_name,
                          budgetAmount: p.budget_amount,
                          budgetCurrency: p.budget_currency ?? "USD",
                          deliverables: p.deliverables ?? [],
                        })}
                        className="rounded p-1.5 text-[#25d366] hover:bg-[#25d366]/10 transition-colors"
                        title="Send via WhatsApp"
                        aria-label="Send via WhatsApp"
                      >
                        <MessageCircle className="w-4 h-4" />
                      </button>
                      <Link href={`/proposals/${p.id}`} className="text-gold hover:underline text-xs">View</Link>
                      <span className="mx-1 text-[#1e1e2e]">|</span>
                      <a href={`/api/proposals/${p.id}/pdf`} target="_blank" rel="noopener noreferrer" className="text-gold hover:underline text-xs">PDF</a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {shareModal && (
        <ShareModal
          open={shareModal.open}
          onClose={() => setShareModal(null)}
          proposalId={shareModal.id}
          proposalLink={typeof window !== "undefined" && shareModal.shareId
            ? `${window.location.origin}/proposal/${shareModal.shareId}`
            : undefined}
          proposalTitle={shareModal.title}
          clientName={shareModal.clientName}
          deliverables={shareModal.deliverables ?? []}
          budgetAmount={shareModal.budgetAmount}
          budgetCurrency={shareModal.budgetCurrency}
          initialTab="whatsapp"
        />
      )}
    </div>
  );
}
