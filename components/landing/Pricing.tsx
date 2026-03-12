"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { openCheckout } from "@/lib/paddle-client";

const plans = [
  {
    name: "Starter",
    badge: "Get Started",
    monthly: 19,
    annual: 15,
    features: [
      { text: "10 proposals per month", included: true },
      { text: "AI proposal generation", included: true },
      { text: "Shareable proposal links", included: true },
      { text: "Open tracking (basic)", included: true },
      { text: "3 proposal templates", included: true },
      { text: "PDF export", included: true },
      { text: "Email support", included: true },
      { text: "Custom branding", included: false },
      { text: "Follow-up reminders", included: false },
      { text: "Client dashboard", included: false },
      { text: "Priority AI", included: false },
    ],
    highlighted: false,
  },
  {
    name: "Pro",
    badge: "Most Popular",
    monthly: 29,
    annual: 23,
    features: [
      { text: "Unlimited proposals", included: true },
      { text: "AI proposal generation", included: true },
      { text: "Shareable proposal links", included: true },
      { text: "Advanced open tracking + scroll depth", included: true },
      { text: "Unlimited templates", included: true },
      { text: "PDF export with your branding", included: true },
      { text: "Follow-up reminders", included: true },
      { text: "Client dashboard", included: true },
      { text: "Custom logo & colors", included: true },
      { text: "Email support (priority)", included: true },
      { text: "Team members", included: false },
      { text: "API access", included: false },
    ],
    highlighted: true,
  },
  {
    name: "Agency",
    badge: "For Teams",
    monthly: 79,
    annual: 63,
    features: [
      { text: "Everything in Pro", included: true },
      { text: "5 team members", included: true },
      { text: "Team proposal sharing", included: true },
      { text: "White-label proposals", included: true },
      { text: "API access", included: true },
      { text: "Custom domain for proposal links", included: true },
      { text: "Dedicated account manager", included: true },
      { text: "Priority support (1hr response)", included: true },
      { text: "Custom onboarding call", included: true },
      { text: "Usage analytics", included: true },
    ],
    highlighted: false,
  },
];

const faqs = [
  { q: "Is there really a free trial?", a: "Yes — every plan starts with a 14-day free trial. No credit card needed to get started." },
  { q: "Can I upgrade or downgrade anytime?", a: "Absolutely. Switch plans whenever you want. Changes take effect immediately." },
  { q: "Do you offer refunds?", a: "Yes. If you're not happy in the first 30 days, we'll give you a full refund. No questions asked." },
  { q: "What counts as a 'proposal'?", a: "Each AI-generated proposal counts as one. Duplicating or editing existing proposals doesn't count." },
];

