import { niches } from "@/lib/niches";
import { notFound } from "next/navigation";
import { Hero } from "@/components/landing/Hero";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { ProblemSolution } from "@/components/landing/ProblemSolution";
import { Features } from "@/components/landing/Features";
import { Pricing } from "@/components/landing/Pricing";
import { Testimonials } from "@/components/landing/Testimonials";
import { FAQ } from "@/components/landing/FAQ";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { generateMetadata as seoMetadata } from "@/lib/seo";
import { Metadata } from "next";

interface PageProps {
  params: { slug: string };
}

export async function generateStaticParams() {
  return niches.map((niche) => ({
    slug: niche.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const niche = niches.find((n) => n.slug === params.slug);
  if (!niche) return {};

  return seoMetadata(
    niche.title,
    niche.description,
    niche.keywords,
    `/solutions/${niche.slug}`
  );
}

export default function SolutionPage({ params }: PageProps) {
  const niche = niches.find((n) => n.slug === params.slug);
  if (!niche) notFound();

  return (
    <main>
      <Navbar />
      {/* Industry-Specific Hero Overlay or Modification logic could go here */}
      {/* For now, we reuse Hero with niche data if Hero allowed prop pass, 
          but usually we'd want a specialized Hero or data-driven Hero.
          I'll keep it simple for now to ensure landing structure is consistent. */}
      <Hero 
        title={niche.heroTitle}
        subtitle={niche.heroSub}
      />
      <div className="bg-[#0a0a14] py-8 text-center border-y border-[#1e1e2e]">
        <p className="text-gold font-semibold uppercase tracking-widest text-sm">
          A-to-Z Workflow for {niche.industry} 专业人士
        </p>
      </div>
      <HowItWorks />
      <ProblemSolution />
      <Features />
      <Pricing />
      <Testimonials />
      <FAQ />
      <Footer />
    </main>
  );
}
