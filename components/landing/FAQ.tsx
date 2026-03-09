"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const faqs = [
  { q: "Is there really a free trial?", a: "Yes — every plan starts with a 14-day free trial. No credit card needed to get started." },
  { q: "Can I upgrade or downgrade anytime?", a: "Absolutely. Switch plans whenever you want. Changes take effect immediately." },
  { q: "How does the AI proposal writing work?", a: "You enter client and project details; our AI generates a full proposal with executive summary, deliverables, timeline, and pricing in your chosen tone (Professional, Friendly, Bold, or Formal)." },
  { q: "Is my data private and secure?", a: "Yes. We use industry-standard encryption and never train on your proposal content. Your data stays yours." },
  { q: "Do you integrate with other tools?", a: "We offer PDF export and shareable links. Integrations (Zapier, Slack, etc.) are on our roadmap." },
  { q: "How do I cancel?", a: "Cancel anytime from your account settings or billing page. No contracts or cancellation fees." },
  { q: "What about team features?", a: "The Agency plan includes 5 team members, shared proposals, and white-label options. Pro is for solo freelancers and small teams." },
  { q: "What counts as a proposal?", a: "Each AI-generated proposal counts as one. Duplicating or editing existing proposals doesn't count toward your limit." },
  { q: "What's the PDF quality like?", a: "PDFs are pixel-perfect with your logo and branding. They're suitable for formal client submissions." },
  { q: "How do I get support?", a: "Email support is included on all plans. Pro and Agency get chat support; Agency includes priority (1hr) response and a dedicated account manager." },
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="py-24 md:py-28 bg-[#0a0a14] px-6">
      <div className="max-w-2xl mx-auto">
        <h2 className="font-serif text-5xl md:text-6xl font-bold text-[#faf8f4] mb-16 leading-tight">
          Everything You Need to Know
        </h2>
        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div
              key={faq.q}
              className="rounded-xl border border-[#1e1e2e] bg-[#12121e] overflow-hidden hover:border-gold/30 transition-colors"
            >
              <button
                type="button"
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-center justify-between p-6 text-left hover:bg-[#0a0a14]/30 transition-colors"
              >
                <span className="font-semibold text-[#faf8f4] text-lg pr-4">{faq.q}</span>
                <span className="text-gold shrink-0 transition-transform duration-200 text-lg" style={{ transform: openIndex === i ? "rotate(180deg)" : "rotate(0deg)" }}>
                  ▼
                </span>
              </button>
              <AnimatePresence initial={false}>
                {openIndex === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden border-t border-[#1e1e2e]"
                  >
                    <p className="px-6 py-5 text-sm text-[#888890] leading-relaxed">{faq.a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
