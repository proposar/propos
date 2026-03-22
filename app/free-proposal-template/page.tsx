import { Metadata } from 'next';
import Link from 'next/link';
import { AuthAwareLink } from '@/components/auth/AuthAwareLink';
import { FAQ } from '@/components/landing/FAQ';
import { Navbar } from '@/components/landing/Navbar';
import { Footer } from '@/components/landing/Footer';

export const metadata: Metadata = {
  title: 'Free Proposal Templates for Freelancers — Download or Generate with AI',
  description: 'Download free professional proposal templates for web design, marketing, SEO, consulting and more. Or let AI generate a customised proposal in 60 seconds.',
  alternates: {
    canonical: 'https://proposar.com/free-proposal-template',
  },
};

export default function FreeProposalTemplatePage() {
  const templates = [
    { title: 'Web Design Proposal', slug: 'web-design', href: '/proposal-templates/web-design' },
    { title: 'Digital Marketing Proposal', slug: 'marketing', href: '/proposal-templates/marketing' },
    { title: 'SEO Proposal', slug: 'seo', href: '/proposal-templates/seo' },
    { title: 'Consulting Proposal', slug: 'consulting', href: '/proposal-templates/consulting' },
    { title: 'Social Media Management', slug: 'social-media', href: '/proposal-templates/social-media' },
    { title: 'App Development Proposal', slug: 'developer', href: '/proposal-templates/developer' },
    { title: 'Brand Identity Proposal', slug: 'branding', href: '/proposal-templates/branding' },
    { title: 'Copywriting Proposal', slug: 'copywriting', href: '/proposal-templates/copywriting' },
    { title: 'Video Production Proposal', slug: 'videography', href: '/proposal-templates/videography' },
    { title: 'Freelance Design Proposal', slug: 'graphic-design', href: '/proposal-templates/graphic-design' },
  ];

  return (
    <main className="min-h-screen bg-[#0a0a14] pt-24 text-[#faf8f4]">
      <Navbar />

      {/* Hero Section */}
      <section className="relative px-6 py-20 lg:py-32 flex flex-col items-center text-center max-w-5xl mx-auto">
        <h1 className="font-serif text-5xl md:text-7xl font-bold bg-gradient-to-r from-[#faf8f4] to-gold bg-clip-text text-transparent mb-6 pb-2">
          Free Proposal Templates That Actually Win Clients
        </h1>
        <p className="text-xl text-[#888890] max-w-3xl mb-10 leading-relaxed">
          Stop staring at a blank screen. Browse our collection of 10+ free, professionally written proposal templates designed specifically for freelancers and agencies. Or better yet... let our AI write it for you.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
           <AuthAwareLink unauthenticatedHref="/signup" className="rounded-lg bg-gold px-8 py-4 font-semibold text-[#0a0a14] hover:bg-gold-light transition-all hover:scale-105">
             Skip Templates — Auto-Generate with AI ✨
           </AuthAwareLink>
           <a href="#templates-grid" className="rounded-lg border border-[#1e1e2e] bg-[#12121e] px-8 py-4 font-semibold text-[#faf8f4] hover:bg-[#1e1e2e] transition-colors">
             Browse Free Templates ↓
           </a>
        </div>
      </section>

      {/* Templates Grid Section */}
      <section id="templates-grid" className="px-6 py-20 bg-[#12121e] border-y border-[#1e1e2e]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-serif text-3xl md:text-5xl font-bold mb-4">Choose Your Template</h2>
            <p className="text-[#888890] text-lg">Download as a PDF or edit instantly in Proposar.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {templates.map((template, idx) => (
              <div key={idx} className="group flex flex-col justify-between rounded-xl border border-[#1e1e2e] bg-[#0a0a14] p-6 hover:border-gold/50 transition-all">
                <div className="mb-6">
                  <div className="h-40 w-full bg-gradient-to-br from-[#1e1e2e] to-[#0a0a14] rounded-lg mb-4 flex items-center justify-center border border-[#1e1e2e] text-gold/30 group-hover:text-gold/60 transition-colors">
                    <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h3 className="font-bold text-xl text-[#faf8f4]">{template.title}</h3>
                  <p className="text-sm text-[#888890] mt-2">Includes: Executive Summary, Timeline, Pricing Table, and Terms.</p>
                </div>
                <div className="flex flex-col gap-3">
                  <Link href={template.href} className="text-center w-full py-3 rounded-lg bg-[#1e1e2e] text-[#faf8f4] font-medium hover:bg-[#2a2a3a] transition-colors text-sm">
                    View & Download PDF
                  </Link>
                  <AuthAwareLink unauthenticatedHref="/signup" className="text-center w-full py-3 rounded-lg border border-gold/30 text-gold font-medium hover:bg-gold hover:text-[#0a0a14] transition-colors text-sm">
                    Use this Template in AI →
                  </AuthAwareLink>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* The Pivot to AI */}
      <section className="px-6 py-32 text-center max-w-4xl mx-auto">
        <h2 className="font-serif text-4xl md:text-5xl font-bold mb-6">Templates are just the beginning.</h2>
        <p className="text-xl text-[#888890] mb-10 leading-relaxed">
          Downloading a template means you still have to fill in all the blanks. Why spend 2 hours writing when <strong className="text-white">Proposar AI can craft a custom proposal perfectly tailored to your client in exactly 60 seconds?</strong>
        </p>
        <AuthAwareLink unauthenticatedHref="/signup" className="inline-block rounded-lg bg-gold px-12 py-5 font-bold text-[#0a0a14] hover:bg-[#e8c76a] transition-all hover:scale-105 text-lg shadow-[0_0_40px_rgba(212,175,71,0.3)]">
          Join 2,000+ Freelancers Using AI →
        </AuthAwareLink>
      </section>

      {/* FAQ Schema Section */}
      <section className="px-6 py-24 bg-[#12121e] border-y border-[#1e1e2e]">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-serif text-3xl font-bold mb-12">Frequently Asked Questions</h2>
        </div>
        <FAQ />
      </section>

      <Footer />
    </main>
  );
}
