import { StaticPageLayout } from "@/components/landing/StaticPageLayout";
import Link from "next/link";

import { Metadata } from "next";
import { generateMetadata } from "@/lib/seo";

export const metadata: Metadata = generateMetadata(
  "Privacy Policy — Proposar",
  "Our commitment to protecting your data. Learn how Proposar handles and protects your personal information and privacy.",
  [
    "proposar privacy policy",
    "data privacy",
    "proposar security",
    "gdpr",
    "user data protection",
  ],
  "/privacy"
);

export default function PrivacyPage() {
  return (
    <StaticPageLayout title="Privacy Policy" description="Last updated: March 2026.">
      <div className="space-y-8 text-[#c4c4cc] text-sm">
        <p className="text-[#888890]">
          We collect and use your information to provide and improve Proposar. We do not sell your personal data.
        </p>

        <section>
          <h2 className="text-base font-semibold text-[#faf8f4] mb-2">Data we collect</h2>
          <ul className="list-disc list-inside space-y-1 text-[#888890]">
            <li>Account info: email, name, business name, logo, branding</li>
            <li>Proposal content: client details, generated proposals, line items</li>
            <li>Usage data: proposal views, opens, acceptance/decline events</li>
            <li>Payment info: processed by Lemonsqueezy; we do not store card numbers</li>
          </ul>
        </section>

        <section>
          <h2 className="text-base font-semibold text-[#faf8f4] mb-2">How we use it</h2>
          <p className="text-[#888890]">
            To run the service, send transactional emails (proposal sent, viewed, accepted), and improve the product. We do not train AI models on your proposal content.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-[#faf8f4] mb-2">Data storage & security</h2>
          <p className="text-[#888890]">
            Data is stored with Supabase (hosted infrastructure). We use industry-standard encryption and follow security best practices.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-[#faf8f4] mb-2">Your rights (GDPR / CCPA)</h2>
          <p className="text-[#888890] mb-2">You can:</p>
          <ul className="list-disc list-inside space-y-1 text-[#888890]">
            <li><strong className="text-[#faf8f4]">Access & export:</strong> Download your data from Settings → Account → Export my data</li>
            <li><strong className="text-[#faf8f4]">Correct:</strong> Update profile and settings in the dashboard</li>
            <li><strong className="text-[#faf8f4]">Delete:</strong> Delete your account from Settings → Account</li>
          </ul>
          <p className="text-[#888890] mt-3">
            Contact us for any privacy requests: <Link href="/contact" className="text-gold hover:underline">Contact support</Link>
          </p>
        </section>
      </div>
    </StaticPageLayout>
  );
}
