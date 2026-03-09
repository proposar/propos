import { StaticPageLayout } from "@/components/landing/StaticPageLayout";

export const metadata = { title: "About", description: "About Proposar." };

export default function AboutPage() {
  return (
    <StaticPageLayout title="About Proposar" description="The proposal tool built for freelancers who want to win.">
      <div className="space-y-8">
        {/* Founder Story */}
        <section>
          <h2 className="text-2xl font-serif font-bold text-[#faf8f4] mb-4">Why We Built Proposar</h2>
          <p className="text-[#c4c4cc] mb-4 leading-relaxed">
            Proposar was born from a frustration. Freelancers spend 10+ hours on each proposal, using Google Docs, PandaDoc, or even Word. By the time they finish, the client has already hired someone faster.
          </p>
          <p className="text-[#c4c4cc] mb-4 leading-relaxed">
            We saw 1.57 billion freelancers globally losing deals they should win. Not because their work wasn&apos;t good—but because they didn&apos;t have the tools to present it professionally in seconds.
          </p>
          <p className="text-[#c4c4cc] leading-relaxed">
            So we built Proposar. An AI-powered tool that generates beautiful, professional proposals in 60 seconds. With tracking. With contracts. With invoices. Everything you need to close deals faster.
          </p>
        </section>

        {/* Mission */}
        <section>
          <h2 className="text-2xl font-serif font-bold text-[#faf8f4] mb-4">Our Mission</h2>
          <p className="text-[#c4c4cc] leading-relaxed">
            To remove the friction between great freelance work and closed deals. We believe every freelancer deserves professional tools that make them look like an agency. At a freelancer&apos;s price.
          </p>
        </section>

        {/* What We Believe */}
        <section>
          <h2 className="text-2xl font-serif font-bold text-[#faf8f4] mb-4">What We Believe</h2>
          <ul className="space-y-3 text-[#c4c4cc]">
            <li className="flex gap-3">
              <span className="text-gold">✓</span>
              <span><strong>Freelancers are the future of work.</strong> Remote, global, asynchronous. They deserve world-class tools.</span>
            </li>
            <li className="flex gap-3">
              <span className="text-gold">✓</span>
              <span><strong>Speed matters.</strong> Generate your proposal in 60 seconds, not 10 hours. Close deals faster than your competition.</span>
            </li>
            <li className="flex gap-3">
              <span className="text-gold">✓</span>
              <span><strong>Price should be fair.</strong> $19/month, not $99/month. Tools built for 1B freelancers should be affordable.</span>
            </li>
            <li className="flex gap-3">
              <span className="text-gold">✓</span>
              <span><strong>Simplicity wins.</strong> No enterprise bloat. Just proposals, contracts, invoices, tracking. Done.</span>
            </li>
            <li className="flex gap-3">
              <span className="text-gold">✓</span>
              <span><strong>Your brand matters.</strong> Every PDF should look like YOU, not Proposar. Dark mode, custom colors, your logo.</span>
            </li>
          </ul>
        </section>

        {/* By the Numbers */}
        <section>
          <h2 className="text-2xl font-serif font-bold text-[#faf8f4] mb-4">By The Numbers</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            <div>
              <p className="text-3xl font-bold text-gold mb-2">1.57B</p>
              <p className="text-[#888890] text-sm">Freelancers globally</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-gold mb-2">55%</p>
              <p className="text-[#888890] text-sm">Proposals that fail</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-gold mb-2">60s</p>
              <p className="text-[#888890] text-sm">To create a proposal</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-gold mb-2">10x</p>
              <p className="text-[#888890] text-sm">Cheaper than competitors</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-gold mb-2">45 countries</p>
              <p className="text-[#888890] text-sm">Using Proposar</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-gold mb-2">100%</p>
              <p className="text-[#888890] text-sm">Bootstrapped</p>
            </div>
          </div>
        </section>

        {/* Culture */}
        <section>
          <h2 className="text-2xl font-serif font-bold text-[#faf8f4] mb-4">How We Work</h2>
          <ul className="space-y-3 text-[#c4c4cc]">
            <li><strong className="text-[#faf8f4]">Obsessed with users.</strong> Every feature comes from real freelancer feedback, not guessing.</li>
            <li><strong className="text-[#faf8f4]">Ship fast, iterate faster.</strong> We deploy multiple times per week. Your feedback = our roadmap.</li>
            <li><strong className="text-[#faf8f4]">Default transparency.</strong> You&apos;ll know exactly what we&apos;re building and why.</li>
            <li><strong className="text-[#faf8f4]">Sustainable growth.</strong> We&apos;re bootstrapped and profitable by design. No pressure to pivot.</li>
          </ul>
        </section>
      </div>
    </StaticPageLayout>
  );
}
