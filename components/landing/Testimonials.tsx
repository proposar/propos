"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Play, TrendingUp, Award, Users } from "lucide-react";

const testimonials = [
  { name: "Sarah Chen", role: "Brand Designer, New York", stars: 5, quote: "I used to dread writing proposals. Now I generate one in literally 60 seconds and my win rate went from maybe 30% to almost 60%. The AI somehow writes better than I do.", avatar: "SC", color: "from-blue-500/30 to-cyan-500/30" },
  { name: "Marcus Webb", role: "Web Developer, London", stars: 5, quote: "The open tracking alone is worth the subscription. I know exactly when to follow up because I can see when they read it. Closed a £8,000 project this way last week.", avatar: "MW", color: "from-amber-500/30 to-orange-500/30" },
  { name: "Priya Sharma", role: "Digital Marketing Agency, Toronto", stars: 5, quote: "We send 20+ proposals a month. Proposar saves my team at least 40 hours a month. That's basically a full week of work back. The ROI is insane.", avatar: "PS", color: "from-violet-500/30 to-purple-500/30" },
  { name: "Jake Morrison", role: "Freelance Copywriter, Austin TX", stars: 5, quote: "I was spending Sunday nights writing proposals. Now I do it in the Uber to my client meeting. No joke.", avatar: "JM", color: "from-emerald-500/30 to-teal-500/30" },
  { name: "Amelia Foster", role: "UX Designer, Sydney", stars: 5, quote: "The tone selector is brilliant. I switched to 'Bold' for a startup client and the proposal felt completely different — more exciting. Won the project.", avatar: "AF", color: "from-rose-500/30 to-pink-500/30" },
  { name: "David Park", role: "SEO Consultant, Chicago", stars: 4, quote: "Honestly I thought AI-written proposals would sound robotic. They don't. They sound better than what I wrote manually. Still slightly embarrassed about that.", avatar: "DP", color: "from-slate-500/30 to-zinc-500/30" },
  { name: "Lucia Fernandez", role: "Social Media Manager, Miami", stars: 5, quote: "Proposar paid for itself with literally the first proposal. $2,400 project, closed in 2 days. The client said my proposal was 'the most professional' they received.", avatar: "LF", color: "from-indigo-500/30 to-blue-500/30" },
  { name: "Tom Bradley", role: "Video Producer, Manchester", stars: 5, quote: "I've tried every proposal tool. Proposify was too complex, Google Docs was too basic. Proposar is the Goldilocks. Simple, powerful, beautiful output.", avatar: "TB", color: "from-amber-500/30 to-yellow-500/30" },
  { name: "Nina Kowalski", role: "Graphic Designer, Toronto", stars: 5, quote: "The follow-up reminder saved a $5k project. I forgot about it completely, Proposar reminded me to follow up, client had just been busy and said yes immediately.", avatar: "NK", color: "from-fuchsia-500/30 to-pink-500/30" },
  { name: "Alex Rivera", role: "Full Stack Developer, San Francisco", stars: 5, quote: "Closed $47k in projects in my first 2 months using Proposar. I'm not saying it's all because of the tool but my proposals are unrecognisably better now.", avatar: "AR", color: "from-cyan-500/30 to-blue-500/30" },
  { name: "Chloe Thompson", role: "Brand Strategist, Melbourne", stars: 5, quote: "My clients keep complimenting my proposals before they even see my portfolio. That used to never happen. First impressions matter so much.", avatar: "CT", color: "from-lime-500/30 to-emerald-500/30" },
  { name: "Ryan Okafor", role: "Motion Designer, Lagos", stars: 5, quote: "Using Proposar from Nigeria to close clients in the US and UK. The proposals look completely professional. Nobody knows I'm a team of one.", avatar: "RO", color: "from-orange-500/30 to-red-500/30" },
];

