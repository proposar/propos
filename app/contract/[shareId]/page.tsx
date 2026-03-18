"use client";

import { useState, useEffect } from "react";
import { useParams, useSearchParams } from "next/navigation";
import Link from "next/link";

export default function PublicContractPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const shareId = params.shareId as string;
  const returnTo = searchParams.get("returnTo");
  const [contract, setContract] = useState<{
    title: string;
    content: string;
    status: string;
    client_name: string;
    client_signature: string | null;
    freelancer_signature: string | null;
    freelancer_name?: string | null;
    business_name?: string | null;
    logo_url?: string | null;
    business_email?: string | null;
    business_phone?: string | null;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [clientName, setClientName] = useState("");
  const [agree, setAgree] = useState(false);
  const [signing, setSigning] = useState(false);
  const [signed, setSigned] = useState(false);

  useEffect(() => {
    fetch(`/api/contract/${shareId}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        setContract(d);
        if (d?.status === "signed" && d?.client_signature && d?.freelancer_signature) setSigned(true);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [shareId]);

  const handleSign = async () => {
    if (!clientName.trim() || !agree) return;
    setSigning(true);
    try {
      const r = await fetch(`/api/contract/${shareId}/sign`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clientName: clientName.trim() }),
      });
      if (r.ok) {
        const data = await r.json().catch(() => null);
        setContract((prev) =>
          prev
            ? {
                ...prev,
                client_signature: clientName.trim(),
                status: data?.status ?? prev.status,
              }
            : prev,
        );
        if (data?.fullySigned) setSigned(true);
      }
    } finally {
      setSigning(false);
    }
  };

  if (loading) return <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">Loading...</div>;
  if (!contract) return <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">Contract not found.</div>;

  if (signed || (contract.status === "signed" && contract.client_signature && contract.freelancer_signature)) {
    const contractUrl = typeof window !== "undefined" ? window.location.href : "";
    const shareMessage = `I have signed the contract "${contract.title}". Please review and sign it here: ${contractUrl}`;
    const whatsappLink = `https://wa.me/?text=${encodeURIComponent(shareMessage)}`;
    const emailSubject = `Sign Contract: ${contract.title}`;
    const emailBody = `I have signed the contract "${contract.title}". Please review and sign it here:\n\n${contractUrl}`;
    const mailtoLink = `mailto:?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;

    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="text-center max-w-md">
          <p className="text-4xl mb-4">✓</p>
          <h1 className="text-xl font-serif font-bold text-gray-900 mb-2">Thank You for Signing!</h1>
          <p className="text-gray-600 mb-6">This contract is now fully signed by both parties. You can now share it with others or keep it for your records.</p>
          <div className="flex flex-col gap-2">
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg bg-green-600 text-white px-4 py-2 font-medium hover:bg-green-700 text-center"
            >
              Share via WhatsApp
            </a>
            <a
              href={mailtoLink}
              className="rounded-lg bg-blue-600 text-white px-4 py-2 font-medium hover:bg-blue-700 text-center"
            >
              Share via Email
            </a>
            <button
              type="button"
              onClick={() => {
                if (navigator.share) {
                  navigator.share({
                    title: contract.title,
                    text: shareMessage,
                    url: contractUrl,
                  });
                } else {
                  alert(`Copy this link to share:\n\n${contractUrl}`);
                }
              }}
              className="rounded-lg border border-gray-300 text-gray-700 px-4 py-2 font-medium hover:bg-gray-100"
            >
              Copy Link
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 py-4 px-6">
        <div className="flex items-start justify-between gap-4 mb-2">
          <div>
            {contract.logo_url ? (
              <img src={contract.logo_url} alt={contract.business_name ?? "Business logo"} className="h-9 w-auto object-contain" />
            ) : (
              <p className="font-semibold text-gray-900">{contract.business_name || contract.freelancer_name || "Freelancer"}</p>
            )}
            {contract.business_email && <p className="text-xs text-gray-500">{contract.business_email}</p>}
            {contract.business_phone && <p className="text-xs text-gray-500">{contract.business_phone}</p>}
          </div>
        </div>
        <h1 className="font-serif text-xl font-bold text-gray-900">{contract.title}</h1>
        <p className="text-sm text-gray-500 mt-1">Prepared for {contract.client_name}</p>
      </header>
      <main className="max-w-3xl mx-auto px-6 py-8">
        <article className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-8">
          <div className="prose prose-sm max-w-none whitespace-pre-wrap text-gray-800">{contract.content}</div>
        </article>
        {contract.client_signature && !signed && (
          <div className="bg-amber-50 rounded-lg shadow-sm border border-amber-200 p-4 mb-4">
            <p className="text-sm text-amber-800">
              Your signature has been recorded. This contract will be marked fully signed after the freelancer signs.
            </p>
          </div>
        )}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          {!contract.client_signature ? (
            <>
              <h2 className="font-semibold text-gray-900 mb-4">Sign this contract</h2>
              <input
                type="text"
                placeholder="Your full name"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 mb-4 text-gray-900 placeholder:text-gray-400"
              />
              <label className="flex items-center gap-2 text-sm text-gray-700 mb-4">
                <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} />
                I agree to the terms of this contract
              </label>
              <p className="text-xs text-gray-500 mb-4">
                By typing your full name and clicking &quot;Sign&quot;, you agree that this is your electronic signature
                and you are legally authorised to enter into this agreement.
              </p>
              <button
                type="button"
                onClick={handleSign}
                disabled={!clientName.trim() || !agree || signing}
                className="rounded-lg bg-amber-600 text-white px-6 py-2 font-medium hover:bg-amber-700 disabled:opacity-50"
              >
                {signing ? "Signing..." : "Sign"}
              </button>
            </>
          ) : (
            <>
              <h2 className="font-semibold text-gray-900 mb-2">Client signature recorded</h2>
              <p className="text-sm text-gray-600">Waiting for freelancer signature to complete this contract.</p>
            </>
          )}
          <p className="mt-4 text-[11px] leading-snug text-gray-400">
            Proposar is not a law firm and does not provide legal advice. Contract templates are for general
            informational purposes only. For large or complex deals, consider asking a lawyer in your country
            to review or customise the contract.
          </p>
        </div>
      </main>
    </div>
  );
}
