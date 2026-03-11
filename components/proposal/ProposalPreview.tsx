"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { MessageCircle, Bell, Pause, Trash2, Send } from "lucide-react";
import { ShareModal } from "./ShareModal";
import { ProposalContent } from "./ProposalContent";

type SequenceStep = { id: string; step_number: number; day_offset: number; status: string; subject: string | null; scheduled_for: string | null; sent_at: string | null };

function FollowUpSequenceSidebar({
  proposalId,
  sequence,
  onPause,
  onCancel,
  onRefresh,
}: {
  proposalId: string;
  sequence: { id: string; status: string; steps: SequenceStep[] };
  onPause: () => void;
  onCancel: () => void;
  onRefresh: () => void;
}) {
  const [actioning, setActioning] = useState(false);
  const [sendingStep, setSendingStep] = useState<string | null>(null);

  const handlePause = async () => {
    setActioning(true);
    try {
      const r = await fetch(`/api/proposals/${proposalId}/sequence`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: sequence.status === "paused" ? "active" : "paused" }),
      });
      if (r.ok) onRefresh();
    } finally {
      setActioning(false);
    }
  };

  const handleCancel = async () => {
    if (!confirm("Cancel the follow-up sequence? Remaining steps will not be sent.")) return;
    setActioning(true);
    try {
      const r = await fetch(`/api/proposals/${proposalId}/sequence`, { method: "DELETE" });
      if (r.ok) onCancel();
    } finally {
      setActioning(false);
    }
  };

  const handleSendNow = async (stepId: string) => {
    setSendingStep(stepId);
    try {
      const r = await fetch(`/api/proposals/${proposalId}/sequence/steps/${stepId}/send`, { method: "POST" });
      if (r.ok) onRefresh();
    } finally {
      setSendingStep(null);
    }
  };

  const stepLabel = (s: SequenceStep) => {
    if (s.status === "sent") return `Step ${s.step_number} sent (Day ${s.day_offset})`;
    if (s.status === "scheduled") return `Step ${s.step_number} scheduled (Day ${s.day_offset})`;
    return `Step ${s.step_number} (Day ${s.day_offset})`;
  };

  return (
    <div className="space-y-4">
      <h4 className="font-medium text-[#faf8f4] text-sm flex items-center gap-2">
        <Bell className="w-4 h-4 text-gold" />
        Follow-Up Sequence
      </h4>
      <p className="text-xs text-[#888890] capitalize">{sequence.status}</p>
      <div className="space-y-2">
        {sequence.steps.map((s) => (
          <div key={s.id} className="text-xs border border-[#1e1e2e] rounded-lg p-2">
            <p className="font-medium text-[#c4c4cc]">{stepLabel(s)}</p>
            {s.status === "sent" && <span className="text-emerald-400">Sent</span>}
            {s.status === "scheduled" && (
              <button
                type="button"
                disabled={!!sendingStep}
                onClick={() => handleSendNow(s.id)}
                className="mt-1 text-gold hover:underline"
              >
                {sendingStep === s.id ? "Sending..." : "Send now"}
              </button>
            )}
          </div>
        ))}
      </div>
      {sequence.status !== "completed" && sequence.status !== "cancelled" && (
        <div className="flex gap-2">
          <button
            type="button"
            disabled={actioning}
            onClick={handlePause}
            className="flex-1 flex items-center justify-center gap-1 rounded-lg border border-[#1e1e2e] py-2 text-xs hover:bg-[#0a0a14]"
          >
            <Pause className="w-3 h-3" />
            {sequence.status === "paused" ? "Resume" : "Pause"}
          </button>
          <button
            type="button"
            disabled={actioning}
            onClick={handleCancel}
            className="flex-1 flex items-center justify-center gap-1 rounded-lg border border-red-500/30 py-2 text-xs text-red-400 hover:bg-red-500/10"
          >
            <Trash2 className="w-3 h-3" />
            Cancel
          </button>
        </div>
      )}
    </div>
  );
}

