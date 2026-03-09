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

export default function HomePage() {
  return (
    <main>
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
