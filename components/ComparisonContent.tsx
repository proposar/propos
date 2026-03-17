'use client';

import Link from 'next/link';
import { Check, X, ChevronRight, Zap, DollarSign, Users, Lightbulb } from 'lucide-react';

const competitors = [
  {
    name: 'Proposar',
    category: 'Built for Freelancers',
    logo: '📄',
    description: "The A-to-Z lifecycle: AI Proposals, WhatsApp Sharing, Smart Contracts, and Anti-Ghosting protection.",
    color: "border-gold bg-gold/5",
    highlighted: true,
  },
  {
    name: 'PandaDoc',
    category: 'Enterprise Document Automation',
    logo: '🐼',
    description: 'Full document automation suite (overkill for solo operators)',
    price: '$65+/month',
  },
  {
    name: 'Proposify',
    category: 'Proposal Software',
    logo: '✍️',
    description: 'Proposal-only, manual creation, slower workflows',
    price: '$99+/month',
  },
  {
    name: 'HubSpot',
    category: 'Full CRM Platform',
    logo: '🎯',
    description: 'Complex CRM system designed for large sales teams',
    price: '$50+/month (Starter)',
  },
  {
    name: 'Stripe Invoicing',
    category: 'Payment Processing Only',
    logo: '💳',
    description: 'Invoicing add-on; no proposals or contracts',
    price: 'Variable',
  },
];

const features = [
  {
    feature: 'AI Proposal Generation (60 sec)',
    proposar: true,
    pandadoc: false,
    proposify: false,
    hubspot: false,
    stripe: false,
  },
  {
    feature: 'Contracts & E-Signature',
    proposar: true,
    pandadoc: true,
    proposify: false,
    hubspot: true,
    stripe: false,
  },
  {
    feature: 'Invoice Generation',
    proposar: true,
    pandadoc: true,
    proposify: false,
    hubspot: true,
    stripe: true,
  },
  {
    feature: 'Proposal Templates',
    proposar: true,
    pandadoc: true,
    proposify: true,
    hubspot: true,
    stripe: false,
  },
  {
    feature: 'Real-time Tracking',
    proposar: true,
    pandadoc: true,
    proposify: true,
    hubspot: true,
    stripe: false,
  },
  {
    feature: 'Custom Branding',
    proposar: true,
    pandadoc: true,
    proposify: true,
    hubspot: true,
    stripe: false,
  },
  {
    feature: 'Analytics Dashboard',
    proposar: true,
    pandadoc: true,
    proposify: true,
    hubspot: true,
    stripe: false,
  },
  {
    feature: 'Affordably Priced',
    proposar: true,
    pandadoc: false,
    proposify: false,
    hubspot: false,
    stripe: false,
  },
  {
    feature: 'Simple, Intuitive UI',
    proposar: true,
    pandadoc: false,
    proposify: true,
    hubspot: false,
    stripe: true,
  },
  {
    feature: 'Anti-Ghosting Protection',
    proposar: true,
    pandadoc: false,
    proposify: false,
    hubspot: false,
    stripe: false,
  },
  {
    feature: 'Internal Team Strategy (AI)',
    proposar: true,
    pandadoc: false,
    proposify: true,
    hubspot: false,
    stripe: true,
  },
];

