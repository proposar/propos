import { StaticPageLayout } from "@/components/landing/StaticPageLayout";
import Link from "next/link";

import { Metadata } from "next";
import { generateMetadata } from "@/lib/seo";

export const metadata: Metadata = generateMetadata(
  "Terms of Service — Proposar",
  "Read our terms of service. Understand the rules and policies that govern your use of Proposar.",
  [
    "proposar terms of service",
    "terms and conditions",
    "user agreement",
    "proposar terms",
  ],
  "/terms"
);

export default function TermsPage() {
  return (
    <StaticPageLayout title="Terms of Service" description="By using Proposar, you agree to these terms.">
      <div className="space-y-8 text-[#c4c4cc] text-sm">
        <p className="text-[#888890]">
          By signing up and using Proposar, you agree to use the service in compliance with these terms.
        </p>

        <section>
          <h2 className="text-base font-semibold text-[#faf8f4] mb-2">Service</h2>
          <p className="text-[#888890]">
            Proposar provides AI-powered proposal generation, shareable links, tracking, and PDF export. We reserve the right to modify or discontinue features with reasonable notice.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-[#faf8f4] mb-2">Acceptable use</h2>
          <p className="text-[#888890]">
            You may not use Proposar for illegal purposes, to harass others, abuse the platform, or violate any applicable laws. We may suspend or terminate accounts that violate these terms.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-[#faf8f4] mb-2">Billing</h2>
          <p className="text-[#888890]">
            Subscription fees are charged per your plan (Starter, Pro, Agency). Refunds follow our billing policy. You may cancel anytime from Settings → Billing.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-[#faf8f4] mb-2">Intellectual property</h2>
          <p className="text-[#888890]">
            You retain ownership of your proposal content. You grant us a license to process and display it as needed to provide the service.
          </p>
        </section>

        <p className="text-[#888890] pt-4">
          Questions? <Link href="/contact" className="text-gold hover:underline">Contact us</Link>
        </p>
      </div>
    </StaticPageLayout>
  );
}
