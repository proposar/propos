import { Metadata } from 'next';
import { AuthAwareLink } from '@/components/auth/AuthAwareLink';
import { FAQ } from '@/components/landing/FAQ';
import { Navbar } from '@/components/landing/Navbar';
import { Footer } from '@/components/landing/Footer';
import { InternalLinks } from '@/components/seo/InternalLinks';

const AI_GENERATOR_FAQ_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    { "@type": "Question", name: "How does the AI proposal generator work?", acceptedAnswer: { "@type": "Answer", text: "Enter your client name, project type, deliverables, and pricing. Proposar's AI generates a complete, professional proposal in 60 seconds with executive summary, timeline, and terms." } },
    { "@type": "Question", name: "Is the AI proposal generator free?", acceptedAnswer: { "@type": "Answer", text: "Yes. Proposar offers a 14-day free trial with no credit card required. You can generate unlimited proposals during the trial." } },
    { "@type": "Question", name: "Can I customize the AI-generated proposal?", acceptedAnswer: { "@type": "Answer", text: "Absolutely. Every section is fully editable. Add your logo, brand colors, and tweak any wording before sending." } },
    { "@type": "Question", name: "What languages does the AI proposal generator support?", acceptedAnswer: { "@type": "Answer", text: "Proposar supports English by default, with more languages on the roadmap. You can also paste translated content into the editor." } },
    { "@type": "Question", name: "Can I export proposals as PDF?", acceptedAnswer: { "@type": "Answer", text: "Yes. Export pixel-perfect PDFs with your branding for formal client submissions." } },
    { "@type": "Question", name: "Does the AI proposal generator send follow-ups?", acceptedAnswer: { "@type": "Answer", text: "Yes. Proposar includes smart follow-up sequences that remind you to follow up at optimal times, or send automated gentle nudges to clients." } },
    { "@type": "Question", name: "How good is the AI proposal quality?", acceptedAnswer: { "@type": "Answer", text: "Users report proposals that sound more professional than their own writing. The AI is trained on thousands of successful proposals and adapts to your chosen tone (Professional, Friendly, Bold, Formal)." } },
    { "@type": "Question", name: "What's the pricing for the AI proposal generator?", acceptedAnswer: { "@type": "Answer", text: "Proposar starts at $19/month for the Pro plan. The free trial lets you test everything before committing." } },
    { "@type": "Question", name: "Is there a refund policy?", acceptedAnswer: { "@type": "Answer", text: "Yes. If you're not satisfied within the first 14 days, contact support for a full refund." } },
    { "@type": "Question", name: "Does Proposar integrate with other tools?", acceptedAnswer: { "@type": "Answer", text: "Proposar offers PDF export, shareable links, and email/WhatsApp sending. Zapier and Slack integrations are on the roadmap." } },
  ],
};

export const metadata: Metadata = {
  title: 'AI Proposal Generator — Create Winning Proposals in 60 Seconds | Proposar',
  description: 'The best AI proposal generator for freelancers. Enter your project details and AI writes a complete, professional proposal in 60 seconds. Free trial — no card needed.',
  alternates: {
    canonical: 'https://proposar.com/ai-proposal-generator',
  },
};

