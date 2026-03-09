"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";

export default function PublicContractPage() {
  const params = useParams();
  const shareId = params.shareId as string;
  const [contract, setContract] = useState<{ title: string; content: string; status: string; client_name: string; client_signature: string | null } | null>(null);
  const [loading, setLoading] = useState(true);
  const [clientName, setClientName] = useState("");
  const [agree, setAgree] = useState(false);
  const [signing, setSigning] = useState(false);
  const [signed, setSigned] = useState(false);

  useEffect(() => {
    fetch(`/api/contract/${shareId}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => { setContract(d); if (d?.status === "signed" && d?.client_signature) setSigned(true); })
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
      if (r.ok) setSigned(true);
    } finally {
      setSigning(false);
    }
  };

  if (loading) return <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">Loading...</div>;
  if (!contract) return <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">Contract not found.</div>;

  if (signed || (contract.status === "signed" && contract.client_signature)) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="text-center max-w-md">
          <p className="text-4xl mb-4">✓</p>
          <h1 className="text-xl font-serif font-bold text-gray-900 mb-2">Contract Signed</h1>
          <p className="text-gray-600">Thank you. The contract has been signed and recorded.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 py-4 px-6">
        <h1 className="font-serif text-xl font-bold text-gray-900">{contract.title}</h1>
        <p className="text-sm text-gray-500 mt-1">Prepared for {contract.client_name}</p>
      </header>
      <main className="max-w-3xl mx-auto px-6 py-8">
        <article className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-8">
          <div className="prose prose-sm max-w-none whitespace-pre-wrap text-gray-800">{contract.content}</div>
        </article>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="font-semibold text-gray-900 mb-4">Sign this contract</h2>
          <input
            type="text"
            placeholder="Your full name"
            value={clientName}
            onChange={(e) => setClientName(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 mb-4"
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
