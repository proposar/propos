"use client";

import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { trackProposalAccepted } from "@/lib/analytics";
import { ProposalContent } from "./ProposalContent";

export interface LineItem {
  id: string;
  item_name: string;
  description: string | null;
  quantity: number;
  unit: string;
  rate: number;
  amount: number;
  is_optional: boolean;
}

interface PublicProposalViewProps {
  shareId: string;
  proposal: {
    id: string;
    title: string;
    client_name: string;
    client_company: string | null;
    generated_content: string | null;
    budget_amount: number | null;
    budget_currency: string;
    subtotal?: number | null;
    discount_percent?: number | null;
    tax_percent?: number | null;
    grand_total?: number | null;
    line_items_enabled?: boolean;
    expires_at: string | null;
    sent_at: string | null;
    freelancerName: string;
    businessName: string;
    signature: string;
    logoUrl: string;
    brandColor: string;
  };
  lineItems?: LineItem[];
}

export function PublicProposalView({
  shareId,
  proposal,
  lineItems = [],
}: PublicProposalViewProps) {
  const [accepted, setAccepted] = useState(false);
  const [accepting, setAccepting] = useState(false);
  const [confirmAccept, setConfirmAccept] = useState(false);
  const [declineOpen, setDeclineOpen] = useState(false);
  const [declineReason, setDeclineReason] = useState("");
  const [declining, setDeclining] = useState(false);
  const [declined, setDeclined] = useState(false);
  const [timeLeft, setTimeLeft] = useState<string | null>(null);
  const startTime = useRef<number>(Date.now());

  const bc = proposal.brandColor || "#D4AF37";

  useEffect(() => {
    fetch(`/api/proposals/${proposal.id}/track`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    }).catch(() => {});
  }, [proposal.id]);

  useEffect(() => {
    if (!proposal.expires_at) return;
    const end = new Date(proposal.expires_at).getTime();
    const tick = () => {
      const now = Date.now();
      if (now >= end) {
        setTimeLeft("Expired");
        return;
      }
      const d = Math.floor((end - now) / 86400000);
      const h = Math.floor(((end - now) % 86400000) / 3600000);
      setTimeLeft(`${d}d ${h}h left`);
    };
    tick();
    const id = setInterval(tick, 60000);
    return () => clearInterval(id);
  }, [proposal.expires_at]);

  useEffect(() => {
    const onUnload = () => {
      const duration = Math.round((Date.now() - startTime.current) / 1000);
      fetch(`/api/proposals/${proposal.id}/track`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ duration_seconds: duration }),
        keepalive: true,
      }).catch(() => {});
    };
    window.addEventListener("beforeunload", onUnload);
    return () => window.removeEventListener("beforeunload", onUnload);
  }, [proposal.id]);

  const handleAccept = async () => {
    setAccepting(true);
    try {
      const res = await fetch(`/api/proposal/${shareId}/accept`, {
        method: "POST",
      });
      const data = await res.json();
      if (data.success) {
        trackProposalAccepted();
        setAccepted(true);
        setConfirmAccept(false);
      }
    } catch {
      // error
    } finally {
      setAccepting(false);
    }
  };

  const handleDecline = async () => {
    setDeclining(true);
    try {
      const res = await fetch(`/api/proposal/${shareId}/decline`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason: declineReason }),
      });
      if (res.ok) {
        setDeclined(true);
        setDeclineOpen(false);
      }
    } finally {
      setDeclining(false);
    }
  };

  /* ─── Status screens ─── */

  if (declined) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center p-6">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
          </div>
          <h1 className="text-2xl font-serif font-bold text-gray-900 mb-3">Proposal Declined</h1>
          <p className="text-gray-500 leading-relaxed">
            Your feedback has been shared with {proposal.freelancerName || proposal.businessName}. Thank you for your time.
          </p>
        </div>
      </div>
    );
  }

  if (accepted) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-6 relative overflow-hidden">
        {/* Confetti-like sublte gradient overlay */}
        <div className="absolute inset-0 opacity-20" style={{
          background: `radial-gradient(circle at 10% 20%, ${bc} 0%, transparent 40%), radial-gradient(circle at 90% 80%, ${bc} 0%, transparent 40%)`
        }} />
        <div className="text-center max-w-lg relative z-10">
          <div
            className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl"
            style={{ backgroundColor: bc + "10", border: `1px solid ${bc}30` }}
          >
            <svg className="w-12 h-12" style={{ color: bc }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-4xl font-serif font-bold text-gray-900 mb-4 tracking-tight">Project Accepted!</h1>
          <p className="text-gray-600 leading-relaxed text-lg mb-8">
            Excellent choice. We&apos;ve notified {proposal.freelancerName || proposal.businessName} and they are preparing the next steps.
          </p>
          <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 text-left">
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">What happens next?</h3>
            <ul className="space-y-4">
              <li className="flex gap-3 text-sm text-gray-600">
                <span className="w-6 h-6 rounded-full bg-white border flex items-center justify-center text-[10px] font-bold shrink-0">1</span>
                <span>A formal contract will be sent to your email for e-signature.</span>
              </li>
              <li className="flex gap-3 text-sm text-gray-600">
                <span className="w-6 h-6 rounded-full bg-white border flex items-center justify-center text-[10px] font-bold shrink-0">2</span>
                <span>Upon signature, the first invoice will be issued to initiate the project.</span>
              </li>
              <li className="flex gap-3 text-sm text-gray-600">
                <span className="w-6 h-6 rounded-full bg-white border flex items-center justify-center text-[10px] font-bold shrink-0">3</span>
                <span>A kickoff meeting will be scheduled to finalize the timeline.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  /* ─── Helpers ─── */

  const content = proposal.generated_content ?? "";

  const getCurrencySymbol = (curr: string) => {
    const symbols: Record<string, string> = {
      USD: "$", EUR: "€", GBP: "£", AUD: "A$", CAD: "C$", INR: "₹", SGD: "S$",
    };
    return symbols[curr] || curr;
  };
  const cSym = getCurrencySymbol(proposal.budget_currency);

  const formatMoney = (val: number | null | undefined) => {
    if (val == null) return "0.00";
    return val.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const brandName = proposal.businessName || proposal.freelancerName;
  const sentDate = proposal.sent_at
    ? new Date(proposal.sent_at).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })
    : new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });

  /* ─── Main render ─── */

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#f8f7f4" }}>
      {/* ─── Expiry banner ─── */}
      {timeLeft && (
        <div
          className="py-2.5 px-4 text-center text-sm font-medium"
          style={{ backgroundColor: bc + "12", color: bc, borderBottom: `1px solid ${bc}22` }}
        >
          <span className="inline-flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            This proposal {timeLeft === "Expired" ? "has expired" : `expires in ${timeLeft}`}
          </span>
        </div>
      )}

      {/* ─── Sticky header ─── */}
      <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-xl border-b border-gray-200/60 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
        <div className="max-w-4xl mx-auto flex items-center justify-between px-4 md:px-8 py-3">
          <div className="flex items-center gap-3">
            {proposal.logoUrl ? (
              <Image
                src={proposal.logoUrl}
                alt={brandName}
                width={160}
                height={40}
                className="h-9 max-w-[150px] w-auto object-contain"
                unoptimized
              />
            ) : (
              <span className="font-serif font-bold text-gray-900 text-lg tracking-tight">{brandName}</span>
            )}
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-400 hidden sm:inline font-medium">{sentDate}</span>
            <a
              href={`/api/proposal/${shareId}/pdf`}
              target="_blank"
              rel="noopener noreferrer"
              download
              className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              PDF
            </a>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8 md:py-14">
        <article className="bg-white rounded-2xl shadow-[0_4px_40px_rgba(0,0,0,0.06)] border border-gray-100/80 overflow-hidden">

          {/* ══════════ COVER SECTION ══════════ */}
          <div className="relative overflow-hidden">
            {/* Decorative background */}
            <div
              className="absolute inset-0 opacity-[0.03]"
              style={{
                backgroundImage: `radial-gradient(circle at 20% 50%, ${bc} 0%, transparent 50%), radial-gradient(circle at 80% 20%, ${bc} 0%, transparent 50%)`,
              }}
            />
            <div
              className="absolute top-0 left-0 right-0 h-1"
              style={{ background: `linear-gradient(90deg, ${bc}, ${bc}88, ${bc})` }}
            />

            <div className="relative px-8 md:px-14 pt-10 md:pt-14 pb-10 md:pb-12">
              {/* Logo + date row */}
              <div className="flex items-start justify-between mb-10">
                <div>
                  {proposal.logoUrl ? (
                    <Image
                      src={proposal.logoUrl}
                      alt={brandName}
                      width={180}
                      height={50}
                      className="h-12 md:h-14 max-w-[200px] w-auto object-contain"
                      unoptimized
                    />
                  ) : (
                    <span className="font-serif font-bold text-gray-900 text-2xl md:text-3xl tracking-tight">
                      {brandName}
                    </span>
                  )}
                </div>
                <div className="text-right shrink-0">
                  <p className="text-[10px] text-gray-400 uppercase tracking-[0.2em] font-medium">Proposal Date</p>
                  <p className="text-sm text-gray-600 font-medium mt-0.5">{sentDate}</p>
                </div>
              </div>

              {/* Divider */}
              <div className="flex items-center gap-4 mb-10">
                <div className="flex-1 h-px bg-gray-200" />
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: bc }} />
                <div className="flex-1 h-px bg-gray-200" />
              </div>

              {/* Client info */}
              <div className="text-center">
                <p className="text-[11px] text-gray-400 uppercase tracking-[0.25em] font-semibold mb-3">
                  Prepared exclusively for
                </p>
                <h1 className="font-serif text-4xl md:text-5xl font-bold text-gray-900 tracking-tight leading-tight">
                  {proposal.client_name}
                </h1>
                {proposal.client_company && (
                  <p className="text-gray-500 mt-2 text-lg font-medium">{proposal.client_company}</p>
                )}
                <div className="mt-6 inline-block">
                  <div className="h-0.5 w-16 mx-auto rounded-full" style={{ backgroundColor: bc + "60" }} />
                </div>
                <p className="text-xl text-gray-700 mt-5 font-serif font-medium">{proposal.title}</p>
              </div>
            </div>
          </div>

          {/* ══════════ PROPOSAL CONTENT ══════════ */}
          <div className="px-8 md:px-14 py-10 md:py-12">
            <ProposalContent content={content} variant="preview" brandColor={bc} />
          </div>

          {/* ══════════ INVESTMENT / PRICING ══════════ */}
          {proposal.line_items_enabled && lineItems.length > 0 ? (
            <div className="mx-6 md:mx-10 mb-10">
              <div className="rounded-2xl border overflow-hidden" style={{ borderColor: bc + "30" }}>
                {/* Header */}
                <div
                  className="px-6 md:px-8 py-5 flex items-center gap-3"
                  style={{ backgroundColor: bc + "08" }}
                >
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm"
                    style={{ backgroundColor: bc }}
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className="font-serif text-xl md:text-2xl font-bold text-gray-900">
                    Investment Breakdown
                  </h3>
                </div>

                {/* Table */}
                <div className="px-6 md:px-8 pb-6">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr
                          className="border-b-2 text-[13px] text-gray-500 uppercase tracking-wider"
                          style={{ borderColor: bc + "30" }}
                        >
                          <th className="py-4 pr-2 font-semibold w-full">Item / Service</th>
                          <th className="py-4 px-4 font-semibold text-center whitespace-nowrap">Qty</th>
                          <th className="py-4 px-4 font-semibold text-right whitespace-nowrap">Rate</th>
                          <th className="py-4 pl-4 font-semibold text-right whitespace-nowrap">Amount</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {lineItems.map((item) => (
                          <tr key={item.id} className="text-gray-800 group hover:bg-gray-50/50 transition-colors">
                            <td className="py-4 pr-2">
                              <p className="font-medium text-gray-900">{item.item_name}</p>
                              {item.description && (
                                <p className="text-sm text-gray-500 mt-1 leading-relaxed">{item.description}</p>
                              )}
                              {item.is_optional && (
                                <span
                                  className="inline-block mt-1 text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full"
                                  style={{ backgroundColor: bc + "15", color: bc }}
                                >
                                  Optional
                                </span>
                              )}
                            </td>
                            <td className="py-4 px-4 text-center align-top text-gray-600">
                              {item.quantity}
                              {item.unit !== "unit" && (
                                <span className="text-xs text-gray-400 block">{item.unit}</span>
                              )}
                            </td>
                            <td className="py-4 px-4 text-right align-top text-gray-600">
                              {cSym}{formatMoney(item.rate)}
                            </td>
                            <td className="py-4 pl-4 text-right align-top font-semibold text-gray-900">
                              {cSym}{formatMoney(item.amount)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Totals */}
                  <div className="mt-6 pt-4 border-t border-gray-100">
                    <div className="flex flex-col items-end w-full sm:w-1/2 ml-auto space-y-2 text-sm">
                      <div className="flex justify-between w-full">
                        <span className="text-gray-500">Subtotal</span>
                        <span className="font-medium text-gray-900">
                          {cSym}{formatMoney(proposal.subtotal)}
                        </span>
                      </div>
                      {!!proposal.discount_percent && proposal.discount_percent > 0 && (
                        <div className="flex justify-between w-full">
                          <span className="text-gray-500">Discount ({proposal.discount_percent}%)</span>
                          <span className="font-medium text-emerald-600">
                            -{cSym}{formatMoney((proposal.subtotal || 0) * (proposal.discount_percent / 100))}
                          </span>
                        </div>
                      )}
                      {!!proposal.tax_percent && proposal.tax_percent > 0 && (
                        <div className="flex justify-between w-full">
                          <span className="text-gray-500">Tax ({proposal.tax_percent}%)</span>
                          <span className="font-medium text-gray-900">
                            +{cSym}{formatMoney(
                              ((proposal.subtotal || 0) - (proposal.subtotal || 0) * ((proposal.discount_percent || 0) / 100)) *
                              (proposal.tax_percent / 100)
                            )}
                          </span>
                        </div>
                      )}
                      <div
                        className="flex justify-between w-full pt-4 mt-2 border-t-2"
                        style={{ borderColor: bc }}
                      >
                        <span className="font-bold text-gray-900 text-lg">Total Investment</span>
                        <span className="font-bold text-2xl tracking-tight" style={{ color: bc }}>
                          {cSym}{formatMoney(proposal.grand_total)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            proposal.budget_amount != null && (
              <div className="mx-6 md:mx-10 mb-10">
                <div className="rounded-2xl border overflow-hidden" style={{ borderColor: bc + "30" }}>
                  <div className="px-8 py-8 text-center" style={{ backgroundColor: bc + "06" }}>
                    <p className="text-[11px] text-gray-400 uppercase tracking-[0.2em] font-semibold mb-2">
                      Total Investment
                    </p>
                    <p className="text-4xl md:text-5xl font-bold font-serif tracking-tight" style={{ color: bc }}>
                      {cSym}{formatMoney(proposal.budget_amount)}
                    </p>
                    <p className="text-sm text-gray-400 mt-2">{proposal.budget_currency}</p>
                  </div>
                </div>
              </div>
            )
          )}

          {/* ══════════ CTA SECTION ══════════ */}
          <div className="relative overflow-hidden">
            <div
              className="absolute inset-0 opacity-[0.03]"
              style={{
                backgroundImage: `radial-gradient(circle at 50% 0%, ${bc} 0%, transparent 60%)`,
              }}
            />
            <div className="relative px-8 md:px-14 py-12 md:py-16 text-center">
              <div className="max-w-lg mx-auto">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-5"
                  style={{ backgroundColor: bc + "12" }}
                >
                  <svg className="w-6 h-6" style={{ color: bc }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h2 className="font-serif text-2xl md:text-3xl font-bold text-gray-900 mb-3">
                  Ready to Get Started?
                </h2>
                <p className="text-gray-500 mb-8 leading-relaxed">
                  Accept this proposal and we&apos;ll be in touch within 24 hours to begin working together.
                </p>
                <button
                  type="button"
                  onClick={() => setConfirmAccept(true)}
                  className="w-full max-w-sm mx-auto rounded-xl py-4 px-8 font-semibold text-white text-lg transition-all hover:shadow-lg hover:scale-[1.01] active:scale-[0.99] shadow-md"
                  style={{ backgroundColor: bc, boxShadow: `0 4px 14px ${bc}40` }}
                >
                  Accept Proposal
                </button>
                <p className="text-xs text-gray-400 mt-4">
                  By accepting, you agree to the terms outlined in this proposal
                </p>
                <button
                  type="button"
                  onClick={() => setDeclineOpen(true)}
                  className="mt-6 text-sm text-gray-400 hover:text-gray-600 transition-colors"
                >
                  Not the right fit? Let us know
                </button>
              </div>
            </div>
          </div>

          {/* ══════════ FOOTER ══════════ */}
          <div className="border-t border-gray-100 px-8 md:px-14 py-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                {proposal.logoUrl ? (
                  <Image
                    src={proposal.logoUrl}
                    alt={brandName}
                    width={100}
                    height={28}
                    className="h-7 max-w-[100px] w-auto object-contain opacity-60"
                    unoptimized
                  />
                ) : (
                  <span className="text-sm font-medium text-gray-400">{brandName}</span>
                )}
              </div>
              <div className="text-center md:text-right">
                {proposal.signature && (
                  <p className="text-sm text-gray-500 italic mb-1">{proposal.signature}</p>
                )}
                <p className="text-xs text-gray-400">
                  Questions? Contact us directly — we&apos;re happy to help.
                </p>
              </div>
            </div>
            <div className="mt-6 pt-4 border-t border-gray-50 text-center">
              <p className="text-[10px] text-gray-300 tracking-wide">
                Powered by <span className="font-medium">Proposar</span>
              </p>
            </div>
          </div>
        </article>
      </main>

      {/* ─── Confirm Accept Modal ─── */}
      {confirmAccept && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
          onClick={() => setConfirmAccept(false)}
        >
          <div
            className="bg-white rounded-2xl p-8 max-w-sm w-full shadow-2xl border border-gray-100"
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4"
              style={{ backgroundColor: bc + "12" }}
            >
              <svg className="w-6 h-6" style={{ color: bc }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="font-serif font-bold text-gray-900 text-xl text-center mb-2">
              Confirm Acceptance
            </h3>
            <p className="text-sm text-gray-500 mb-6 text-center leading-relaxed">
              Accept <span className="font-medium text-gray-700">{proposal.title}</span> at{" "}
              <span className="font-semibold" style={{ color: bc }}>
                {cSym}{formatMoney(
                  proposal.line_items_enabled
                    ? Math.max(proposal.grand_total || 0, proposal.budget_amount || 0)
                    : proposal.budget_amount
                )}
              </span>?
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setConfirmAccept(false)}
                className="flex-1 rounded-xl border border-gray-200 py-3 text-gray-600 font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleAccept}
                disabled={accepting}
                className="flex-1 rounded-xl py-3 text-white font-semibold disabled:opacity-50 transition-all hover:shadow-md"
                style={{ backgroundColor: bc }}
              >
                {accepting ? "Accepting..." : "Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── Decline Modal ─── */}
      {declineOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
          onClick={() => setDeclineOpen(false)}
        >
          <div
            className="bg-white rounded-2xl p-8 max-w-sm w-full shadow-2xl border border-gray-100"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="font-serif font-bold text-gray-900 text-xl mb-2">Decline Proposal</h3>
            <p className="text-sm text-gray-500 mb-4">
              Optional: share why it&apos;s not the right fit.
            </p>
            <textarea
              value={declineReason}
              onChange={(e) => setDeclineReason(e.target.value)}
              className="w-full rounded-xl border border-gray-200 p-4 text-sm mb-4 resize-none focus:outline-none focus:ring-2 focus:border-transparent focus:ring-gray-200"
              rows={3}
              placeholder="Your feedback helps us improve..."
            />
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setDeclineOpen(false)}
                className="flex-1 rounded-xl border border-gray-200 py-3 text-gray-600 font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDecline}
                disabled={declining}
                className="flex-1 rounded-xl bg-gray-900 py-3 text-white font-medium disabled:opacity-50 hover:bg-gray-800 transition-colors"
              >
                {declining ? "Submitting..." : "Submit Feedback"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

