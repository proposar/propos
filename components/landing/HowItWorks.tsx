"use client";

import { motion } from "framer-motion";

const steps = [
  {
    num: "01",
    title: "Fill in the Details",
    desc: "Enter your client's name, project type, budget, and a few bullet points about what you'll deliver. Takes 30 seconds.",
    icon: (
      <svg className="w-8 h-8 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
    visual: "form",
  },
  {
    num: "02",
    title: "AI Writes Your Proposal",
    desc: "Proposar's AI crafts a complete, persuasive proposal — with executive summary, deliverables, timeline, pricing, and a compelling close.",
    icon: (
      <span className="text-2xl">✨</span>
    ),
    visual: "doc",
  },
  {
    num: "03",
    title: "Send & Get Notified",
    desc: "Share a beautiful proposal link. You'll know the exact moment your client opens it — and how long they spent reading.",
    icon: (
      <span className="text-2xl">🔔</span>
    ),
    visual: "notification",
  },
];

export function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="py-24 md:py-28 bg-[#0a0a14] px-6 relative"
      style={{
        backgroundImage: `radial-gradient(circle at 1px 1px, rgba(201,168,76,0.06) 1px, transparent 0)`,
        backgroundSize: "32px 32px",
      }}
    >
      <div className="max-w-5xl mx-auto">
        <p className="text-gold text-sm uppercase tracking-[0.2em] mb-4 font-semibold">
          THE PROCESS
        </p>
        <h2 className="font-serif text-5xl md:text-6xl font-bold text-[#faf8f4] mb-6 leading-tight">
          From Brief to Deal in 60 Seconds
        </h2>
        <p className="text-[#888890] text-lg mb-20 max-w-2xl leading-relaxed">
          No templates to fight with. No blank page anxiety. Just results.
        </p>

        <div className="grid md:grid-cols-3 gap-8 md:gap-6 relative">
          {steps.map((step, i) => (
            <motion.div
              key={step.num}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: i * 0.08, duration: 0.5 }}
              className="relative"
            >
              <div className="rounded-xl border border-[#1e1e2e] bg-[#12121e] p-8 hover:border-gold/50 hover:shadow-[0_0_32px_rgba(217,119,6,0.15)] hover:-translate-y-2 transition-all duration-300 h-full flex flex-col">
                <span className="absolute top-6 right-6 text-4xl font-serif text-gold/20">
                  {step.num}
                </span>
                <div className="mb-4">{step.icon}</div>
                <h3 className="font-semibold text-[#faf8f4] text-lg mb-2">
                  {step.title}
                </h3>
                <p className="text-[#888890] text-sm flex-1">{step.desc}</p>
                {/* Mini visual */}
                <div className="mt-6 rounded-lg bg-[#0a0a14]/50 border border-[#1e1e2e] p-4 min-h-[80px] flex items-center justify-center">
                  {step.visual === "form" && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                      className="w-full space-y-2"
                    >
                      <div className="h-2 rounded bg-gold/30 w-3/4" />
                      <div className="h-2 rounded bg-gold/20 w-1/2" />
                      <div className="h-2 rounded bg-gold/10 w-full" />
                    </motion.div>
                  )}
                  {step.visual === "doc" && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                      className="text-xs text-gold/70 font-mono"
                    >
                      Generating...
                    </motion.div>
                  )}
                  {step.visual === "notification" && (
                    <div className="flex items-center gap-2 text-sm text-[#888890]">
                      <span>🔔</span>
                      <span>Sarah just opened your proposal!</span>
                    </div>
                  )}
                </div>
              </div>
              {i < steps.length - 1 && (
                <div className="hidden md:block absolute top-1/2 -right-4 w-8 border-t border-dashed border-gold/20" />
              )}
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-24 flex justify-center"
        >
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-lg border border-gold/30 px-7 py-3.5 text-[#faf8f4] hover:bg-[#12121e] hover:border-gold hover:shadow-[0_0_20px_rgba(217,119,6,0.2)] transition-all duration-300 font-medium"
          >
            <span className="text-gold text-lg">▶</span>
            Watch 2-min Demo
          </button>
        </motion.div>
      </div>
    </section>
  );
}
