import { Metadata } from 'next';
import { IndustryPage } from '@/components/seo/IndustryPage';

export const metadata: Metadata = {
  title: 'Proposal Software for SEO Agencies — Win More Retainers | Proposar',
  description: 'The ultimate proposal software for SEO professionals and agencies. Generate technical SEO audits and monthly retainers instantly.',
  alternates: {
    canonical: 'https://proposar.com/for/seo-agencies',
  },
};

export default function SEOAgenciesPage() {
  return (
    <IndustryPage
      industry="SEO"
      heroHeading="Proposal Software for SEO Agencies"
      heroSubheading="Stop spending hours compiling audit data into Word documents. Generate high-converting SEO retainer proposals in 60 seconds."
      problemStatement="Selling SEO is incredibly difficult because it is invisible and highly technical. If your proposal focuses too much on technical jargon (canonical tags, hreflang), you lose the CEO. If it focuses too much on fluff, you lose the technical buyer. "
      marketStats="Agencies that clearly tie SEO deliverables to business ROI in their proposals close 55% more high-ticket retainers."
      solutions={[
        {
          title: "ROI-Focused Generation",
          desc: "Proposar's AI translates technical SEO deliverables (like backlink velocity and schema markup) into business outcomes (revenue and lead generation).",
          icon: "🚀"
        },
        {
          title: "Clear Milestone Tracking",
          desc: "SEO takes time. Our templates structure expectations clearly, outlining what happens in Month 1 (Audits) vs Month 6 (Growth) to prevent churn.",
          icon: "📅"
        },
        {
          title: "Read Receipts & Intelligence",
          desc: "Know exactly how long the client spent reading the pricing table vs the technical audit section, giving you immense leverage in closing calls.",
          icon: "🧠"
        }
      ]}
      testimonials={[
        { quote: "Generating an SEO proposal used to involve copying screenshots from Ahrefs into a massive PDF. Now I just drop the core strategy into Proposar and it builds the business case for me.", author: "Mike V.", role: "Founder, Apex Local SEO" },
        { quote: "The timeline feature is brilliant for SEO. It clearly sets boundaries so clients don't expect overnight rankings, protecting my agency from early churn.", author: "Sarah H.", role: "Freelance SEO Specialist" },
        { quote: "My previous quoting tool looked cheap. Proposar gives my $5k/mo SEO retainers the premium aesthetic they deserve.", author: "Chris N.", role: "Growth Marketing Consultant" }
      ]}
    />
  );
}