const featuredCustomers = [
  {
    name: "Marcus Webb",
    role: "Web Developer Agency",
    location: "London, UK",
    metric: "+£8,000",
    metricLabel: "First Deal Closed",
    story: "Went from proposal anxiety to confident closures. Used open tracking to follow up at the perfect moment. Won £8,000 project in first month.",
    color: "from-amber-500/30 to-orange-500/30",
    avatar: "MW",
    image: "https://via.placeholder.com/400x300?text=Marcus+Web+Dev",
  },
  {
    name: "Priya Sharma",
    role: "Digital Marketing Agency",
    location: "Toronto, Canada",
    metric: "40 hrs",
    metricLabel: "Saved Per Month",
    story: "Managing 20+ proposals monthly. Proposar cuts proposal creation time in half. Team can now focus on strategy instead of formatting.",
    color: "from-violet-500/30 to-purple-500/30",
    avatar: "PS",
    image: "https://via.placeholder.com/400x300?text=Priya+Marketing",
  },
  {
    name: "Alex Rivera",
    role: "Full Stack Developer",
    location: "San Francisco, USA",
    metric: "+$47k",
    metricLabel: "First 2 Months",
    story: "AI-generated proposals dramatically improved win rate. Clients now compliment proposals before seeing portfolio. Professional first impression wins deals.",
    color: "from-cyan-500/30 to-blue-500/30",
    avatar: "AR",
    image: "https://via.placeholder.com/400x300?text=Alex+Developer",
  },
];

const tweets = [
  { handle: "@sarahchendesign", text: "Proposar just saved me 2 hours on a proposal. Closed the deal in 48hrs. This is the one.", time: "2h" },
  { handle: "@marcuswebb_dev", text: "Open tracking = game changer. I follow up the moment they read it. Win rate up 40%.", time: "5h" },
  { handle: "@priyasharma", text: "We do 20+ proposals/month. Proposar cut that time in half. Team is obsessed.", time: "1d" },
  { handle: "@jakemcopy", text: "Wrote a proposal in the Uber. Client signed before I got home. What.", time: "2d" },
  { handle: "@ameliauf", text: "The Bold tone option won me a startup client. They said it 'felt different'. Yes it did.", time: "3d" },
  { handle: "@davidparkseo", text: "I was skeptical. The AI writes better than my old templates. I'm a convert.", time: "4d" },
];

const stats = [
  { value: 2000, suffix: "+", label: "Active Users", icon: Users },
  { value: 14500, suffix: "+", label: "Proposals Sent", icon: TrendingUp },
  { value: 42, suffix: "%", label: "Avg Win Rate Increase", icon: Award },
  { value: 4.2, suffix: "M+", label: "In Deals Closed", prefix: "$", icon: Award },
];

function AnimatedNumber({ value, prefix = "", suffix = "", duration = 1.5 }: { value: number; prefix?: string; suffix?: string; duration?: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const isDecimal = value < 10 && value !== Math.floor(value);

  useEffect(() => {
    if (!inView) return;
    const steps = 60 * duration;
    const step = value / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += step;
      if (current >= value) {
        setCount(value);
        clearInterval(timer);
      } else setCount(isDecimal ? Math.round(current * 10) / 10 : Math.floor(current));
    }, 1000 / 60);
    return () => clearInterval(timer);
  }, [inView, value, duration, isDecimal]);

  const display = inView ? (isDecimal ? count.toFixed(1) : count) : 0;
  return <span ref={ref}>{prefix}{display}{suffix}</span>;
}

