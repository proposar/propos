import React from 'react';
import { AuthAwareLink } from '@/components/auth/AuthAwareLink';
import { FAQ } from '@/components/landing/FAQ';
import { Navbar } from '@/components/landing/Navbar';
import { Footer } from '@/components/landing/Footer';

interface ComparisonFeature {
  name: string;
  competitor: string | boolean;
  proposar: string | boolean;
  highlight?: boolean;
}

interface ComparisonPageProps {
  competitorName: string;
  competitorSlug: string;
  competitorPrice: string;
  heroHeading: string;
  heroSubheading: string;
  openingParagraph: string;
  features: ComparisonFeature[];
  competitorPros: string[];
  proposarPros: string[];
  testimonials: { quote: string; author: string; role: string }[];
}

export function ComparisonPage({
  competitorName,
  competitorSlug,
  competitorPrice,
  heroHeading,
  heroSubheading,
  openingParagraph,
  features,
  competitorPros,
  proposarPros,
  testimonials
}: ComparisonPageProps) {
  return (
    <main className="min-h-screen bg-[#0a0a14] pt-24 text-[#faf8f4]">
      <Navbar />

      {/* Hero Section */}
      <section className="relative px-6 py-20 lg:py-32 flex flex-col items-center text-center max-w-5xl mx-auto">
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-red-900/10 rounded-full blur-[120px] -z-10" />
        <h1 className="font-serif text-5xl md:text-7xl font-bold mb-6 pb-2">
          {heroHeading}
        </h1>
        <p className="text-xl text-[#888890] max-w-3xl mb-10 leading-relaxed">
          {heroSubheading}
        </p>
        <AuthAwareLink unauthenticatedHref="/signup" className="rounded-lg bg-gold px-10 py-5 font-semibold text-[#0a0a14] hover:bg-gold-light transition-all hover:scale-105 text-lg">
          Try Proposar Free Instead →
        </AuthAwareLink>
      </section>

      {/* Honest Introduction */}
      <section className="px-6 py-16 bg-[#12121e] border-y border-[#1e1e2e]">
        <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-2xl font-bold mb-6">An Honest Evaluation</h2>
            <p className="text-[#888890] text-lg leading-relaxed">{openingParagraph}</p>
        </div>
      </section>

      {/* Feature Comparison Table */}
      <section className="px-6 py-24 max-w-4xl mx-auto">
        <h2 className="font-serif text-3xl md:text-4xl font-bold text-center mb-12">Feature Breakdown</h2>
        <div className="rounded-2xl border border-[#1e1e2e] bg-[#12121e] overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-[#0a0a14]">
              <tr>
                <th className="p-6 border-b border-[#1e1e2e] font-medium text-[#888890]">Feature</th>
                <th className="p-6 border-b border-[#1e1e2e] font-bold text-[#faf8f4]">{competitorName}</th>
                <th className="p-6 border-b border-gold font-bold text-gold text-lg bg-gold/5">Proposar</th>
              </tr>
            </thead>
            <tbody>
              {features.map((feat, i) => (
                <tr key={i}>
                  <td className="p-6 border-b border-[#1e1e2e] text-[#888890]">{feat.name}</td>
                  <td className="p-6 border-b border-[#1e1e2e]">
                    {typeof feat.competitor === 'boolean' ? (feat.competitor ? '✅ Yes' : '❌ No') : feat.competitor}
                  </td>
                  <td className={`p-6 border-b border-[#1e1e2e] bg-gold/5 font-semibold ${feat.highlight ? 'text-gold' : 'text-[#faf8f4]'}`}>
                    {typeof feat.proposar === 'boolean' ? (feat.proposar ? '✅ Yes' : '❌ No') : feat.proposar}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Pros & Targeted Audiences */}
      <section className="px-6 py-20 bg-[#12121e] border-y border-[#1e1e2e]">
          <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12">
              <div className="p-8 rounded-xl border border-[#1e1e2e] bg-[#0a0a14]">
                  <h3 className="text-2xl font-bold mb-6">{competitorName} is better if you...</h3>
                  <ul className="space-y-4 text-[#888890]">
                      {competitorPros.map((pro, i) => (
                          <li key={i} className="flex gap-3"><span className="text-blue-400">▹</span>{pro}</li>
                      ))}
                  </ul>
              </div>
              <div className="p-8 rounded-xl border border-gold/30 bg-gold/5">
                  <h3 className="text-2xl font-bold mb-6 text-gold">Proposar is better if you...</h3>
                  <ul className="space-y-4 text-[#faf8f4]">
                      {proposarPros.map((pro, i) => (
                          <li key={i} className="flex gap-3"><span className="text-gold">▹</span>{pro}</li>
                      ))}
                  </ul>
              </div>
          </div>
      </section>

      {/* Testimonials */}
      {testimonials.length > 0 && (
          <section className="px-6 py-24 max-w-6xl mx-auto">
            <h2 className="font-serif text-3xl font-bold text-center mb-16">What users say when they switch</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {testimonials.map((t, i) => (
                <div key={i} className="p-8 rounded-2xl bg-[#12121e] border border-[#1e1e2e]">
                  <div className="text-gold mb-4">★★★★★</div>
                  <p className="text-[#faf8f4] mb-6 line-clamp-4">&quot;{t.quote}&quot;</p>
                  <div>
                    <p className="font-bold">{t.author}</p>
                    <p className="text-sm text-[#888890]">{t.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
      )}

      {/* FAQ Schema Section */}
      <section className="px-6 py-24 bg-[#12121e] border-y border-[#1e1e2e]">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-serif text-3xl font-bold mb-12">Frequently Asked Questions</h2>
        </div>
        <FAQ />
      </section>

      {/* Final CTA */}
      <section className="px-6 py-32 text-center max-w-3xl mx-auto">
        <h2 className="font-serif text-4xl md:text-5xl font-bold mb-6">See why freelancers make the switch.</h2>
        <AuthAwareLink unauthenticatedHref="/signup" className="inline-block rounded-lg bg-gold px-12 py-5 font-bold text-[#0a0a14] hover:bg-[#e8c76a] transition-all hover:scale-105 text-lg shadow-[0_0_40px_rgba(212,175,71,0.3)]">
          Try Proposar Free for 14 Days →
        </AuthAwareLink>
      </section>

      <Footer />
    </main>
  );
}