export function ComparisonContent() {
  return (
    <div className="min-h-screen bg-[#0a0a14] text-[#c4c4cc]">
      {/* Hero Section */}
      <div className="border-b border-[#1e1e2e] bg-gradient-to-b from-[#0a0a14] via-[#12121e] to-[#0a0a14] px-4 py-12 sm:px-6 sm:py-20">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-4 inline-flex rounded-lg bg-gold/20 px-3 py-1">
            <span className="text-sm font-medium text-gold">Built for Freelancers</span>
          </div>
          <h1 className="mb-4 text-4xl font-bold text-[#faf8f4] sm:text-5xl">
            Why Proposar Wins
          </h1>
          <p className="mb-8 text-lg text-[#888890]">
            Compare Proposar with other proposal and invoicing tools. See why 1000+ freelancers and agencies choose Proposar.
          </p>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="px-4 py-12 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5 mb-12">
            {competitors.map((comp) => (
              <div
                key={comp.name}
                className={`rounded-lg border p-4 ${
                  comp.highlighted
                    ? 'border-gold bg-gold/10 ring-2 ring-gold/50'
                    : 'border-[#1e1e2e] bg-[#12121e]'
                }`}
              >
                <div className="text-3xl mb-2">{comp.logo}</div>
                <h3
                  className={`font-semibold mb-1 ${
                    comp.highlighted ? 'text-gold' : 'text-[#faf8f4]'
                  }`}
                >
                  {comp.name}
                </h3>
                <p className="text-xs text-[#888890] mb-2">{comp.category}</p>
                {comp.price && <p className="text-sm font-medium text-[#faf8f4]">{comp.price}</p>}
              </div>
            ))}
          </div>

          {/* Key Differentiators */}
          <div className="mb-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-lg border border-[#1e1e2e] bg-[#12121e] p-6">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-gold/20">
                <Zap className="h-5 w-5 text-gold" />
              </div>
              <h3 className="mb-2 font-semibold text-[#faf8f4]">60-Second AI Generation</h3>
              <p className="text-sm text-[#888890]">
                Generate complete, client-ready proposals with Claude AI. No manual writing.
              </p>
            </div>

            <div className="rounded-lg border border-[#1e1e2e] bg-[#12121e] p-6">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-gold/20">
                <DollarSign className="h-5 w-5 text-gold" />
              </div>
              <h3 className="mb-2 font-semibold text-[#faf8f4]">10x Cheaper</h3>
              <p className="text-sm text-[#888890]">
                Start free. Upgrade to Pro for $49/mo. No hidden fees. No enterprise pricing.
              </p>
            </div>

            <div className="rounded-lg border border-[#1e1e2e] bg-[#12121e] p-6">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-gold/20">
                <Users className="h-5 w-5 text-gold" />
              </div>
              <h3 className="mb-2 font-semibold text-[#faf8f4]">Built for Solo Operators</h3>
              <p className="text-sm text-[#888890]">
                Designed for freelancers & small agencies. No unnecessary complexity.
              </p>
            </div>

            <div className="rounded-lg border border-[#1e1e2e] bg-[#12121e] p-6">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-gold/20">
                <Lightbulb className="h-5 w-5 text-gold" />
              </div>
              <h3 className="mb-2 font-semibold text-[#faf8f4]">All-in-One Solution</h3>
              <p className="text-sm text-[#888890]">
                Proposals + Contracts + Invoices. Everything you need in one platform.
              </p>
            </div>
          </div>

          {/* Detailed Comparison Table */}
          <div className="mb-12 overflow-x-auto rounded-lg border border-[#1e1e2e]">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#1e1e2e] bg-[#12121e]">
                  <th className="px-6 py-4 text-left font-semibold text-[#faf8f4]">Feature</th>
                  <th className="px-6 py-4 text-center font-semibold text-gold">Proposar</th>
                  <th className="px-6 py-4 text-center font-semibold text-[#888890]">PandaDoc</th>
                  <th className="px-6 py-4 text-center font-semibold text-[#888890]">Proposify</th>
                  <th className="px-6 py-4 text-center font-semibold text-[#888890]">HubSpot</th>
                  <th className="px-6 py-4 text-center font-semibold text-[#888890]">Stripe</th>
                </tr>
              </thead>
              <tbody>
                {features.map((row, idx) => (
                  <tr
                    key={idx}
                    className={`border-b border-[#1e1e2e] ${
                      idx % 2 === 0 ? 'bg-[#0a0a14]/30' : 'bg-[#12121e]/30'
                    }`}
                  >
                    <td className="px-6 py-4 font-medium text-[#faf8f4]">{row.feature}</td>
                    <td className="px-6 py-4 text-center">
                      {row.proposar ? (
                        <Check className="mx-auto h-5 w-5 text-gold" />
                      ) : (
                        <X className="mx-auto h-5 w-5 text-[#666672]" />
                      )}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {row.pandadoc ? (
                        <Check className="mx-auto h-5 w-5 text-[#10b981]" />
                      ) : (
                        <X className="mx-auto h-5 w-5 text-[#666672]" />
                      )}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {row.proposify ? (
                        <Check className="mx-auto h-5 w-5 text-[#10b981]" />
                      ) : (
                        <X className="mx-auto h-5 w-5 text-[#666672]" />
                      )}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {row.hubspot ? (
                        <Check className="mx-auto h-5 w-5 text-[#10b981]" />
                      ) : (
                        <X className="mx-auto h-5 w-5 text-[#666672]" />
                      )}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {row.stripe ? (
                        <Check className="mx-auto h-5 w-5 text-[#10b981]" />
                      ) : (
                        <X className="mx-auto h-5 w-5 text-[#666672]" />
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Head-to-Head */}
          <div className="mb-12 space-y-8">
            <div className="rounded-lg border border-gold/30 bg-gold/5 p-8">
              <h3 className="mb-4 text-xl font-bold text-gold">Proposar vs PandaDoc</h3>
              <div className="space-y-3 text-sm text-[#c4c4cc]">
                <p>
                  <strong className="text-[#faf8f4]">PandaDoc</strong> is an enterprise document
                  automation platform ($65+/mo). It&apos;s built for large teams managing 1000s of
                  documents. For freelancers? Overkill and expensive.
                </p>
                <p>
                  <strong className="text-gold">Proposar</strong> is built specifically for
                  freelancers and small agencies. Start free, upgrade to $19-$199/mo. Get AI
                  generation + contracts + invoices. No bloat.
                </p>
              </div>
            </div>

            <div className="rounded-lg border border-[#1e1e2e] bg-[#12121e] p-8">
              <h3 className="mb-4 text-xl font-bold text-[#faf8f4]">Proposar vs Proposify</h3>
              <div className="space-y-3 text-sm text-[#c4c4cc]">
                <p>
                  <strong className="text-[#faf8f4]">Proposify</strong> is a solid proposal
                  tool ($99+/mo), but it requires manual creation. You write each proposal from
                  scratch. No AI generation. Slower workflows.
                </p>
                <p>
                  <strong className="text-gold">Proposar</strong> generates full proposals in 60
                  seconds with AI. Plus, we throw in contracts and invoicing. 5x faster, 2x
                  cheaper, and more features.
                </p>
              </div>
            </div>

            <div className="rounded-lg border border-[#1e1e2e] bg-[#12121e] p-8">
              <h3 className="mb-4 text-xl font-bold text-[#faf8f4]">Proposar vs HubSpot</h3>
              <div className="space-y-3 text-sm text-[#c4c4cc]">
                <p>
                  <strong className="text-[#faf8f4]">HubSpot</strong> is a CRM platform designed
                  for large sales teams. It&apos;s powerful but complex. For solo freelancers, it&apos;s
                  overwhelming.
                </p>
                <p>
                  <strong className="text-gold">Proposar</strong> is intentionally simple.
                  Proposals, contracts, invoices. That&apos;s it. No CRM noise. No unnecessary features.
                  Just what freelancers need.
                </p>
              </div>
            </div>

            <div className="rounded-lg border border-[#1e1e2e] bg-[#12121e] p-8">
              <h3 className="mb-4 text-xl font-bold text-[#faf8f4]">Proposar vs Stripe</h3>
              <div className="space-y-3 text-sm text-[#c4c4cc]">
                <p>
                  <strong className="text-[#faf8f4]">Stripe</strong> is a payments platform.
                  Invoicing is an add-on feature. No proposals. No contracts. Just billing.
                </p>
                <p>
                  <strong className="text-gold">Proposar</strong> is a complete proposal-to-payment workflow.
                  Generate proposals, create contracts, send invoices, track everything. Stripe
                  handles payments; Proposar handles the sales process.
                </p>
              </div>
            </div>
          </div>

          {/* Pricing Comparison */}
          <div className="mb-12 rounded-lg border border-[#1e1e2e] bg-[#12121e] p-8">
            <h3 className="mb-6 text-2xl font-bold text-[#faf8f4]">Pricing Breakdown</h3>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
              <div>
                <h4 className="mb-3 font-semibold text-gold">Proposar</h4>
                <ul className="space-y-2 text-sm text-[#c4c4cc]">
                  <li>Free: 3 proposals/mo</li>
                  <li>Starter: $19/mo (10/mo)</li>
                  <li>Pro: $29/mo (unlimited)</li>
                  <li>Agency: $79+ (teams)</li>
                </ul>
              </div>
              <div>
                <h4 className="mb-3 font-semibold text-[#faf8f4]">PandaDoc</h4>
                <ul className="space-y-2 text-sm text-[#c4c4cc]">
                  <li>Standard: $65/mo</li>
                  <li>Business: $115/mo</li>
                  <li>Enterprise: Custom</li>
                </ul>
              </div>
              <div>
                <h4 className="mb-3 font-semibold text-[#faf8f4]">Proposify</h4>
                <ul className="space-y-2 text-sm text-[#c4c4cc]">
                  <li>Professional: $99/mo</li>
                  <li>Business: $239/mo</li>
                  <li>Plus: $699/mo</li>
                </ul>
              </div>
              <div>
                <h4 className="mb-3 font-semibold text-[#faf8f4]">HubSpot</h4>
                <ul className="space-y-2 text-sm text-[#c4c4cc]">
                  <li>Starter: $50/mo</li>
                  <li>Professional: $800/mo</li>
                  <li>Enterprise: Custom</li>
                </ul>
              </div>
              <div>
                <h4 className="mb-3 font-semibold text-[#faf8f4]">Stripe</h4>
                <ul className="space-y-2 text-sm text-[#c4c4cc]">
                  <li>Free (invoicing</li>
                  <li>2.9% + 30¢ per</li>
                  <li>payment)</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="border-t border-[#1e1e2e] bg-gradient-to-b from-[#12121e] to-[#0a0a14] px-4 py-12 sm:px-6">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="mb-4 text-3xl font-bold text-[#faf8f4]">
            Ready to switch to Proposar?
          </h2>
          <p className="mb-8 text-lg text-[#888890]">
            Start free. No credit card required. Generate your first proposal in 60 seconds.
          </p>
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/signup"
              className="rounded-lg bg-gold px-8 py-3 font-semibold text-[#0a0a14] transition-all hover:bg-[#e8c76a]"
            >
              Start for Free
            </Link>
            <Link
              href="/help"
              className="rounded-lg border border-[#1e1e2e] bg-[#12121e] px-8 py-3 font-semibold text-gold transition-all hover:border-gold/50"
            >
              See Help Center
              <ChevronRight className="ml-2 -mr-1 inline h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
