"use client";

import { useState } from "react";
import { motion } from "framer-motion";

const TONES = ["Professional", "Friendly", "Bold", "Formal"] as const;

const features = [
  {
    title: "Skip the Spam Filter",
    desc: "Stop wondering if they saw your email. Deliver proposals directly to their WhatsApp or via a professional secure link for instant opens.",
    icon: "📲",
    pulse: true,
  },
  {
    title: "Eliminate the Guesswork",
    desc: "Know exactly when your client is reading. See which sections they spend the most time on, so you can call them while they're still hot.",
    icon: "👁️",
    pulse: true,
  },
  {
    title: "The 'Yes' Shortcut",
    desc: "Remove the friction. Clients can accept your proposal in one click from their phone — no printing, no signing PDFs, no delays.",
    icon: "✅",
  },
  {
    title: "Elite Branding",
    desc: "Stand out from the 'generic document' crowd. Export pixel-perfect PDFs that make you look like a top-tier agency from day one.",
    icon: "📄",
  },
  {
    title: "Your Sales Cockpit",
    desc: "Track every deal in one view. Identify which clients are ready to close and who needs a nudge before they go cold.",
    icon: "📊",
  },
  {
    title: "Automatic Nudges",
    desc: "Never feel 'annoying' or desperate again. Set automatic follow-ups that handle the chasing for you while you stay professional.",
    icon: "🔔",
  },
  {
    title: "The Legal Guard",
    desc: "Protect your work. The second they accept, a legal-grade contract is ready. No more working without a net — you're covered from day one.",
    icon: "📜",
  },
  {
    title: "Payment Security",
    desc: "The A-to-Z flow: Proposal → Contract → Invoice. Ensure you get paid for every hour you work. No more ghosting on the final invoice.",
    icon: "🧾",
  },
];

const miniStats = [
  { value: "3 hrs → 60 sec", label: "time saved" },
  { value: "42%", label: "higher win rate" },
  { value: "2,000+", label: "freelancers" },
  { value: "$2.4M+", label: "in deals closed" },
];

export function Features() {
  const [tone, setTone] = useState<(typeof TONES)[number]>("Professional");

  return (
    <section id="features" className="py-24 md:py-28 bg-[#12121e]/50 px-6">
      <div className="max-w-5xl mx-auto">
        <p className="text-gold text-sm uppercase tracking-[0.2em] mb-4 font-semibold">
          EVERYTHING YOU NEED
        </p>
        <h2 className="font-serif text-5xl md:text-6xl font-bold text-[#faf8f4] mb-6 leading-tight">
          Built for Freelancers Who Want to Win
        </h2>

        {/* Bento grid */}
        <div className="grid md:grid-cols-2 gap-4 mt-12">
          {/* Large card: AI That Writes Like You */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="md:col-span-2 rounded-xl border border-[#1e1e2e] bg-[#12121e] p-8 hover:border-gold/50 hover:shadow-[0_0_32px_rgba(217,119,6,0.15)] transition-all duration-300"
          >
            <h3 className="font-semibold text-[#faf8f4] text-2xl mb-3 flex items-center gap-2">
              <span>✨</span> AI That Writes Like You
            </h3>
            <p className="text-[#888890] text-sm mb-6 max-w-2xl">
              Choose your tone — Professional, Friendly, Bold, or Formal. The AI adapts to your voice and your client&apos;s industry. Every proposal feels handwritten, not generated.
            </p>
            <div className="flex flex-wrap gap-2">
              {TONES.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTone(t)}
                  className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                    tone === t
                      ? "bg-gold text-[#0a0a14]"
                      : "border border-[#1e1e2e] text-[#888890] hover:border-gold/50 hover:text-[#faf8f4]"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
            <p className="mt-4 text-xs text-[#888890]">
              Preview: &ldquo;{tone === "Professional" && "We understand your goals and are prepared to deliver..."}
              {tone === "Friendly" && "Hey! Really excited about this project — here's how we can help..."}
              {tone === "Bold" && "You need results. We deliver. Here's the plan."}
              {tone === "Formal" && "In accordance with your requirements, we submit the following proposal..."}&rdquo;
            </p>
          </motion.div>

          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: (i % 3) * 0.08, duration: 0.5 }}
              className="rounded-xl border border-[#1e1e2e] bg-[#12121e] p-7 hover:border-gold/50 hover:shadow-[0_0_28px_rgba(217,119,6,0.12)] hover:-translate-y-1.5 transition-all duration-300"
            >
              <span className={`text-2xl ${f.pulse ? "animate-pulse" : ""}`}>{f.icon}</span>
              <h3 className="font-semibold text-[#faf8f4] mt-4 mb-2">{f.title}</h3>
              <p className="text-[#888890] text-sm">{f.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Mini stat cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16">
          {miniStats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.4 }}
              className="rounded-xl border border-[#1e1e2e] bg-[#0a0a14] p-6 text-center hover:border-gold/40 hover:shadow-[0_0_24px_rgba(217,119,6,0.1)] transition-all duration-300"
            >
              <p className="text-2xl font-bold text-gold">{s.value}</p>
              <p className="text-xs text-[#888890] mt-2">{s.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
