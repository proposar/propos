'use client';
import { useState } from 'react';
import { Navbar } from '@/components/landing/Navbar';
import { Footer } from '@/components/landing/Footer';
import { AuthAwareLink } from '@/components/auth/AuthAwareLink';

export default function WinRateCalculatorPage() {
  const [proposalsSent, setProposalsSent] = useState<number | ''>('');
  const [proposalsWon, setProposalsWon] = useState<number | ''>('');
  const [averageValue, setAverageValue] = useState<number | ''>('');

  const sent = Number(proposalsSent) || 0;
  const won = Number(proposalsWon) || 0;
  const avgVal = Number(averageValue) || 0;

  const winRate = sent > 0 ? ((won / sent) * 100).toFixed(1) : '0.0';
  const currentRevenue = won * avgVal;
  
  // Projection if they increase win rate by 20% (absolute, or relative. Let's do absolute to 50% or +15%)
  const projectedWinRate = Math.min((Number(winRate) + 20), 100);
  const projectedWins = Math.round(sent * (projectedWinRate / 100));
  const projectedRevenue = projectedWins * avgVal;
  const revenueLost = projectedRevenue - currentRevenue;

  return (
    <main className="min-h-screen bg-[#0a0a14] pt-24 text-[#faf8f4]">
      <title>Freelance Proposal Win Rate Calculator | Proposar</title>
      <meta name="description" content="Calculate your freelance proposal win rate and discover how much revenue you are losing by using static PDFs instead of tracked, interactive proposals." />
      
      <Navbar />

      <section className="px-6 py-20 max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="font-serif text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent mb-6">
            Proposal Win Rate & Revenue Calculator
          </h1>
          <p className="text-xl text-[#888890] max-w-2xl mx-auto">
            Input your metrics below to calculate your current win rate and see how much money you could make by optimizing your proposal process.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
           {/* Inputs */}
           <div className="space-y-6 bg-[#12121e] p-8 border border-[#1e1e2e] rounded-2xl">
              <h3 className="text-2xl font-bold mb-6">Your Metrics (Last 12 Months)</h3>
              
              <div>
                 <label className="block text-sm text-[#888890] mb-2">Total Proposals Sent</label>
                 <input 
                   type="number" 
                   className="w-full bg-[#0a0a14] border border-[#1e1e2e] rounded-lg p-4 text-[#faf8f4] focus:border-emerald-500 outline-none"
                   placeholder="e.g. 50"
                   value={proposalsSent}
                   onChange={e => setProposalsSent(Number(e.target.value) || '')}
                 />
              </div>

              <div>
                 <label className="block text-sm text-[#888890] mb-2">Total Proposals Won (Signed)</label>
                 <input 
                   type="number" 
                   className="w-full bg-[#0a0a14] border border-[#1e1e2e] rounded-lg p-4 text-[#faf8f4] focus:border-emerald-500 outline-none"
                   placeholder="e.g. 15"
                   value={proposalsWon}
                   onChange={e => setProposalsWon(Number(e.target.value) || '')}
                 />
              </div>

              <div>
                 <label className="block text-sm text-[#888890] mb-2">Average Project Value ($)</label>
                 <input 
                   type="number" 
                   className="w-full bg-[#0a0a14] border border-[#1e1e2e] rounded-lg p-4 text-[#faf8f4] focus:border-emerald-500 outline-none"
                   placeholder="e.g. 3000"
                   value={averageValue}
                   onChange={e => setAverageValue(Number(e.target.value) || '')}
                 />
              </div>
           </div>

           {/* Outputs */}
           <div className="space-y-6">
              <div className="bg-[#0a0a14] border border-[#1e1e2e] p-8 rounded-2xl shadow-xl relative overflow-hidden">
                 <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 blur-[50px] rounded-full" />
                 <h3 className="text-[#888890] text-sm uppercase tracking-widest font-bold mb-2">Current Win Rate</h3>
                 <div className="text-6xl font-black text-[#faf8f4] mb-2">{winRate}%</div>
                 <p className="text-sm text-[#888890]">Industry Average: 31%</p>
                 
                 <div className="mt-8 pt-8 border-t border-[#1e1e2e]">
                    <h3 className="text-[#888890] text-sm uppercase tracking-widest font-bold mb-2">Current Revenue Won</h3>
                    <div className="text-4xl font-bold text-emerald-400">${currentRevenue.toLocaleString()}</div>
                 </div>
              </div>

              {sent > 0 && (
                <div className="bg-gradient-to-br from-[#12121e] to-[#1a1a2e] border border-blue-500/30 p-8 rounded-2xl">
                   <h3 className="text-xl font-bold text-blue-400 mb-4">The Cost of Doing Nothing</h3>
                   <p className="text-[#d1d1d6] mb-6 line-height-relaxed">
                     Freelancers who switch to interactive, tracked proposals with 3-tier pricing usually increase their win rate by 15-20%. 
                   </p>
                   <div className="bg-[#0a0a14] p-4 rounded-lg border border-[#1e1e2e]">
                      <div className="text-sm text-[#888890]">If you increased your win rate to {projectedWinRate.toFixed(1)}%, you would make an extra:</div>
                      <div className="text-3xl font-black text-emerald-400 mt-2">+ ${Math.max(0, revenueLost).toLocaleString()}</div>
                   </div>
                   
                   <AuthAwareLink unauthenticatedHref="/signup" className="block w-full text-center mt-6 bg-blue-500 hover:bg-blue-400 text-white font-bold py-4 rounded-lg transition-colors">
                      Fix Your Win Rate with Proposar →
                   </AuthAwareLink>
                </div>
              )}
           </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
