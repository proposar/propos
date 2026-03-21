import React from 'react';
import Link from 'next/link';
import { AuthAwareLink } from '@/components/auth/AuthAwareLink';
import { FAQ } from '@/components/landing/FAQ';
import { Navbar } from '@/components/landing/Navbar';
import { Footer } from '@/components/landing/Footer';

interface BlogPostLayoutProps {
  title: string;
  description: string;
  publishDate: string;
  readTime: string;
  author: string;
  slug: string;
  children: React.ReactNode;
}

export function BlogPostLayout({
  title,
  description,
  publishDate,
  readTime,
  author,
  slug,
  children
}: BlogPostLayoutProps) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description: description,
    image: "https://proposar.com/og-image.png",
    author: {
      "@type": "Organization",
      name: author,
      url: "https://proposar.com"
    },
    publisher: {
      "@type": "Organization",
      name: "Proposar",
      logo: {
        "@type": "ImageObject",
        url: "https://proposar.com/logo.png"
      }
    },
    datePublished: publishDate,
  };

  return (
    <main className="min-h-screen bg-[#0a0a14] pt-24 text-[#faf8f4] font-sans">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar />

      <article className="max-w-3xl mx-auto px-6 py-20">
        <header className="mb-12 text-center border-b border-[#1e1e2e] pb-12">
           <div className="flex items-center justify-center gap-4 text-sm text-[#888890] mb-6 font-medium">
              <span>{publishDate}</span>
              <span>•</span>
              <span>{readTime}</span>
              <span>•</span>
              <span>By {author}</span>
           </div>
           <h1 className="font-serif text-4xl md:text-6xl font-bold bg-gradient-to-r from-[#faf8f4] to-gold bg-clip-text text-transparent mb-6 leading-tight">
              {title}
           </h1>
        </header>

        {/* Article Body */}
        <div className="prose prose-invert prose-lg max-w-none prose-h2:font-serif prose-h2:text-3xl prose-h2:text-gold prose-h2:mt-12 prose-h2:mb-6 prose-p:text-[#d1d1d6] prose-p:leading-relaxed prose-a:text-emerald-400 prose-a:no-underline hover:prose-a:underline prose-strong:text-[#faf8f4]">
           {children}
        </div>

        {/* Author Bio Section */}
        <div className="mt-20 p-8 border border-[#1e1e2e] rounded-2xl bg-[#12121e] flex items-center gap-6">
           <div className="w-16 h-16 rounded-full bg-gold/20 flex items-center justify-center text-gold text-2xl font-bold">P</div>
           <div>
              <h3 className="text-xl font-bold text-[#faf8f4]">About the Proposar Team</h3>
              <p className="text-[#888890] mt-2">We build AI tools that help freelancers and agencies close more deals, faster. Stop writing proposals manually and let AI do the heavy lifting.</p>
           </div>
        </div>
      </article>

      {/* Internal Linking / Related */}
      <section className="bg-[#12121e] border-y border-[#1e1e2e] py-20 px-6">
         <div className="max-w-4xl mx-auto text-center">
            <h2 className="font-serif text-3xl font-bold mb-8">Ready to create proposals that win?</h2>
            <p className="text-xl text-[#888890] mb-10">Join 2,000+ top freelancers generating professional proposals in 60 seconds.</p>
            <AuthAwareLink unauthenticatedHref="/signup" className="inline-block rounded-lg bg-gold px-12 py-5 font-bold text-[#0a0a14] hover:bg-[#e8c76a] transition-all hover:scale-105 text-lg shadow-[0_0_40px_rgba(212,175,71,0.3)]">
              Try Proposar Free →
            </AuthAwareLink>
         </div>
      </section>

      <Footer />
    </main>
  );
}

export function InlineCTA() {
  return (
    <div className="my-10 p-6 border-l-4 border-gold bg-gold/5 rounded-r-lg not-prose">
      <h3 className="text-xl font-bold text-[#faf8f4] mb-2">Create proposals like this in 60 seconds</h3>
      <p className="text-[#888890] mb-4">Stop writing from scratch. Let Proposar AI draft your entire proposal.</p>
      <AuthAwareLink unauthenticatedHref="/signup" className="text-gold font-bold hover:underline">
        Try Proposar Free →
      </AuthAwareLink>
    </div>
  );
}
