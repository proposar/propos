import { Metadata } from 'next';
import { AuthAwareLink } from '@/components/auth/AuthAwareLink';
import { FAQ } from '@/components/landing/FAQ';
import { Navbar } from '@/components/landing/Navbar';
import { Footer } from '@/components/landing/Footer';

export const metadata: Metadata = {
  title: 'Proposal Tracking Software — Know When Clients Read Your Proposals | Proposar',
  description: 'Get notified the moment your client opens your proposal. See how long they read it and which section they spent most time on. Try Proposar free.',
  alternates: {
    canonical: 'https://proposar.com/proposal-tracking-software',
  },
};

export default function ProposalTrackingPage() {
  return (
    <main className="min-h-screen bg-[#0a0a14] pt-24 text-[#faf8f4]">
      <Navbar />

      <section className="relative px-6 py-20 lg:py-32 flex flex-col items-center text-center max-w-5xl mx-auto">
        <div className="absolute top-0 right-1/4 w-[400px] h-[400px] bg-purple-900/10 rounded-full blur-[120px] -z-10" />
        <h1 className="font-serif text-5xl md:text-7xl font-bold mb-6 pb-2 text-purple-400">
          Know Exactly When They Read Your Proposal
        </h1>
        <p className="text-xl text-[#888890] max-w-3xl mb-10 leading-relaxed">
          Stop wondering if your email went to spam. Real-time notifications and detailed page-by-page analytics tell you exactly when to follow up and close the deal.
        </p>
        <AuthAwareLink unauthenticatedHref="/signup" className="rounded-lg bg-purple-500 px-10 py-5 font-semibold text-[#faf8f4] hover:bg-purple-400 transition-all hover:scale-105 text-lg">
          Start Tracking Proposals Free →
        </AuthAwareLink>
      </section>

      <section className="px-6 py-24 bg-[#12121e] border-y border-[#1e1e2e]">
         <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
            
            <div className="space-y-8">
               <h2 className="font-serif text-3xl md:text-4xl font-bold">Analytics that drive revenue</h2>
               <div className="p-8 border border-purple-500/30 rounded-xl bg-purple-500/5">
                  <div className="text-purple-400 font-bold mb-4 text-xl">Instant Opening Alerts</div>
                  <p className="text-[#faf8f4]">Receive a push notification the exact second the prospective client clicks your proposal link. Follow up while you have their complete attention.</p>
               </div>
               <div className="p-8 border border-[#1e1e2e] rounded-xl bg-[#0a0a14]">
                  <div className="text-emerald-400 font-bold mb-4 text-xl">Time-to-Read Analytics</div>
                  <p className="text-[#888890]">Discover exactly what your clients care about. Proposar&apos;s real-time document analytics show you exactly when a client opens your proposal, how long they spend on the pricing page, and when they close it. Follow up with precision, not guesswork.</p>
               </div>
            </div>

            <div className="h-[500px] bg-[#0a0a14] rounded-2xl border border-[#1e1e2e] p-8 relative overflow-hidden">
                <div className="text-center mb-12">
                   <div className="inline-block px-4 py-2 bg-purple-500/10 text-purple-400 rounded-full text-sm font-bold border border-purple-500/20">
                      Just Now
                   </div>
                   <h3 className="text-2xl mt-4 font-bold">Client is viewing your proposal</h3>
                </div>
                
                <div className="space-y-4">
                    <div className="flex justify-between items-center p-4 bg-[#12121e] rounded border border-[#1e1e2e]">
                       <span className="text-[#888890]">Section 1: Executive Summary</span>
                       <span className="text-emerald-400 font-mono">1m 14s</span>
                    </div>
                    <div className="flex justify-between items-center p-4 bg-[#12121e] rounded border border-purple-500/30 border-l-4 border-l-purple-500">
                       <span className="text-[#faf8f4] font-bold">Section 4: Investment Options</span>
                       <span className="text-purple-400 font-mono animate-pulse">Viewing...</span>
                    </div>
                </div>
                
                <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0a0a14] to-transparent pointer-events-none" />
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
        <h2 className="font-serif text-4xl mb-6">Stop sending blind PDFs. Enter the tracking era.</h2>
        <AuthAwareLink unauthenticatedHref="/signup" className="inline-block rounded-lg bg-purple-500 px-12 py-5 font-bold text-[#faf8f4] hover:bg-purple-400 transition-all hover:scale-105 text-lg shadow-[0_0_40px_rgba(168,85,247,0.3)]">
          Start Your Free Trial →
        </AuthAwareLink>
      </section>

      <Footer />
    </main>
  );
}
