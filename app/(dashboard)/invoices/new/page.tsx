"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

export default function NewInvoicePage() {
  const searchParams = useSearchParams();
  const proposalId = searchParams.get("proposalId");
  const [proposals, setProposals] = useState<Array<{ id: string; title: string }>>([]);
  const [selectedProposal, setSelectedProposal] = useState(proposalId ?? "");
  const [title, setTitle] = useState("");
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [lineItems, setLineItems] = useState<Array<{ item_name: string; quantity: number; unit: string; rate: number; amount: number }>>([]);
  const [subtotal, setSubtotal] = useState(0);
  const [discountPercent, setDiscountPercent] = useState(0);
  const [taxPercent, setTaxPercent] = useState(0);
  const [total, setTotal] = useState(0);
  const [currency, setCurrency] = useState("USD");
  const [dueDate, setDueDate] = useState("");
  const [paymentLink, setPaymentLink] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const d = new Date();
    d.setDate(d.getDate() + 7);
    setDueDate(d.toISOString().slice(0, 10));
  }, []);

  useEffect(() => {
    fetch("/api/proposals")
      .then((r) => r.json())
      .then((d) => setProposals(Array.isArray(d) ? d.filter((p: { status: string }) => p.status === "accepted") : []))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (proposalId) setSelectedProposal(proposalId);
  }, [proposalId]);

  useEffect(() => {
    if (!selectedProposal) return;
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
          setCurrency(d.currency ?? "USD");
        }
      })
      .catch(() => {});
  }, [selectedProposal]);

  const save = async () => {
    if (!title.trim() || !clientName.trim()) return;
    setSaving(true);
    try {
      const r = await fetch("/api/invoices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          proposalId: selectedProposal || null,
          title: title.trim(),
          clientName: clientName.trim(),
          clientEmail: clientEmail || null,
          lineItems,
          subtotal,
          discountPercent,
          taxPercent,
          total,
          currency,
          dueDate: dueDate || null,
          paymentLink: paymentLink || null,
        }),
      });
      const d = await r.json();
      if (d.id) setSaved(true);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <Link href="/invoices" className="text-sm text-gold hover:underline">← Invoices</Link>
      <h1 className="font-serif text-2xl font-bold text-[#faf8f4]">New Invoice</h1>

      <div className="rounded-xl border border-[#1e1e2e] bg-[#12121e] p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-[#faf8f4] mb-1">From proposal *</label>
          <select
            value={selectedProposal}
            onChange={(e) => setSelectedProposal(e.target.value)}
            className="w-full rounded-lg border border-[#1e1e2e] bg-[#0a0a14] px-3 py-2 text-[#faf8f4]"
          >
            <option value="">Select an accepted proposal</option>
            {proposals.map((p) => (
              <option key={p.id} value={p.id}>{p.title}</option>
            ))}
          </select>
          {proposals.length === 0 && (
            <p className="text-sm text-[#888890] mt-2">
              Invoices are created from accepted proposals. You have no accepted proposals yet.{" "}
              <Link href="/proposals" className="text-gold hover:underline">View proposals</Link>
            </p>
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
          <p className="text-sm text-[#888890] mb-2">Line items (from proposal)</p>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {lineItems.map((item, i) => (
              <div key={i} className="flex justify-between text-sm text-[#c4c4cc]">
                <span>{item.item_name} × {item.quantity}</span>
                <span>{currency} {item.amount?.toLocaleString()}</span>
              </div>
            ))}
          </div>
          <p className="text-sm font-medium text-[#faf8f4] mt-2">Total: {currency} {total.toLocaleString()}</p>
        </div>
        <button
          onClick={save}
          disabled={saving || !selectedProposal || !title.trim() || !clientName.trim()}
          className="rounded-lg bg-gold px-4 py-2 text-sm font-medium text-[#0a0a14] disabled:opacity-50"
        >
          {saving ? "Saving..." : saved ? "Saved" : "Create Invoice"}
        </button>
      </div>
    </div>
  );
}