function WhatsAppFollowUpSidebar({
  clientName,
  proposalLink,
  sentAt,
}: {
  clientName: string;
  proposalLink: string;
  sentAt: string;
}) {
  const daysSince = Math.floor(
    (Date.now() - new Date(sentAt).getTime()) / 86400000
  );
  const name = clientName || "there";

  const templates: { label: string; text: string }[] = [
    {
      label: "Day 3",
      text: `Hi ${name}, just checking you had a chance to look at the proposal I sent? Happy to answer any questions 🙂\n${proposalLink}`,
    },
    {
      label: "Day 7",
      text: `Hey ${name}, I wanted to follow up on the proposal. Is this still something you'd like to move forward with?\n${proposalLink}`,
    },
    {
      label: "Day 14",
      text: `Hi ${name}, the proposal expires in 48 hours. Let me know if you'd like to proceed or if the timing doesn't work right now.\n${proposalLink}`,
    },
  ];

  const copyAndOpen = (text: string) => {
    navigator.clipboard.writeText(text);
    window.open(
      `https://wa.me/?text=${encodeURIComponent(text)}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  return (
    <div className="space-y-4">
      <h4 className="font-medium text-[#faf8f4] text-sm flex items-center gap-2">
        <MessageCircle className="w-4 h-4 text-[#25d366]" />
        WhatsApp follow-up
      </h4>
      <p className="text-xs text-[#888890]">
        {daysSince} day{daysSince !== 1 ? "s" : ""} since sent. Use these templates:
      </p>
      {templates.map((t) => (
        <div key={t.label} className="space-y-2">
          <p className="text-xs font-medium text-[#c4c4cc]">{t.label}</p>
          <p className="text-xs text-[#888890] whitespace-pre-wrap line-clamp-3">{t.text}</p>
          <button
            type="button"
            onClick={() => copyAndOpen(t.text)}
            className="w-full rounded-lg border border-[#25d366]/50 bg-[#25d366]/10 text-[#25d366] py-2 text-xs font-medium hover:bg-[#25d366]/20 transition-colors"
          >
            Copy for WhatsApp
          </button>
        </div>
      ))}
    </div>
  );
}

interface ProposalPreviewProps {
  proposalId: string;
}

const statusColors: Record<string, string> = {
  draft: "bg-[#1e1e2e] text-[#888890]",
  sent: "bg-blue-500/20 text-blue-400",
  viewed: "bg-amber-500/20 text-amber-400",
  accepted: "bg-emerald-500/20 text-emerald-400",
  declined: "bg-red-500/20 text-red-400",
  expired: "bg-[#1e1e2e] text-[#888890]",
};

export function ProposalPreview({ proposalId }: ProposalPreviewProps) {
  const [proposal, setProposal] = useState<{
    id: string;
    share_id: string;
    title: string;
    status: string;
    generated_content: string | null;
    client_name: string;
    client_email?: string;
    budget_amount: number | null;
    budget_currency: string;
    deliverables?: string[] | null;
    sent_at?: string | null;
  } | null>(null);
  const [content, setContent] = useState("");
  const [saved, setSaved] = useState(true);
  const [shareOpen, setShareOpen] = useState(false);
  const [saveAsTemplateOpen, setSaveAsTemplateOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [mode, setMode] = useState<"edit" | "preview">("edit");
  const [profile, setProfile] = useState<{ full_name?: string | null; business_name?: string | null } | null>(null);
  const [sequence, setSequence] = useState<{ id: string; status: string; steps: SequenceStep[] } | null>(null);

  const load = useCallback(async () => {
    const res = await fetch(`/api/proposals/${proposalId}`);
    if (!res.ok) return;
    const data = await res.json();
    setProposal(data);
    setContent(data.generated_content ?? "");
  }, [proposalId]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    fetch("/api/profile")
      .then((r) => (r.ok ? r.json() : null))
      .then((p) => setProfile(p ?? null))
      .catch(() => setProfile(null));
  }, []);

  useEffect(() => {
    if (!proposalId || !proposal) return;
    if (proposal.status !== "sent" && proposal.status !== "viewed") {
      setSequence(null);
      return;
    }
    fetch(`/api/proposals/${proposalId}/sequence`)
      .then((r) => r.json())
      .then((d) => setSequence(d.sequence ?? null))
      .catch(() => setSequence(null));
  }, [proposalId, proposal]);

  const save = useCallback(async () => {
    if (!proposalId) return;
    await fetch(`/api/proposals/${proposalId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ generated_content: content }),
    });
    setSaved(true);
  }, [proposalId, content]);

  useEffect(() => {
    if (!proposal) return;
    const t = setInterval(save, 30000);
    return () => clearInterval(t);
  }, [proposal, save]);

  useEffect(() => {
    setSaved(false);
  }, [content]);

  if (!proposal) {
    return (
      <div className="rounded-xl border border-[#1e1e2e] bg-[#12121e] p-8 animate-pulse">
        <div className="h-8 bg-[#0a0a14]/50 rounded w-1/3 mb-4" />
        <div className="h-4 bg-[#0a0a14]/50 rounded w-full mb-2" />
        <div className="h-4 bg-[#0a0a14]/50 rounded w-2/3" />
      </div>
    );
  }

  const appUrl = typeof window !== "undefined" ? window.location.origin : "";
  const shareLink = `${appUrl}/proposal/${proposal.share_id}`;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Link href="/proposals" className="text-sm text-gold hover:underline">
          ← Proposals
        </Link>
        <div className="flex items-center gap-2 flex-wrap">
          <input
            type="text"
            value={proposal.title}
            className="bg-transparent border-none text-lg font-semibold text-[#faf8f4] focus:outline-none focus:ring-2 focus:ring-gold/50 rounded px-2"
            onChange={(e) => setProposal((p) => (p ? { ...p, title: e.target.value } : p))}
          />
          <span className={`rounded-full px-2 py-0.5 text-xs capitalize ${statusColors[proposal.status] ?? ""}`}>
            {proposal.status}
          </span>
          <button
            type="button"
            onClick={() => setMode(mode === "edit" ? "preview" : "edit")}
            className="rounded-lg border border-[#1e1e2e] px-3 py-1.5 text-sm text-[#888890] hover:text-[#faf8f4]"
          >
            {mode === "edit" ? "Preview" : "Edit"}
          </button>
          <a
            href={`/api/proposals/${proposalId}/pdf`}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg border border-[#1e1e2e] px-3 py-1.5 text-sm text-[#888890] hover:text-[#faf8f4] inline-block"
          >
            Download PDF
          </a>
          <button
            type="button"
            onClick={() => setShareOpen(true)}
            className="rounded-lg bg-gold px-3 py-1.5 text-sm font-medium text-[#0a0a14] hover:bg-[#e8c76a]"
          >
            Share Proposal
          </button>
          <div className="relative">
            <button
              type="button"
              onClick={() => setMoreOpen((o) => !o)}
              className="rounded-lg border border-[#1e1e2e] p-1.5 text-[#888890] hover:text-[#faf8f4]"
              aria-haspopup="true"
              aria-expanded={moreOpen}
            >
              ⋮
            </button>
            {moreOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setMoreOpen(false)} aria-hidden="true" />
                <div className="absolute right-0 top-full mt-1 z-20 min-w-[180px] rounded-lg border border-[#1e1e2e] bg-[#12121e] py-1 shadow-xl">
                  <button
                    type="button"
                    onClick={() => { setMoreOpen(false); setSaveAsTemplateOpen(true); }}
                    className="w-full px-4 py-2 text-left text-sm text-[#faf8f4] hover:bg-[#0a0a14]"
                  >
                    Save as template
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {proposal.status === "accepted" && (
        <div className="rounded-xl border border-gold/30 bg-gold/5 p-6">
          <h4 className="font-medium text-[#faf8f4] mb-2">Proposal accepted</h4>
          <p className="text-sm text-[#888890] mb-4">What would you like to do next?</p>
          <div className="flex flex-wrap gap-3">
            <Link
              href={`/contracts/new?proposalId=${proposalId}`}
              className="rounded-lg bg-gold px-4 py-2 text-sm font-medium text-[#0a0a14] hover:bg-[#e8c76a]"
            >
              Send Contract
            </Link>
            <Link
              href={`/invoices/new?proposalId=${proposalId}`}
              className="rounded-lg border border-gold/50 px-4 py-2 text-sm font-medium text-gold hover:bg-gold/10"
            >
              Send Invoice
            </Link>
            <span className="text-sm text-[#888890] self-center">or handle from dashboard</span>
          </div>
        </div>
      )}

      <div
        className={`grid gap-6 ${
          (proposal.status === "sent" || proposal.status === "viewed") && proposal.sent_at
            ? "lg:grid-cols-3"
            : "lg:grid-cols-2"
        }`}
      >
        <div className="rounded-xl border border-[#1e1e2e] bg-[#12121e] p-4">
          {mode === "edit" ? (
            <>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-[#888890]">Editor</span>
                {!saved && (
                  <button type="button" onClick={save} className="text-xs text-gold hover:underline">
                    Save
                  </button>
                )}
                {saved && <span className="text-xs text-[#888890]">Saved</span>}
              </div>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full min-h-[400px] bg-[#0a0a14] rounded-lg p-4 text-[#faf8f4] text-sm font-mono resize-y focus:outline-none focus:ring-2 focus:ring-gold/50"
                spellCheck={false}
              />
            </>
          ) : (
            <div className="max-w-none min-h-[400px] p-4 rounded-lg bg-[#0a0a14]">
              <ProposalContent content={content} variant="default" />
            </div>
          )}
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white text-gray-900 shadow-[0_4px_40px_rgba(0,0,0,0.06)] overflow-hidden">
          <div className="relative">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gold rounded-t-2xl" />
            <div className="px-8 md:px-10 pt-8 pb-6">
              <div className="flex items-center justify-between mb-6">
                {profile?.business_name ? (
                  <span className="font-serif font-bold text-gray-900 text-lg tracking-tight">{profile.business_name}</span>
                ) : (
                  <span className="text-xs text-gray-400 uppercase tracking-widest font-medium">Client Preview</span>
                )}
                <span className="text-[10px] text-gray-400 uppercase tracking-wider font-medium">
                  {new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                </span>
              </div>
              <div className="flex items-center gap-4 mb-6">
                <div className="flex-1 h-px bg-gray-200" />
                <div className="w-1.5 h-1.5 rounded-full bg-gold" />
                <div className="flex-1 h-px bg-gray-200" />
              </div>
              <div className="text-center pb-4">
                <p className="text-[10px] text-gray-400 uppercase tracking-[0.2em] font-semibold mb-2">Prepared exclusively for</p>
                <p className="font-serif text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">{proposal.client_name}</p>
                <p className="text-gray-500 text-sm mt-2 font-medium">{proposal.title}</p>
              </div>
            </div>
          </div>
          <div className="px-8 md:px-10 pb-8">
            <ProposalContent content={content} variant="preview" brandColor="#c9a84c" />
          </div>
        </div>

        {(proposal.status === "sent" || proposal.status === "viewed") && proposal.sent_at && (
          <div className="lg:col-span-1 rounded-xl border border-[#1e1e2e] bg-[#12121e] p-4 h-fit space-y-6">
            {sequence ? (
              <FollowUpSequenceSidebar
                proposalId={proposalId}
                sequence={sequence}
                onPause={() => {}}
                onCancel={() => setSequence(null)}
                onRefresh={load}
              />
            ) : (
              <WhatsAppFollowUpSidebar
                clientName={proposal.client_name}
                proposalLink={shareLink}
                sentAt={proposal.sent_at}
              />
            )}
          </div>
        )}
      </div>

      <ShareModal
        open={shareOpen}
        onClose={() => setShareOpen(false)}
        proposalId={proposal.id}
        proposalLink={shareLink}
        proposalTitle={proposal.title}
        clientEmail={proposal.client_email ?? undefined}
        clientName={proposal.client_name}
        deliverables={proposal.deliverables ?? []}
        budgetAmount={proposal.budget_amount}
        budgetCurrency={proposal.budget_currency ?? "USD"}
        freelancerName={profile?.full_name ?? undefined}
        businessName={profile?.business_name ?? undefined}
      />
      <SaveAsTemplateModal
        open={saveAsTemplateOpen}
        onClose={() => setSaveAsTemplateOpen(false)}
        defaultName={proposal.title}
        projectType={(proposal as { project_type?: string }).project_type ?? "Consulting"}
        content={content}
        onSaved={() => setSaveAsTemplateOpen(false)}
      />
    </div>
  );
}

function SaveAsTemplateModal({
  open,
  onClose,
  defaultName,
  projectType,
  content,
  onSaved,
}: {
  open: boolean;
  onClose: () => void;
  defaultName: string;
  projectType: string;
  content: string;
  onSaved: () => void;
}) {
  const [name, setName] = useState(defaultName);
  const [description, setDescription] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (open) {
      setName(defaultName);
      setDescription("");
      setError("");
    }
  }, [open, defaultName]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) { setError("Name required"); return; }
    setSaving(true);
    setError("");
    try {
      const res = await fetch("/api/templates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), description: description.trim() || undefined, project_type: projectType, content }),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        setError(d.error || "Failed to save template");
        return;
      }
      onSaved();
      onClose();
    } finally {
      setSaving(false);
    }
  }

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60" onClick={onClose}>
      <div className="rounded-xl border border-[#1e1e2e] bg-[#12121e] p-6 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
        <h2 className="font-semibold text-[#faf8f4] mb-4">Save as template</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-[#888890] mb-1">Template name *</label>
            <input value={name} onChange={(e) => setName(e.target.value)} className="w-full rounded-lg border border-[#1e1e2e] bg-[#0a0a14] px-3 py-2 text-[#faf8f4]" required />
          </div>
          <div>
            <label className="block text-sm text-[#888890] mb-1">Description (optional)</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={2} className="w-full rounded-lg border border-[#1e1e2e] bg-[#0a0a14] px-3 py-2 text-[#faf8f4]" />
          </div>
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <div className="flex gap-2">
            <button type="submit" disabled={saving} className="rounded-lg bg-gold px-4 py-2 text-sm font-medium text-[#0a0a14] disabled:opacity-50">Save template</button>
            <button type="button" onClick={onClose} className="rounded-lg border border-[#1e1e2e] px-4 py-2 text-sm text-[#888890]">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}

