import { Metadata } from 'next';
import { IndustryPage } from '@/components/seo/IndustryPage';

export const metadata: Metadata = {
  title: 'The Best Proposal Tool for Australian Freelancers | Proposar',
  description: 'AI-powered proposal generator explicitly built for Australian freelancers and independent agencies. Close lucrative local deals quickly in AUD.',
  alternates: {
    canonical: 'https://proposar.com/for/freelancers-australia',
  },
};

export default function FreelancersAustraliaPage() {
  return (
    <IndustryPage
      industry="Australian Freelancers"
      heroHeading="The Smartest Proposal Tool for Australian Freelancers"
      heroSubheading="From Sydney to Perth, thousands of independent Aussies are ditching messy PDFs for AI-generated proposals that close deals up to 40% faster."
      problemStatement="Australian clients value transparency and straightforward communication. Dense, jargon-filled PDF proposals fail to convert. You need a fast, visually premium way to outline scope in clear language—without spending your entire weekend writing it."
      marketStats="The Australian freelance economy is growing at twice the rate of the traditional workforce. Speed to market is the #1 competitive advantage."
      solutions={[
        {
          title: "Native AUD Formats",
          desc: "Present pricing natively in Australian Dollars (AUD/$) with precise GST breakdowns so local clients know exactly what they're paying.",
          icon: "🇦🇺"
        },
        {
          title: "Stunning Digital Delivery",
          desc: "Instead of clogged email attachments, send a sleek, trackable web link that clients can view and accept instantly from their phones.",
          icon: "⚡"
        },
        {
          title: "Direct Response AI",
          desc: "The AI generator understands modern, direct-response copywriting—cutting the fluff and getting straight to the value, which Aussie business owners respect.",
          icon: "🎯"
        }
      ]}
      testimonials={[
        { quote: "Before Proposar, I lost three major web design projects because I took four days to send the quote. Now, I generate and send it within an hour of the discovery call. I'm winning locally.", author: "Jackson H.", role: "Web Designer, Melbourne" },
        { quote: "It calculates my GST automatically in the pricing table. Simple feature, but it saves me a massive accounting headache at the end of every quarter.", author: "Mia L.", role: "Strategy Consultant, Sydney" },
        { quote: "I can run my entire freelance pipeline from my phone while at the beach. The WhatsApp integration is ridiculous.", author: "Flynn W.", role: "Videographer, Gold Coast" }
      ]}
    />
  );
}
