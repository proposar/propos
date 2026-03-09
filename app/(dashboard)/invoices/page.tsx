"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const statusStyles: Record<string, string> = {
  draft: "bg-[#1e1e2e] text-[#888890]",
  sent: "bg-blue-500/20 text-blue-400",
  paid: "bg-emerald-500/20 text-emerald-400",
  overdue: "bg-red-500/20 text-red-400",
  cancelled: "bg-[#1e1e2e] text-[#888890]",
};

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Array<{ id: string; share_id: string; invoice_number: string; title: string; status: string; client_name: string; total: number; currency: string; due_date: string | null; created_at: string }>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/invoices")
      .then((r) => r.json())
      .then((d) => { setInvoices(Array.isArray(d) ? d : []); })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="font-serif text-2xl font-bold text-[#faf8f4]">Invoices</h1>
        <Link href="/invoices/new" className="rounded-lg bg-gold px-4 py-2 text-sm font-medium text-[#0a0a14] hover:bg-[#e8c76a]">
          New Invoice
        </Link>
      </div>
      <div className="rounded-xl border border-[#1e1e2e] bg-[#12121e] overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-[#888890]">Loading...</div>
        ) : invoices.length === 0 ? (
          <div className="p-8 text-center text-[#888890]">
            <p>No invoices yet.</p>
            <Link href="/invoices/new" className="mt-4 inline-block text-gold hover:underline">
              Create your first invoice
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-[#888890] border-b border-[#1e1e2e]">
                  <th className="p-4">#</th>
                  <th className="p-4">Title</th>
                  <th className="p-4">Client</th>
                  <th className="p-4">Amount</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Due</th>
                  <th className="p-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((inv) => (
                  <tr key={inv.id} className="border-b border-[#1e1e2e]/50 hover:bg-[#0a0a14]/30">
                    <td className="p-4 font-mono text-[#888890]">{inv.invoice_number}</td>
                    <td className="p-4 font-medium text-[#faf8f4]">{inv.title}</td>
                    <td className="p-4 text-[#888890]">{inv.client_name}</td>
                    <td className="p-4 text-[#888890]">{inv.currency} {(inv.total ?? 0).toLocaleString()}</td>
                    <td className="p-4">
                      <span className={`rounded-full px-2 py-0.5 text-xs capitalize ${statusStyles[inv.status] ?? ""}`}>
                        {inv.status}
                      </span>
                    </td>
                    <td className="p-4 text-[#888890]">{inv.due_date ? new Date(inv.due_date).toLocaleDateString() : "—"}</td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <Link href={`/invoice/${inv.share_id}`} target="_blank" rel="noopener noreferrer" className="text-gold hover:underline text-xs">View</Link>
                        <a href={`/api/invoices/${inv.id}/pdf`} download className="text-gold hover:underline text-xs">PDF</a>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
