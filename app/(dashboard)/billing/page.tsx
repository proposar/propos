"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useProfile } from "@/contexts/ProfileContext";
import { openCheckout, type PaddlePlan } from "@/lib/paddle-client";
import Link from "next/link";

const PLANS = {
  free: {
    name: "Free",
    monthly: 0,
    annual: 0,
    proposalsPerMonth: 3,
    features: [
      { text: "3 proposals per month", included: true },
      { text: "Basic proposal generation", included: true },
      { text: "Shareable proposal links", included: true },
      { text: "Open tracking (basic)", included: true },
      { text: "Custom branding", included: false },
      { text: "Follow-up reminders", included: false },
      { text: "Client dashboard", included: false },
      { text: "Priority AI", included: false },
      { text: "Email support", included: false },
      { text: "Team members", included: false },
      { text: "API access", included: false },
    ],
  },
  starter: {
    name: "Starter",
    monthly: 19,
    annual: 15,
    proposalsPerMonth: 10,
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
      { text: "Team members", included: false },
      { text: "API access", included: false },
    ],
  },
  pro: {
    name: "Pro",
    monthly: 29,
    annual: 23,
    proposalsPerMonth: -1,
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
  },
  agency: {
    name: "Agency",
    monthly: 79,
    annual: 63,
    proposalsPerMonth: -1,
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
  },
};

const planOrder = ["free", "starter", "pro", "agency"];

