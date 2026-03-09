"use client";

import { useState, useEffect } from "react";
import { trackProposalSent } from "@/lib/analytics";
import { MessageCircle, Mail, Link2 } from "lucide-react";

export type ShareTab = "email" | "whatsapp" | "link";

interface ShareModalProps {
  open: boolean;
  onClose: () => void;
  proposalId?: string;
  proposalLink?: string;
  proposalTitle?: string;
  clientEmail?: string;
  /** Pre-fill for WhatsApp rich template */
  clientName?: string;
  clientPhone?: string;
  deliverables?: string[];
  budgetAmount?: number | null;
  budgetCurrency?: string;
  freelancerName?: string;
  businessName?: string;
  /** Open directly on WhatsApp tab */
  initialTab?: ShareTab;
}

function buildDefaultWhatsAppMessage(
  link: string,
  clientName: string,
  projectTitle: string,
  deliverables: string[],
  amount: number | null,
  currency: string,
  yourName: string,
  businessName: string
): string {
  const name = clientName || "there";
  const deliverablesList =
    deliverables.length > 0
      ? deliverables.map((d) => `- ${d}`).join("\n")
      : "- Full project deliverables";
  const amountLine =
    amount != null
      ? `- Total investment: ${currency} ${amount.toLocaleString()}`
      : "";
  const investment = amountLine ? `\n${amountLine}` : "";
  const signOff = yourName || "Your freelancer";
  const biz = businessName ? `\n${businessName}` : "";

  return `Hi ${name} 👋

I've put together a proposal for ${projectTitle}.

You can view it here:
${link}

It covers:
${deliverablesList}${investment}

Happy to answer any questions. Looking forward to working together!

${signOff}${biz}`.trim();
}

