"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useInView } from "framer-motion";
import { AuthAwareLink } from "@/components/auth/AuthAwareLink";

function AnimatedCounter({ value, suffix = "", prefix = "", duration = 1.5 }: { value: number; suffix?: string; prefix?: string; duration?: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const end = value;
    const startTime = performance.now();
    const step = (now: number) => {
      const elapsed = (now - startTime) / 1000;
      const progress = Math.min(elapsed / duration, 1);
      setCount(Math.round(progress * end));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [inView, value, duration]);

  return <span ref={ref}>{prefix}{count}{suffix}</span>;
}

const PAIN_STATS = [
  { number: 25, prefix: "", suffix: " hrs", label: "Average time spent writing ONE proposal", subtext: "That's 3 full working days per client pitch", icon: "⏰" },
  { number: 55, prefix: "", suffix: "%", label: "Of proposals sent globally never win", subtext: "Most freelancers are flying blind with no strategy", icon: "❌" },
  { number: 47, prefix: "", suffix: "%", label: "Of freelancers have been ghosted or not paid", subtext: "Half paid, then silence — no contract, no recourse", icon: "👻" },
  { number: 3, prefix: "", suffix: " days", label: "Average wait before following up", subtext: "By then, the client has moved on", icon: "📭" },
];

const QUOTES = [
  { text: "I spent an entire Sunday writing a proposal for a $5,000 project. Sent it Monday. Never heard back. Not even a no. Just silence. That Sunday is gone forever.", name: "James R., Full Stack Developer", location: "Austin TX", flag: "🇺🇸" },
  { text: "I did the work, they paid half, then disappeared. No contract — I had nothing to show. Never again. Now I get a contract and invoice from the same proposal.", name: "Priya S., Freelance Designer", location: "Mumbai", flag: "🇮🇳" },
  { text: "We were sending 15 proposals a month. My team was spending more time writing proposals than doing actual client work. Something had to change.", name: "David K., Creative Agency", location: "Sydney", flag: "🇦🇺" },
];

const TICKER_ITEMS = [
  "📊 1.57B freelancers worldwide",
  "💰 $1.5T earned in 2024",
  "👻 47% ghosted or not paid — contracts matter",
  "🇺🇸 76.4M freelancers in USA",
  "🇬🇧 4.2M in UK",
  "🇮🇳 India freelance market growing fast",
  "⚠️ Average win rate: only 45%",
  "⏰ 25 hours wasted per proposal",
];

const WITHOUT_LIST = [
  "Stare at a blank Google Doc for hours",
  "Copy-paste from an old proposal and hope it works",
  "Send it and hear nothing for days",
  "No idea if the client even opened it",
  "Forget to follow up until it's too late",
  "Get ghosted or half-paid — no contract, no way to get back",
  "Repeat this torture for every single client",
];

const WITH_LIST = [
  "Fill in 4 fields about your project (30 seconds)",
  "AI writes a complete, persuasive proposal (60 seconds)",
  "Send a link → track opens → automatic follow-ups if no reply",
  "Client accepts in one click — then you're covered",
  "AI-generated contract from the same proposal (no fear of ghosting)",
  "Invoice from the same deal — one flow: proposal → contract → get paid",
  "Win more. Get paid. No ghosting.",
];

const COUNTRIES = [
  { flag: "🇺🇸", name: "United States", stat: "76.4M freelancers | 38% of workforce", insight: "The world's largest freelance market. US clients pay premium rates — your proposals need to match that standard.", accent: "from-red-600/20 to-blue-600/20" },
  { flag: "🇬🇧", name: "United Kingdom", stat: "4.2M freelancers | Growing 25% YoY", insight: "UK agencies and freelancers are winning global contracts. Professional proposals are expected — not optional.", accent: "from-blue-600/20 to-red-600/20" },
  { flag: "🇦🇺", name: "Australia", stat: "64% freelancer growth since 2020", insight: "Australian freelancers are going global. Stand out with proposals that compete internationally.", accent: "from-emerald-600/20 to-amber-500/20" },
  { flag: "🇨🇦", name: "Canada", stat: "64% freelancer growth | $47/hr average", insight: "Canadian freelancers punch above their weight globally. The right proposal closes deals with clients worldwide.", accent: "from-red-600/20 to-gray-400/20" },
];

export function ProblemSolution() {
  const pivotRef = useRef<HTMLDivElement>(null);
  const pivotInView = useInView(pivotRef, { once: true, margin: "-100px" });

  return (
    <section id="problem-solution" className="bg-[#0a0a14] overflow-hidden">
      {/* Part 1: Global Crisis Headline */}
      <div className="relative py-20 md:py-28 px-6 bg-gradient-to-b from-[#1a0a0a] to-[#0a0a14] overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-[20%] left-[15%] w-2 h-2 rounded-full bg-gold animate-pulse" style={{ animationDelay: "0s" }} />
          <div className="absolute top-[25%] right-[20%] w-2 h-2 rounded-full bg-gold animate-pulse" style={{ animationDelay: "0.5s" }} />
          <div className="absolute top-[60%] left-[25%] w-2 h-2 rounded-full bg-gold animate-pulse" style={{ animationDelay: "1s" }} />
          <div className="absolute top-[55%] right-[15%] w-2 h-2 rounded-full bg-gold animate-pulse" style={{ animationDelay: "0.3s" }} />
          <div className="absolute top-[40%] left-[50%] w-2 h-2 rounded-full bg-gold animate-pulse" style={{ animationDelay: "0.7s" }} />
        </div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-gold text-sm uppercase tracking-[0.2em] mb-4">
            THE GLOBAL PROBLEM
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-[#faf8f4] leading-tight mb-6"
          >
            1.57 Billion Freelancers.
            <br />
            Most Lose Deals They Should Win.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-[#c4c4cc] text-lg md:text-xl max-w-2xl mx-auto"
          >
            Across the USA, UK, Australia, Canada and every corner of the world — the freelance economy is exploding. But there&apos;s a silent crisis holding talented people back. It&apos;s not their skills. It&apos;s their proposals.
          </motion.p>
        </div>
      </div>

      {/* Part 2: Pain Stats Row */}
      <div className="py-16 px-6 bg-gradient-to-b from-[#0a0a14] to-[#150a0a]">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {PAIN_STATS.map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="rounded-xl border border-red-900/40 bg-[#120808]/80 p-6 hover:shadow-[0_0_30px_rgba(220,38,38,0.15)] transition-shadow"
              >
                <span className="text-2xl mb-2 block">{stat.icon}</span>
                <p className="font-serif text-3xl md:text-4xl font-bold text-[#faf8f4]">
                  <AnimatedCounter value={stat.number} prefix={stat.prefix} suffix={stat.suffix} />
                </p>
                <p className="text-[#faf8f4] font-medium mt-2">{stat.label}</p>
                <p className="text-sm text-[#a88] mt-1">{stat.subtext}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Part 3: Real Stories */}
      <div className="py-20 px-6 bg-[#0a0a14]">
        <div className="max-w-6xl mx-auto">
          <motion.h3 initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="font-serif text-3xl md:text-4xl font-bold text-[#faf8f4] text-center mb-2">
            Sound Familiar?
          </motion.h3>
          <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-[#888890] text-center mb-12">
            These are real freelancer experiences from around the world
          </motion.p>
          <div className="flex gap-6 overflow-x-auto pb-4 md:overflow-visible md:pb-0 md:grid md:grid-cols-3">
            {QUOTES.map((q, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: i === 1 ? 0 : i === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="rounded-xl border border-[#1e1e2e] bg-[#12121e] p-6 min-w-[280px] md:min-w-0 flex-shrink-0"
              >
                <span className="text-4xl text-gold font-serif">&ldquo;</span>
                <p className="text-[#c4c4cc] mt-2 leading-relaxed">&ldquo;{q.text}&rdquo;</p>
                <p className="text-sm text-gold mt-4">
                  — {q.name}, {q.location} {q.flag}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Part 4: Market Reality Bar */}
      <div className="py-4 bg-[#050508] border-y border-[#1e1e2e] overflow-hidden">
        <div className="animate-scroll-left whitespace-nowrap flex gap-4 text-gold/90 text-sm font-medium">
          {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
            <span key={i} className="inline-flex items-center gap-4">
              <span>{item}</span>
              <span className="text-gold/50">•</span>
            </span>
          ))}
        </div>
      </div>

      {/* Part 5: Until Now */}
      <div ref={pivotRef} className="py-20 px-6 text-center bg-[#0a0a14]">
        <motion.p
          initial={{ scale: 0.5, opacity: 0 }}
          animate={pivotInView ? { scale: 1, opacity: 1 } : {}}
          transition={{ duration: 0.6 }}
          className="font-serif text-5xl md:text-7xl lg:text-8xl font-bold text-gold mb-6"
        >
          Until Now.
        </motion.p>
        <motion.p
          initial={{ opacity: 0 }}
          animate={pivotInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.3 }}
          className="text-[#c4c4cc] text-xl md:text-2xl max-w-xl mx-auto mb-8"
        >
          Proposar fixes every single one of these problems. Here&apos;s how.
        </motion.p>
        <p className="text-gold text-2xl">✦</p>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={pivotInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.5 }}
          className="mt-8 flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-sm"
        >
          <span className="text-[#888890]">One flow:</span>
          <span className="font-medium text-gold">Proposal</span>
          <span className="text-[#888890]">→</span>
          <span className="font-medium text-gold">Follow-ups</span>
          <span className="text-[#888890]">→</span>
          <span className="font-medium text-gold">Contract</span>
          <span className="text-[#888890]">→</span>
          <span className="font-medium text-gold">Invoice</span>
          <span className="text-[#888890] ml-1">— get paid, no ghosting.</span>
        </motion.div>
      </div>

      {/* Part 6: Side by Side */}
      <div className="py-20 px-6 bg-[#0a0a14]">
        <div className="max-w-6xl mx-auto">
          <motion.h3 initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="font-serif text-3xl md:text-4xl font-bold text-[#faf8f4] text-center mb-2">
            The Proposar Difference
          </motion.h3>
          <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-[#888890] text-center mb-12">
            We didn&apos;t just build another proposal tool. We rebuilt the entire workflow.
          </motion.p>
          <div className="grid md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="rounded-xl border border-red-900/50 bg-[#120808]/60 p-8"
            >
              <h4 className="text-xl font-semibold text-[#faf8f4] mb-6">😩 The Old Way</h4>
              <ul className="space-y-3">
                {WITHOUT_LIST.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-[#c4c4cc]">
                    <span className="text-red-400 mt-0.5">✗</span>
                    {item}
                  </li>
                ))}
              </ul>
              <div className="mt-8 p-4 rounded-lg bg-red-950/40 border border-red-900/30 text-sm text-[#e4a0a0]">
                Average time: 2–3 hours per proposal<br />
                Average win rate: 35–45%<br />
                Deals lost to bad proposals: millions every year
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="rounded-xl border-2 border-gold/50 bg-[#12121e] p-8 shadow-[0_0_40px_rgba(201,168,76,0.08)] hover:shadow-[0_0_50px_rgba(201,168,76,0.12)] hover:-translate-y-0.5 transition-all"
            >
              <h4 className="text-xl font-semibold text-[#faf8f4] mb-6">🚀 The Proposar Way</h4>
              <ul className="space-y-3">
                {WITH_LIST.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-[#c4c4cc]">
                    <span className="text-gold mt-0.5">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
              <div className="mt-8 p-4 rounded-lg bg-gold/10 border border-gold/30 text-sm text-[#faf8f4]">
                Average time: 90 seconds per proposal<br />
                Win rate improvement: up to 42% higher<br />
                Contract + invoice from the same deal — no ghosting, get paid
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Part 7: Global Reach */}
      <div className="py-20 px-6 bg-[#0a0a14]">
        <div className="max-w-6xl mx-auto">
          <motion.h3 initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="font-serif text-3xl md:text-4xl font-bold text-[#faf8f4] text-center mb-2">
            Built for Freelancers Everywhere
          </motion.h3>
          <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-[#888890] text-center mb-12 max-w-2xl mx-auto">
            Proposar is built for the global freelance economy — wherever you are, whoever your clients are.
          </motion.p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {COUNTRIES.map((c, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`rounded-xl border border-[#1e1e2e] bg-[#12121e] p-6 bg-gradient-to-br ${c.accent}`}
              >
                <p className="text-3xl mb-2">{c.flag}</p>
                <h4 className="font-semibold text-[#faf8f4]">{c.name}</h4>
                <p className="text-sm text-gold mt-1">{c.stat}</p>
                <p className="text-sm text-[#888890] mt-3">{c.insight}</p>
              </motion.div>
            ))}
          </div>
          <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center text-[#888890] mt-10">
            Plus India, UAE, Philippines, Germany, Netherlands and 180+ countries.<br />
            Your clients are global. Your proposals should be too.
          </motion.p>
        </div>
      </div>

      {/* Part 8: Market Opportunity CTA */}
      <div className="py-20 px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto rounded-2xl border-2 border-gold/50 bg-gradient-to-br from-gold/10 to-transparent p-8 md:p-12 text-center"
        >
          <p className="text-[#faf8f4] text-lg md:text-xl leading-relaxed mb-6">
            The freelance economy is worth $1.5 trillion.<br />
            Proposals are the #1 bottleneck holding freelancers back from their share of it.
          </p>
          <p className="text-[#c4c4cc] mb-6">
            Proposar is the fastest, smartest way to write proposals that win.<br />
            Used by 2,000+ freelancers across 40+ countries.
          </p>
          <p className="text-gold font-semibold mb-8">
            The market is exploding. The problem is real. The solution is here.
          </p>
          <AuthAwareLink
            unauthenticatedHref="/signup"
            className="inline-block rounded-lg bg-gold px-8 py-4 text-lg font-semibold text-[#0a0a14] hover:bg-[#e8c76a] transition-colors"
          >
            Start Winning With Proposar — Free Trial →
          </AuthAwareLink>
        </motion.div>
      </div>
    </section>
  );
}
