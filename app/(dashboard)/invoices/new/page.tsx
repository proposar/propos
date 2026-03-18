"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

export default function NewInvoicePage() {
  const searchParams = useSearchParams();
  const proposalId = searchParams.get("proposalId");
  const prefillTitle = searchParams.get("title") ?? "";
  const prefillClientName = searchParams.get("clientName") ?? "";
  const prefillClientEmail = searchParams.get("clientEmail") ?? "";

  const [proposals, setProposals] = useState<Array<{ id: string; title: string }>>([]);
  const [selectedProposal, setSelectedProposal] = useState(proposalId ?? "");
  const [loadingProposals, setLoadingProposals] = useState(true);
  const [proposalError, setProposalError] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [lineItems, setLineItems] = useState<Array<{ item_name: string; quantity: number; unit: string; rate: number; amount: number }>>([]);
  const [subtotal, setSubtotal] = useState(0);
  const [discountPercent, setDiscountPercent] = useState(0);
  const [taxPercent, setTaxPercent] = useState(0);
  const [total, setTotal] = useState(0);
  const [manualAmount, setManualAmount] = useState(0);
  const [currency, setCurrency] = useState("USD");
  const [dueDate, setDueDate] = useState("");
  const [paymentLink, setPaymentLink] = useState("");

  const [saving, setSaving] = useState(false);
  const [savedInvoice, setSavedInvoice] = useState<{ id: string; share_id: string } | null>(null);
  const [sendingEmail, setSendingEmail] = useState(false);
  const [emailStatus, setEmailStatus] = useState<string>("");

  useEffect(() => {
    const d = new Date();
    d.setDate(d.getDate() + 7);
    setDueDate(d.toISOString().slice(0, 10));
  }, []);

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

  useEffect(() => {
    if (proposalId) return;
    if (!title && prefillTitle) setTitle(prefillTitle);
    if (!clientName && prefillClientName) setClientName(prefillClientName);
    if (!clientEmail && prefillClientEmail) setClientEmail(prefillClientEmail);
  }, [proposalId, prefillTitle, prefillClientName, prefillClientEmail, title, clientName, clientEmail]);

  useEffect(() => {
    if (!selectedProposal) {
      setLineItems([]);
      setSubtotal(manualAmount);
      setDiscountPercent(0);
      setTaxPercent(0);
      setTotal(manualAmount);
      return;
    }

    fetch(`/api/invoices/from-proposal?proposalId=${selectedProposal}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (d) {
          setTitle(d.title ?? "");
          setClientName(d.clientName ?? "");
          setClientEmail(d.clientEmail ?? "");
          setLineItems(d.lineItems ?? []);
          setSubtotal(d.subtotal ?? 0);
          setDiscountPercent(d.discountPercent ?? 0);
          setTaxPercent(d.taxPercent ?? 0);
          setTotal(d.total ?? 0);
          setManualAmount(d.total ?? 0);
          setCurrency(d.currency ?? "USD");
        }
      })
      .catch(() => {});
  }, [selectedProposal, manualAmount]);

  const save = async () => {
    if (!title.trim() || !clientName.trim()) return;
    setSaving(true);
    setEmailStatus("");
    try {
      const response = await fetch("/api/invoices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          proposalId: selectedProposal || null,
          title: title.trim(),
          clientName: clientName.trim(),
          clientEmail: clientEmail || null,
          lineItems: selectedProposal
            ? lineItems
            : [
                {
                  item_name: title.trim(),
                  quantity: 1,
                  unit: "service",
                  rate: manualAmount,
                  amount: manualAmount,
                },
              ],
          subtotal: selectedProposal ? subtotal : manualAmount,
          discountPercent: selectedProposal ? discountPercent : 0,
          taxPercent: selectedProposal ? taxPercent : 0,
          total: selectedProposal ? total : manualAmount,
          currency,
          dueDate: dueDate || null,
          paymentLink: paymentLink || null,
        }),
      });

      const data = await response.json().catch(() => null);
      if (response.ok && data?.id && data?.share_id) {
        setSavedInvoice({ id: data.id, share_id: data.share_id });
      }
    } finally {
      setSaving(false);
    }
  };

  const publicInvoiceUrl =
    typeof window !== "undefined" && savedInvoice
      ? `${window.location.origin}/invoice/${savedInvoice.share_id}`
      : "";

  const handleSendInvoiceEmail = async () => {
    if (!savedInvoice) return;
    const to = window.prompt("Client email", clientEmail);
    if (!to?.trim()) return;
    const message = window.prompt("Optional personal message", "") ?? "";

    setSendingEmail(true);
    setEmailStatus("");
    try {
      const response = await fetch("/api/emails/send-invoice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          invoiceId: savedInvoice.id,
          to: to.trim(),
          message,
        }),
      });

      const data = await response.json().catch(() => null);
      if (response.ok && data?.sent) {
        setEmailStatus("Invoice email sent successfully ✓");
      } else {
        setEmailStatus(data?.error ?? "Failed to send invoice email");
      }
    } finally {
      setSendingEmail(false);
    }
  };

  const handleSendInvoiceWhatsApp = () => {
    if (!publicInvoiceUrl) return;
    const text = `Hi ${clientName},\n\nPlease review your invoice:\n${publicInvoiceUrl}\n\nThanks.`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <Link href="/invoices" className="text-sm text-gold hover:underline">← Invoices</Link>
      <h1 className="font-serif text-2xl font-bold text-[#faf8f4]">New Invoice</h1>

      <div className="rounded-xl border border-[#1e1e2e] bg-[#12121e] p-6 space-y-4">
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="block text-sm font-medium text-[#faf8f4]">From proposal (optional)</label>
            <button
              onClick={loadProposals}
              disabled={loadingProposals}
              className="text-xs text-gold hover:underline disabled:opacity-50"
            >
              {loadingProposals ? "Refreshing..." : "Refresh"}
            </button>
          </div>
          {loadingProposals && <div className="text-xs text-[#888890] mb-2">Loading proposals...</div>}
          {proposalError && <div className="text-xs text-red-400 mb-2 p-2 bg-red-500/10 rounded border border-red-500/30">{proposalError}</div>}
          <select
            value={selectedProposal}
            onChange={(e) => setSelectedProposal(e.target.value)}
            className="w-full rounded-lg border border-[#1e1e2e] bg-[#0a0a14] px-3 py-2 text-[#faf8f4]"
          >
            <option value="">No proposal (manual invoice)</option>
            {proposals.length > 0 ? (
              proposals.map((p) => (
                <option key={p.id} value={p.id}>{p.title}</option>
              ))
            ) : (
              <option disabled>{loadingProposals ? "Loading..." : "No accepted proposals"}</option>
            )}
          </select>
          {proposals.length === 0 && !loadingProposals && (
            <p className="text-xs text-[#666680] mt-1">No accepted proposals yet. Send one to a client and have them accept it.</p>
          )}
        </div>

        <div>
          <label className="block text-sm text-[#888890] mb-1">Title *</label>
          <input value={title} onChange={(e) => setTitle(e.target.value)} className="w-full rounded-lg border border-[#1e1e2e] bg-[#0a0a14] px-3 py-2 text-[#faf8f4]" />
        </div>

        <div>
          <label className="block text-sm text-[#888890] mb-1">Client name *</label>
          <input value={clientName} onChange={(e) => setClientName(e.target.value)} className="w-full rounded-lg border border-[#1e1e2e] bg-[#0a0a14] px-3 py-2 text-[#faf8f4]" />
        </div>

        <div>
          <label className="block text-sm text-[#888890] mb-1">Client email</label>
          <input type="email" value={clientEmail} onChange={(e) => setClientEmail(e.target.value)} className="w-full rounded-lg border border-[#1e1e2e] bg-[#0a0a14] px-3 py-2 text-[#faf8f4]" />
        </div>

        <div>
          <label className="block text-sm text-[#888890] mb-1">Due date</label>
          <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className="w-full rounded-lg border border-[#1e1e2e] bg-[#0a0a14] px-3 py-2 text-[#faf8f4]" />
        </div>

        <div>
          <label className="block text-sm text-[#888890] mb-1">Payment link</label>
          <input value={paymentLink} onChange={(e) => setPaymentLink(e.target.value)} placeholder="Lemon Squeezy, PayPal, etc." className="w-full rounded-lg border border-[#1e1e2e] bg-[#0a0a14] px-3 py-2 text-[#faf8f4]" />
        </div>

        <div className="border-t border-[#1e1e2e] pt-4">
          {selectedProposal ? (
            <>
              <p className="text-sm text-[#888890] mb-2">Line items (from proposal)</p>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {lineItems.map((item, i) => (
                  <div key={i} className="flex justify-between text-sm text-[#c4c4cc]">
                    <span>{item.item_name} × {item.quantity}</span>
                    <span>{currency} {item.amount?.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div>
              <label className="block text-sm text-[#888890] mb-1">Invoice amount *</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={manualAmount}
                onChange={(e) => setManualAmount(Math.max(0, Number(e.target.value) || 0))}
                className="w-full rounded-lg border border-[#1e1e2e] bg-[#0a0a14] px-3 py-2 text-[#faf8f4]"
              />
            </div>
          )}
          <p className="text-sm font-medium text-[#faf8f4] mt-2">Total: {currency} {(selectedProposal ? total : manualAmount).toLocaleString()}</p>
        </div>

        <button
          onClick={save}
          disabled={saving || !title.trim() || !clientName.trim() || (!selectedProposal && manualAmount <= 0)}
          className="rounded-lg bg-gold px-4 py-2 text-sm font-medium text-[#0a0a14] disabled:opacity-50"
        >
          {saving ? "Saving..." : savedInvoice ? "Saved" : "Create Invoice"}
        </button>
      </div>

      {savedInvoice && (
        <div className="rounded-xl border border-[#1e1e2e] bg-[#12121e] p-6 space-y-3">
          <h3 className="font-semibold text-[#faf8f4]">Invoice saved. Share now</h3>
          <div className="flex flex-wrap gap-2">
            <Link
              href={`/invoice/${savedInvoice.share_id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg bg-gold px-4 py-2 text-sm font-medium text-[#0a0a14] hover:bg-[#e8c76a]"
            >
              Open Public Invoice
            </Link>
            <button
              type="button"
              onClick={handleSendInvoiceEmail}
              disabled={sendingEmail}
              className="rounded-lg border border-[#1e1e2e] px-4 py-2 text-sm text-[#888890] hover:text-[#faf8f4] disabled:opacity-50"
            >
              {sendingEmail ? "Sending..." : "Send Email"}
            </button>
            <button
              type="button"
              onClick={handleSendInvoiceWhatsApp}
              className="rounded-lg border border-[#1e1e2e] px-4 py-2 text-sm text-[#888890] hover:text-[#faf8f4]"
            >
              Send WhatsApp
            </button>
            <button
              type="button"
              onClick={() => navigator.clipboard.writeText(publicInvoiceUrl)}
              className="rounded-lg border border-[#1e1e2e] px-4 py-2 text-sm text-[#888890] hover:text-[#faf8f4]"
            >
              Copy Link
            </button>
            <a
              href={`/api/invoices/${savedInvoice.id}/pdf`}
              download
              className="rounded-lg border border-[#1e1e2e] px-4 py-2 text-sm text-[#888890] hover:text-[#faf8f4]"
            >
              Download PDF
            </a>
          </div>
          {!!emailStatus && (
            <p className={`text-sm ${emailStatus.includes("successfully") ? "text-emerald-400" : "text-red-400"}`}>
              {emailStatus}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