export function ShareModal({
  open,
  onClose,
  proposalId,
  proposalLink = "",
  proposalTitle = "",
  clientEmail,
  clientName = "",
  clientPhone = "",
  deliverables = [],
  budgetAmount = null,
  budgetCurrency = "USD",
  freelancerName = "",
  businessName = "",
  initialTab = "email",
}: ShareModalProps) {
  const [activeTab, setActiveTab] = useState<ShareTab>(initialTab);
  const [copied, setCopied] = useState(false);
  const [copiedMessage, setCopiedMessage] = useState(false);
  const [toEmail, setToEmail] = useState(clientEmail ?? "");
  const [whatsappPhone, setWhatsappPhone] = useState(clientPhone);
  const [whatsappMessage, setWhatsappMessage] = useState("");
  const [subject, setSubject] = useState(`Proposal: ${proposalTitle}`);
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const [previewHtml, setPreviewHtml] = useState("");
  const [loadingPreview, setLoadingPreview] = useState(false);
  const [showChaseCard, setShowChaseCard] = useState(false);
  const [chaseActivating, setChaseActivating] = useState(false);
  const [chaseEnabled, setChaseEnabled] = useState(true);

  const link = proposalLink || "https://Proposar.io/p/...";

  useEffect(() => {
    if (open) {
      setActiveTab(initialTab);
      setShowChaseCard(false);
      setChaseEnabled(true);
      if (clientEmail) setToEmail(clientEmail);
      if (clientPhone) setWhatsappPhone(clientPhone);
      setWhatsappMessage(
        buildDefaultWhatsAppMessage(
          link,
          clientName,
          proposalTitle,
          deliverables,
          budgetAmount,
          budgetCurrency,
          freelancerName,
          businessName
        )
      );
    }
  }, [
    open,
    initialTab,
    clientEmail,
    clientPhone,
    clientName,
    proposalTitle,
    link,
    deliverables,
    budgetAmount,
    budgetCurrency,
    freelancerName,
    businessName,
  ]);

  if (!open) return null;

  const copyLink = () => {
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const copyMessage = () => {
    navigator.clipboard.writeText(whatsappMessage);
    setCopiedMessage(true);
    setTimeout(() => setCopiedMessage(false), 2000);
  };

  const markProposalSent = async () => {
    if (!proposalId) return;
    try {
      await fetch(`/api/proposals/${proposalId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "sent" }),
      });
      trackProposalSent();
    } catch {
      // Best-effort; don't block user
    }
  };

  const openWhatsApp = async () => {
    const phone = whatsappPhone.replace(/\D/g, "") || "";
    const url = phone
      ? `https://wa.me/${phone}?text=${encodeURIComponent(whatsappMessage)}`
      : `https://wa.me/?text=${encodeURIComponent(whatsappMessage)}`;
    await markProposalSent();
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const loadPreview = async () => {
    setLoadingPreview(true);
    setShowPreview(true);
    try {
      const res = await fetch("/api/emails/preview-proposal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientName: clientName || clientEmail?.split("@")[0] || "Client",
          projectTitle: proposalTitle,
          personalMessage: message,
          proposalLink: link,
          freelancerName: freelancerName || undefined,
        }),
      });
      if (res.ok) {
        const html = await res.text();
        setPreviewHtml(html);
      } else {
        setPreviewHtml("<p style='color: white;'>Failed to load preview.</p>");
      }
    } catch {
      setPreviewHtml("<p style='color: white;'>Error loading preview.</p>");
    } finally {
      setLoadingPreview(false);
    }
  };

  const tabs: { id: ShareTab; label: string; icon: React.ReactNode }[] = [
    { id: "email", label: "Email", icon: <Mail className="w-4 h-4" /> },
    { id: "whatsapp", label: "WhatsApp", icon: <MessageCircle className="w-4 h-4" /> },
    { id: "link", label: "Copy Link", icon: <Link2 className="w-4 h-4" /> },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60"
      onClick={onClose}
    >
      <div
        className={`rounded-xl border border-[#1e1e2e] bg-[#12121e] p-6 w-full max-h-[90vh] overflow-y-auto ${showPreview ? "max-w-2xl" : "max-w-md"}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-semibold text-[#faf8f4] text-lg">Share Proposal</h3>
          {showPreview && (
            <button onClick={() => setShowPreview(false)} className="text-sm text-gold hover:underline">
              Back
            </button>
          )}
        </div>

        {!showPreview && !showChaseCard && (
          <div className="flex gap-1 p-1 rounded-lg bg-[#0a0a14] mb-6">
            {tabs.map((t) => (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === t.id
                    ? "bg-[#1e1e2e] text-[#faf8f4]"
                    : "text-[#888890] hover:text-[#faf8f4]"
                }`}
              >
                {t.icon}
                {t.label}
              </button>
            ))}
          </div>
        )}

        {showPreview ? (
          <div className="bg-[#0a0a14] rounded-lg border border-[#1e1e2e] overflow-hidden min-h-[400px] flex items-center justify-center">
            {loadingPreview ? (
              <span className="text-white text-sm">Loading preview...</span>
            ) : (
              <iframe
                srcDoc={previewHtml}
                className="w-full h-full min-h-[400px] border-none"
                title="Email Preview"
              />
            )}
          </div>
        ) : activeTab === "whatsapp" ? (
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-[#faf8f4] block mb-2">
                Client&apos;s WhatsApp number
              </label>
              <input
                type="tel"
                placeholder="+1 234 567 8900"
                value={whatsappPhone}
                onChange={(e) => setWhatsappPhone(e.target.value)}
                className="w-full rounded-lg border border-[#1e1e2e] bg-[#0a0a14] px-3 py-2 text-[#faf8f4] text-sm"
              />
              <p className="text-xs text-[#888890] mt-1">
                Include country code. USA: +1, UK: +44, AUS: +61, India: +91
              </p>
            </div>

            <div>
              <label className="text-sm font-medium text-[#faf8f4] block mb-2">
                Your Message
              </label>
              <textarea
                value={whatsappMessage}
                onChange={(e) => setWhatsappMessage(e.target.value)}
                rows={8}
                className="w-full rounded-lg border border-[#1e1e2e] bg-[#0a0a14] px-3 py-2 text-[#faf8f4] text-sm resize-none"
              />
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={copyMessage}
                className="flex-1 rounded-lg border border-[#1e1e2e] text-[#888890] py-3 text-sm hover:text-[#faf8f4] hover:border-gold/30 transition-colors"
              >
                {copiedMessage ? "Copied!" : "Copy Message"}
              </button>
              <button
                type="button"
                onClick={openWhatsApp}
                className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-[#25d366] text-white font-medium py-3 text-sm hover:bg-[#20ba5a] transition-colors"
              >
                <MessageCircle className="w-5 h-5" />
                Open WhatsApp →
              </button>
            </div>

            <p className="text-xs text-[#888890]">
              This opens WhatsApp. Your message is pre-written — just hit send.
            </p>
          </div>
        ) : activeTab === "email" ? (
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-[#faf8f4] block mb-2">
                Recipient Email
              </label>
              <input
                type="email"
                placeholder="client@example.com"
                value={toEmail}
                onChange={(e) => setToEmail(e.target.value)}
                className="w-full rounded-lg border border-[#1e1e2e] bg-[#0a0a14] px-3 py-2 text-[#faf8f4] text-sm"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-[#faf8f4] block mb-2">
                Subject
              </label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full rounded-lg border border-[#1e1e2e] bg-[#0a0a14] px-3 py-2 text-[#faf8f4] text-sm"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-[#faf8f4] block mb-2">
                Personal Message
              </label>
              <textarea
                placeholder="Add a personal note..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={3}
                className="w-full rounded-lg border border-[#1e1e2e] bg-[#0a0a14] px-3 py-2 text-[#faf8f4] text-sm resize-none"
              />
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={loadPreview}
                className="flex-1 rounded-lg border border-[#1e1e2e] text-[#888890] py-2 text-sm hover:text-[#faf8f4]"
              >
                Preview
              </button>
              <button
                type="button"
                disabled={!toEmail.trim() || !proposalId || sending}
                onClick={async () => {
                  if (!toEmail.trim() || !proposalId) return;
                  setSending(true);
                  setSendError("");
                  try {
                    const res = await fetch("/api/emails/send-proposal", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({
                        to: toEmail.trim(),
                        subject,
                        message,
                        proposalId,
                      }),
                    });
                    const data = await res.json();
                    if (res.ok && data.sent) {
                      trackProposalSent();
                      setShowChaseCard(true);
                    } else {
                      setSendError(data.error ?? "Failed to send");
                    }
                  } catch {
                    setSendError("Failed to send");
                  } finally {
                    setSending(false);
                  }
                }}
                className="flex-1 rounded-lg bg-gold text-[#0a0a14] font-medium py-2 text-sm hover:bg-[#e8c76a] disabled:opacity-50"
              >
                {sending ? "Sending..." : "Send Email"}
              </button>
            </div>

            {sendError && <p className="text-red-400 text-sm">{sendError}</p>}
          </div>
        ) : showChaseCard ? (
          <div className="space-y-4">
            <h4 className="font-medium text-[#faf8f4]">Set up auto follow-ups?</h4>
            <p className="text-sm text-[#888890]">
              Proposar will automatically follow up with {clientName || "your client"} if they don&apos;t respond:
            </p>
            <div className="rounded-lg border border-[#1e1e2e] bg-[#0a0a14] p-4 space-y-2 text-sm">
              <p className="text-[#c4c4cc]">Day 0 &bull; Proposal sent (now)</p>
              <p className="text-[#888890]">Day 3 &bull; &quot;Hey, did you get a chance to look at this?&quot;</p>
              <p className="text-[#888890]">Day 7 &bull; &quot;Quick summary of what&apos;s included...&quot;</p>
              <p className="text-[#888890]">Day 14 &bull; &quot;Is this still something you&apos;d like to explore?&quot;</p>
              <p className="text-[#888890]">Day 21 &bull; &quot;Final reminder — proposal expires soon&quot;</p>
            </div>
            <label className="flex items-center gap-2 text-sm text-[#c4c4cc]">
              <input
                type="checkbox"
                checked={chaseEnabled}
                onChange={(e) => setChaseEnabled(e.target.checked)}
                className="rounded border-[#1e1e2e] bg-[#0a0a14]"
              />
              Enable smart follow-ups (emails stop if client responds or accepts)
            </label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => { setShowChaseCard(false); onClose(); }}
                className="flex-1 rounded-lg border border-[#1e1e2e] text-[#888890] py-2 text-sm hover:text-[#faf8f4]"
              >
                Skip
              </button>
              <button
                type="button"
                disabled={!chaseEnabled || !proposalId || chaseActivating}
                onClick={async () => {
                  if (!proposalId || !chaseEnabled) return;
                  setChaseActivating(true);
                  try {
                    const r = await fetch(`/api/proposals/${proposalId}/sequence`, { method: "POST" });
                    if (r.ok) {
                      onClose();
                    }
                  } finally {
                    setChaseActivating(false);
                  }
                }}
                className="flex-1 rounded-lg bg-gold text-[#0a0a14] font-medium py-2 text-sm hover:bg-[#e8c76a] disabled:opacity-50"
              >
                {chaseActivating ? "Activating..." : "Activate Sequence"}
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-[#888890]">Direct link to your proposal:</p>

            <div className="flex gap-2">
              <input
                type="text"
                readOnly
                value={link}
                className="flex-1 rounded-lg border border-[#1e1e2e] bg-[#0a0a14] px-3 py-2 text-[#faf8f4] text-xs font-mono"
              />
              <button
                type="button"
                onClick={copyLink}
                className="rounded-lg bg-gold px-4 py-2 text-sm font-medium text-[#0a0a14] hover:bg-[#e8c76a]"
              >
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>

            <p className="text-xs text-[#888890] text-center py-4">
              Share this link in Slack, Teams, email, or anywhere else
            </p>
          </div>
        )}

        <button
          type="button"
          onClick={onClose}
          className="w-full rounded-lg border border-[#1e1e2e] py-2 text-[#888890] hover:text-[#faf8f4] hover:border-[#1e1e2e] mt-6"
        >
          Done
        </button>
      </div>
    </div>
  );
}
