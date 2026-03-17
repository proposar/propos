"use client";

import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";

const STEP_VISUALS = ["doc", "notification", "contract", "paid"] as const;
const STEP_ICONS = ["✨", "📲", "📜", "💰"];

export function HowItWorks() {
  const { t } = useLanguage();

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
          {t.howItWorks.eyebrow}
        </p>
        <h2 className="font-serif text-5xl md:text-6xl font-bold text-[#faf8f4] mb-6 leading-tight">
          {t.howItWorks.title}
        </h2>
        <p className="text-[#888890] text-lg mb-20 max-w-2xl leading-relaxed">
          {t.howItWorks.subtitle}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {t.howItWorks.steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: i * 0.08, duration: 0.5 }}
              className="relative"
            >
              <div className="rounded-xl border border-[#1e1e2e] bg-[#12121e] p-6 hover:border-gold/50 hover:shadow-[0_0_32px_rgba(217,119,6,0.15)] hover:-translate-y-2 transition-all duration-300 h-full flex flex-col">
                <span className="absolute top-4 right-4 text-3xl font-serif text-gold/20">
                  0{i + 1}
                </span>
                <div className="mb-4"><span className="text-2xl">{STEP_ICONS[i]}</span></div>
                <h3 className="font-semibold text-[#faf8f4] text-lg mb-2">
                  {step.title}
                </h3>
                <p className="text-[#888890] text-sm flex-1">{step.desc}</p>
                {/* Mini visual */}
                <div className="mt-6 rounded-lg bg-[#0a0a14]/50 border border-[#1e1e2e] p-4 min-h-[80px] flex items-center justify-center">
                  {STEP_VISUALS[i] === "doc" && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                      className="text-xs text-gold/70 font-mono"
                    >
                      Generating Strategy...
                    </motion.div>
                  )}
                  {STEP_VISUALS[i] === "notification" && (
                    <div className="flex flex-col items-center gap-1 text-[10px] text-[#888890]">
                      <div className="flex items-center gap-2">
                        <span>📲</span>
                        <span>WhatsApp Sent</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span>👁️</span>
                        <span className="text-gold">Viewed: 2m ago</span>
                      </div>
                    </div>
                  )}
                  {STEP_VISUALS[i] === "contract" && (
                    <div className="w-full space-y-1">
                      <div className="h-1 rounded bg-gold/40 w-full" />
                      <div className="h-1 rounded bg-gold/20 w-3/4" />
                      <div className="mt-2 text-[10px] text-green-400 font-medium">✓ Digitally Signed</div>
                    </div>
                  )}
                  {STEP_VISUALS[i] === "paid" && (
                    <div className="text-center">
                      <div className="text-xl">💰</div>
                      <div className="text-[10px] text-gold font-bold mt-1">PAYMENT RECEIVED</div>
                    </div>
                  )}
                </div>
              </div>
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
            {t.howItWorks.watchDemo}
          </button>
        </motion.div>
      </div>
    </section>
  );
}
