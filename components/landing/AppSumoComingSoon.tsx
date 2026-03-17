"use client";

import { motion } from "framer-motion";
import { Mail, Gift } from "lucide-react";

export function AppSumoComingSoon() {
  return (
    <section className="py-20 px-6 bg-[#0a0a14] relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-4xl mx-auto rounded-2xl border border-blue-500/30 bg-[#12121e]/50 p-8 md:p-12 relative z-10 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-2 text-sm text-blue-400 mb-6">
          <Gift className="w-4 h-4" />
          <span className="font-semibold tracking-wide uppercase">AppSumo Launch Incoming</span>
        </div>
        
        <h2 className="font-serif text-4xl md:text-5xl font-bold text-[#faf8f4] mb-6">
          The <span className="text-blue-400">Lifetime Deal (LTD)</span> Is Coming.
        </h2>
        
        <p className="text-[#888890] text-lg mb-8 max-w-2xl mx-auto leading-relaxed">
          Stop paying monthly for proposal tools. We&apos;re launching on AppSumo with 
          <span className="text-[#faf8f4]"> Stackable Lifetime Codes</span>. Get full access to the 
          <span className="text-[#faf8f4]"> A-to-Z Anti-Ghosting workflow</span> for a single payment.
        </p>

        <form className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto" onSubmit={(e) => e.preventDefault()}>
          <div className="relative flex-1">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#888890]" />
            <input 
              type="email" 
              placeholder="Enter your email" 
              className="w-full rounded-lg border border-[#1e1e2e] bg-[#0a0a14] py-3 pl-10 pr-4 text-[#faf8f4] placeholder-[#888890] focus:border-blue-500/50 focus:outline-none transition-colors"
              required
            />
          </div>
          <button 
            type="submit" 
            className="rounded-lg bg-blue-600 px-8 py-3 font-semibold text-white hover:bg-blue-500 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            Notify Me first →
          </button>
        </form>

        <p className="text-xs text-[#888890] mt-6 italic">
          *Early bird subscribers get an exclusive 10% extra discount on top of the AppSumo LTD price.
        </p>
      </div>
    </section>
  );
}
