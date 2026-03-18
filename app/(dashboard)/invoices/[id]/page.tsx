"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

const statusStyles: Record<string, string> = {
  draft: "bg-[#1e1e2e] text-[#888890]",
  sent: "bg-blue-500/20 text-blue-400",
  paid: "bg-emerald-500/20 text-emerald-400",
  overdue: "bg-red-500/20 text-red-400",
  cancelled: "bg-[#1e1e2e] text-[#888890]",
};

const paymentStatusStyles: Record<string, string> = {
  unpaid: "bg-red-500/20 text-red-400",
  partially_paid: "bg-yellow-500/20 text-yellow-400",
  deposit_paid: "bg-orange-500/20 text-orange-400",
  fully_paid: "bg-emerald-500/20 text-emerald-400",
};

export default function InvoiceDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const [invoice, setInvoice] = useState<{
    id: string;
    share_id: string;
    invoice_number: string;
    title: string;
    status: string;
    payment_status?: string;
    client_name: string;
    client_email: string | null;
    line_items: Array<{ item_name: string; quantity: number; unit: string; rate: number; amount: number }>;
    subtotal: number;
    discount_percent: number;
    tax_percent: number;
    total: number;
    currency: string;
    due_date: string | null;
    payment_link: string | null;
    amount_paid?: number;
    deposit_percent?: number;
  } | null>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [sendingEmail, setSendingEmail] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch(`/api/invoices/${id}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => setInvoice(d))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="p-8 text-[#888890]">Loading...</div>;
  if (!invoice) return <div className="p-8 text-[#888890]">Invoice not found.</div>;

  const publicLink = typeof window !== "undefined" ? `${window.location.origin}/invoice/${invoice.share_id}` : "";

  const saveChanges = async () => {
    setSaving(true);
    setMessage("");
    try {
      const response = await fetch(`/api/invoices/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: invoice.title,
          client_name: invoice.client_name,
          client_email: invoice.client_email,
          due_date: invoice.due_date,
          payment_link: invoice.payment_link,
          status: invoice.status,
        }),
      });

      const data = await response.json().catch(() => null);
      if (response.ok && data) {
        setInvoice(data);
        setMessage("Invoice updated successfully ✓");
      } else {
        setMessage(data?.error ?? "Failed to update invoice");
      }
    } finally {
      setSaving(false);
    }
  };

  const sendEmail = async () => {
    const to = window.prompt("Client email", invoice.client_email ?? "");
    if (!to?.trim()) return;
    const personalMessage = window.prompt("Optional personal message", "") ?? "";

    setSendingEmail(true);
    setMessage("");
    try {
      const response = await fetch("/api/emails/send-invoice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ invoiceId: invoice.id, to: to.trim(), message: personalMessage }),
      });
      const data = await response.json().catch(() => null);
      if (response.ok && data?.sent) {
        setInvoice((prev) => (prev ? { ...prev, status: prev.status === "draft" ? "sent" : prev.status } : prev));
        setMessage("Invoice email sent successfully ✓");
      } else {
        setMessage(data?.error ?? "Failed to send invoice email");
      }
    } finally {
      setSendingEmail(false);
    }
  };

  const sendWhatsApp = async () => {
    const text = `Hi ${invoice.client_name},\n\nPlease review your invoice:\n${publicLink}\n\nThanks.`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank", "noopener,noreferrer");

    if (invoice.status === "draft") {
      await fetch(`/api/invoices/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "sent" }),
      }).catch(() => {});
      setInvoice((prev) => (prev ? { ...prev, status: "sent" } : prev));
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <Link href="/invoices" className="text-sm text-gold hover:underline">← Invoices</Link>

      <div className="flex justify-between items-start">
        <div>
          <h1 className="font-serif text-2xl font-bold text-[#faf8f4]">{invoice.title}</h1>
          <p className="text-sm text-[#888890] mt-1">{invoice.invoice_number}</p>
        </div>
        <div className="flex gap-2">
          <span className={`rounded-full px-2 py-1 text-xs capitalize ${statusStyles[invoice.status] ?? "bg-[#1e1e2e] text-[#888890]"}`}>
            {invoice.status}
          </span>
          {invoice.payment_status && (
            <span className={`rounded-full px-2 py-1 text-xs capitalize ${paymentStatusStyles[invoice.payment_status] ?? "bg-[#1e1e2e] text-[#888890]"}`}>
              {invoice.payment_status === "deposit_paid" && "💰 Pending Half"}
              {invoice.payment_status === "fully_paid" && "✓ Fully Paid"}
              {invoice.payment_status === "partially_paid" && "⚠ Partial"}
              {invoice.payment_status === "unpaid" && "Unpaid"}
            </span>
          )}
        </div>
      </div>

      {invoice.payment_status && (invoice.payment_status !== "unpaid") && (
        <div className="rounded-xl border border-[#1e1e2e] bg-[#12121e] p-6">
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-[#888890]">Payment Progress</span>
              <span className="text-sm font-medium text-[#faf8f4]">
                {invoice.currency} {(invoice.amount_paid ?? 0).toLocaleString()} / {invoice.currency} {(invoice.total ?? 0).toLocaleString()}
              </span>
            </div>
            <div className="w-full bg-[#0a0a14] rounded-full h-2 overflow-hidden">
              <div
                className={`h-full transition-all ${
                  (invoice.payment_status === "fully_paid") ? "bg-emerald-500" :
                  (invoice.payment_status === "deposit_paid") ? "bg-orange-500" :
                  "bg-yellow-500"
                }`}
                style={{
                  width: `${Math.min(((invoice.amount_paid ?? 0) / (invoice.total ?? 1)) * 100, 100)}%`,
                }}
              />
            </div>
            <div className="text-xs text-[#888890] space-y-1">
              {invoice.deposit_percent && (
                <p>📋 Deposit required: {invoice.deposit_percent}% ({invoice.currency} {((invoice.total ?? 0) * (invoice.deposit_percent ?? 50) / 100).toLocaleString()})</p>
              )}
              <p>💵 Remaining: {invoice.currency} {Math.max(0, (invoice.total ?? 0) - (invoice.amount_paid ?? 0)).toLocaleString()}</p>
            </div>
          </div>
        </div>
      )}

      <div className="rounded-xl border border-[#1e1e2e] bg-[#12121e] p-6 space-y-4">
        <h3 className="text-sm font-semibold text-[#faf8f4] mb-4">Edit Invoice</h3>
        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block text-sm text-[#888890] mb-1">Payment Received</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={invoice.amount_paid ?? 0}
                onChange={(e) => setInvoice((prev) => (prev ? { ...prev, amount_paid: parseFloat(e.target.value) || 0 } : prev))}
                className="w-full rounded-lg border border-[#1e1e2e] bg-[#0a0a14] px-3 py-2 text-[#faf8f4]"
                placeholder="Amount received so far"
              />
            </div>
            <div>
              <label className="block text-sm text-[#888890] mb-1">Deposit %</label>
              <input
                type="number"
                min="0"
                max="100"
                value={invoice.deposit_percent ?? 50}
                onChange={(e) => setInvoice((prev) => (prev ? { ...prev, deposit_percent: parseFloat(e.target.value) || 50 } : prev))}
                className="w-full rounded-lg border border-[#1e1e2e] bg-[#0a0a14] px-3 py-2 text-[#faf8f4]"
              />
            </div>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="block text-sm text-[#888890] mb-1">Title</label>
            <input
              value={invoice.title}
              onChange={(e) => setInvoice((prev) => (prev ? { ...prev, title: e.target.value } : prev))}
              className="w-full rounded-lg border border-[#1e1e2e] bg-[#0a0a14] px-3 py-2 text-[#faf8f4]"
            />
          </div>
          <div>
            <label className="block text-sm text-[#888890] mb-1">Client name</label>
            <input
              value={invoice.client_name}
              onChange={(e) => setInvoice((prev) => (prev ? { ...prev, client_name: e.target.value } : prev))}
              className="w-full rounded-lg border border-[#1e1e2e] bg-[#0a0a14] px-3 py-2 text-[#faf8f4]"
            />
          </div>
          <div>
            <label className="block text-sm text-[#888890] mb-1">Client email</label>
            <input
              type="email"
              value={invoice.client_email ?? ""}
              onChange={(e) => setInvoice((prev) => (prev ? { ...prev, client_email: e.target.value || null } : prev))}
              className="w-full rounded-lg border border-[#1e1e2e] bg-[#0a0a14] px-3 py-2 text-[#faf8f4]"
            />
          </div>
          <div>
            <label className="block text-sm text-[#888890] mb-1">Due date</label>
            <input
              type="date"
              value={invoice.due_date ?? ""}
              onChange={(e) => setInvoice((prev) => (prev ? { ...prev, due_date: e.target.value || null } : prev))}
              className="w-full rounded-lg border border-[#1e1e2e] bg-[#0a0a14] px-3 py-2 text-[#faf8f4]"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm text-[#888890] mb-1">Payment link</label>
            <input
              value={invoice.payment_link ?? ""}
              onChange={(e) => setInvoice((prev) => (prev ? { ...prev, payment_link: e.target.value || null } : prev))}
              className="w-full rounded-lg border border-[#1e1e2e] bg-[#0a0a14] px-3 py-2 text-[#faf8f4]"
            />
          </div>
        </div>

        <div className="border-t border-[#1e1e2e] pt-4">
          <p className="text-sm text-[#888890] mb-2">Line items</p>
          <div className="space-y-2">
            {(invoice.line_items ?? []).map((item, index) => (
              <div key={index} className="flex justify-between text-sm text-[#c4c4cc]">
                <span>{item.item_name} × {item.quantity}</span>
                <span>{invoice.currency} {(item.amount ?? item.quantity * item.rate).toLocaleString()}</span>
              </div>
            ))}
          </div>
          <p className="text-sm font-medium text-[#faf8f4] mt-3">Total: {invoice.currency} {(invoice.total ?? 0).toLocaleString()}</p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={saveChanges}
            disabled={saving}
            className="rounded-lg bg-gold px-4 py-2 text-sm font-medium text-[#0a0a14] hover:bg-[#e8c76a] disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>

          <Link
            href={`/invoice/${invoice.share_id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg border border-[#1e1e2e] px-4 py-2 text-sm text-[#888890] hover:text-[#faf8f4]"
          >
            Open Public
          </Link>

          <button
            type="button"
            onClick={sendEmail}
            disabled={sendingEmail}
            className="rounded-lg border border-[#1e1e2e] px-4 py-2 text-sm text-[#888890] hover:text-[#faf8f4] disabled:opacity-50"
          >
            {sendingEmail ? "Sending..." : "Send Email"}
          </button>

          <button
            type="button"
            onClick={sendWhatsApp}
            className="rounded-lg border border-[#1e1e2e] px-4 py-2 text-sm text-[#888890] hover:text-[#faf8f4]"
          >
            Send WhatsApp
          </button>

          <button
            type="button"
            onClick={() => navigator.clipboard.writeText(publicLink)}
            className="rounded-lg border border-[#1e1e2e] px-4 py-2 text-sm text-[#888890] hover:text-[#faf8f4]"
          >
            Copy Link
          </button>

          <a
            href={`/api/invoices/${invoice.id}/pdf`}
            download
            className="rounded-lg border border-[#1e1e2e] px-4 py-2 text-sm text-[#888890] hover:text-[#faf8f4]"
          >
            Download PDF
          </a>
        </div>

        {!!message && (
          <p className={`text-sm ${message.includes("✓") ? "text-emerald-400" : "text-red-400"}`}>
            {message}
          </p>
        )}
      </div>
    </div>
  );
}
