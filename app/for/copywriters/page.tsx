import { Metadata } from 'next';
import { IndustryPage } from '@/components/seo/IndustryPage';

export const metadata: Metadata = {
  title: 'Proposal Software for Copywriters & Writers | Proposar',
  description: 'AI proposal software for freelance copywriters and content marketers. Generate perfectly structured content proposals and retainers in 60 seconds.',
  alternates: {
    canonical: 'https://proposar.com/for/copywriters',
  },
};

export default function CopywritersPage() {
  return (
    <IndustryPage
      industry="Copywriting"
      heroHeading="Proposal Software for Copywriters"
      heroSubheading="You write for a living, but you shouldn't have to write proposals from scratch. Generate stunning, high-converting copywriting proposals in 60 seconds."
      problemStatement="As a copywriter, your words are your inventory. Every hour spent writing a proposal is an hour you aren't writing billable client copy. Furthermore, clients expect a copywriter's proposal to be written perfectly—adding immense pressure to every pitch."
      marketStats="Freelance copywriters who use specialized proposal software send quotes 3x faster, increasing their overall pipeline velocity."
      solutions={[
        {
          title: "Pre-Trained Copy Logic",
          desc: "Our AI is trained on winning direct-response copy. It knows exactly how to position your writing services, SEO blogs, and email sequences.",
          icon: "✍️"
        },
        {
          title: "Retainer vs Per-Word Pricing",
          desc: "Whether you charge per word, per asset, or on a monthly retainer, Proposar's pricing tables make complex content billing simple and transparent.",
          icon: "💰"
        },
        {
          title: "Automated Follow-Ups",
          desc: "Never send an awkward 'just checking in' email again. Proposar's smart sequences chase the client for you, professionally and automatically.",
          icon: "✉️"
        }
      ]}
      testimonials={[
        { quote: "It felt ironic using AI to write a copywriting proposal, but the execution is flawless. It saves me an hour per lead and the copy actually sounds like me.", author: "Jessica M.", role: "Direct Response Copywriter" },
        { quote: "Pricing content retainers was always messy in Google Docs. Proposar's tables make it look incredibly professional. My acceptance rate went up 20%.", author: "Daniel T.", role: "Content Marketing Consultant" },
        { quote: "The tracked links are amazing. I see when the marketing director opens my pitch, giving me the perfect excuse to follow up by phone.", author: "Olivia P.", role: "Freelance B2B Writer" }
      ]}
    />
  );
}