export function Pricing() {
  const router = useRouter();
  const [annual, setAnnual] = useState(false);
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);

  const handleCheckout = async (plan: "starter" | "pro" | "agency") => {
    setLoadingPlan(plan);
    try {
      console.log("[Pricing] Checking auth...");
      const checkAuth = await fetch("/api/auth/session");
      console.log("[Pricing] Auth check response:", checkAuth.status);
      
      if (!checkAuth.ok) {
        console.log("[Pricing] Not authenticated, redirecting to login");
        router.push("/login?redirectTo=/dashboard/billing");
        setLoadingPlan(null);
        return;
      }
      
      const successUrl = `${window.location.origin}/dashboard/billing?upgrade=success`;
      console.log("[Pricing] User authenticated, opening checkout with successUrl:", successUrl);
      
      const result = await openCheckout(plan, {
        successUrl,
      });
      console.log("[Pricing] Checkout result:", result);
      
      if (!result.ok) {
        console.error("[Pricing] Checkout failed:", result.error);
        alert(`Checkout error: ${result.error}`);
      }
    } catch (error) {
      console.error("[Pricing] Checkout error:", error);
      alert("Failed to start checkout. Please try again.");
    } finally {
      setLoadingPlan(null);
    }
  };

  return (
    <section id="pricing" className="py-24 md:py-28 bg-[#0a0a14] px-6">
      <div className="max-w-6xl mx-auto">
        <h2 className="font-serif text-5xl md:text-6xl font-bold text-[#faf8f4] text-center mb-4 leading-tight">
          Simple, transparent pricing
        </h2>
        <p className="text-[#888890] text-center mb-12 text-lg">Prices in USD. Target USA, UK, AUS, Canada.</p>

        <div className="flex justify-center items-center gap-6 mb-16">
          <button
            type="button"
            onClick={() => setAnnual(false)}
            className={`px-6 py-2.5 rounded-lg text-sm font-semibold transition-all ${
              !annual ? "bg-gold text-[#0a0a14] shadow-lg shadow-gold/20" : "text-[#888890] hover:text-[#faf8f4]"
            }`}
          >
            Monthly
          </button>
          <button
            type="button"
            onClick={() => setAnnual(true)}
            className={`px-6 py-2.5 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 ${
              annual ? "bg-gold text-[#0a0a14] shadow-lg shadow-gold/20" : "text-[#888890] hover:text-[#faf8f4]"
            }`}
          >
            Annual
            <span className="rounded bg-emerald-500/20 text-emerald-400 text-xs px-2.5 py-1">Save 20%</span>
          </button>
        </div>

        <div className="grid md:grid-cols-3 gap-7 items-stretch">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className={`rounded-xl border p-8 flex flex-col ${
                plan.highlighted
                  ? "border-gold bg-[#12121e] md:scale-[1.05] shadow-xl shadow-gold/15 hover:shadow-[0_0_40px_rgba(217,119,6,0.25)] hover:-translate-y-2 transition-all duration-300"
                  : "border-[#1e1e2e] bg-[#12121e] hover:border-gold/40 hover:shadow-[0_0_32px_rgba(217,119,6,0.12)] hover:-translate-y-1 transition-all duration-300"
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-medium text-gold uppercase tracking-wider">
                  {plan.badge}
                </span>
              </div>
              <h3 className="font-serif text-xl font-semibold text-[#faf8f4]">{plan.name}</h3>
              <p className="mt-2 text-3xl font-bold text-[#faf8f4]">
                ${annual ? plan.annual : plan.monthly}
                <span className="text-base font-normal text-[#888890]">/mo</span>
              </p>
              {annual && (
                <p className="text-xs text-[#888890] mt-1">Billed annually</p>
              )}
              <ul className="mt-6 space-y-3 flex-1">
                {plan.features.map((f) => (
                  <li key={f.text} className="flex items-start gap-2 text-sm">
                    {f.included ? (
                      <span className="text-gold mt-0.5">✓</span>
                    ) : (
                      <span className="text-[#888890]/60 mt-0.5">✗</span>
                    )}
                    <span className={f.included ? "text-[#888890]" : "text-[#888890]/60"}>{f.text}</span>
                  </li>
                ))}
              </ul>
              <button
                onClick={() => handleCheckout(plan.name.toLowerCase() as "starter" | "pro" | "agency")}
                disabled={loadingPlan !== null}
                className={`mt-6 block w-full rounded-lg py-3 text-center font-medium transition-colors ${
                  plan.highlighted
                    ? "bg-gold text-[#0a0a14] hover:bg-[#e8c76a] disabled:opacity-50"
                    : "border border-[#1e1e2e] text-[#faf8f4] hover:bg-[#1e1e2e] disabled:opacity-50"
                }`}
              >
                {loadingPlan === plan.name.toLowerCase() ? "Loading..." : "Start Free Trial"}
              </button>
            </motion.div>
          ))}
        </div>

        <p className="text-center text-sm text-[#888890] mt-10">
          All plans include 14-day free trial. No credit card required.
        </p>
        <p className="text-center text-xs text-[#888890]/80 mt-2 max-w-xl mx-auto">
          Agency: Team, API &amp; custom domain are coming soon. Account manager, priority support &amp; onboarding are delivered by our team.
        </p>
        <p className="text-center text-sm text-[#888890] mt-2">
          Cancel anytime. No contracts. No surprises.
        </p>

        {/* Mini FAQ */}
        <div className="mt-24 max-w-2xl mx-auto">
          <h3 className="font-serif text-3xl font-bold text-[#faf8f4] text-center mb-10">
            Pricing FAQ
          </h3>
          <div className="space-y-3">
            {faqs.map((faq) => (
              <div
                key={faq.q}
                className="rounded-lg border border-[#1e1e2e] bg-[#12121e] p-5 hover:border-gold/30 transition-colors"
              >
                <p className="font-semibold text-[#faf8f4]">{faq.q}</p>
                <p className="text-sm text-[#888890] mt-2">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Comparison table */}
        <div className="mt-24 overflow-x-auto">
          <h3 className="font-serif text-3xl font-bold text-[#faf8f4] text-center mb-8">
            Compare plans
          </h3>
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-[#1e1e2e]">
                <th className="text-left py-3 px-4 text-[#888890] font-medium">Feature</th>
                <th className="text-center py-3 px-4 text-[#faf8f4]">Starter</th>
                <th className="text-center py-3 px-4 text-gold">Pro</th>
                <th className="text-center py-3 px-4 text-[#faf8f4]">Agency</th>
              </tr>
            </thead>
            <tbody className="text-[#888890]">
              <tr className="border-b border-[#1e1e2e]/50"><td className="py-3 px-4">Proposals/month</td><td className="text-center py-3 px-4">10</td><td className="text-center py-3 px-4">Unlimited</td><td className="text-center py-3 px-4">Unlimited</td></tr>
              <tr className="border-b border-[#1e1e2e]/50"><td className="py-3 px-4">Templates</td><td className="text-center py-3 px-4">3</td><td className="text-center py-3 px-4">Unlimited</td><td className="text-center py-3 px-4">Unlimited</td></tr>
              <tr className="border-b border-[#1e1e2e]/50"><td className="py-3 px-4">Custom branding</td><td className="text-center py-3 px-4">—</td><td className="text-center py-3 px-4">✓</td><td className="text-center py-3 px-4">✓</td></tr>
              <tr className="border-b border-[#1e1e2e]/50"><td className="py-3 px-4">Team members</td><td className="text-center py-3 px-4">—</td><td className="text-center py-3 px-4">—</td><td className="text-center py-3 px-4">5</td></tr>
              <tr className="border-b border-[#1e1e2e]/50"><td className="py-3 px-4">API / White-label</td><td className="text-center py-3 px-4">—</td><td className="text-center py-3 px-4">—</td><td className="text-center py-3 px-4">✓</td></tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
