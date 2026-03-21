import { Metadata } from 'next';
import { AuthAwareLink } from '@/components/auth/AuthAwareLink';
import { FAQ } from '@/components/landing/FAQ';
import { Navbar } from '@/components/landing/Navbar';
import { Footer } from '@/components/landing/Footer';

export const metadata: Metadata = {
  title: 'Proposal Generator for Freelancers — Win High Ticket Clients | Proposar',
  description: 'The definitive proposal generator for freelancers. Reduce your admin time by 90% and win more clients with our AI-driven freelance proposal software.',
  alternates: {
    canonical: 'https://proposar.com/proposal-generator-for-freelancers',
  },
};

export default function FreelancerProposalGeneratorPage() {
  return (
    <main className="min-h-screen bg-[#0a0a14] pt-24 text-[#faf8f4]">
      <Navbar />

      <section className="relative px-6 py-20 lg:py-32 flex flex-col items-center text-center max-w-5xl mx-auto">
        <div className="absolute top-0 right-1/4 w-[400px] h-[400px] bg-gold/10 rounded-full blur-[120px] -z-10" />
        <h1 className="font-serif text-5xl md:text-7xl font-bold mb-6 pb-2 text-gold">
          The Proposal Generator Built Specifically for Freelancers
        </h1>
        <p className="text-xl text-[#888890] max-w-3xl mb-10 leading-relaxed">
          Agency proposal tools are too bloated and expensive. You work alone, which means every hour spent writing proposals is unpaid. Generate gorgeous, high-converting proposals in 60 seconds and get back to billable work.
        </p>
        <AuthAwareLink unauthenticatedHref="/signup" className="rounded-lg bg-gold px-10 py-5 font-semibold text-[#0a0a14] hover:bg-gold-light transition-all hover:scale-105 text-lg">
          Start Your Free 14-Day Trial →
        </AuthAwareLink>
      </section>

      <section className="px-6 py-24 bg-[#12121e] border-y border-[#1e1e2e]">
         <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
            <div className="h-[500px] bg-[#0a0a14] rounded-2xl border border-[#1e1e2e] p-8 flex flex-col items-center justify-center text-center">
                 <div className="w-24 h-24 rounded-full bg-red-500/10 flex items-center justify-center text-red-500 text-4xl mb-6">
                    !
                 </div>
                 <h3 className="text-2xl font-bold mb-4">The Price of PDF Templates</h3>
                 <p className="text-[#888890]">Downloading a free Google Doc template seems smart, until you spend 45 minutes finding and replacing the bracketed text, formatting the tables, exporting it to a PDF, and asking the client to print and sign it. It&apos;s a terrible experience for everyone.</p>
            </div>
            
            <div className="space-y-8">
               <h2 className="font-serif text-3xl md:text-4xl font-bold">Your Unfair Freelance Advantage</h2>
               <div className="p-8 border border-emerald-500/30 rounded-xl bg-emerald-500/5">
                  <div className="text-emerald-400 font-bold mb-4 text-xl">Built-in Electronic Signatures</div>
                  <p className="text-[#faf8f4]">Stop losing deals because the client doesn&apos;t have a printer. Our platform includes legally binding, instant e-signatures so clients can sign on their mobile phones.</p>
               </div>
               <div className="p-8 border border-[#1e1e2e] rounded-xl bg-[#0a0a14]">
                  <div className="text-[#d1d1d6] font-bold mb-4 text-xl">Pricing Focus</div>
                  <p className="text-[#888890]">Prevent the dreaded &quot;sticker shock&quot; by allowing clients to choose from curated, tiered options rather than accepting or rejecting a single flat fee.</p>
               </div>
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
        <h2 className="font-serif text-4xl mb-6">Built for copywriters, designers, developers, and consultants.</h2>
        <AuthAwareLink unauthenticatedHref="/signup" className="inline-block rounded-lg bg-gold px-12 py-5 font-bold text-[#0a0a14] hover:bg-[#e8c76a] transition-all hover:scale-105 text-lg shadow-[0_0_40px_rgba(212,175,71,0.3)]">
          Create Your Freelance Account →
        </AuthAwareLink>
      </section>

      <Footer />
    </main>
  );
}
