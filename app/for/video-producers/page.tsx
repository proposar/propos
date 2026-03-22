import { Metadata } from 'next';
import { IndustryPage } from '@/components/seo/IndustryPage';

export const metadata: Metadata = {
  title: 'Proposal Software for Video Producers — Win More Video Projects | Proposar',
  description: 'Create winning video production proposals in 60 seconds with AI. Used by videographers, editors, and production agencies. Free trial — no card required.',
  alternates: {
    canonical: 'https://proposar.com/for/video-producers',
  },
};

export default function VideoProducersPage() {
  return (
    <IndustryPage
      industry="Video Producers"
      heroHeading="Proposal Software for Video Producers — Win More Video Projects"
      heroSubheading="Stop losing clients to slow, generic proposals. Proposar's AI generates professional video production proposals in 60 seconds — complete with deliverables, timelines, and tiered pricing that closes deals."
      problemStatement="Video producers and production agencies often spend hours crafting proposals for commercial shoots, wedding films, corporate content, and social media. Clients expect detailed deliverables, clear timelines, and professional pricing structures. A weak or late proposal means losing the job to a competitor. Proposar was built to turn your creative expertise into winning proposals instantly."
      marketStats="68% of clients choose the first professional proposal they receive. Send yours in 60 seconds."
      solutions={[
        {
          title: "Video-Specific Proposal Sections",
          desc: "AI generates proposals with pre-production, shoot days, post-production, revisions, and deliverables — all tailored to video projects.",
          icon: "🎬",
        },
        {
          title: "Tiered Package Pricing",
          desc: "Present multiple options (e.g. Basic, Standard, Premium) so clients can choose what fits their budget. AI structures pricing tables automatically.",
          icon: "💰",
        },
        {
          title: "Open Tracking & Follow-ups",
          desc: "Know when your client opens the proposal and which section they spend the most time on. Automated follow-ups ensure you never lose a deal to silence.",
          icon: "📊",
        },
      ]}
      testimonials={[
        { quote: "I used to spend 2 hours on every video proposal. Now I send them in under a minute. My close rate has gone up significantly.", author: "Tyler M.", role: "Commercial Videographer" },
        { quote: "The tiered pricing structure Proposar generates has made it so much easier to upsell clients to bigger packages.", author: "Rachel F.", role: "Wedding Videographer" },
        { quote: "Finally, a proposal tool that understands video production. The deliverables and timeline sections are spot-on.", author: "Derek S.", role: "Content Creator" },
      ]}
    />
  );
}
