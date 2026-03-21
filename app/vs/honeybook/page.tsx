import { Metadata } from 'next';
import { ComparisonPage } from '@/components/seo/ComparisonPage';

export const metadata: Metadata = {
  title: 'Proposar vs HoneyBook — The Better HoneyBook Alternative for Proposals',
  description: 'Compare Proposar vs HoneyBook. Why pay $39/month for bloated CRM features? See why freelancers choose Proposar for lightning-fast AI proposals.',
  alternates: {
    canonical: 'https://proposar.com/vs/honeybook',
  },
};

export default function HoneyBookComparisonPage() {
  return (
    <ComparisonPage
      competitorName="HoneyBook"
      competitorSlug="honeybook"
      competitorPrice="$39/mo"
      heroHeading="Proposar vs HoneyBook — Which Is Right for You?"
      heroSubheading="HoneyBook is an all-in-one behemoth. Proposar is a surgical, AI-powered tool focused entirely on helping you win more clients with unbeatable proposals."
      openingParagraph="HoneyBook is a massive all-in-one platform built primarily for event professionals (like wedding planners) handling hundreds of minor invoices, scheduling, and messy pipelines. Because it tries to do everything, it's bloated, complex, and costs $39/month. If you already have tools for scheduling or accounting, and you just want the absolute best way to generate, send, and track business proposals, Proposar is the superior choice."
      features={[
        { name: "Starting Price", competitor: "$39 / month", proposar: "$19 / month", highlight: true },
        { name: "Primary Focus", competitor: "All-in-one CRM", proposar: "Proposals & Follow-ups", highlight: true },
        { name: "AI Proposal Writing", competitor: false, proposar: true, highlight: true },
        { name: "Time to Send", competitor: "Slow (Complex builder)", proposar: "60 seconds (AI)" },
        { name: "Learning Curve", competitor: "Steep (Days)", proposar: "Instant (Zero setup)", highlight: true },
        { name: "WhatsApp Sharing", competitor: false, proposar: true },
        { name: "Invoicing", competitor: true, proposar: false },
        { name: "Scheduling", competitor: true, proposar: false },
      ]}
      competitorPros={[
        "You want an all-in-one tool that handles your calendar, invoices, and CRM.",
        "You are an event professional (wedding photographer, planner).",
        "You don't mind spending days setting up your workflows.",
        "You are comfortable paying $39+ a month for features you might not use."
      ]}
      proposarPros={[
        "You only need a powerful tool to close deals and create proposals.",
        "You want AI to write the proposal text for you in seconds.",
        "You want a simple, beautiful interface with zero learning curve.",
        "You prefer paying $19/mo solely for the tools you use.",
        "You want smart, automated email follow-ups."
      ]}
      testimonials={[
        { quote: "HoneyBook felt like I was navigating an airplane dashboard. I literally just wanted to send a proposal. Proposar solved this perfectly.", author: "Emilia R.", role: "Brand Designer" },
        { quote: "I dragged my feet to switch because of all the embedded features in HoneyBook, but paying $400/year for bloated software hurt. Proposar is half the cost and the AI is vastly superior.", author: "Connor T.", role: "Web Flow Developer" },
        { quote: "HoneyBook's templates are okay, but Proposar's AI actually writes the exact strategy based on my notes. That alone is worth its weight in gold.", author: "Nia K.", role: "Social Media Manager" }
      ]}
    />
  );
}
