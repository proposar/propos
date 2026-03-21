import { Metadata } from 'next';
import { IndustryPage } from '@/components/seo/IndustryPage';

export const metadata: Metadata = {
  title: 'Proposal Software for Marketing Agencies — Close Retainers Faster | Proposar',
  description: 'The best proposal software for digital marketing agencies. Generate convincing SEO, PPC, and social media retainers in 60 seconds with AI.',
  alternates: {
    canonical: 'https://proposar.com/for/marketing-agencies',
  },
};

export default function MarketingAgenciesPage() {
  return (
    <IndustryPage
      industry="Marketing"
      heroHeading="Proposal Software for Marketing Agencies"
      heroSubheading="Close high-ticket monthly retainers faster. Use AI to generate highly persuasive, ROI-focused marketing proposals in 60 seconds."
      problemStatement="Marketing agencies lose deals not because they lack skill, but because they lack speed. If a prospect talks to three agencies, the first one to send a professional, detailed proposal wins the account 70% of the time. But writing custom strategies for SEO, PPC, and social media takes hours."
      marketStats="Marketing agencies using auto-follow-up sequences increase their retainer close rate by up to 45% compared to manual chasing."
      solutions={[
        {
          title: "ROI-Focused AI Copywriting",
          desc: "Our AI doesn't just list services; it positions your marketing deliverables as high-return investments using proven direct-response frameworks.",
          icon: "📈"
        },
        {
          title: "Automated Chasing",
          desc: "Agency owners are too busy to chase leads. Proposar's smart follow-up sequences automatically nudge prospects until they sign.",
          icon: "🤖"
        },
        {
          title: "Retainer & Project Pricing",
          desc: "Easily display one-off setup fees alongside recurring monthly retainer packages in beautiful, transparent pricing tables.",
          icon: "💳"
        }
      ]}
      testimonials={[
        { quote: "Writing customized SEO and content proposals used to take me half a day per prospect. Proposar's AI nails the strategy and tone in 60 seconds. My agency has doubled its deal volume.", author: "Rachel Greene", role: "Founder, Peak Social" },
        { quote: "The automated follow-ups are the killer feature. We've closed three $5k/mo retainers this quarter purely from the system following up while I was asleep.", author: "Tom H.", role: "PPC Consultant" },
        { quote: "Being the first agency to get a proposal in the client's inbox has completely changed our win rate. Highly recommend for any lean marketing team.", author: "Elena V.", role: "Digital Growth Agency" }
      ]}
    />
  );
}
