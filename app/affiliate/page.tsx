import { StaticPageLayout } from "@/components/landing/StaticPageLayout";

import { Metadata } from "next";
import { generateMetadata } from "@/lib/seo";

export const metadata: Metadata = generateMetadata(
  "Affiliate Program — Earn with Proposar",
  "Join our affiliate program and earn up to 30% recurring commission. Get paid every month for referrals.",
  [
    "proposar affiliate program",
    "affiliate marketing",
    "referral program",
    "earn money",
    "commission program",
    "proposar partner",
  ],
  "/affiliate"
);

export default function AffiliatePage() {
  return (
    <StaticPageLayout title="Affiliate Program" description="Earn by referring freelancers to Proposar.">
      <div className="space-y-8">
        <section>
          <p className="text-[#c4c4cc] text-lg mb-6 leading-relaxed">
            Know someone who needs better proposals? Earn $50 per referral when they upgrade to a paid plan.
          </p>
        </section>

        {/* Coming Soon */}
        <section className="bg-gold/10 border border-gold/30 rounded-lg p-8">
          <p className="text-3xl mb-3">🚀</p>
          <p className="text-[#faf8f4] font-semibold text-xl mb-3">Affiliate Program Launching Soon</p>
          <p className="text-[#c4c4cc] mb-6">
            We&apos;re building a full affiliate system with:
          </p>
          <ul className="space-y-2 text-[#c4c4cc] mb-6">
            <li>✓ Unique referral links for tracking</li>
            <li>✓ $50 commission per referred customer</li>
            <li>✓ Real-time dashboard to track earnings</li>
            <li>✓ Weekly payouts via Stripe</li>
            <li>✓ Exclusive affiliate resources & templates</li>
          </ul>
          <p className="text-[#888890] text-sm mb-4">
            Expected launch: <strong>April 2026</strong>
          </p>
          <p className="text-[#c4c4cc] mb-4">
            Be first in line. Drop your email below and we&apos;ll invite you to the beta program.
          </p>
          <div className="flex gap-3">
            <input 
              type="email" 
              placeholder="your@email.com" 
              className="flex-1 rounded-lg border border-[#1e1e2e] bg-[#0a0a14] px-4 py-2 text-[#faf8f4] placeholder-[#888890]"
            />
            <button className="rounded-lg bg-gold px-6 py-2 text-[#0a0a14] font-semibold hover:bg-[#e8c76a]">
              Notify Me
            </button>
          </div>
        </section>

        {/* Why Join */}
        <section>
          <h2 className="text-2xl font-serif font-bold text-[#faf8f4] mb-4">Why Become an Affiliate?</h2>
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="text-2xl flex-shrink-0">💰</div>
              <div>
                <p className="text-[#faf8f4] font-semibold mb-1">$50 per Customer</p>
                <p className="text-[#c4c4cc]">Whenever someone you refer upgrades from free to paid, you earn $50.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="text-2xl flex-shrink-0">📊</div>
              <div>
                <p className="text-[#faf8f4] font-semibold mb-1">Lifetime Value</p>
                <p className="text-[#c4c4cc]">As long as they stay on Proposar, you earn. One referral = recurring revenue.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="text-2xl flex-shrink-0">🌐</div>
              <div>
                <p className="text-[#faf8f4] font-semibold mb-1">Share What You Love</p>
                <p className="text-[#c4c4cc]">Tell your audience about a tool you actually use. Authenticity = conversions.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="text-2xl flex-shrink-0">🏆</div>
              <div>
                <p className="text-[#faf8f4] font-semibold mb-1">Top Affiliate Bonus</p>
                <p className="text-[#c4c4cc]">Top 3 affiliates get featured on our site + $500 quarterly bonus.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Who Should Apply */}
        <section>
          <h2 className="text-2xl font-serif font-bold text-[#faf8f4] mb-4">Who Should Apply?</h2>
          <p className="text-[#c4c4cc] mb-4 leading-relaxed">
            We&apos;re looking for people with influence in the freelancer community:
          </p>
          <ul className="space-y-2 text-[#c4c4cc]">
            <li>🌟 Freelance educators / YouTubers</li>
            <li>🌟 Agency owners (who refer freelancer clients)</li>
            <li>🌟 Tech bloggers & newsletter writers</li>
            <li>🌟 Community leaders (Slack groups, Discord, Reddit)</li>
            <li>🌟 Freelance coaches & mentors</li>
          </ul>
        </section>

        {/* FAQ */}
        <section>
          <h2 className="text-2xl font-serif font-bold text-[#faf8f4] mb-4">FAQ</h2>
          <div className="space-y-4">
            <div className="bg-[#12121e] border border-[#1e1e2e] rounded-lg p-4">
              <p className="text-[#faf8f4] font-semibold mb-2">How do I get paid?</p>
              <p className="text-[#c4c4cc]">Via Stripe, monthly. Need minimum $20 balance to cash out.</p>
            </div>
            <div className="bg-[#12121e] border border-[#1e1e2e] rounded-lg p-4">
              <p className="text-[#faf8f4] font-semibold mb-2">How long is the cookie?</p>
              <p className="text-[#c4c4cc]">30 days. If they sign up within 30 days of clicking your link, you earn.</p>
            </div>
            <div className="bg-[#12121e] border border-[#1e1e2e] rounded-lg p-4">
              <p className="text-[#faf8f4] font-semibold mb-2">Is there a cap?</p>
              <p className="text-[#c4c4cc]">No. Earn as much as you can. We pay 100% of commissions earned.</p>
            </div>
            <div className="bg-[#12121e] border border-[#1e1e2e] rounded-lg p-4">
              <p className="text-[#faf8f4] font-semibold mb-2">When is it live?</p>
              <p className="text-[#c4c4cc]">April 2026. Early affiliate beta opens March 25. Apply now to get in early.</p>
            </div>
          </div>
        </section>
      </div>
    </StaticPageLayout>
  );
}
