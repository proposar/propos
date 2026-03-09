import { StaticPageLayout } from "@/components/landing/StaticPageLayout";
import Link from "next/link";

import { Metadata } from "next";
import { generateMetadata } from "@/lib/seo";

export const metadata: Metadata = generateMetadata(
  "API Documentation — Proposar Developer Docs",
  "Integrate Proposar into your app. Complete API reference, webhooks, authentication, and code examples.",
  [
    "proposar api",
    "api documentation",
    "developer api",
    "webhook",
    "integration",
    "api reference",
    "proposar developers",
  ],
  "/api-docs"
);

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://proposar.io";

export default function ApiDocsPage() {
  return (
    <StaticPageLayout title="API Docs" description="Integrate Proposar with your tools.">
      <div className="space-y-10 text-[#c4c4cc] prose prose-invert max-w-none">
        <section id="zapier">
          <h2 className="text-xl font-semibold text-[#faf8f4] mb-3">Zapier Webhooks</h2>
          <p className="text-sm text-[#888890] mb-4">
            Use webhooks to automate your workflow when proposals are created, viewed, accepted, or declined.
          </p>
          <div className="rounded-lg border border-[#1e1e2e] bg-[#0a0a14] p-4 font-mono text-sm overflow-x-auto">
            <p className="text-gold mb-2"># Webhook events (coming soon)</p>
            <p className="text-[#888890]">proposal.created</p>
            <p className="text-[#888890]">proposal.viewed</p>
            <p className="text-[#888890]">proposal.accepted</p>
            <p className="text-[#888890]">proposal.declined</p>
            <p className="text-[#888890]">proposal.expired</p>
          </div>
          <p className="text-sm text-[#888890] mt-4">
            Zapier integration is in development. In the meantime, use the <strong className="text-[#faf8f4]">Share via Email</strong> or <strong className="text-[#faf8f4]">Copy Link</strong> options to share proposals. For custom integrations, contact us.
          </p>
          <Link href="/contact" className="inline-block mt-3 text-gold hover:underline text-sm">Request Zapier access →</Link>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-[#faf8f4] mb-3">REST API</h2>
          <p className="text-sm text-[#888890] mb-4">
            A full REST API for proposals, clients, and templates is planned. For now, the app uses authenticated endpoints for dashboard actions.
          </p>
          <div className="rounded-lg border border-[#1e1e2e] bg-[#0a0a14] p-4 font-mono text-sm">
            <p className="text-gold mb-2"># Example: Proposal share link</p>
            <p className="text-[#888890]">GET {APP_URL}/proposal/&lt;share_id&gt;</p>
            <p className="text-[#888890] mt-2"># Public proposal view (no auth)</p>
            <p className="text-[#888890]">GET {APP_URL}/api/proposal/&lt;share_id&gt;/pdf</p>
            <p className="text-[#888890] mt-2"># Download proposal PDF</p>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-[#faf8f4] mb-3">Email tracking</h2>
          <p className="text-sm text-[#888890]">
            When you send a proposal via email, we embed a 1×1 tracking pixel. When the client opens the email, we record the open and notify you. The proposal link also tracks views and scroll depth when the client opens it in a browser.
          </p>
        </section>
      </div>
    </StaticPageLayout>
  );
}
