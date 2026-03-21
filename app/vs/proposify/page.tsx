import { Metadata } from 'next';
import { ComparisonPage } from '@/components/seo/ComparisonPage';

export const metadata: Metadata = {
  title: 'Proposar vs Proposify — The Better Proposify Alternative for Freelancers',
  description: 'Compare Proposar and Proposify. See why 1,000+ freelancers switched from Proposify to Proposar for AI writing, simpler UX, and better pricing. Free trial.',
  alternates: {
    canonical: 'https://proposar.com/vs/proposify',
  },
};

export default function ProposifyComparisonPage() {
  return (
    <ComparisonPage
      competitorName="Proposify"
      competitorSlug="proposify"
      competitorPrice="$49/mo"
      heroHeading="Proposar vs Proposify — Which Is Right for You?"
      heroSubheading="Proposify is a great tool for large sales teams. But if you're a freelancer or small agency looking for an AI-powered alternative that doesn't cost $49 a month, you're in the right place."
      openingParagraph="Proposify is a solid, legacy tool built for large B2B sales teams who need complex roles, permissions, and Salesforce integrations. If you're a solo freelancer or a small agency looking for AI-powered proposals with built-in follow-ups that act like a digital assistant, Proposar was built specifically for you."
      features={[
        { name: "Starting Price", competitor: "$49 / user / month", proposar: "$19 / month (Flat)", highlight: true },
        { name: "Content Generation", competitor: "Templates only", proposar: "Full AI Writing in 60s", highlight: true },
        { name: "Setup Time", competitor: "Weeks of onboarding", proposar: "5 minutes" },
        { name: "WhatsApp Sharing", competitor: false, proposar: true },
        { name: "Smart Auto Follow-ups", competitor: "Manual only", proposar: "Automated sequences", highlight: true },
        { name: "Built for Freelancers", competitor: "Built for Sales Teams", proposar: "Yes", highlight: true },
        { name: "PDF Quality", competitor: "Known formatting issues", proposar: "Pixel perfect" },
        { name: "Proposal Tracking", competitor: true, proposar: true },
      ]}
      competitorPros={[
        "You have a sales team of 10+ people.",
        "You need complex approval workflows and strict roles/permissions.",
        "You require deep Salesforce integration.",
        "You have a dedicated designer to manage their complex editor."
      ]}
      proposarPros={[
        "You want AI to actually write the proposal for you.",
        "You're a freelancer who wants to spend less time on admin.",
        "You want automated follow-ups so you never have to chase clients.",
        "You prefer a clean, fast, mobile-friendly interface.",
        "You want to save $360+ per year."
      ]}
      testimonials={[
        { quote: "I used Proposify for a year but the editor was incredibly clunky. Switched to Proposar and now AI writes the proposals for me. It's wildly faster.", author: "Michael C.", role: "Web Designer" },
        { quote: "Proposify's $49/mo price tag is too steep for a solo freelancer. Proposar gives me better templates, tracking, and AI writing for less than half the cost.", author: "Amanda T.", role: "Copywriter" },
        { quote: "The WhatsApp integration in Proposar is a game-changer. My clients actually read them instantly compared to the Proposify email links that went to spam.", author: "David R.", role: "Consultant" }
      ]}
    />
  );
}
