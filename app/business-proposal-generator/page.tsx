import { Metadata } from 'next';
import { AuthAwareLink } from '@/components/auth/AuthAwareLink';
import { FAQ } from '@/components/landing/FAQ';
import { Navbar } from '@/components/landing/Navbar';
import { Footer } from '@/components/landing/Footer';

export const metadata: Metadata = {
  title: 'Business Proposal Generator — Automate B2B Sales | Proposar',
  description: 'Create highly professional B2B software and consulting proposals with our business proposal generator. Integrate pricing, scope, and digital signatures.',
  alternates: {
    canonical: 'https://proposar.com/business-proposal-generator',
  },
};

export default function BusinessProposalGeneratorPage() {
  return (
    <main className="min-h-screen bg-[#0a0a14] pt-24 text-[#faf8f4]">
      <Navbar />

      <section className="relative px-6 py-20 lg:py-32 flex flex-col items-center text-center max-w-5xl mx-auto">
        <div className="absolute top-0 left-1/4 w-[400px] h-[400px] bg-blue-900/10 rounded-full blur-[120px] -z-10" />
        <h1 className="font-serif text-5xl md:text-7xl font-bold mb-6 pb-2">
          The Intelligent Business Proposal Generator
        </h1>
        <p className="text-xl text-[#888890] max-w-3xl mb-10 leading-relaxed">
          The ultimate engine for B2B consultants and service businesses. Generate comprehensive strategy proposals, embed 3-tier pricing, and track client interactions.
        </p>
        <AuthAwareLink unauthenticatedHref="/signup" className="rounded-lg bg-blue-500 px-10 py-5 font-semibold text-[#faf8f4] hover:bg-blue-400 transition-all hover:scale-105 text-lg">
          Start Your Free Trial →
        </AuthAwareLink>
      </section>

      <section className="px-6 py-24 bg-[#12121e] border-y border-[#1e1e2e]">
         <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
               <h2 className="font-serif text-3xl md:text-4xl font-bold">What makes a business proposal different?</h2>
               <div className="p-8 border border-[#1e1e2e] rounded-xl bg-[#0a0a14]">
                  <div className="text-emerald-400 font-bold mb-4 text-xl">1. ROI Focused Executive Summaries</div>
                  <p className="text-[#888890]">B2B executives do not buy features; they buy financial outcomes. Our generator structures your opening pages to explicitly answer the &quot;Why You, Why Now&quot; question.</p>
               </div>
               <div className="p-8 border border-gold/30 rounded-xl bg-gold/5">
                  <div className="text-gold font-bold mb-4 text-xl">2. Scalable Tiered Pricing</div>
                  <p className="text-[#faf8f4]">Never send a flat quote. Generate interactive Good/Better/Best pricing tables that increase your average deal size by 30% by shifting the client&apos;s mindset from cost to choice.</p>
               </div>
               <div className="p-8 border border-[#1e1e2e] rounded-xl bg-[#0a0a14]">
                  <div className="text-emerald-400 font-bold mb-4 text-xl">3. Professional Formatting</div>
                  <p className="text-[#888890]">A consistent, brand-aligned visual design ensures your business stands out against competitors sending plain word documents.</p>
               </div>
            </div>
            <div className="h-[600px] bg-gradient-to-br from-[#12121e] to-[#0a0a14] rounded-2xl border border-blue-500/20 shadow-[-20px_0_60px_rgba(59,130,246,0.1)] p-8">
                {/* Abstract UI representation of a beautiful business document */}
                <div className="w-1/2 h-8 bg-blue-500/20 rounded mb-8" />
                <div className="w-full h-3 bg-[#1e1e2e] rounded mb-3" />
                <div className="w-5/6 h-3 bg-[#1e1e2e] rounded mb-12" />
                
                <div className="grid grid-cols-3 gap-4 mb-12">
                   <div className="h-32 border border-[#1e1e2e] rounded bg-[#0a0a14]" />
                   <div className="h-36 border-2 border-gold/50 rounded bg-gold/5 -translate-y-2 shadow-[0_0_20px_rgba(212,175,71,0.2)]" />
                   <div className="h-32 border border-[#1e1e2e] rounded bg-[#0a0a14]" />
                </div>
                
                <div className="w-1/3 h-10 bg-blue-500 rounded mx-auto" />
            </div>
         </div>
      </section>

      <section className="px-6 py-24 bg-[#12121e] border-y border-[#1e1e2e] mt-24">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-serif text-3xl font-bold mb-12">Frequently Asked Questions</h2>
        </div>
        <FAQ />
      </section>

      <section className="px-6 py-32 text-center max-w-3xl mx-auto">
        <h2 className="font-serif text-4xl md:text-5xl font-bold mb-6">Upgrade your sales process today.</h2>
        <AuthAwareLink unauthenticatedHref="/signup" className="inline-block rounded-lg bg-blue-500 px-12 py-5 font-bold text-[#faf8f4] hover:bg-blue-400 transition-all hover:scale-105 text-lg shadow-[0_0_40px_rgba(59,130,246,0.3)]">
          Build Your First Business Proposal →
        </AuthAwareLink>
      </section>

      <Footer />
    </main>
  );
}
