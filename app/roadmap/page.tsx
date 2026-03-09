import { StaticPageLayout } from "@/components/landing/StaticPageLayout";

import { Metadata } from "next";
import { generateMetadata } from "@/lib/seo";

export const metadata: Metadata = generateMetadata(
  "Proposar Roadmap — What's Coming Next",
  "See what we're building next at Proposar. Upcoming features, improvements, and our vision for the future.",
  [
    "proposar roadmap",
    "upcoming features",
    "product roadmap",
    "proposar features",
    "proposal generator roadmap",
  ],
  "/roadmap"
);

export default function RoadmapPage() {
  return (
    <StaticPageLayout title="Roadmap" description="What we're building next.">
      <div className="space-y-8">
        <section>
          <p className="text-[#c4c4cc] mb-6 leading-relaxed">
            This roadmap is real and shaped by your feedback. We ship features every week. This is what we&apos;re focused on for Q2-Q4 2026.
          </p>
          <p className="text-[#888890] text-sm mb-6">Last updated: March 2026 | Check back monthly for updates</p>
        </section>

        {/* Q2 2026 */}
        <section>
          <h2 className="text-2xl font-serif font-bold text-[#faf8f4] mb-4">Q2 2026 (Now - June)</h2>
          <div className="space-y-3">
            <div className="border-l-2 border-gold pl-4 py-2">
              <p className="text-[#faf8f4] font-semibold mb-1">✓ Launch Checklist</p>
              <p className="text-[#c4c4cc]">Help center, live support chatbot, analytics dashboard, mobile optimization</p>
            </div>
            <div className="border-l-2 border-gold pl-4 py-2">
              <p className="text-[#faf8f4] font-semibold mb-1">✓ Advanced Analytics</p>
              <p className="text-[#c4c4cc]">Proposal acceptance trends, client response time insights, template performance</p>
            </div>
            <div className="border-l-2 border-gold pl-4 py-2">
              <p className="text-[#faf8f4] font-semibold mb-1">✓ Invoice Payment Tracking</p>
              <p className="text-[#c4c4cc]">See which invoices are paid, late, or pending. Automatic reminders to clients.</p>
            </div>
            <div className="border-l-2 border-gold pl-4 py-2">
              <p className="text-[#faf8f4] font-semibold mb-1">✓ Proposal Versioning</p>
              <p className="text-[#c4c4cc]">Track changes. Show client the last 3 versions. Easy comparisons.</p>
            </div>
          </div>
        </section>

        {/* Q3 2026 */}
        <section>
          <h2 className="text-2xl font-serif font-bold text-[#faf8f4] mb-4">Q3 2026 (July - Sept)</h2>
          <div className="space-y-3">
            <div className="border-l-2 border-gold/60 pl-4 py-2">
              <p className="text-[#faf8f4] font-semibold mb-1">🔄 Zapier & Make Integration</p>
              <p className="text-[#c4c4cc]">Connect Proposar to 5000+ apps. Auto-create proposals from form submissions.</p>
            </div>
            <div className="border-l-2 border-gold/60 pl-4 py-2">
              <p className="text-[#faf8f4] font-semibold mb-1">👥 Team Collaboration (Pro Plan)</p>
              <p className="text-[#c4c4cc]">Invite team members. Share templates. See team proposals, contracts, invoices.</p>
            </div>
            <div className="border-l-2 border-gold/60 pl-4 py-2">
              <p className="text-[#faf8f4] font-semibold mb-1">📧 Email Sequences</p>
              <p className="text-[#c4c4cc]">Auto follow-up cadence. &quot;Day 2: send reminder. Day 7: send discount offer.&quot;</p>
            </div>
            <div className="border-l-2 border-gold/60 pl-4 py-2">
              <p className="text-[#faf8f4] font-semibold mb-1">🌍 International Expansion</p>
              <p className="text-[#c4c4cc]">Localization for Spanish, German, French, Portuguese, Japanese markets.</p>
            </div>
            <div className="border-l-2 border-gold/60 pl-4 py-2">
              <p className="text-[#faf8f4] font-semibold mb-1">🤖 Custom AI Models</p>
              <p className="text-[#c4c4cc]">Agency owners train AI on their past winning proposals. Personalized generation.</p>
            </div>
          </div>
        </section>

        {/* Q4 2026 */}
        <section>
          <h2 className="text-2xl font-serif font-bold text-[#faf8f4] mb-4">Q4 2026 (Oct - Dec)</h2>
          <div className="space-y-3">
            <div className="border-l-2 border-gold/40 pl-4 py-2">
              <p className="text-[#faf8f4] font-semibold mb-1">📱 Native Mobile Apps</p>
              <p className="text-[#c4c4cc]">iOS & Android apps. Sign proposals, accept contracts on the go.</p>
            </div>
            <div className="border-l-2 border-gold/40 pl-4 py-2">
              <p className="text-[#faf8f4] font-semibold mb-1">💬 AI Chat for Freelancers</p>
              <p className="text-[#c4c4cc]">Ask AI: &quot;Create proposal for web design project, $5K budget.&quot; Done.</p>
            </div>
            <div className="border-l-2 border-gold/40 pl-4 py-2">
              <p className="text-[#faf8f4] font-semibold mb-1">🎓 Education Hub</p>
              <p className="text-[#c4c4cc]">Free courses. &quot;How to Price Your Freelance Work&quot;, &quot;Proposal Psychology 101&quot;.</p>
            </div>
            <div className="border-l-2 border-gold/40 pl-4 py-2">
              <p className="text-[#faf8f4] font-semibold mb-1">🏆 Agency Tier (Enterprise)</p>
              <p className="text-[#c4c4cc]">For teams. Custom integrations, dedicated support, SSO, unlimited proposals.</p>
            </div>
          </div>
        </section>

        {/* Future */}
        <section className="bg-[#12121e] border border-[#1e1e2e] rounded-lg p-6">
          <h3 className="text-xl font-semibold text-[#faf8f4] mb-3">Future Possibilities (2027+)</h3>
          <ul className="space-y-2 text-[#c4c4cc] text-sm">
            <li>✦ Proposal marketplace (sell/buy templates)</li>
            <li>✦ Escrow payment integration for high-value projects</li>
            <li>✦ CRM integration (HubSpot, Pipedrive sync)</li>
            <li>✦ Proposal analytics API for agencies</li>
            <li>✦ White-label solution</li>
          </ul>
        </section>

        {/* Feedback */}
        <section className="bg-gold/10 border border-gold/30 rounded-lg p-6">
          <p className="text-[#faf8f4] font-semibold mb-3">What should we build next?</p>
          <p className="text-[#c4c4cc] mb-4">
            Our roadmap depends on your feedback. What problem are you facing today? Email{" "}
            <a href="mailto:hello@proposar.com" className="text-gold hover:underline">hello@proposar.com</a> or reply to any email from us.
          </p>
        </section>
      </div>
    </StaticPageLayout>
  );
}
