import { Metadata } from 'next';
import { IndustryPage } from '@/components/seo/IndustryPage';

export const metadata: Metadata = {
  title: 'The Best Proposal Tool for US Freelancers | Proposar',
  description: 'AI proposal software trusted by thousands of freelancers across the United States. Perfect for independent contractors, agencies, and Upwork professionals.',
  alternates: {
    canonical: 'https://proposar.com/for/freelancers-usa',
  },
};

export default function FreelancersUSAPage() {
  return (
    <IndustryPage
      industry="US Freelancers"
      heroHeading="The Best Proposal Tool for US Freelancers"
      heroSubheading="Join thousands of independent contractors across the United States. Generate persuasive, high-converting proposals in 60 seconds with AI."
      problemStatement="With over 60 million freelancers in the US economy, the competition on platforms like Upwork and Fiverr is fierce. If your proposal doesn't instantly communicate professionalism, trust, and clear ROI, US clients will simply hire someone else."
      marketStats="US freelancers lose an estimated $2.4 billion annually in unpaid time spent writing unaccepted business proposals."
      solutions={[
        {
          title: "Win Against Agencies",
          desc: "Our AI generates proposals that look and read like they came from a premium Manhattan agency, allowing you to charge higher rates.",
          icon: "🦅"
        },
        {
          title: "USD Default Pricing",
          desc: "Present your pricing in native USD formats with clear milestone breakdowns, retainer models, or hourly fee structures.",
          icon: "💵"
        },
        {
          title: "Time Zone Independent",
          desc: "Let Proposar's automated follow-ups chase leads on the East Coast while you sleep on the West Coast.",
          icon: "⏰"
        }
      ]}
      testimonials={[
        { quote: "I compete for federal state contracts and corporate B2B projects in New York. The proposals Proposar generates feel expensive and formal, exactly what US clients expect.", author: "James T.", role: "B2B Consultant, NYC" },
        { quote: "Upwork clients usually ghost if you just send a plain message. I attach a Proposar link, they see the analytics, and my close rate in the US market has skyrocketed.", author: "Sarah W.", role: "Freelance Developer, Austin" },
        { quote: "The best ROI of any SaaS tool I pay for. It literally pays for its annual subscription with the first proposal I send every month.", author: "Mike B.", role: "Marketing Agency, Chicago" }
      ]}
    />
  );
}