export function Testimonials() {
  return (
    <section className="py-24 md:py-28 bg-[#0a0a14] px-6 overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <p className="text-gold text-sm uppercase tracking-[0.2em] mb-4 font-semibold">WHAT FREELANCERS SAY</p>
        <h2 className="font-serif text-5xl md:text-6xl font-bold text-[#faf8f4] mb-8 leading-tight">
          They Were Skeptical. Now They&apos;re Closing.
        </h2>

        {/* Stats bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.4 }}
              className="rounded-xl border border-[#1e1e2e] bg-[#12121e] p-6 text-center hover:border-gold/40 hover:shadow-[0_0_28px_rgba(217,119,6,0.12)] transition-all duration-300"
            >
              <p className="text-3xl font-bold text-gold">
                <AnimatedNumber value={s.value} prefix={s.prefix} suffix={s.suffix} />
              </p>
              <p className="text-xs text-[#888890] mt-2 font-medium">{s.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Featured Case Studies */}
        <div className="mb-20">
          <h3 className="font-serif text-3xl font-bold text-[#faf8f4] mb-10">Featured Success Stories</h3>
          <div className="grid md:grid-cols-3 gap-6">
            {featuredCustomers.map((customer, idx) => (
              <motion.div
                key={customer.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1, duration: 0.5 }}
                className="rounded-xl border border-[#1e1e2e] bg-[#12121e] overflow-hidden hover:border-gold/40 hover:shadow-[0_0_32px_rgba(217,119,6,0.15)] transition-all duration-300 group"
              >
                {/* Image placeholder with play button */}
                <div className="relative h-48 bg-gradient-to-br from-[#1e1e2e] to-[#0a0a14] overflow-hidden">
                  <img
                    src={customer.image}
                    alt={customer.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <button className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Play className="h-12 w-12 text-gold fill-gold" />
                  </button>
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="mb-4">
                    <div className="flex items-center gap-3 mb-3">
                      <span className={`h-10 w-10 rounded-full bg-gradient-to-br ${customer.color} flex items-center justify-center text-xs font-semibold text-[#faf8f4]`}>
                        {customer.avatar}
                      </span>
                      <div>
                        <p className="font-semibold text-[#faf8f4]">{customer.name}</p>
                        <p className="text-xs text-[#888890]">{customer.role}</p>
                      </div>
                    </div>
                  </div>

                  {/* Metric highlight */}
                  <div className="mb-4 p-3 rounded-lg bg-gold/10 border border-gold/20">
                    <p className="text-sm font-semibold text-gold">{customer.metric}</p>
                    <p className="text-xs text-[#888890]">{customer.metricLabel}</p>
                  </div>

                  {/* Story */}
                  <p className="text-sm text-[#c4c4cc] mb-4 leading-relaxed line-clamp-3">{customer.story}</p>

                  <button className="w-full rounded-lg border border-gold/50 bg-gold/10 py-2 text-sm font-semibold text-gold hover:bg-gold/20 transition-all duration-300">
                    Watch Full Story →
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Carousel: 2 rows of scrolling cards */}
        <div className="mb-20">
          <h3 className="font-serif text-3xl font-bold text-[#faf8f4] mb-10">Join 2000+ Happy Users</h3>
          <div className="space-y-6">
            <div className="flex gap-5 overflow-hidden">
              <div className="flex gap-5 animate-scroll-left shrink-0">
                {[...testimonials, ...testimonials].slice(0, 6).map((t) => (
                  <div
                    key={`${t.name}-1`}
                    className="w-[340px] shrink-0 rounded-xl border border-[#1e1e2e] bg-[#12121e] p-6 hover:border-gold/40 hover:shadow-[0_0_24px_rgba(217,119,6,0.1)] transition-all duration-300"
                  >
                    <p className="text-gold text-sm mb-3 font-semibold">{"★".repeat(t.stars)}</p>
                    <p className="text-[#faf8f4] text-sm mb-5 leading-relaxed">&ldquo;{t.quote}&rdquo;</p>
                    <div className="flex items-center gap-3">
                      <span className={`h-10 w-10 rounded-full bg-gradient-to-br ${t.color} flex items-center justify-center text-xs font-semibold text-[#faf8f4]`}>{t.avatar}</span>
                      <div>
                        <p className="font-semibold text-[#faf8f4] text-sm">{t.name}</p>
                        <p className="text-xs text-[#888890]">{t.role}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex gap-5 overflow-hidden">
              <div className="flex gap-5 animate-scroll-right shrink-0">
                {[...testimonials, ...testimonials].slice(6, 12).map((t) => (
                  <div
                    key={`${t.name}-2`}
                    className="w-[340px] shrink-0 rounded-xl border border-[#1e1e2e] bg-[#12121e] p-6 hover:border-gold/40 hover:shadow-[0_0_24px_rgba(217,119,6,0.1)] transition-all duration-300"
                  >
                    <p className="text-gold text-sm mb-3 font-semibold">{"★".repeat(t.stars)}</p>
                    <p className="text-[#faf8f4] text-sm mb-5 leading-relaxed">&ldquo;{t.quote}&rdquo;</p>
                    <div className="flex items-center gap-3">
                      <span className={`h-10 w-10 rounded-full bg-gradient-to-br ${t.color} flex items-center justify-center text-xs font-semibold text-[#faf8f4]`}>{t.avatar}</span>
                      <div>
                        <p className="font-semibold text-[#faf8f4] text-sm">{t.name}</p>
                        <p className="text-xs text-[#888890]">{t.role}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Wall of Love - Tweet style */}
        <h3 className="font-serif text-3xl font-bold text-[#faf8f4] mb-10">Wall of Love</h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {tweets.map((tw) => (
            <div
              key={tw.handle}
              className="rounded-xl border border-[#1e1e2e] bg-[#12121e] p-5 hover:border-gold/30 hover:shadow-[0_0_20px_rgba(217,119,6,0.08)] transition-all duration-300"
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="text-gold text-sm font-medium">{tw.handle}</span>
                <span className="text-[#888890] text-xs">{tw.time}</span>
              </div>
              <p className="text-[#faf8f4] text-sm">{tw.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
