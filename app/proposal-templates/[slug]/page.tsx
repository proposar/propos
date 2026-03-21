import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { AuthAwareLink } from '@/components/auth/AuthAwareLink';
import { Navbar } from '@/components/landing/Navbar';
import { Footer } from '@/components/landing/Footer';
import { InternalLinks } from '@/components/seo/InternalLinks';

// In a real app with a DB, this comes from a CMS. 
// For SEO programmatic generation, we map slugs to dynamic titles and content.
const generateTemplateData = (slug: string) => {
  const formattedTitle = slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  
  return {
    title: `${formattedTitle} Proposal Template`,
    description: `A highly persuasive, editable ${formattedTitle.toLowerCase()} written specifically to help freelancers and agencies win high-ticket projects. Includes pricing tables and scope definitions.`,
    h1: `${formattedTitle} Proposal Template`,
    intro: `Sending a basic word document for a ${formattedTitle.toLowerCase()} project is the fastest way to lose a deal. You need a structured, professional proposal that outlines your methodology, mitigates scope risk, and clearly justifies your pricing.`,
    sections: [
       "Executive Summary & Objectives",
       "Project Scope & Exclusions",
       "Timeline & Key Milestones",
       "Investment & Phased Pricing",
       "Terms & Sign-off"
    ]
  };
};

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const data = generateTemplateData(params.slug);
  return {
    title: `${data.title} | Free PDF Download | Proposar`,
    description: data.description,
    alternates: {
      canonical: `https://proposar.com/proposal-templates/${params.slug}`
    }
  };
}

export default function TemplateDetailPage({ params }: { params: { slug: string } }) {
  const data = generateTemplateData(params.slug);
  
  if (!data) notFound();

  return (
    <main className="min-h-screen bg-[#0a0a14] pt-24 text-[#faf8f4]">
      <Navbar />

      <section className="px-6 py-20 max-w-5xl mx-auto grid md:grid-cols-2 gap-16 items-center">
         <div>
            <div className="text-emerald-400 text-sm font-bold uppercase tracking-widest mb-4">Template Library</div>
            <h1 className="font-serif text-4xl md:text-5xl font-bold mb-6">{data.h1}</h1>
            <p className="text-lg text-[#888890] mb-8 leading-relaxed">{data.intro}</p>
            <div className="flex flex-col gap-4">
                <AuthAwareLink unauthenticatedHref="/signup" className="text-center rounded-lg bg-emerald-500 px-8 py-4 font-bold text-[#0a0a14] hover:bg-emerald-400 transition-all hover:scale-105">
                  Use this Template via AI ✨
                </AuthAwareLink>
                <div className="text-center text-sm text-[#888890]">
                  Takes 60 seconds • No credit card required
                </div>
            </div>
         </div>
         
         <div className="relative">
             <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/20 to-transparent blur-3xl -z-10" />
             <div className="bg-[#12121e] border border-[#1e1e2e] rounded-xl shadow-2xl overflow-hidden flex flex-col">
                 {/* Mock UI of the Template Editor */}
                 <div className="h-10 border-b border-[#1e1e2e] bg-[#0a0a14] flex items-center px-4 gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500/20" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/20" />
                    <div className="w-3 h-3 rounded-full bg-green-500/20" />
                    <div className="ml-4 text-xs text-[#888890] font-mono">{params.slug}-proposal.pdf</div>
                 </div>
                 <div className="p-8 space-y-6 flex-1 min-h-[400px]">
                     <div className="h-4 w-3/4 bg-[#1e1e2e] rounded" />
                     <div className="h-4 w-full bg-[#1e1e2e] rounded" />
                     <div className="h-4 w-5/6 bg-[#1e1e2e] rounded" />
                     <div className="my-8">
                         <div className="h-10 w-full bg-emerald-500/10 border border-emerald-500/20 rounded mb-2" />
                         <div className="h-10 w-full bg-[#1e1e2e] rounded mb-2" />
                         <div className="h-10 w-full bg-[#1e1e2e] rounded" />
                     </div>
                     <div className="h-8 w-1/3 bg-gold/20 rounded mt-auto" />
                 </div>
             </div>
         </div>
      </section>

      <section className="px-6 py-20 bg-[#12121e] border-y border-[#1e1e2e]">
          <div className="max-w-4xl mx-auto">
             <h2 className="text-2xl font-bold mb-8">What&apos;s included in this template?</h2>
             <ul className="grid sm:grid-cols-2 gap-4">
               {data.sections.map((sec, i) => (
                  <li key={i} className="flex items-center gap-3 bg-[#0a0a14] p-4 rounded-lg border border-[#1e1e2e]">
                     <span className="text-emerald-400">✓</span> {sec}
                  </li>
               ))}
             </ul>

             <div className="mt-16">
                 <InternalLinks category="templates" />
             </div>
          </div>
      </section>

      <Footer />
    </main>
  );
}
