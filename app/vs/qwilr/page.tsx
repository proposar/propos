import { Metadata } from 'next';
import { ComparisonPage } from '@/components/seo/ComparisonPage';

export const metadata: Metadata = {
  title: 'Proposar vs Qwilr — The Best Qwilr Alternative for Freelancers',
  description: 'Compare Proposar vs Qwilr. See why freelancers save $400/year and get better PDFs and AI-powered writing by switching to Proposar.',
  alternates: {
    canonical: 'https://proposar.com/vs/qwilr',
  },
};

export default function QwilrComparisonPage() {
  return (
    <ComparisonPage
      competitorName="Qwilr"
      competitorSlug="qwilr"
      competitorPrice="$35/mo"
      heroHeading="Proposar vs Qwilr — The Better Alternative"
      heroSubheading="Qwilr builds web pages. Proposar uses AI to craft wildly persuasive proposals that actually close deals. See why modern freelancers are making the switch."
      openingParagraph="Qwilr is essentially a mini website builder for proposals. It's highly visual, but comes at a steep price ($35 to $59 per user) and requires intense design effort to look good. Furthermore, Qwilr's PDF export is famously flawed because translating web pages to PDFs is messy. Proposar offers a cleaner, AI-driven experience with flawless PDF generation at half the price."
      features={[
        { name: "Starting Price", competitor: "$35 / user / month", proposar: "$19 / month (Flat)", highlight: true },
        { name: "Format", competitor: "Web pages", proposar: "Clean documents", highlight: true },
        { name: "AI Proposal Writing", competitor: false, proposar: true, highlight: true },
        { name: "Flawless PDF Export", competitor: "Has known issues", proposar: "Pixel perfect", highlight: true },
        { name: "Design Effort", competitor: "High (Requires design skill)", proposar: "Zero (Auto-styled)" },
        { name: "Smart Auto Follow-ups", competitor: "No (Manual integration needed)", proposar: "Yes (Native feature)" },
        { name: "WhatsApp Sharing", competitor: false, proposar: true },
        { name: "Digital Signatures", competitor: true, proposar: true },
      ]}
      competitorPros={[
        "You want your proposal to look exactly like a complex, scrolling website.",
        "You have a dedicated designer to build and maintain your templates.",
        "You don't care about the quality of the downloaded PDF version.",
        "You have the budget for $35 to $59 per user per month."
      ]}
      proposarPros={[
        "You want a professional proposal generated immediately via AI.",
        "You want perfect PDF exports for clients who require standard documentation.",
        "You want automated follow-ups to close deals faster.",
        "You want an affordable, flat-rate pricing plan.",
        "You prefer a clean, document-style interface over a website builder."
      ]}
      testimonials={[
        { quote: "Qwilr looks cool out of the box, but customizing it took me hours of tweaking margins and columns. Proposar's AI generated a beautiful doc instantly without any design headache.", author: "Jason F.", role: "Consultant" },
        { quote: "My enterprise clients require PDF copies of proposals for their accounting teams. Qwilr's PDFs were constantly broken or cut off. Switched to Proposar for perfect PDFs.", author: "Alicia P.", role: "B2B Marketer" },
        { quote: "The price difference alone is worth it, but getting AI generation on top is the icing on the cake. Saving $400 a year was a no-brainer.", author: "Marcus D.", role: "Freelance Developer" }
      ]}
    />
  );
}
