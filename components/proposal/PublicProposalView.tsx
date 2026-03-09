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

  if (declined) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="text-center max-w-md">
          <p className="text-4xl mb-4">✓</p>
          <h1 className="text-xl font-serif font-bold text-gray-900 mb-2">
            Proposal Declined
          </h1>
          <p className="text-gray-600">
            Your feedback has been shared with {proposal.freelancerName}.
          </p>
        </div>
      </div>
    );
  }

  if (accepted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="text-center max-w-md">
          <p className="text-5xl mb-4">🎉</p>
          <h1 className="text-2xl font-serif font-bold text-gray-900 mb-2">
            Proposal Accepted!
          </h1>
          <p className="text-gray-600">
            {proposal.freelancerName} will contact you shortly.
          </p>
        </div>
      </div>
    );
  }

  const content = proposal.generated_content ?? "";

  const getCurrencySymbol = (curr: string) => {
    const symbols: Record<string, string> = {
      USD: "$",
      EUR: "€",
      GBP: "£",
      AUD: "A$",
      CAD: "C$",
      INR: "₹",
      SGD: "S$",
    };
    return symbols[curr] || curr;
  };
  const cSym = getCurrencySymbol(proposal.budget_currency);

  const formatMoney = (val: number | null | undefined) => {
    if (val == null) return "0.00";
    return val.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  return (
    <div className="min-h-screen bg-[#fafaf9]">
      {timeLeft && (
        <div className="bg-amber-50/90 border-b border-amber-200/60 py-2.5 px-4 text-center text-sm text-amber-800 font-medium">
          ⏰ This proposal expires in {timeLeft}
        </div>
      )}

      <header className="bg-white/95 backdrop-blur border-b border-gray-100 py-3 px-4 md:px-6 flex flex-wrap items-center justify-between gap-2 shadow-sm">
        <div className="flex items-center gap-3">
          {proposal.logoUrl ? (
            <Image
              src={proposal.logoUrl}
              alt={proposal.businessName || proposal.freelancerName}
              width={160}
              height={40}
              className="h-10 max-w-[160px] w-auto object-contain"
              unoptimized
            />
          ) : (
            <span className="font-bold text-gray-900 text-base">
              {proposal.businessName || proposal.freelancerName}
            </span>
          )}
          <span className="text-xs text-gray-400 hidden sm:inline">
            {proposal.sent_at
              ? new Date(proposal.sent_at).toLocaleDateString()
              : ""}
          </span>
        </div>
        <a
          href={`/api/proposal/${shareId}/pdf`}
          target="_blank"
          rel="noopener noreferrer"
          download
          className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50"
        >
          Download PDF
        </a>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8 md:py-12">
        <article className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
          {/* Premium cover section */}
          <div className="px-8 md:px-12 pt-8 md:pt-12">
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-3">
                {proposal.logoUrl ? (
                  <Image
                    src={proposal.logoUrl}
                    alt={proposal.businessName || proposal.freelancerName}
                    width={140}
                    height={44}
                    className="h-11 max-w-[140px] w-auto object-contain"
                    unoptimized
                  />
                ) : (
                  <span className="font-bold text-gray-900 text-lg tracking-tight">
                    {proposal.businessName || proposal.freelancerName}
                  </span>
                )}
              </div>
              <span className="text-xs text-gray-400 uppercase tracking-wider font-medium">
                {new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
              </span>
            </div>
            <div className="h-1 rounded-full mb-8" style={{ backgroundColor: proposal.brandColor }} />

            <p className="text-xs text-gray-400 uppercase tracking-widest font-medium mb-2">Prepared for</p>
            <h1 className="font-serif text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
              {proposal.client_name}
            </h1>
            {proposal.client_company && (
              <p className="text-gray-600 mt-1 font-medium">{proposal.client_company}</p>
            )}
            <p className="text-lg text-gray-700 mt-3 font-medium">{proposal.title}</p>
          </div>

          <div className="px-8 md:px-12 py-6 border-t border-gray-100">
            <ProposalContent content={content} variant="preview" />
          </div>

          {proposal.line_items_enabled && lineItems.length > 0 ? (
            <div className="mx-8 md:mx-12 mb-8 p-6 md:p-8 rounded-xl border-2 bg-gray-50/60" style={{ borderColor: proposal.brandColor + '44' }}>
              <h3 className="font-serif text-2xl font-bold text-gray-900 mb-6">
                Investment Breakdown
              </h3>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b-2 text-sm text-gray-700" style={{ borderColor: proposal.brandColor + '66' }}>
                      <th className="py-3 px-2 font-semibold w-full">
                        Item / Service
                      </th>
                      <th className="py-3 px-2 font-semibold text-center whitespace-nowrap">
                        Qty
                      </th>
                      <th className="py-3 px-2 font-semibold text-right whitespace-nowrap">
                        Rate
                      </th>
                      <th className="py-3 px-2 font-semibold text-right whitespace-nowrap">
                        Amount
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {lineItems.map((item) => (
                      <tr key={item.id} className="text-gray-800">
                        <td className="py-4 px-2">
                          <p className="font-medium">{item.item_name}</p>
                          {item.description && (
                            <p className="text-sm text-gray-500 mt-1">
                              {item.description}
                            </p>
                          )}
                        </td>
                        <td className="py-4 px-2 text-center align-top text-gray-600">
                          {item.quantity}{" "}
                          <span className="text-xs text-gray-400 block">
                            {item.unit !== "unit" ? item.unit : ""}
                          </span>
                        </td>
                        <td className="py-4 px-2 text-right align-top text-gray-600">
                          {cSym}
                          {formatMoney(item.rate)}
                        </td>
                        <td className="py-4 px-2 text-right align-top font-medium tracking-tight">
                          {cSym}
                          {formatMoney(item.amount)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="w-full h-px bg-gray-200 my-4" />

              <div className="flex flex-col items-end w-full sm:w-1/2 ml-auto space-y-2 text-sm text-gray-600">
                <div className="flex justify-between w-full px-2">
                  <span>Subtotal</span>
                  <span className="font-medium text-gray-900">
                    {cSym}
                    {formatMoney(proposal.subtotal)}
                  </span>
                </div>

                {!!proposal.discount_percent &&
                  proposal.discount_percent > 0 && (
                    <div className="flex justify-between w-full px-2">
                      <span>Discount ({proposal.discount_percent}%)</span>
                      <span className="font-medium text-red-600">
                        -{cSym}
                        {formatMoney(
                          (proposal.subtotal || 0) *
                            (proposal.discount_percent / 100),
                        )}
                      </span>
                    </div>
                  )}

                {!!proposal.tax_percent && proposal.tax_percent > 0 && (
                  <div className="flex justify-between w-full px-2">
                    <span>Tax ({proposal.tax_percent}%)</span>
                    <span className="font-medium text-gray-900">
                      +{cSym}
                      {formatMoney(
                        ((proposal.subtotal || 0) -
                          (proposal.subtotal || 0) *
                            ((proposal.discount_percent || 0) / 100)) *
                          (proposal.tax_percent / 100),
                      )}
                    </span>
                  </div>
                )}

                <div className="flex justify-between w-full px-2 pt-4 mt-2 border-t-2" style={{ borderColor: proposal.brandColor + '66' }}>
                  <span className="font-bold text-gray-900 text-lg">Total</span>
                  <span className="font-bold text-2xl tracking-tight" style={{ color: proposal.brandColor }}>
                    {cSym}
                    {formatMoney(proposal.grand_total)}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            proposal.budget_amount != null && (
              <div className="mx-8 md:mx-12 mb-8 p-6 rounded-xl border-2 bg-gray-50/60" style={{ borderColor: proposal.brandColor + '44' }}>
                <h3 className="font-semibold text-gray-900 mb-2">Investment</h3>
                <p className="text-2xl font-bold text-gray-900">
                  {cSym}
                  {formatMoney(proposal.budget_amount)}
                </p>
              </div>
            )
          )}

          <div className="px-8 md:px-12 pb-8 md:pb-12 pt-8 border-t border-gray-100">
            <h2 className="font-serif text-xl font-semibold text-gray-900 mb-2">
              Ready to Move Forward?
            </h2>
            <p className="text-gray-600 mb-6">
              Click the button below to accept this proposal. We&apos;ll be in
              touch within 24 hours to get started.
            </p>
            <button
              type="button"
              onClick={() => setConfirmAccept(true)}
              className="w-full rounded-xl py-4 font-semibold text-white transition-all hover:opacity-95 active:scale-[0.99] shadow-md"
              style={{ backgroundColor: proposal.brandColor }}
            >
              Accept This Proposal
            </button>
            <p className="text-xs text-gray-500 mt-2 text-center">
              By clicking accept, you agree to the terms outlined above.
            </p>
            <button
              type="button"
              onClick={() => setDeclineOpen(true)}
              className="block mx-auto mt-4 text-sm text-gray-500 hover:text-gray-700 underline"
            >
              Not the right fit? Let us know →
            </button>
          </div>

          {proposal.signature && (
            <p className="mt-8 text-gray-600 text-sm italic">{proposal.signature}</p>
          )}
          <p className="mt-6 text-xs text-gray-400">
            Questions? Reply to this email or contact us directly.
          </p>
          <p className="mt-2 text-xs text-gray-400">
            This proposal was created with Proposar
          </p>
        </article>
      </main>

      {confirmAccept && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
          onClick={() => setConfirmAccept(false)}
        >
          <div
            className="bg-white rounded-xl p-6 max-w-sm w-full shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="font-semibold text-gray-900 mb-2">
              Confirm acceptance
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Accept proposal for {proposal.title} at {cSym}
              {formatMoney(
                proposal.line_items_enabled
                  ? Math.max(
                      proposal.grand_total || 0,
                      proposal.budget_amount || 0,
                    )
                  : proposal.budget_amount,
              )}
              ?
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setConfirmAccept(false)}
                className="flex-1 rounded-lg border border-gray-300 py-2 text-gray-700"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleAccept}
                disabled={accepting}
                className="flex-1 rounded-lg py-2 text-white font-medium disabled:opacity-50"
                style={{ backgroundColor: proposal.brandColor }}
              >
                {accepting ? "Accepting..." : "Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}

      {declineOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
          onClick={() => setDeclineOpen(false)}
        >
          <div
            className="bg-white rounded-xl p-6 max-w-sm w-full shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="font-semibold text-gray-900 mb-2">
              Decline proposal
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Optional: share why it&apos;s not the right fit.
            </p>
            <textarea
              value={declineReason}
              onChange={(e) => setDeclineReason(e.target.value)}
              className="w-full rounded-lg border border-gray-300 p-3 text-sm mb-4 resize-none"
              rows={3}
              placeholder="Reason (optional)"
            />
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setDeclineOpen(false)}
                className="flex-1 rounded-lg border border-gray-300 py-2 text-gray-700"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDecline}
                disabled={declining}
                className="flex-1 rounded-lg bg-gray-800 py-2 text-white disabled:opacity-50"
              >
                {declining ? "Submitting..." : "Submit"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

