"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

export default function PublicInvoicePage() {
  const params = useParams();
  const shareId = params.shareId as string;
  const [invoice, setInvoice] = useState<{
    id: string;
    invoice_number: string;
    title: string;
    client_name: string;
    line_items: Array<{ item_name: string; quantity: number; unit: string; rate: number; amount: number }>;
    subtotal: number;
    discount_percent: number;
    tax_percent: number;
    total: number;
    currency: string;
    due_date: string | null;
    status: string;
    payment_status?: string;
    payment_link: string | null;
    amount_paid?: number;
    deposit_percent?: number;
    freelancer_name?: string | null;
    business_name?: string | null;
    business_email?: string | null;
    business_phone?: string | null;
    business_address?: string | null;
    logo_url?: string | null;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/invoice/${shareId}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => setInvoice(d))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [shareId]);

  if (loading) return <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">Loading...</div>;
  if (!invoice) return <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">Invoice not found.</div>;

  const items = invoice.line_items ?? [];
  const c = invoice.currency === "USD" ? "$" : invoice.currency;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <header className="bg-amber-50 border-b border-amber-200 py-6 px-8">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div>
              {invoice.logo_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={invoice.logo_url} alt={invoice.business_name ?? "Business logo"} className="h-10 w-auto object-contain" />
              ) : (
                <p className="font-serif text-lg font-bold text-gray-900">{invoice.business_name || invoice.freelancer_name || "Freelancer"}</p>
              )}
              <p className="text-sm text-gray-500 mt-1">{invoice.business_name || invoice.freelancer_name || ""}</p>
              {invoice.business_email && <p className="text-xs text-gray-500">{invoice.business_email}</p>}
              {invoice.business_phone && <p className="text-xs text-gray-500">{invoice.business_phone}</p>}
              {invoice.business_address && <p className="text-xs text-gray-500">{invoice.business_address}</p>}
            </div>
          </div>
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="font-serif text-2xl font-bold text-gray-900">Invoice {invoice.invoice_number}</h1>
              <p className="text-gray-600 mt-1">{invoice.title}</p>
              <p className="text-sm text-gray-500 mt-2">Bill to: {invoice.client_name}</p>
            </div>
            <a
              href={`/api/invoices/${invoice.id}/pdf`}
              download
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 font-medium"
            >
              📥 Download PDF
            </a>
          </div>
        </header>
        <main className="p-8">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500 border-b border-gray-200">
                <th className="pb-3">Item</th>
                <th className="pb-3 text-right">Qty</th>
                <th className="pb-3 text-right">Rate</th>
                <th className="pb-3 text-right">Amount</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, i) => (
                <tr key={i} className="border-b border-gray-100">
                  <td className="py-3 text-gray-800">{item.item_name}</td>
                  <td className="py-3 text-right text-gray-600">{item.quantity} {item.unit}</td>
                  <td className="py-3 text-right text-gray-600">{c}{item.rate?.toLocaleString()}</td>
                  <td className="py-3 text-right text-gray-800">{c}{(item.amount ?? item.quantity * item.rate).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="mt-6 text-right space-y-1">
            {invoice.discount_percent > 0 && <p className="text-gray-600">Discount {invoice.discount_percent}%</p>}
            {invoice.tax_percent > 0 && <p className="text-gray-600">Tax {invoice.tax_percent}%</p>}
            <p className="text-lg font-bold text-gray-900">Total: {c}{Number(invoice.total ?? 0).toLocaleString()}</p>
          </div>

          {invoice.payment_status && invoice.amount_paid !== undefined && (
            <div className="mt-8 p-4 bg-amber-50 border border-amber-200 rounded-lg space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700">
                  {invoice.payment_status === "deposit_paid" ? "💰 Deposit Received - Pending Balance" :
                   invoice.payment_status === "fully_paid" ? "✓ Fully Paid" :
                   invoice.payment_status === "partially_paid" ? "⚠ Partially Paid" :
                   "Awaiting Payment"}
                </span>
                <span className="text-sm font-medium text-gray-900">
                  {c}{Number(invoice.amount_paid ?? 0).toLocaleString()} / {c}{Number(invoice.total ?? 0).toLocaleString()}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                <div
                  className={`h-full transition-all ${
                    (invoice.payment_status === "fully_paid") ? "bg-green-600" :
                    (invoice.payment_status === "deposit_paid") ? "bg-orange-600" :
                    "bg-yellow-600"
                  }`}
                  style={{
                    width: `${Math.min(((invoice.amount_paid ?? 0) / (invoice.total ?? 1)) * 100, 100)}%`,
                  }}
                />
              </div>
              {invoice.deposit_percent && (
                <p className="text-xs text-gray-600">
                  📋 Deposit required: {invoice.deposit_percent}% ({c}{Number((invoice.total ?? 0) * (invoice.deposit_percent ?? 50) / 100).toLocaleString()})
                </p>
              )}
              {invoice.payment_status !== "fully_paid" && (
                <p className="text-xs font-medium text-gray-700">
                  💵 Remaining: {c}{Number(Math.max(0, (invoice.total ?? 0) - (invoice.amount_paid ?? 0))).toLocaleString()}
                </p>
              )}
            </div>
          )}

          {invoice.due_date && <p className="mt-4 text-sm text-gray-500">Due: {new Date(invoice.due_date).toLocaleDateString()}</p>}
          {invoice.payment_link && (
            <a href={invoice.payment_link} target="_blank" rel="noopener noreferrer" className="mt-6 inline-block rounded-lg bg-amber-600 text-white px-6 py-2 font-medium hover:bg-amber-700">
              Pay Now
            </a>
          )}
        </main>
      </div>
    </div>
  );
}
