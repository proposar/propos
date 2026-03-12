"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const PLANS = [
  { id: "starter" as const, name: "Starter", price: "$19", period: "/mo", features: ["10 proposals/mo", "AI generation", "Shareable links", "Open tracking"] },
  { id: "pro" as const, name: "Pro", price: "$29", period: "/mo", popular: true, features: ["Unlimited proposals", "Priority AI", "Client dashboard", "Custom branding"] },
  { id: "agency" as const, name: "Agency", price: "$79", period: "/mo", features: ["5 team members", "White-label", "API access", "Dedicated support"] },
];

// Extend Window for Paddle.js
declare global {
  interface Window {
    Paddle?: {
      Initialize: (opts: {
        token: string;
        checkout?: {
          settings?: Record<string, unknown>;
        };
      }) => void;
      Environment?: { set: (env: string) => void };
      Checkout: {
        open: (opts: {
          items: Array<{ priceId: string; quantity: number }>;
          settings?: Record<string, unknown>;
          customer?: { email?: string };
          customData?: Record<string, string>;
        }) => void;
      };
    };
  }
}

interface PaddleConfig {
  clientToken: string | null;
  isSandbox: boolean;
  priceIds: { starter: string; pro: string; agency: string };
}

interface UpgradeModalProps {
  open: boolean;
  onClose: () => void;
  message?: string;
}

export function UpgradeModal({ open, onClose, message }: UpgradeModalProps) {
  const [annual, setAnnual] = useState(false);
  const [loading, setLoading] = useState<string | null>(null);
  const [paddleConfig, setPaddleConfig] = useState<PaddleConfig | null>(null);
  const [paddleReady, setPaddleReady] = useState(false);
  const paddleInitializedRef = useRef(false);

  const initializePaddle = useCallback((cfg: PaddleConfig) => {
    if (!window.Paddle || !cfg.clientToken || paddleInitializedRef.current) {
      return;
    }

    if (cfg.isSandbox) {
      window.Paddle.Environment?.set("sandbox");
    }

    window.Paddle.Initialize({
      token: cfg.clientToken,
      checkout: {
        settings: {
          theme: "dark",
          locale: "en",
          displayMode: "overlay",
          successUrl: `${window.location.origin}/dashboard?upgrade=success`,
        },
      },
    });

    paddleInitializedRef.current = true;
    setPaddleReady(true);
  }, []);

  // Fetch Paddle config and load Paddle.js once
  useEffect(() => {
    if (!open || paddleConfig) return;

    fetch("/api/paddle/config")
      .then((r) => (r.ok ? r.json() : null))
      .then((cfg: PaddleConfig | null) => {
        if (!cfg?.clientToken) return;
        setPaddleConfig(cfg);

        if (window.Paddle) {
          initializePaddle(cfg);
          return;
        }

        const script = document.createElement("script");
        script.src = "https://cdn.paddle.com/paddle/v2/paddle.js";
        script.onload = () => {
          initializePaddle(cfg);
        };
        document.head.appendChild(script);
      })
      .catch(() => {});
  }, [initializePaddle, open, paddleConfig]);

  const handleUpgrade = useCallback(
    async (planId: "starter" | "pro" | "agency") => {
      setLoading(planId);

      if (!paddleReady || !paddleConfig || !window.Paddle) {
        // Fallback: server-side redirect
        try {
          const res = await fetch("/api/paddle/checkout", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ plan: planId }),
          });
          const data = await res.json();
          if (data.url) window.location.href = data.url;
          else alert("Checkout unavailable. Please try again later.");
        } catch {
          alert("Checkout unavailable. Please try again later.");
        } finally {
          setLoading(null);
        }
        return;
      }

      const priceId = paddleConfig.priceIds[planId];
      try {
        window.Paddle.Checkout.open({
          items: [{ priceId, quantity: 1 }],
          settings: {
            displayMode: "overlay",
            successUrl: `${window.location.origin}/dashboard?upgrade=success`,
          },
        });
      } catch (err) {
        console.error("Paddle checkout error", err);
        alert("Could not open checkout. Please try again.");
      } finally {
        setLoading(null);
      }
    },
    [paddleReady, paddleConfig],
  );

  if (!open) return null;

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          onClick={(e) => e.stopPropagation()}
          className="rounded-xl border border-[#1e1e2e] bg-[#12121e] p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        >
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="font-serif text-xl font-bold text-[#faf8f4]">Upgrade to create more proposals</h2>
              {message && <p className="text-sm text-[#888890] mt-1">{message}</p>}
            </div>
            <button type="button" onClick={onClose} className="text-[#888890] hover:text-[#faf8f4]">✕</button>
          </div>

          <div className="flex justify-center gap-2 mb-6">
            <button
              type="button"
              onClick={() => setAnnual(false)}
              className={`px-3 py-1.5 rounded-lg text-sm ${!annual ? "bg-gold text-[#0a0a14]" : "text-[#888890]"}`}
            >
              Monthly
            </button>
            <button
              type="button"
              onClick={() => setAnnual(true)}
              className={`px-3 py-1.5 rounded-lg text-sm flex items-center gap-1 ${annual ? "bg-gold text-[#0a0a14]" : "text-[#888890]"}`}
            >
              Annual <span className="text-xs bg-emerald-500/20 text-emerald-400 px-1.5 rounded">Save 20%</span>
            </button>
          </div>

          <div className="grid md:grid-cols-3 gap-4 mb-6">
            {PLANS.map((plan) => (
              <div
                key={plan.id}
                className={`rounded-xl border p-4 ${plan.popular ? "border-gold bg-gold/5" : "border-[#1e1e2e]"}`}
              >
                {plan.popular && <p className="text-xs text-gold font-medium mb-2">Most Popular</p>}
                <h3 className="font-semibold text-[#faf8f4]">{plan.name}</h3>
                <p className="text-2xl font-bold text-[#faf8f4] mt-1">
                  {plan.price}<span className="text-sm font-normal text-[#888890]">{plan.period}</span>
                </p>
                <ul className="text-xs text-[#888890] mt-3 space-y-1">
                  {plan.features.map((f) => (
                    <li key={f}>✓ {f}</li>
                  ))}
                </ul>
                <button
                  type="button"
                  onClick={() => handleUpgrade(plan.id)}
                  disabled={!!loading}
                  className={`mt-4 w-full rounded-lg py-2 text-sm font-medium disabled:opacity-50 ${
                    plan.popular ? "bg-gold text-[#0a0a14] hover:bg-[#e8c76a]" : "border border-[#1e1e2e] text-[#faf8f4] hover:bg-[#0a0a14]"
                  }`}
                >
                  {loading === plan.id ? "Opening..." : "Upgrade Now"}
                </button>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-full rounded-lg border border-[#1e1e2e] py-2 text-sm text-[#888890] hover:text-[#faf8f4]"
          >
            Maybe later
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

