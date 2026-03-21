import { Metadata } from 'next';
import Link from 'next/link';
import { AuthAwareLink } from '@/components/auth/AuthAwareLink';
import { Navbar } from '@/components/landing/Navbar';
import { Footer } from '@/components/landing/Footer';

export const metadata: Metadata = {
  title: 'Free Proposal Templates PDF & Docs | Proposar',
  description: 'Download free, professional proposal templates for any industry. Web design, marketing, consulting, photography, and more. Or generate instantly with AI.',
  alternates: {
    canonical: 'https://proposar.com/proposal-templates',
  },
};

const TEMPLATE_CATEGORIES = [
  {
    title: "Design & Creative",
    templates: [
      { name: "Web Design Proposal Template", slug: "web-design" },
      { name: "Graphic Design Proposal", slug: "graphic-design" },
      { name: "Branding Proposal", slug: "branding" },
      { name: "Interior Design Proposal", slug: "interior-design" }
    ]
  },
  {
    title: "Marketing & Strategy",
    templates: [
      { name: "SEO Retainer Proposal", slug: "seo" },
      { name: "Digital Marketing Strategy", slug: "marketing" },
      { name: "Social Media Management", slug: "social-media" },
      { name: "Copywriting Proposal", slug: "copywriting" }
    ]
  },
  {
    title: "Consulting & Professional Services",
    templates: [
      { name: "Business Consulting SOW", slug: "consulting" },
      { name: "Accounting Services Proposal", slug: "accounting" },
      { name: "IT Services Proposal", slug: "it-services" },
      { name: "Freelance Developer Quote", slug: "developer" }
    ]
  },
  {
    title: "Events & Operations",
    templates: [
      { name: "Wedding Photography Proposal", slug: "photography" },
      { name: "Event Planning Proposal", slug: "event-planning" },
      { name: "Commercial Videography", slug: "videography" },
      { name: "Catering Services Proposal", slug: "catering" }
    ]
  }
];

export default function TemplatesIndexPage() {
  return (
    <main className="min-h-screen bg-[#0a0a14] pt-24 text-[#faf8f4]">
      <Navbar />

      <section className="px-6 py-20 lg:py-32 max-w-5xl mx-auto text-center">
        <h1 className="font-serif text-5xl md:text-7xl font-bold bg-gradient-to-r from-emerald-400 to-[#faf8f4] bg-clip-text text-transparent mb-6">
          Free Proposal Templates
        </h1>
        <p className="text-xl text-[#888890] max-w-3xl mx-auto mb-10 leading-relaxed">
          Browse our library of industry-specific proposal templates. Download them as PDFs, or let our AI customize them for your exact client in 60 seconds.
        </p>
        <AuthAwareLink unauthenticatedHref="/signup" className="rounded-lg bg-emerald-500 px-10 py-5 font-bold text-[#0a0a14] hover:bg-emerald-400 transition-all hover:scale-105 text-lg shadow-[0_0_40px_rgba(16,185,129,0.3)]">
          Generate a Template with AI →
        </AuthAwareLink>
      </section>

      <section className="px-6 py-20 bg-[#12121e] border-y border-[#1e1e2e]">
        <div className="max-w-6xl mx-auto space-y-16">
          {TEMPLATE_CATEGORIES.map((category, idx) => (
            <div key={idx}>
              <h2 className="text-3xl font-serif font-bold text-gold mb-8 pb-4 border-b border-[#1e1e2e]">{category.title}</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                 {category.templates.map((template, tIdx) => (
                    <Link key={tIdx} href={`/proposal-templates/${template.slug}`} className="group p-6 rounded-xl border border-[#1e1e2e] bg-[#0a0a14] hover:border-emerald-500 transition-colors flex flex-col justify-between h-48">
                        <div>
                           <div className="w-10 h-10 rounded bg-[#1e1e2e] flex items-center justify-center text-emerald-500 mb-4 group-hover:scale-110 transition-transform">
                              📄
                           </div>
                           <h3 className="font-bold text-lg text-[#faf8f4] leading-tight">{template.name}</h3>
                        </div>
                        <div className="text-sm text-[#888890] font-medium group-hover:text-emerald-400 transition-colors">
                            View Template →
                        </div>
                    </Link>
                 ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </main>
  );
}
