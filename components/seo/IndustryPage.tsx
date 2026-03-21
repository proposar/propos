import React from 'react';
import { AuthAwareLink } from '@/components/auth/AuthAwareLink';
import { FAQ } from '@/components/landing/FAQ';
import { Navbar } from '@/components/landing/Navbar';
import { Footer } from '@/components/landing/Footer';

interface IndustryPageProps {
  industry: string;
  heroHeading: string;
  heroSubheading: string;
  problemStatement: string;
  solutions: { title: string; desc: string; icon: string }[];
  marketStats?: string;
  testimonials: { quote: string; author: string; role: string }[];
}

export function IndustryPage({
  industry,
  heroHeading,
  heroSubheading,
  problemStatement,
  solutions,
  marketStats,
  testimonials,
}: IndustryPageProps) {
  return (
    <main className="min-h-screen bg-[#0a0a14] pt-24 text-[#faf8f4]">
      <Navbar />

      {/* Hero Section */}
      <section className="relative px-6 py-20 lg:py-32 flex flex-col items-center text-center max-w-5xl mx-auto">
        <div className="absolute top-0 left-1/4 w-[400px] h-[400px] bg-emerald-900/10 rounded-full blur-[120px] -z-10" />
        <h1 className="font-serif text-5xl md:text-7xl font-bold mb-6 pb-2">
          {heroHeading}
        </h1>
        <p className="text-xl text-[#888890] max-w-3xl mb-10 leading-relaxed">
          {heroSubheading}
        </p>
        <AuthAwareLink unauthenticatedHref="/signup" className="rounded-lg bg-gold px-10 py-5 font-semibold text-[#0a0a14] hover:bg-gold-light transition-all hover:scale-105 text-lg">
          Generate {industry} Proposals Free →
        </AuthAwareLink>
      </section>

      {/* Problem Agitation Section */}
      <section className="px-6 py-20 bg-[#12121e] border-y border-[#1e1e2e]">
        <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-serif font-bold mb-6 text-gold">The Proposal Trap</h2>
            <p className="text-[#888890] text-lg leading-relaxed">{problemStatement}</p>
            {marketStats && (
               <div className="mt-8 p-6 bg-[#0a0a14] border border-[#1e1e2e] rounded-xl text-emerald-400 font-semibold tracking-wide shadow-inner">
                   {marketStats}
               </div>
            )}
        </div>
      </section>

      {/* Industry Solutions / Features */}
      <section className="px-6 py-24 max-w-6xl mx-auto">
        <h2 className="font-serif text-3xl md:text-4xl font-bold text-center mb-16">How Proposar helps {industry.toLowerCase()} win more work</h2>
        <div className="grid md:grid-cols-3 gap-8">
            {solutions.map((sol, i) => (
               <div key={i} className="p-8 rounded-2xl bg-[#0a0a14] border border-[#1e1e2e] hover:border-gold/30 transition-all">
                  <div className="text-4xl mb-6">{sol.icon}</div>
                  <h3 className="text-xl font-bold mb-4">{sol.title}</h3>
                  <p className="text-[#888890] leading-relaxed">{sol.desc}</p>
               </div>
            ))}
        </div>
      </section>

      {/* Testimonials */}
      {testimonials.length > 0 && (
          <section className="px-6 py-24 bg-[#12121e] border-y border-[#1e1e2e]">
            <div className="max-w-6xl mx-auto">
              <h2 className="font-serif text-3xl font-bold text-center mb-16">What other {industry.toLowerCase()} are saying</h2>
              <div className="grid md:grid-cols-3 gap-8">
                {testimonials.map((t, i) => (
                  <div key={i} className="p-8 rounded-2xl bg-[#0a0a14] border border-[#1e1e2e]">
                    <div className="text-gold mb-4">★★★★★</div>
                    <p className="text-[#faf8f4] mb-6 line-clamp-4">&quot;{t.quote}&quot;</p>
                    <div>
                      <p className="font-bold">{t.author}</p>
                      <p className="text-sm text-[#888890]">{t.role}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
      )}

      {/* FAQ Schema Section */}
      <section className="px-6 py-24 bg-[#0a0a14] border-b border-[#1e1e2e]">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-serif text-3xl font-bold mb-12">Frequently Asked Questions</h2>
        </div>
        <FAQ />
      </section>

      {/* CTA */}
      <section className="px-6 py-32 text-center max-w-3xl mx-auto">
        <h2 className="font-serif text-4xl md:text-5xl font-bold mb-6">Stop leaving {industry.toLowerCase()} revenue on the table.</h2>
        <AuthAwareLink unauthenticatedHref="/signup" className="inline-block rounded-lg bg-gold px-12 py-5 font-bold text-[#0a0a14] hover:bg-[#e8c76a] transition-all hover:scale-105 text-lg shadow-[0_0_40px_rgba(212,175,71,0.3)]">
          Start Your Free 14-Day Trial →
        </AuthAwareLink>
      </section>

      <Footer />
    </main>
  );
}
