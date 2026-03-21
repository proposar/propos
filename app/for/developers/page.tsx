import { Metadata } from 'next';
import { IndustryPage } from '@/components/seo/IndustryPage';

export const metadata: Metadata = {
  title: 'Software Development Proposal Template & Generator | Proposar',
  description: 'AI-driven proposal software for freelance developers and dev agencies. Define technical scope, milestones, and sprint pricing instantly.',
  alternates: {
    canonical: 'https://proposar.com/for/developers',
  },
};

export default function DevelopersPage() {
  return (
    <IndustryPage
      industry="Software Development"
      heroHeading="Proposal Software for Developers"
      heroSubheading="Spend less time writing documentation and more time writing code. Generate precise technical scope and sprint proposals in 60 seconds."
      problemStatement="Freelance developers and agencies lose thousands of dollars to undefined scope. Writing a technical proposal requires outlining tech stacks, API integrations, and milestone phases—a tedious process that deters you from taking on new client work."
      marketStats="Software agencies using structured, milestone-based digital proposals report a 40% drop in mid-project scope disputes."
      solutions={[
        {
          title: "Technical Scope Automation",
          desc: "Input a brief project description, and Proposar's AI expands it into a comprehensive technical scope, including assumptions and exclusions.",
          icon: "💻"
        },
        {
          title: "Milestone & Sprint Pricing",
          desc: "Whether you bill by Agile sprints or fixed feature milestones, our flexible pricing tables make complex development quotes crystal clear.",
          icon: "⏱️"
        },
        {
          title: "Perfect PDF Exports",
          desc: "Some enterprise clients require strict PDF trails for compliance. Proposar generates flawless, pixel-perfect PDFs automatically.",
          icon: "📄"
        }
      ]}
      testimonials={[
        { quote: "I'm a developer, not a copywriter. Proposar bridges the gap. I just paste my raw technical notes, and the AI turns it into a persuasive, client-friendly business case.", author: "Alex R.", role: "Full-Stack Freelancer" },
        { quote: "Defining scope clearly is the hardest part of running a dev agency. Proposar's templates explicitly outline what's NOT included, saving me from scope creep on every project.", author: "Ben W.", role: "CTO, Forge Dev" },
        { quote: "My previous proposal tool kept breaking table layouts when I added too many sprints. Proposar handles complex pricing structures beautifully.", author: "Chris T.", role: "Mobile App Developer" }
      ]}
    />
  );
}
