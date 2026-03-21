import { Metadata } from 'next';
import { AuthAwareLink } from '@/components/auth/AuthAwareLink';
import { FAQ } from '@/components/landing/FAQ';
import { Navbar } from '@/components/landing/Navbar';
import { Footer } from '@/components/landing/Footer';

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
      <Navbar />

      <section className="relative px-6 py-20 lg:py-32 flex flex-col items-center text-center max-w-5xl mx-auto">
        <div className="absolute top-0 right-1/4 w-[400px] h-[400px] bg-emerald-900/10 rounded-full blur-[120px] -z-10" />
        <h1 className="font-serif text-5xl md:text-7xl font-bold bg-gradient-to-r from-emerald-400 to-[#faf8f4] bg-clip-text text-transparent mb-6 pb-2">
          The AI Proposal Generator that Closes High-Ticket Deals
        </h1>
        <p className="text-xl text-[#888890] max-w-3xl mb-10 leading-relaxed">
          Stop staring at a blank Google Doc. Tell our AI about your client, your pricing, and your timeline. We deliver a legally sound, highly persuasive proposal in 60 seconds.
        </p>
        <AuthAwareLink unauthenticatedHref="/signup" className="rounded-lg bg-emerald-500 px-10 py-5 font-semibold text-[#0a0a14] hover:bg-emerald-400 transition-all hover:scale-105 text-lg shadow-[0_0_40px_rgba(16,185,129,0.3)]">
          Start Generating Free →
        </AuthAwareLink>
      </section>

      <section className="px-6 py-24 bg-[#12121e] border-y border-[#1e1e2e]">
         <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
               <h2 className="font-serif text-3xl md:text-4xl font-bold">Why use an AI proposal generator?</h2>
               <div className="p-8 border border-gold/30 rounded-xl bg-gold/5">
                  <div className="text-gold font-bold mb-4 text-xl">1. The Need for Speed</div>
                  <p className="text-[#faf8f4]">In B2B consulting, the vendor who sends their proposal first wins the deal 60% of the time. AI allows you to send the proposal 5 minutes after the discovery call ends.</p>
               </div>
               <div className="p-8 border border-[#1e1e2e] rounded-xl bg-[#0a0a14]">
                  <div className="text-emerald-400 font-bold mb-4 text-xl">2. Perfectly Structured Flow</div>
                  <p className="text-[#888890]">Our AI doesn&apos;t just write words. It structures your document based on thousands of successful contracts, ensuring you include Executive Summaries, Timelines, and Scope Protections.</p>
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
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="font-serif text-3xl font-bold mb-12">Who uses Proposar&apos;s AI?</h2>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="p-6 border border-[#1e1e2e] rounded-lg">Web Designers</div>
            <div className="p-6 border border-[#1e1e2e] rounded-lg">Marketing Agencies</div>
            <div className="p-6 border border-[#1e1e2e] rounded-lg">SEO Consultants</div>
            <div className="p-6 border border-[#1e1e2e] rounded-lg">Freelance Developers</div>
          </div>
        </div>
      </section>

      <section className="px-6 py-24 bg-[#12121e] border-y border-[#1e1e2e]">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-serif text-3xl font-bold mb-12">Frequently Asked Questions</h2>
        </div>
        <FAQ />
      </section>

      <section className="px-6 py-32 text-center max-w-3xl mx-auto">
        <h2 className="font-serif text-4xl md:text-5xl font-bold mb-6">Never write a proposal from scratch again.</h2>
        <AuthAwareLink unauthenticatedHref="/signup" className="inline-block rounded-lg bg-emerald-500 px-12 py-5 font-bold text-[#0a0a14] hover:bg-emerald-400 transition-all hover:scale-105 text-lg shadow-[0_0_40px_rgba(16,185,129,0.3)]">
          Try the AI Generator Free →
        </AuthAwareLink>
      </section>

      <Footer />
    </main>
  );
}