export default function AIProposalGeneratorPage() {
  return (
    <main className="min-h-screen bg-[#0a0a14] pt-24 text-[#faf8f4]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(AI_GENERATOR_FAQ_SCHEMA) }} />
      <Navbar />

      <section className="relative px-6 py-20 lg:py-32 flex flex-col items-center text-center max-w-5xl mx-auto">
        <div className="absolute top-0 right-1/4 w-[400px] h-[400px] bg-emerald-900/10 rounded-full blur-[120px] -z-10" />
        <h1 className="font-serif text-5xl md:text-7xl font-bold bg-gradient-to-r from-emerald-400 to-[#faf8f4] bg-clip-text text-transparent mb-6 pb-2">
          The AI Proposal Generator That Writes Better Than You Do
        </h1>
        <p className="text-xl text-[#888890] max-w-3xl mb-10 leading-relaxed">
          The old way: stare at a blank Google Doc for 2–3 hours. The new way: tell our AI proposal generator about your client and project, and get a complete, persuasive proposal in 60 seconds. No more writer&apos;s block. No more inconsistent quality.
        </p>
        <AuthAwareLink unauthenticatedHref="/signup" className="rounded-lg bg-emerald-500 px-10 py-5 font-semibold text-[#0a0a14] hover:bg-emerald-400 transition-all hover:scale-105 text-lg shadow-[0_0_40px_rgba(16,185,129,0.3)]">
          Generate Your First Proposal Free →
        </AuthAwareLink>
      </section>

      <section className="px-6 py-24 bg-[#12121e] border-y border-[#1e1e2e]">
         <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
               <h2 className="font-serif text-3xl md:text-4xl font-bold">Why use an AI proposal generator?</h2>
               <p className="text-[#888890] leading-relaxed">
                 Writing proposals manually takes 2–3 hours per deal. Clients ghost you. Quality varies. An AI proposal generator like Proposar changes that: you input client details, pricing, and timeline — the AI structures everything into a professional document. Three steps: (1) Enter project info, (2) AI generates in 60 seconds, (3) Edit, send, and track. The AI proposal generator produces executive summaries, scope sections, deliverables, pricing tables, and next steps — every time.
               </p>
               <div className="p-8 border border-gold/30 rounded-xl bg-gold/5">
                  <div className="text-gold font-bold mb-4 text-xl">1. The Need for Speed</div>
                  <p className="text-[#faf8f4]">In B2B, the vendor who sends their proposal first wins 60% of the time. An AI proposal generator lets you send yours 5 minutes after the discovery call ends.</p>
               </div>
               <div className="p-8 border border-[#1e1e2e] rounded-xl bg-[#0a0a14]">
                  <div className="text-emerald-400 font-bold mb-4 text-xl">2. Perfectly Structured Flow</div>
                  <p className="text-[#888890]">Our AI proposal generator structures documents from thousands of successful proposals — Executive Summaries, Timelines, Scope Protections, and clear CTAs.</p>
               </div>
            </div>
            <div className="relative h-[600px] bg-[#0a0a14] rounded-2xl border border-[#1e1e2e] shadow-2xl overflow-hidden flex flex-col">
                <div className="p-4 border-b border-[#1e1e2e] bg-[#12121e] flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500/20" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/20" />
                    <div className="w-3 h-3 rounded-full bg-green-500/20" />
                </div>
                <div className="p-8 font-mono text-sm text-[#888890] space-y-4">
                    <p className="text-emerald-400">{'// Input: Client wants a new e-commerce website for their clothing brand.'}</p>
                    <p className="text-emerald-400">{'// Generating Phase 1...'}</p>
                    <div className="h-4 bg-[#1e1e2e] w-3/4 rounded animate-pulse mt-8" />
                    <div className="h-4 bg-[#1e1e2e] w-full rounded animate-pulse" />
                    <div className="h-4 bg-[#1e1e2e] w-5/6 rounded animate-pulse" />
                </div>
            </div>
         </div>
      </section>

      <section className="px-6 py-24 bg-[#0a0a14]">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-center mb-16">What Proposar&apos;s AI Generates For You</h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: "📋", title: "Executive summary" },
              { icon: "🎯", title: "Understanding client's challenge" },
              { icon: "✨", title: "Proposed solution" },
              { icon: "📦", title: "Deliverables breakdown" },
              { icon: "📅", title: "Timeline and milestones" },
              { icon: "💰", title: "Investment/pricing section" },
              { icon: "🏆", title: "Why choose you" },
              { icon: "➡️", title: "Clear next steps" },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-4 p-4 rounded-xl border border-[#1e1e2e] bg-[#12121e]">
                <span className="text-2xl">{item.icon}</span>
                <span className="font-medium text-[#faf8f4]">{item.title}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-24 bg-[#12121e] border-y border-[#1e1e2e]">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-center mb-12">Proposar vs Writing Proposals Manually</h2>
          <div className="rounded-2xl border border-[#1e1e2e] bg-[#0a0a14] overflow-hidden">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-[#1e1e2e]">
                  <th className="p-4 md:p-6 text-[#888890] font-medium"></th>
                  <th className="p-4 md:p-6 text-[#888890] font-medium">Manual</th>
                  <th className="p-4 md:p-6 text-emerald-400 font-bold bg-emerald-500/5">Proposar AI</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["Time", "2–3 hours", "60 seconds"],
                  ["Quality", "Inconsistent", "Professional every time"],
                  ["Follow-ups", "Manual", "Automated"],
                  ["Tracking", "None", "Real-time"],
                  ["Win rate", "~40%", "Up to 67%"],
                ].map((row, i) => (
                  <tr key={i} className="border-b border-[#1e1e2e]">
                    <td className="p-4 md:p-6 font-medium text-[#faf8f4]">{row[0]}</td>
                    <td className="p-4 md:p-6 text-[#888890]">{row[1]}</td>
                    <td className="p-4 md:p-6 text-emerald-400 font-semibold bg-emerald-500/5">{row[2]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="px-6 py-24 bg-[#0a0a14]">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-serif text-3xl font-bold text-center mb-12">What Freelancers Say About Proposar</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { quote: "I used to dread writing proposals. Now I generate one in 60 seconds. My win rate went from maybe 30% to almost 60%. The AI writes better than I do.", author: "Sarah C.", role: "Brand Designer" },
              { quote: "The open tracking alone is worth it. I know exactly when to follow up. Closed an £8,000 project because I followed up the moment they read it.", author: "Marcus W.", role: "Web Developer" },
              { quote: "We send 20+ proposals a month. Proposar saves my team 40 hours. That's a full week back. The ROI is insane.", author: "Priya S.", role: "Marketing Agency" },
            ].map((t, i) => (
              <div key={i} className="p-8 rounded-2xl bg-[#12121e] border border-[#1e1e2e]">
                <div className="text-gold mb-4">★★★★★</div>
                <p className="text-[#faf8f4] mb-6">&quot;{t.quote}&quot;</p>
                <p className="font-bold text-[#faf8f4]">{t.author}</p>
                <p className="text-sm text-[#888890]">{t.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-24 bg-[#12121e] border-y border-[#1e1e2e]">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-serif text-3xl font-bold mb-12 text-center">Frequently Asked Questions</h2>
          <FAQ />
          <div className="mt-16">
            <InternalLinks category="tools" />
          </div>
        </div>
      </section>

      <section className="px-6 py-32 text-center max-w-3xl mx-auto">
        <h2 className="font-serif text-4xl md:text-5xl font-bold mb-6">Never write a proposal from scratch again.</h2>
        <AuthAwareLink unauthenticatedHref="/signup" className="inline-block rounded-lg bg-emerald-500 px-12 py-5 font-bold text-[#0a0a14] hover:bg-emerald-400 transition-all hover:scale-105 text-lg shadow-[0_0_40px_rgba(16,185,129,0.3)]">
          Generate Your First Proposal Free →
        </AuthAwareLink>
      </section>

      <Footer />
    </main>
  );
}
