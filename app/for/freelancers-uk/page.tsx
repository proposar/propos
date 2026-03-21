import { Metadata } from 'next';
import { IndustryPage } from '@/components/seo/IndustryPage';

export const metadata: Metadata = {
  title: 'The Best Proposal Tool for UK Freelancers & Agencies | Proposar',
  description: 'AI proposal software tailored for freelancers and agencies in the UK. Generate professional, IR35-friendly business proposals in 60 seconds.',
  alternates: {
    canonical: 'https://proposar.com/for/freelancers-uk',
  },
};

export default function FreelancersUKPage() {
  return (
    <IndustryPage
      industry="UK Freelancers"
      heroHeading="The Best Proposal Tool for UK Freelancers"
      heroSubheading="Trusted by independent professionals from London to Edinburgh. Generate persuasive, beautifully structured proposals in 60 seconds."
      problemStatement="The UK freelance market is highly sophisticated. Clients expect formal scope documentation, clear deliverables, and precise pricing. Sending a loose email quote often results in clients questioning your professionalism or demanding lower day rates."
      marketStats="Over 4.2 million self-employed professionals in the UK rely on digital tools to secure B2B contracts."
      solutions={[
        {
          title: "Clear Scope Definitions",
          desc: "Proposar explicitly outlines deliverables and timelines, helping you clarify 'Outside IR35' project-based boundaries for UK clients.",
          icon: "🇬🇧"
        },
        {
          title: "GBP Pricing Structures",
          desc: "Structure your quotes in GBP (£) with clear tax/VAT breakdowns, whether you use day rates, daily retainers, or fixed-price milestones.",
          icon: "💷"
        },
        {
          title: "European GDPR Compliant",
          desc: "Proposar respects data privacy, ensuring your proposal tracking and client analytics meet UK and European GDPR standards.",
          icon: "🔒"
        }
      ]}
      testimonials={[
        { quote: "I operate outside IR35, so my SOWs need to be incredibly tight and project-based. Proposar's AI outlines the deliverables perfectly without me spending hours on admin.", author: "Oliver S.", role: "IT Consultant, London" },
        { quote: "The ability to just send a link via WhatsApp to UK clients is brilliant. And the read-receipts tell me exactly when to follow up.", author: "Chloe M.", role: "Brand Storyteller, Manchester" },
        { quote: "It makes my tiny one-person operation look like a fully staffed creative agency. The ROI is undeniable.", author: "Liam K.", role: "Video Producer, Bristol" }
      ]}
    />
  );
}
