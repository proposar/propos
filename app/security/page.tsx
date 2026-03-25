import { StaticPageLayout } from "@/components/landing/StaticPageLayout";
import { Metadata } from "next";
import { generateMetadata } from "@/lib/seo";
import { Shield, Lock, FileCheck, Globe } from "lucide-react";

export const metadata: Metadata = generateMetadata(
  "Security & Compliance — Proposar",
  "Learn how Proposar protects your data with enterprise-grade security, GDPR compliance, and certified infrastructure.",
  [
    "proposar security",
    "gdpr compliance",
    "soc2 compliance",
    "pci dss payments",
    "data protection",
  ],
  "/security"
);

export default function SecurityPage() {
  return (
    <StaticPageLayout 
      title="Security & Compliance" 
      description="Enterprise-grade protection for the global freelance economy."
    >
      <div className="space-y-12">
        {/* Intro */}
        <section className="text-[#888890] leading-relaxed">
          <p>
            At Proposar, we understand that your proposals and client data are your most valuable assets. 
            That&apos;s why we build security into every layer of our platform, from our choice of world-class 
            infrastructure providers to our internal data handling policies.
          </p>
        </section>

        {/* Security Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* GDPR */}
          <div className="p-8 rounded-2xl bg-[#12121e] border border-[#1e1e2e] hover:border-gold/30 transition-all group">
            <div className="w-12 h-12 rounded-xl bg-gold/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Globe className="w-6 h-6 text-gold" />
            </div>
            <h3 className="text-xl font-serif font-bold text-[#faf8f4] mb-4">GDPR Ready</h3>
            <p className="text-[#888890] text-sm leading-relaxed">
              We are fully committed to GDPR compliance. We provide data sovereignty for our users 
              across the UK, EU, and beyond. You have full control over your data, including 
              easy export and deletion options.
            </p>
          </div>

          {/* SOC2 */}
          <div className="p-8 rounded-2xl bg-[#12121e] border border-[#1e1e2e] hover:border-gold/30 transition-all group">
            <div className="w-12 h-12 rounded-xl bg-gold/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Shield className="w-6 h-6 text-gold" />
            </div>
            <h3 className="text-xl font-serif font-bold text-[#faf8f4] mb-4">SOC2 Type II</h3>
            <p className="text-[#888890] text-sm leading-relaxed">
              Our core infrastructure is hosted on Supabase (running on AWS), which is SOC2 Type II 
              certified. This ensures your data is stored in facilities that meet the highest 
              standards for security, availability, and confidentiality.
            </p>
          </div>

          {/* PCI-DSS */}
          <div className="p-8 rounded-2xl bg-[#12121e] border border-[#1e1e2e] hover:border-gold/30 transition-all group">
            <div className="w-12 h-12 rounded-xl bg-gold/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Lock className="w-6 h-6 text-gold" />
            </div>
            <h3 className="text-xl font-serif font-bold text-[#faf8f4] mb-4">PCI-DSS Level 1</h3>
            <p className="text-[#888890] text-sm leading-relaxed">
              Payments are processed through Lemonsqueezy and Stripe, both of which are PCI Level 1 
              Service Providers. Proposar never stores your credit card information on our servers.
            </p>
          </div>

          {/* Compliance */}
          <div className="p-8 rounded-2xl bg-[#12121e] border border-[#1e1e2e] hover:border-gold/30 transition-all group">
            <div className="w-12 h-12 rounded-xl bg-gold/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <FileCheck className="w-6 h-6 text-gold" />
            </div>
            <h3 className="text-xl font-serif font-bold text-[#faf8f4] mb-4">Encryption</h3>
            <p className="text-[#888890] text-sm leading-relaxed">
              All data is encrypted in transit using TLS 1.3 and at rest using AES-256. 
              Your proposal content is strictly private and is never used to train our AI models.
            </p>
          </div>
        </div>

        {/* Footer Note */}
        <section className="pt-8 border-t border-[#1e1e2e] text-center">
          <p className="text-[#888890] text-sm mb-4">
            Have questions about our security practices?
          </p>
          <a 
            href="/contact" 
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gold text-[#0a0a14] font-bold hover:shadow-[0_0_20px_rgba(217,119,6,0.3)] transition-all"
          >
            Contact Security Team
          </a>
        </section>
      </div>
    </StaticPageLayout>
  );
}