export default function BillingPage() {
  const router = useRouter();
  const { profile, loading: profileLoading } = useProfile();
  const plan = (profile?.subscription_plan as "free" | "starter" | "pro" | "agency") || "free";
  const hasBillingSubscription =
    !!profile?.stripe_subscription_id || !!profile?.stripe_customer_id;
  const [billing, setBilling] = useState<"monthly" | "annual">("monthly");
  const [upgradeLoading, setUpgradeLoading] = useState<string | null>(null);
  const [portalLoading, setPortalLoading] = useState(false);
  const autoCheckoutAttemptedRef = useRef(false);

  useEffect(() => {
    if (!profileLoading && !profile) {
      router.push("/login");
    }
  }, [profile, profileLoading, router]);

  const handleUpgrade = useCallback(async (targetPlan: string) => {
    if (targetPlan === plan) return;
    if (!["starter", "pro", "agency"].includes(targetPlan)) return;

    setUpgradeLoading(targetPlan);
    try {
      const result = await openCheckout(targetPlan as PaddlePlan, {
        successUrl: `${window.location.origin}/billing`,
      });
      if (!result.ok) {
        alert(result.error || "Failed to start checkout");
      }
    } catch (err) {
      console.error("[Billing] Checkout error:", err);
      alert("Failed to start checkout. Please try again.");
    } finally {
      setUpgradeLoading(null);
    }
  }, [plan]);

  const openPortal = useCallback(async () => {
    setPortalLoading(true);
    try {
      const res = await fetch("/api/paddle/portal", { method: "POST" });
      const data = await res.json();
      if (data.url) {
        window.open(data.url, "_blank");
      } else {
        alert(data.error || "Failed to open billing portal");
      }
    } catch (err) {
      console.error("Portal error:", err);
      alert("Failed to open billing portal");
    } finally {
      setPortalLoading(false);
    }
  }, []);

  // Support links like `/billing?plan=pro` by auto-triggering checkout once.
  useEffect(() => {
    if (autoCheckoutAttemptedRef.current) return;
    if (profileLoading || !profile) return;

    const planParam = new URLSearchParams(window.location.search).get("plan");
    if (!planParam) return;
    if (!["starter", "pro", "agency"].includes(planParam)) return;
    if (planParam === plan) return;

    autoCheckoutAttemptedRef.current = true;

    const shouldUsePortal = hasBillingSubscription && planParam !== "free";
    if (shouldUsePortal) {
      void openPortal();
    } else {
      void handleUpgrade(planParam);
    }
  }, [profileLoading, profile, plan, hasBillingSubscription, openPortal, handleUpgrade]);

  if (profileLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold"></div>
      </div>
    );
  }

  const currentPlan = PLANS[plan as keyof typeof PLANS];
  const limit = currentPlan.proposalsPerMonth;
  const used = profile?.proposals_used_this_month ?? 0;
  const limitLabel = limit === -1 ? "Unlimited" : limit;

  return (
    <div className="min-h-screen bg-[#0a0a14] text-[#faf8f4] py-16 px-4">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-5xl mx-auto mb-12"
      >
        <h1 className="font-serif text-4xl font-bold mb-2">Billing & Plans</h1>
        <p className="text-[#888890] text-lg">
          Manage your subscription and see all available plans
        </p>
      </motion.div>

      {/* Current Plan Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-5xl mx-auto mb-12 p-6 rounded-xl border border-[#1e1e2e] bg-[#12121e]"
      >
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <p className="text-sm text-[#888890] mb-2">Current Plan</p>
            <h2 className="text-3xl font-bold capitalize text-gold mb-4">{plan}</h2>
            
            {currentPlan.monthly > 0 && (
              <div className="mb-6">
                <p className="text-2xl font-bold">
                  ${billing === "monthly" ? currentPlan.monthly : currentPlan.annual}/month
                </p>
                {billing === "annual" && (
                  <p className="text-sm text-green-400">Save 20% with annual billing</p>
                )}
              </div>
            )}

            {profile?.subscription_period_end && (
              <div className="mb-6">
                <p className="text-sm text-[#888890] mb-1">Next billing date</p>
                <p className="text-[#faf8f4]">{new Date(profile.subscription_period_end).toLocaleDateString()}</p>
              </div>
            )}

            <div className="flex gap-3">
              {plan !== "free" && (
                <button
                  onClick={openPortal}
                  disabled={portalLoading}
                  className="px-4 py-2 rounded-lg bg-[#1e1e2e] border border-[#2d2d3d] hover:border-gold/50 transition-colors text-sm font-medium disabled:opacity-50"
                >
                  {portalLoading ? "Opening..." : "Manage Billing"}
                </button>
              )}
              {plan !== "free" && (
                <button
                  onClick={() => window.open("mailto:support@proposar.com?subject=Cancel Subscription", "_blank")}
                  className="px-4 py-2 rounded-lg bg-red-900/20 border border-red-700/30 hover:border-red-600 transition-colors text-sm font-medium text-red-400"
                >
                  Cancel Plan
                </button>
              )}
            </div>
          </div>

          {/* Usage */}
          <div>
            <p className="text-sm text-[#888890] mb-4">Usage This Month</p>
            <div className="mb-4">
              <div className="h-3 rounded-full bg-[#0a0a14] overflow-hidden mb-2">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-gold to-gold/60 transition-all"
                  style={{
                    width: limit === -1 ? "0%" : `${Math.min(100, (used / limit) * 100)}%`,
                  }}
                />
              </div>
              <p className="text-sm text-[#888890]">
                {used} of {limitLabel} proposals
              </p>
            </div>

            {limit > 0 && used >= limit && (
              <div className="p-3 rounded-lg bg-yellow-900/20 border border-yellow-700/30 text-yellow-300 text-sm">
                You&apos;ve reached your monthly limit. Upgrade to send more proposals.
              </div>
            )}

            {limit > 0 && used > limit * 0.8 && used < limit && (
              <div className="p-3 rounded-lg bg-yellow-900/20 border border-yellow-700/30 text-yellow-300 text-sm">
                You&apos;re approaching your limit. Consider upgrading for more proposals.
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Billing Toggle */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="max-w-5xl mx-auto mb-12 flex justify-center"
      >
        <div className="inline-flex rounded-lg bg-[#12121e] border border-[#1e1e2e] p-1">
          <button
            onClick={() => setBilling("monthly")}
            className={`px-6 py-2 rounded-lg font-medium transition-all ${
              billing === "monthly"
                ? "bg-gold text-[#0a0a14]"
                : "text-[#888890] hover:text-[#faf8f4]"
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setBilling("annual")}
            className={`px-6 py-2 rounded-lg font-medium transition-all ${
              billing === "annual"
                ? "bg-gold text-[#0a0a14]"
                : "text-[#888890] hover:text-[#faf8f4]"
            }`}
          >
            Annual <span className="text-sm ml-1">(Save 20%)</span>
          </button>
        </div>
      </motion.div>

      {/* Plans Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="max-w-6xl mx-auto grid md:grid-cols-4 gap-6 mb-12"
      >
        {planOrder.map((planKey) => {
          const p = PLANS[planKey as keyof typeof PLANS];
          const isCurrentPlan = plan === planKey;
          const price = billing === "monthly" ? p.monthly : p.annual;
          const isFreePlanKey = planKey === "free";
          const shouldUsePortalForUpgrade =
            hasBillingSubscription && !isFreePlanKey && !isCurrentPlan;

          return (
            <motion.div
              key={planKey}
              whileHover={{ y: -5 }}
              className={`rounded-xl border-2 transition-all ${
                isCurrentPlan
                  ? "border-gold bg-gold/5"
                  : "border-[#1e1e2e] bg-[#12121e] hover:border-[#2d2d3d]"
              }`}
            >
              <div className="p-6 flex flex-col h-full">
                {/* Header */}
                <div className="mb-6">
                  <h3 className="text-xl font-bold mb-2">{p.name}</h3>
                  {isCurrentPlan && (
                    <div className="inline-block px-2 py-1 rounded bg-gold/20 text-gold text-xs font-semibold mb-3">
                      Current Plan
                    </div>
                  )}
                  <div className="mb-4">
                    <span className="text-3xl font-bold">${price}</span>
                    <span className="text-[#888890] text-sm">/month</span>
                  </div>
                </div>

                {/* Features */}
                <div className="flex-grow mb-6">
                  <ul className="space-y-3">
                    {p.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm">
                        <span
                          className={`mt-1 flex-shrink-0 w-4 h-4 rounded border ${
                            feature.included
                              ? "bg-gold border-gold"
                              : "border-[#2d2d3d]"
                          } flex items-center justify-center`}
                        >
                          {feature.included && (
                            <svg
                              className="w-3 h-3 text-[#0a0a14] font-bold"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                          )}
                        </span>
                        <span
                          className={
                            feature.included ? "text-[#faf8f4]" : "text-[#888890]"
                          }
                        >
                          {feature.text}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* CTA Button */}
                <button
                  onClick={() =>
                    shouldUsePortalForUpgrade
                      ? openPortal()
                      : handleUpgrade(planKey)
                  }
                  disabled={
                    isCurrentPlan ||
                    upgradeLoading !== null ||
                    isFreePlanKey
                  }
                  className={`w-full py-2 px-4 rounded-lg font-medium transition-all ${
                    isCurrentPlan
                      ? "bg-[#2d2d3d] text-[#888890] cursor-default"
                      : "bg-gold text-[#0a0a14] hover:bg-[#e8c76a] disabled:opacity-50"
                  }`}
                >
                  {upgradeLoading === planKey
                    ? "Loading..."
                    : isCurrentPlan
                    ? "Current Plan"
                    : isFreePlanKey
                    ? "Already Free"
                    : shouldUsePortalForUpgrade
                    ? "Change in Billing Portal"
                    : "Upgrade Now"}
                </button>

                {price === 0 && (
                  <p className="text-xs text-[#888890] text-center mt-3">
                    Forever free
                  </p>
                )}
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* FAQ Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="max-w-3xl mx-auto"
      >
        <h2 className="text-2xl font-bold mb-8">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {[
            { q: "Is there really a free trial?", a: "Yes — every plan starts with a 14-day free trial. No credit card needed to get started." },
            { q: "Can I upgrade or downgrade anytime?", a: "Absolutely. Switch plans whenever you want. Changes take effect immediately." },
            { q: "Do you offer refunds?", a: "Yes. If you&apos;re not happy in the first 30 days, we&apos;ll give you a full refund. No questions asked." },
            { q: "What counts as a &apos;proposal&apos;?", a: "Each proposal sent counts as one. Duplicating or editing existing proposals doesn&apos;t count." },
          ].map((faq, idx) => (
            <details
              key={idx}
              className="p-4 rounded-lg border border-[#1e1e2e] bg-[#12121e] group cursor-pointer"
            >
              <summary className="font-medium flex justify-between items-center">
                {faq.q}
                <span className="group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="mt-3 text-[#888890] text-sm">{faq.a}</p>
            </details>
          ))}
        </div>
      </motion.div>

      {/* Need Help */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="max-w-5xl mx-auto mt-16 text-center"
      >
        <p className="text-[#888890] mb-4">
          Have questions? <Link href="/contact" className="text-gold hover:underline">Contact our team</Link>
        </p>
      </motion.div>
    </div>
  );
}
