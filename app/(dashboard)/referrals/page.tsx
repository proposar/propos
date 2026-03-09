"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Copy, Check, Share2, Users, DollarSign } from "lucide-react";

interface Referral {
  id: string;
  referred_email: string;
  signed_up_at: string;
  converted_to_paid: boolean;
}

export default function ReferralsPage() {
  const [referralCode, setReferralCode] = useState("");
  const [earnings, setEarnings] = useState(0);
  const [count, setCount] = useState(0);
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    loadReferralData();
  }, []);

  const loadReferralData = async () => {
    try {
      const res = await fetch("/api/referrals");
      if (res.ok) {
        const data = await res.json();
        setReferralCode(data.referral_code);
        setEarnings(data.referral_earnings);
        setCount(data.referral_count);
        setReferrals(data.recent_referrals);
      }
    } catch (error) {
      console.error("Failed to load referral data:", error);
    } finally {
      setLoading(false);
    }
  };

  const generateCode = async () => {
    try {
      const res = await fetch("/api/referrals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "generate_code" }),
      });
      if (res.ok) {
        const data = await res.json();
        setReferralCode(data.referral_code);
      }
    } catch (error) {
      console.error("Failed to generate code:", error);
    }
  };

  const copyLink = () => {
    const link = `${typeof window !== "undefined" ? window.location.origin : ""}/signup?ref=${referralCode}`;
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareLink = () => {
    const link = `${typeof window !== "undefined" ? window.location.origin : ""}/signup?ref=${referralCode}`;
    const text = `Join Proposar - AI proposal generator for freelancers. Generate winning proposals in 60 seconds. Free forever. ${link}`;

    if (navigator.share) {
      navigator.share({
        title: "Proposar",
        text,
        url: link,
      });
    } else {
      copyLink();
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-32 rounded-xl border border-[#1e1e2e] bg-[#12121e] animate-pulse" />
        <div className="h-64 rounded-xl border border-[#1e1e2e] bg-[#12121e] animate-pulse" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-3xl font-bold text-[#faf8f4]">Referral Program</h1>
        <p className="text-[#888890] mt-2">Earn $10 for every freelancer who signs up with your link</p>
      </div>

      {/* Stats */}
      <div className="grid sm:grid-cols-3 gap-4">
        <div className="rounded-xl border border-[#1e1e2e] bg-[#12121e] p-6">
          <div className="flex items-center gap-3 mb-2">
            <Users className="h-5 w-5 text-gold" />
            <p className="text-sm text-[#888890]">Total Referrals</p>
          </div>
          <p className="text-3xl font-bold text-[#faf8f4]">{count}</p>
          <p className="text-xs text-[#888890] mt-2">People you&apos;ve referred</p>
        </div>

        <div className="rounded-xl border border-[#1e1e2e] bg-[#12121e] p-6">
          <div className="flex items-center gap-3 mb-2">
            <DollarSign className="h-5 w-5 text-gold" />
            <p className="text-sm text-[#888890]">Total Earnings</p>
          </div>
          <p className="text-3xl font-bold text-[#faf8f4]">${earnings}</p>
          <p className="text-xs text-[#888890] mt-2">Lifetime referral rewards</p>
        </div>

        <div className="rounded-xl border border-[#1e1e2e] bg-[#12121e] p-6">
          <div className="flex items-center gap-3 mb-2">
            <DollarSign className="h-5 w-5 text-[#10b981]" />
            <p className="text-sm text-[#888890]">Next Payout</p>
          </div>
          <p className="text-3xl font-bold text-[#faf8f4]">${earnings >= 10 ? earnings : "Pending"}</p>
          <p className="text-xs text-[#888890] mt-2">When you reach $10+, we&apos;ll pay you via Stripe</p>
        </div>
      </div>

      {/* Referral Link */}
      <div className="rounded-xl border border-gold/50 bg-gold/10 p-6">
        <h2 className="font-semibold text-[#faf8f4] mb-4">Your Referral Link</h2>

        {referralCode ? (
          <div className="space-y-4">
            <div className="flex gap-2">
              <input
                type="text"
                value={`${typeof window !== "undefined" ? window.location.origin : ""}/signup?ref=${referralCode}`}
                readOnly
                className="flex-1 rounded-lg border border-[#1e1e2e] bg-[#0a0a14] px-4 py-3 text-sm text-[#faf8f4] font-mono"
              />
              <button
                onClick={copyLink}
                className="rounded-lg bg-gold px-4 py-3 text-[#0a0a14] font-medium hover:bg-[#e8c76a] transition-all flex items-center gap-2"
              >
                {copied ? (
                  <>
                    <Check className="h-4 w-4" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                    Copy
                  </>
                )}
              </button>
            </div>

            <button
              onClick={shareLink}
              className="w-full rounded-lg border border-gold text-gold px-4 py-3 font-medium hover:bg-gold/10 transition-all flex items-center justify-center gap-2"
            >
              <Share2 className="h-4 w-4" />
              Share Link
            </button>

            <div className="text-sm text-[#888890] space-y-2">
              <p>💡 <strong>Pro tip:</strong> Share your link on Twitter, LinkedIn, or in freelance communities</p>
              <p>🎯 Better yet: Include it in your email signature or about page</p>
              <p>📧 Say: &quot;I use Proposar to generate client proposals in 60 seconds. It&apos;s free - here&apos;s a link if you want to try&quot;</p>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-[#888890] mb-4">Create your unique referral code to get started</p>
            <button
              onClick={generateCode}
              className="rounded-lg bg-gold px-6 py-3 text-[#0a0a14] font-medium hover:bg-[#e8c76a] transition-all"
            >
              Generate Referral Code
            </button>
          </div>
        )}
      </div>

      {/* How It Works */}
      <div className="rounded-xl border border-[#1e1e2e] bg-[#12121e] p-6">
        <h3 className="font-semibold text-[#faf8f4] mb-4">How the Referral Program Works</h3>
        <div className="space-y-4 text-sm text-[#c4c4cc]">
          <div className="flex gap-4">
            <div className="text-gold font-bold min-w-6">1</div>
            <div>
              <p className="font-medium text-[#faf8f4]">Share Your Link</p>
              <p>Copy your unique referral link and share it anywhere—Twitter, email, your website, etc.</p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="text-gold font-bold min-w-6">2</div>
            <div>
              <p className="font-medium text-[#faf8f4]">They Sign Up</p>
              <p>When someone signs up using your link, they&apos;re linked to you as their referrer.</p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="text-gold font-bold min-w-6">3</div>
            <div>
              <p className="font-medium text-[#faf8f4]">You Earn $10</p>
              <p>When they upgrade to a paid plan (Starter, Pro, or Agency), you earn $10 instantly.</p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="text-gold font-bold min-w-6">4</div>
            <div>
              <p className="font-medium text-[#faf8f4]">Monthly Payouts</p>
              <p>Once you earn $10+, we pay you via Stripe on the 15th of each month.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Referrals */}
      {referrals.length > 0 && (
        <div className="rounded-xl border border-[#1e1e2e] bg-[#12121e] p-6">
          <h3 className="font-semibold text-[#faf8f4] mb-4">Recent Referrals</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-[#888890] border-b border-[#1e1e2e]">
                  <th className="pb-3">Email</th>
                  <th className="pb-3">Signed Up</th>
                  <th className="pb-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {referrals.map((ref) => (
                  <tr key={ref.id} className="border-b border-[#1e1e2e]/50 hover:bg-[#0a0a14]/30">
                    <td className="py-3 text-[#c4c4cc]">{ref.referred_email}</td>
                    <td className="py-3 text-[#888890]">
                      {new Date(ref.signed_up_at).toLocaleDateString()}
                    </td>
                    <td className="py-3">
                      <span
                        className={`text-xs font-medium px-2 py-1 rounded ${
                          ref.converted_to_paid
                            ? "bg-[#10b981]/20 text-[#10b981]"
                            : "bg-[#f59e0b]/20 text-[#f59e0b]"
                        }`}
                      >
                        {ref.converted_to_paid ? "Paid Subscriber" : "Free Plan"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* FAQ */}
      <div className="rounded-xl border border-[#1e1e2e] bg-[#12121e] p-6">
        <h3 className="font-semibold text-[#faf8f4] mb-4">Referral FAQ</h3>
        <div className="space-y-4 text-sm text-[#c4c4cc]">
          <details className="cursor-pointer">
            <summary className="font-medium text-[#faf8f4] mb-2">Do I earn money if they stay on the free plan?</summary>
            <p className="mt-2 ml-4">No, you only earn $10 when they upgrade to a paid plan. The free plan is risk-free for them.</p>
          </details>
          <details className="cursor-pointer">
            <summary className="font-medium text-[#faf8f4] mb-2">Can I earn more by referring multiple people?</summary>
            <p className="mt-2 ml-4">Yes! There&apos;s no cap. Refer 100 people → $1,000. Refer 1,000 people → $10,000.</p>
          </details>
          <details className="cursor-pointer">
            <summary className="font-medium text-[#faf8f4] mb-2">How often are referral payouts?</summary>
            <p className="mt-2 ml-4">Monthly. Once you reach $10+, we process payouts via Stripe on the 15th of each month.</p>
          </details>
          <details className="cursor-pointer">
            <summary className="font-medium text-[#faf8f4] mb-2">What if someone clicks my link but signs up later?</summary>
            <p className="mt-2 ml-4">We track referral links for 30 days. If they sign up within 30 days of clicking, you get credit.</p>
          </details>
        </div>
      </div>
    </div>
  );
}
