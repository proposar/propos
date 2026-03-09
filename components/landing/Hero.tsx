"use client";

import Link from "next/link";
import { motion } from "framer-motion";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export function Hero() {
  return (
    <section className="pt-24 pb-16 min-h-screen flex items-center justify-center relative overflow-hidden bg-[#0a0a14]">
      {/* Animated gradient mesh background */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-gold/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-gold/5 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: "1s" }} />
      </div>

      <div className="relative z-10 w-full max-w-6xl mx-auto px-6 py-16 flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-16">
        {/* Left: Copy */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="flex-1 text-center lg:text-left"
        >
          <motion.div variants={item} className="inline-block mb-6">
            <span className="inline-flex items-center gap-2 rounded-full border border-gold/30 bg-surface/80 px-4 py-2 text-sm text-gold backdrop-blur-sm">
              <span className="relative inline-block h-2 w-2 rounded-full bg-gold">
                <span className="absolute inset-0 rounded-full bg-gold animate-ping opacity-75" />
              </span>
              <span className="bg-gradient-to-r from-gold via-gold-light to-gold bg-clip-text font-medium tracking-wide">
                Trusted by 2,000+ freelancers worldwide
              </span>
            </span>
          </motion.div>
          <motion.h1
            variants={item}
            className="font-serif text-4xl sm:text-5xl md:text-6xl font-bold text-[#faf8f4] leading-tight mb-3"
          >
            Write Proposals That
            <br />
            <span className="bg-gradient-to-r from-[#c9a84c] to-[#e8c76a] bg-clip-text text-transparent">
              Win Deals.
            </span>
          </motion.h1>
          <motion.p
            variants={item}
            className="text-gold/90 text-lg sm:text-xl font-medium mb-6"
          >
            The one stop for every freelancer.
          </motion.p>
          <motion.p
            variants={item}
            className="text-[#888890] text-lg max-w-xl mx-auto lg:mx-0 mb-8"
          >
            Stop spending 3 hours on proposals that get ignored. Proposar uses AI to
            generate proposals in 60 seconds, then follow-ups, contract, and invoice from the same deal — so you close faster and get paid, not ghosted.
          </motion.p>
          <motion.div variants={item} className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-8">
            <Link
              href="/signup"
              className="rounded-lg bg-[#c9a84c] px-8 py-4 font-medium text-[#0a0a14] hover:bg-[#e8c76a] transition-all hover:scale-[1.02] active:scale-[0.98] text-center"
            >
              Generate Free Proposal →
            </Link>
            <Link
              href="#how-it-works"
              className="rounded-lg border border-[#1e1e2e] px-8 py-4 font-medium text-[#faf8f4] hover:bg-[#12121e] transition-colors text-center"
            >
              See How It Works
            </Link>
          </motion.div>
          <motion.div variants={item} className="flex flex-wrap items-center justify-center lg:justify-start gap-4 text-sm text-[#888890]">
            <span>★★★★★ 4.9/5 from 800+ reviews</span>
            <span className="flex items-center gap-2 -space-x-1">
              {["PC", "AC", "BC", "DS", "EA"].map((label) => (
                <span
                  key={label}
                  className="w-8 h-8 rounded-full border-2 border-[#0a0a14] bg-gradient-to-br from-gold/40 to-gold/20 flex items-center justify-center text-[10px] font-semibold text-[#faf8f4]"
                >
                  {label}
                </span>
              ))}
            </span>
            <span>Trusted by 2,000+ freelancers closing more deals</span>
          </motion.div>
        </motion.div>

        {/* Right: Animated mockup */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="flex-1 w-full max-w-lg flex justify-center lg:justify-end"
        >
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="relative"
          >
            <div className="rounded-xl border border-[#1e1e2e] bg-[#12121e] p-5 shadow-2xl shadow-black/30">
              <p className="text-xs text-[#888890] mb-2">New proposal</p>
              <p className="text-[#faf8f4] font-medium">Sarah Chen · Brand identity</p>
              <p className="text-sm text-[#888890]">$4,500 · 4 weeks</p>
              <div className="mt-4 h-px bg-[#1e1e2e]" />
              <div className="mt-4 space-y-2 min-h-[120px]">
                <TypewriterLine delay={1.5} text="Executive summary..." />
                <TypewriterLine delay={2.2} text="Deliverables & timeline..." />
                <TypewriterLine delay={2.9} text="Investment: $4,500" />
              </div>
            </div>
            {/* View count popup */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 3.5 }}
              className="absolute -right-2 -top-2 rounded-lg border border-gold/50 bg-[#12121e] px-3 py-2 shadow-lg"
            >
              <p className="text-xs text-[#888890]">View count</p>
              <p className="text-sm font-semibold text-gold">3 views</p>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

function TypewriterLine({ text, delay }: { text: string; delay: number }) {
  return (
    <motion.p
      initial={{ width: 0, opacity: 0 }}
      animate={{ width: "100%", opacity: 1 }}
      transition={{ delay, duration: 0.4 }}
      className="text-sm text-[#888890] overflow-hidden whitespace-nowrap"
    >
      {text}
    </motion.p>
  );
}
