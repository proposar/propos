'use client';
import { useState } from 'react';
import { Navbar } from '@/components/landing/Navbar';
import { Footer } from '@/components/landing/Footer';
import { AuthAwareLink } from '@/components/auth/AuthAwareLink';

// Adding dynamic metadata in a Client Component file requires a separate layout or page wrapper in optimal setups, 
// but we will keep it simple here as it's a tool page. (Ideally metadata is in layout or a separate server file,
// but for this phase we will structure the tool).

export default function WordCountToolPage() {
  const [text, setText] = useState('');
  
  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  const chars = text.length;
  const readingTime = Math.ceil(words / 200); // avg 200 wpm
  
  let suggestion = "";
  if (words === 0) suggestion = "Paste your proposal text below to analyze it.";
  else if (words < 300) suggestion = "Your proposal is very brief. Ensure you have clearly defined the scope of work and deliverables to prevent scope creep.";
  else if (words > 1200) suggestion = "This is getting long. Clients rarely read proposals over 1,200 words. Consider tightening the Executive Summary.";
  else suggestion = "This length is ideal. It's long enough to build trust and outline scope, but short enough to keep their attention.";

  return (
    <main className="min-h-screen bg-[#0a0a14] pt-24 text-[#faf8f4]">
      <Navbar />

      <section className="px-6 py-20 max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="font-serif text-4xl md:text-5xl font-bold bg-gradient-to-r from-emerald-400 to-[#faf8f4] bg-clip-text text-transparent mb-6">
            Proposal Formatting & Word Count Checker
          </h1>
          <p className="text-xl text-[#888890]">
            Paste your proposal below to calculate word count, estimated reading time, and structural advice.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8 text-center">
           <div className="bg-[#12121e] border border-[#1e1e2e] rounded-xl p-6">
              <div className="text-4xl font-bold text-[#faf8f4] mb-2">{words}</div>
              <div className="text-[#888890] text-sm uppercase tracking-wider">Words</div>
           </div>
           <div className="bg-[#12121e] border border-[#1e1e2e] rounded-xl p-6">
              <div className="text-4xl font-bold text-[#faf8f4] mb-2">{chars}</div>
              <div className="text-[#888890] text-sm uppercase tracking-wider">Characters</div>
           </div>
           <div className="bg-[#12121e] border border-[#1e1e2e] rounded-xl p-6">
              <div className="text-4xl font-bold text-[#faf8f4] mb-2">{readingTime}m</div>
              <div className="text-[#888890] text-sm uppercase tracking-wider">Reading Time</div>
           </div>
        </div>

        <div className={`p-4 rounded-lg mb-8 border ${words > 0 && words <= 1200 && words >= 300 ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-gold/10 border-gold/30 text-gold'}`}>
           <strong>Recommendation:</strong> {suggestion}
        </div>

        <textarea
          className="w-full h-96 bg-[#0a0a14] border border-[#1e1e2e] rounded-xl p-6 text-[#faf8f4] focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all resize-y"
          placeholder="Paste your proposal text here..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        <div className="mt-16 p-8 border border-gold/30 bg-gold/5 rounded-2xl text-center">
           <h3 className="text-2xl font-bold text-gold mb-4">Tired of writing proposals manually?</h3>
           <p className="text-[#faf8f4] mb-6">Proposar&apos;s AI generator creates perfectly optimized, legally tight proposals in 60 seconds.</p>
           <AuthAwareLink unauthenticatedHref="/signup" className="inline-block rounded-lg bg-gold px-8 py-4 font-bold text-[#0a0a14] hover:bg-gold-light transition-all text-lg">
             Try the AI Generator Free
           </AuthAwareLink>
        </div>
      </section>

      <Footer />
    </main>
  );
}
