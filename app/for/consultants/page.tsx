import { Metadata } from 'next';
import { IndustryPage } from '@/components/seo/IndustryPage';

export const metadata: Metadata = {
  title: 'Consulting Proposal Software — Close High-Ticket Projects | Proposar',
  description: 'AI proposal software for independent consultants. Generate professional statement of work (SOW) documents and consulting proposals in 60 seconds.',
  alternates: {
    canonical: 'https://proposar.com/for/consultants',
  },
};

export default function ConsultantsPage() {
  return (
    <IndustryPage
      industry="Consulting"
      heroHeading="Proposal Software for Consultants"
      heroSubheading="Stop copying and pasting old Word docs. Generate compelling Statements of Work (SOWs) and high-ticket consulting proposals instantly."
      problemStatement="As an independent consultant, your expertise is your product. But when you send a disorganized Google Doc outlining a $20,000 strategy engagement, you commoditize your value. Writing a rigorous Business Case and Statement of Work manually takes hours you don't have."
      marketStats="Consultants leveraging AI for proposal writing save an average of 14 hours per month on administrative tasks."
      solutions={[
        {
          title: "Executive Summaries via AI",
          desc: "Our AI model understands high-level business logic, crafting Executive Summaries that speak directly to C-suite stakeholders and their KPIs.",
          icon: "👔"
        },
        {
          title: "Day Rate vs Fixed Pricing",
          desc: "Easily switch between hourly, day-rate, or fixed-fee pricing tables depending on how you structure your consulting engagements.",
          icon: "📊"
        },
        {
          title: "Read Tracking",
          desc: "Know exactly when the CEO opens your proposal and how long they spent reviewing the pricing section before you follow up.",
          icon: "👁️"
        }
      ]}
      testimonials={[
        { quote: "I used to hate writing SOWs for enterprise clients. Proposar's AI generator completely understands consulting jargon and structures the deliverables perfectly. It's a lifesaver.", author: "James M.", role: "Management Consultant" },
        { quote: "When you're charging $1,500 a day, your proposals need to look $1,500-a-day good. Proposar delivers that premium, minimalist aesthetic right out of the box.", author: "Sarah L.", role: "Strategy Consultant" },
        { quote: "The read receipts are incredible. I saw a prospect open my proposal 4 times in one hour, so I called them immediately. Closed a $30k deal on the spot.", author: "Marcus K.", role: "Fractional CMO" }
      ]}
    />
  );
}
