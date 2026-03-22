import { Metadata } from 'next';
import { Navbar } from '@/components/landing/Navbar';
import { Pricing } from '@/components/landing/Pricing';
import { Footer } from '@/components/landing/Footer';

export const metadata: Metadata = {
  title: 'Pricing — Proposar AI Proposal Generator',
  description: 'Proposar pricing: Free, Starter, Pro, and Agency plans. Start at $19/month. 14-day free trial, no credit card required.',
  alternates: {
    canonical: 'https://proposar.com/pricing',
  },
};

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-[#0a0a14] pt-24 text-[#faf8f4]">
      <Navbar />
      <section id="pricing" className="py-20">
        <Pricing />
      </section>
      <Footer />
    </main>
  );
}
