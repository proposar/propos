import { Metadata } from "next";
import { faqSchema } from "@/lib/seo";
import { Navbar } from "@/components/landing/Navbar";
import { AnnouncementBar } from "@/components/landing/AnnouncementBar";
import { Hero } from "@/components/landing/Hero";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { ProblemSolution } from "@/components/landing/ProblemSolution";
import { Features } from "@/components/landing/Features";
import { Pricing } from "@/components/landing/Pricing";
import { AppSumoComingSoon } from "@/components/landing/AppSumoComingSoon";
import { Testimonials } from "@/components/landing/Testimonials";
import { FAQ } from "@/components/landing/FAQ";
import { Footer } from "@/components/landing/Footer";
import { FloatingCTA } from "@/components/landing/FloatingCTA";
import { LanguageProvider } from "@/contexts/LanguageContext";

export const metadata: Metadata = {
  title: "Proposar — AI Proposal Generator for Freelancers & Agencies",
  description: "The A to Z workflow for freelancers. Generate AI proposals in 60s, share via WhatsApp/Email, close with legal contracts, and get paid. Stop being ghosted.",
  keywords: [
    "anti-ghosting for freelancers",
    "WhatsApp proposal follow-up",
    "A to Z freelance workflow",
    "AI proposal generator",
    "freelance contract software",
    "agency closing tool",
    "proposal to invoice automation",
    "secure freelance payments",
  ],
};

export default function HomePage() {
  return (
    <LanguageProvider>
      <main>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
        <Navbar />
        <AnnouncementBar />
        <Hero />
        <HowItWorks />
        <ProblemSolution />
        <Features />
        <AppSumoComingSoon />
        <Pricing />
        <Testimonials />
        <FAQ />
        <Footer />
        <FloatingCTA />
      </main>
    </LanguageProvider>
  );
}
