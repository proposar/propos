import { Metadata } from "next";
import { faqSchema } from "@/lib/seo";
import { Navbar } from "@/components/landing/Navbar";
import { AnnouncementBar } from "@/components/landing/AnnouncementBar";
import { Hero } from "@/components/landing/Hero";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { ProblemSolution } from "@/components/landing/ProblemSolution";
import { Features } from "@/components/landing/Features";
import { Pricing } from "@/components/landing/Pricing";
import { Testimonials } from "@/components/landing/Testimonials";
import { FAQ } from "@/components/landing/FAQ";
import { Footer } from "@/components/landing/Footer";
import { FloatingCTA } from "@/components/landing/FloatingCTA";

export const metadata: Metadata = {
  title: "Proposar — AI Proposal Generator for Freelancers & Agencies",
  description: "Generate winning client proposals in 60 seconds with AI. Trusted by 2,000+ freelancers. Track opens, close faster, earn more.",
  keywords: [
    "proposal generator",
    "AI proposal generator",
    "freelance proposal software",
    "best proposal software",
    "proposal writing tool",
    "proposal automation",
    "freelancer tools",
    "agency software",
    "proposal template",
    "client proposal",
  ],
};

export default function HomePage() {
  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <Navbar />
      <AnnouncementBar />
      <Hero />
      <HowItWorks />
      <ProblemSolution />
      <Features />
      <Pricing />
      <Testimonials />
      <FAQ />
      <Footer />
      <FloatingCTA />
    </main>
  );
}
