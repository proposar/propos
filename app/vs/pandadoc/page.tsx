import { Metadata } from 'next';
import { ComparisonPage } from '@/components/seo/ComparisonPage';

export const metadata: Metadata = {
  title: 'Proposar vs PandaDoc — The Better PandaDoc Alternative for Freelancers',
  description: 'Compare Proposar and PandaDoc. Discover why freelancers are switching to Proposar to avoid hidden fees and get AI-powered proposal writing.',
  alternates: {
    canonical: 'https://proposar.com/vs/pandadoc',
  },
};

export default function PandaDocComparisonPage() {
  return (
    <ComparisonPage
      competitorName="PandaDoc"
      competitorSlug="pandadoc"
      competitorPrice="$35/mo"
      heroHeading="Proposar vs PandaDoc — Which Is Right for You?"
      heroSubheading="PandaDoc is an enterprise document machine. Proposar is a lightning-fast proposal generator built specifically for freelancers and independent agencies to win more clients."
      openingParagraph="PandaDoc is a massive platform designed for HR departments and enterprise sales teams handling thousands of contracts. Because of this, it's bloated, expensive, and complex to set up. If you just need a beautiful way to send proposals, track opens, and get paid without the enterprise headache, Proposar is the better alternative."
      features={[
        { name: "Starting Price", competitor: "$35 / user / month", proposar: "$19 / month (Flat)", highlight: true },
        { name: "Target User", competitor: "HR & Enterprise Sales", proposar: "Freelancers & Agencies" },
        { name: "AI Proposal Writing", competitor: false, proposar: true, highlight: true },
        { name: "Document Focus", competitor: "All documents (HR, NDA, etc)", proposar: "Laser-focused on Proposals" },
        { name: "Smart Auto Follow-ups", competitor: "Manual tracking", proposar: "Automated sequences", highlight: true },
        { name: "Hidden Fees", competitor: "Yes (API, bulk send extra)", proposar: "No hidden fees", highlight: true },
        { name: "E-Signatures", competitor: true, proposar: true },
        { name: "Native WhatsApp", competitor: false, proposar: true },
      ]}
      competitorPros={[
        "You are an enterprise company with 500+ employees.",
        "You need to send HR onboarding documents and NDAs.",
        "You need deep integrations with enterprise CRMs like Dynamics.",
        "You have the budget for a complex implementation process."
      ]}
      proposarPros={[
        "You only care about sending winning proposals to clients.",
        "You want an AI assistant to write the proposal content for you.",
        "You want a flat, affordable pricing model with no surprise limits.",
        "You want to share proposals via WhatsApp right from your phone.",
        "You want automated follow-ups to chase clients for you."
      ]}
      testimonials={[
        { quote: "PandaDoc was just too much tool for what I needed. I spent hours configuring it. With Proposar, I was sending my first AI-written proposal in 5 minutes.", author: "Sarah W.", role: "Brand Strategist" },
        { quote: "I kept hitting hidden limits on PandaDoc's 'affordable' tier. Switched to Proposar for the flat pricing and discovered the AI generation is incredible.", author: "Tom H.", role: "SEO Agency Owner" },
        { quote: "The automated follow-ups in Proposar have saved me so many lost deals. I don't have to remember to check PandaDoc and manually email clients anymore.", author: "Jessica L.", role: "Freelance Photographer" }
      ]}
    />
  );
}
