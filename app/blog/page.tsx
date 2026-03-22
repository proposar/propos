import { Metadata } from 'next';
import Link from 'next/link';
import { Navbar } from '@/components/landing/Navbar';
import { Footer } from '@/components/landing/Footer';
import { getAllBlogPosts } from '@/lib/blog';

export const metadata: Metadata = {
  title: 'Proposar Blog | Resources for Freelancers & Agencies',
  description: 'Expert advice on writing proposals, pricing freelance projects, closing deals, and scaling your independent business.',
  alternates: {
    canonical: 'https://proposar.com/blog',
  },
};

function getCategory(tags: string[]): string {
  for (const tag of tags) {
    const lower = tag.toLowerCase();
    if (lower.includes('proposal')) return 'Proposal Tips';
    if (lower.includes('freelance') || lower.includes('business')) return 'Freelance Business';
    if (lower.includes('client') || lower.includes('sales')) return 'Client Management';
    if (lower.includes('ai')) return 'AI Tools';
  }
  return 'Proposal Tips';
}

export default async function BlogIndexPage() {
  const posts = await getAllBlogPosts();
  return (
    <main className="min-h-screen bg-[#0a0a14] pt-24 text-[#faf8f4]">
      <Navbar />

      <section className="px-6 py-20 max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="font-serif text-5xl md:text-6xl font-bold bg-gradient-to-r from-gold to-[#faf8f4] bg-clip-text text-transparent mb-6">
            The Proposar Blog
          </h1>
          <p className="text-xl text-[#888890] max-w-2xl mx-auto">
            Expert advice, templates, and strategies to help freelancers and agencies write better proposals, close more deals, and scale.
          </p>
        </div>

        {/* Categories (Static UI for layout purposes) */}
        <div className="flex flex-wrap gap-4 justify-center mb-16">
          {["All", "Proposal Tips", "Freelance Business", "Client Management", "AI Tools"].map(cat => (
             <button key={cat} className={`px-6 py-2 rounded-full border border-[#1e1e2e] ${cat === "All" ? "bg-gold text-[#0a0a14] font-bold" : "bg-[#12121e] text-[#888890] hover:bg-[#1e1e2e]"} transition-colors`}>
               {cat}
             </button>
          ))}
        </div>

        {/* Blog Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
             <Link key={post.slug} href={`/blog/${post.slug}`} className="group flex flex-col rounded-2xl border border-[#1e1e2e] bg-[#12121e] overflow-hidden hover:border-gold/30 transition-all">
                <div className="h-48 bg-[#1e1e2e] relative overflow-hidden flex items-center justify-center">
                   <div className="absolute inset-0 bg-gradient-to-br from-[#12121e] to-[#0a0a14]" />
                   <div className="z-10 text-gold/20 group-hover:scale-110 transition-transform duration-500">
                     <svg className="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                     </svg>
                   </div>
                </div>
                <div className="p-6 flex flex-col flex-1">
                   <div className="text-xs font-bold text-gold uppercase tracking-wider mb-3">
                     {getCategory(post.tags)}
                   </div>
                   <h2 className="text-xl font-bold text-[#faf8f4] mb-4 group-hover:text-gold transition-colors">
                     {post.title}
                   </h2>
                   <div className="mt-auto flex items-center justify-between text-sm text-[#888890]">
                      <span>By {post.author || 'Proposar Team'}</span>
                      <span className="flex items-center gap-1 group-hover:text-gold transition-colors">Read article →</span>
                   </div>
                </div>
             </Link>
          ))}
        </div>
      </section>

      <Footer />
    </main>
  );
}
