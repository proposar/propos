import { Metadata } from 'next';
import { ComparisonPage } from '@/components/seo/ComparisonPage';

export const metadata: Metadata = {
  title: 'Proposar vs Bonsai — AI Proposal Generator Alternative for Freelancers',
  description: 'Compare Proposar and Bonsai. Bonsai is great for contracts and invoicing — but Proposar delivers AI proposal writing, open tracking, and smarter follow-ups. Free trial.',
  alternates: {
    canonical: 'https://proposar.com/vs/bonsai',
  },
};

export default function BonsaiComparisonPage() {
  return (
    <ComparisonPage
      competitorName="Bonsai"
      competitorSlug="bonsai"
      competitorPrice="$25/mo"
      heroHeading="Proposar vs Bonsai — Which Is Right for You?"
      heroSubheading="Bonsai excels at contracts and invoicing. Proposar excels at AI-written proposals, real-time tracking, and automated follow-ups. Choose based on your biggest pain point."
      openingParagraph="Bonsai is a popular all-in-one freelance platform that bundles proposals, contracts, invoicing, and time tracking. It's a solid choice for freelancers who want everything in one place. However, Bonsai's proposal builder is template-based — you fill in the blanks yourself. Proposar uses AI to actually write your proposal content in 60 seconds, includes real-time open tracking and scroll-depth analytics, and sends automated follow-up sequences. If proposal quality and close rates matter most, Proposar is the stronger choice."
      features={[
        { name: "Starting Price", competitor: "$25 / month", proposar: "$19 / month", highlight: true },
        { name: "AI Proposal Writing", competitor: "Templates only", proposar: "Full AI in 60 seconds", highlight: true },
        { name: "Proposal Open Tracking", competitor: "Basic", proposar: "Real-time + scroll depth", highlight: true },
        { name: "Smart Follow-ups", competitor: "Manual", proposar: "Automated sequences", highlight: true },
        { name: "Contracts & Invoicing", competitor: true, proposar: "Contracts via AI" },
        { name: "WhatsApp Sharing", competitor: false, proposar: true },
        { name: "Time Tracking", competitor: true, proposar: false },
        { name: "Built for Freelancers", competitor: true, proposar: true },
      ]}
      competitorPros={[
        "You need contracts, invoicing, and time tracking in one tool.",
        "You prefer filling in pre-built templates over AI generation.",
        "You want a single monthly subscription for your entire freelance stack.",
        "You don't mind spending 30+ minutes per proposal."
      ]}
      proposarPros={[
        "You want AI to write your proposal content for you.",
        "You need to know when clients open and read your proposals.",
        "You want automated follow-ups so you never have to chase.",
        "Proposal quality and win rate are your top priority.",
        "You want to save time on every proposal you send."
      ]}
      testimonials={[
        { quote: "Bonsai was good for contracts, but I was still writing proposals from scratch. Proposar's AI cut my proposal time from an hour to under 2 minutes.", author: "Jordan P.", role: "Marketing Consultant" },
        { quote: "The tracking in Proposar is incredible. I know exactly when my client opens the proposal and which section they're reading. Bonsai never gave me that.", author: "Sandra L.", role: "Web Designer" },
        { quote: "I kept Bonsai for invoicing but switched to Proposar for proposals. The AI and follow-up automation alone justified the switch.", author: "Marcus K.", role: "SEO Specialist" }
      ]}
    />
  );
}
