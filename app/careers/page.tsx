import { StaticPageLayout } from "@/components/landing/StaticPageLayout";
import Link from "next/link";

export const metadata = { title: "Careers", description: "Join the Proposar team." };

export default function CareersPage() {
  return (
    <StaticPageLayout title="Careers" description="Join the Proposar mission.">
      <div className="space-y-8">
        {/* Headline */}
        <section>
          <p className="text-[#c4c4cc] text-lg mb-6 leading-relaxed">
            We&apos;re building the future of freelance proposals. If you believe 1.57 billion freelancers deserve better tools—not tools built for enterprises—we want you on the team.
          </p>
        </section>

        {/* Company Stage */}
        <section>
          <h2 className="text-2xl font-serif font-bold text-[#faf8f4] mb-4">Where We Are</h2>
          <div className="space-y-4">
            <div className="bg-[#12121e] border border-[#1e1e2e] rounded-lg p-6">
              <p className="text-[#faf8f4] font-semibold mb-2">🚀 Early Stage (Pre-Launch)</p>
              <p className="text-[#888890]">We just shipped the product. Zero users paid yet. This is where the real work begins.</p>
            </div>
            <div className="bg-[#12121e] border border-[#1e1e2e] rounded-lg p-6">
              <p className="text-[#faf8f4] font-semibold mb-2">💰 Bootstrapped & Profitable</p>
              <p className="text-[#888890]">We&apos;re not burning VC money. We reinvest every dollar users pay us. Your work has direct impact on business health.</p>
            </div>
            <div className="bg-[#12121e] border border-[#1e1e2e] rounded-lg p-6">
              <p className="text-[#faf8f4] font-semibold mb-2">🌍 Remote First, Global</p>
              <p className="text-[#888890]">We work async, ship fast, and don&apos;t believe in office politics. Core hours: 9 AM ET - 6 PM ET. Beyond that, async.</p>
            </div>
          </div>
        </section>

        {/* Open Roles */}
        <section>
          <h2 className="text-2xl font-serif font-bold text-[#faf8f4] mb-4">Open Roles</h2>
          <div className="bg-[#12121e] border border-[#1e1e2e] rounded-lg p-6 mb-6">
            <p className="text-[#888890] mb-4">Right now, we&apos;re not hiring. We&apos;re focused on product-market fit.</p>
            <p className="text-[#c4c4cc] mb-4">
              But if you&apos;re interested in joining us for Year 2, we&apos;ll be hiring for:
            </p>
            <ul className="space-y-2 text-[#c4c4cc]">
              <li>• <strong>Growth Lead</strong> — Content, SEO, paid ads (Q3 2026)</li>
              <li>• <strong>Full-Stack Engineer</strong> — Next.js, TypeScript, Supabase (Q3 2026)</li>
              <li>• <strong>Customer Success</strong> — Help users win more deals (Q4 2026)</li>
            </ul>
          </div>
        </section>

        {/* What We Look For */}
        <section>
          <h2 className="text-2xl font-serif font-bold text-[#faf8f4] mb-4">Qualities We Value</h2>
          <ul className="space-y-3 text-[#c4c4cc]">
            <li className="flex gap-3">
              <span className="text-gold">→</span>
              <span><strong>Owner mindset.</strong> You think like a co-founder, not an employee. You own outcomes, not tasks.</span>
            </li>
            <li className="flex gap-3">
              <span className="text-gold">→</span>
              <span><strong>Fast learner.</strong> We move quick. You embrace uncertain, learn publicly, iterate.</span>
            </li>
            <li className="flex gap-3">
              <span className="text-gold">→</span>
              <span><strong>User obsessed.</strong> You talk to freelancers. You understand their pain. You build what they ask for.</span>
            </li>
            <li className="flex gap-3">
              <span className="text-gold">→</span>
              <span><strong>Pragmatic, not perfect.</strong> Done &gt; perfect. We ship MVPs, collect feedback, iterate.</span>
            </li>
            <li className="flex gap-3">
              <span className="text-gold">→</span>
              <span><strong>Default transparency.</strong> We over-communicate. No politics. No surprises.</span>
            </li>
          </ul>
        </section>

        {/* Interest */}
        <section className="bg-gold/10 border border-gold/30 rounded-lg p-6">
          <p className="text-[#faf8f4] mb-3">👀 Interested in joining us later?</p>
          <p className="text-[#c4c4cc] mb-4">
            Drop us a line at <a href="mailto:hello@proposar.com" className="text-gold hover:underline">hello@proposar.com</a> with your background and what problem you&apos;d want to solve at Proposar.
          </p>
          <p className="text-[#888890] text-sm">We&apos;re building in public. Expect an update Q3 2026.</p>
        </section>
      </div>
    </StaticPageLayout>
  );
}
