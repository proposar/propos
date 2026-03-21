import { Metadata } from 'next';
import { ComparisonPage } from '@/components/seo/ComparisonPage';

export const metadata: Metadata = {
  title: 'Proposar vs Better Proposals — The Ultimate Better Proposals Alternative',
  description: 'Compare Proposar vs Better Proposals. See why agencies are migrating to Proposar to leverage AI proposal generation and automated client follow-ups.',
  alternates: {
    canonical: 'https://proposar.com/vs/better-proposals',
  },
};

export default function BetterProposalsComparisonPage() {
  return (
    <ComparisonPage
      competitorName="Better Proposals"
      competitorSlug="better-proposals"
      competitorPrice="$19/mo"
      heroHeading="Proposar vs Better Proposals — An Honest Comparison"
      heroSubheading="Both tools help you send proposals. But only one uses AI to actually write the proposal for you and automatically follows up until they sign."
      openingParagraph="Better Proposals is a widely used tool that revolutionized web-based proposals years ago. They have great templates. But having a template still requires you to sit down and write the content. Proposar represents the next generation of proposal software: AI that understands your project and writes a highly persuasive, customized proposal in 60 seconds."
      features={[
        { name: "Starting Price", competitor: "$19 / user / month", proposar: "$19 / month (Flat)" },
        { name: "Content Generation", competitor: "Static Templates", proposar: "Dynamic AI Generation", highlight: true },
        { name: "Smart Auto Follow-ups", competitor: "No (Manual)", proposar: "Yes (Automated)", highlight: true },
        { name: "WhatsApp Sharing", competitor: false, proposar: true },
        { name: "Proposal Analytics", competitor: true, proposar: true },
        { name: "Digital Signatures", competitor: true, proposar: true },
        { name: "Setup Speed", competitor: "1-2 hours", proposar: "60 seconds", highlight: true },
        { name: "PDF Export", competitor: true, proposar: true },
      ]}
      competitorPros={[
        "You prefer to write every word of your proposal yourself.",
        "You want access to their specific marketplace of templates.",
        "You don't mind manually following up with clients via email.",
        "You are highly focused on complex payment integrations via Stripe."
      ]}
      proposarPros={[
        "You want AI to cure your writer's block and draft the proposal.",
        "You want a modern, faster UI built for 2025.",
        "You want the system to automatically email follow-ups to clients.",
        "You frequently communicate with clients via WhatsApp.",
        "You want to close deals faster with less administrative work."
      ]}
      testimonials={[
        { quote: "Better Proposals was good, but filling out templates still felt like a chore. Proposar's AI generator completely flipped my workflow. It's magic.", author: "Kevin B.", role: "Web Developer" },
        { quote: "I switched from Better Proposals specifically for the auto follow-ups. Clients inevitably forget to sign, and having Proposar chase them for me is amazing.", author: "Elena M.", role: "Marketing Consultant" },
        { quote: "The UI in Proposar is just much cleaner and faster than Better Proposals. Plus, being able to generate a full proposal from my phone is a lifesaver.", author: "Ryan S.", role: "Video Producer" }
      ]}
    />
  );
}
