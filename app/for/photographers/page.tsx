import { Metadata } from 'next';
import { IndustryPage } from '@/components/seo/IndustryPage';

export const metadata: Metadata = {
  title: 'Proposal Software for Photographers & Videographers | Proposar',
  description: 'Beautiful, AI-generated proposal software for freelance photographers, wedding studios, and commercial videographers.',
  alternates: {
    canonical: 'https://proposar.com/for/photographers',
  },
};

export default function PhotographersPage() {
  return (
    <IndustryPage
      industry="Photography"
      heroHeading="Proposal Software for Photographers"
      heroSubheading="Your work is highly visual. Your proposals should be too. Generate stunning, professional photography or video proposals in 60 seconds."
      problemStatement="Standard invoicing tools make your premium photography services look like a utility bill. You are selling art, memories, and brand vision. A text-heavy PDF or a generic accounting invoice kills the emotional momentum of your sales pitch."
      marketStats="Creative professionals who use highly visual, web-based proposals close 42% more inquiries than those sending plain text quotes."
      solutions={[
        {
          title: "Stunning Visual Formatting",
          desc: "Proposar's minimalist, premium aesthetic ensures your proposal looks as good as your portfolio. No more ugly accounting invoices.",
          icon: "✨"
        },
        {
          title: "Package Tiering",
          desc: "Easily upsell clients by presenting 'Standard', 'Premium', and 'Luxury' photography packages side-by-side in beautiful pricing tables.",
          icon: "💎"
        },
        {
          title: "Mobile-First Design",
          desc: "Couples and commercial clients read proposals on their phones. Proposar ensures your quotes look flawless on any screen size.",
          icon: "📱"
        }
      ]}
      testimonials={[
        { quote: "I used to send basic Xero invoices for $8,000 wedding packages. It felt so wrong. Proposar makes the quoting experience feel like a luxury boutique.", author: "Emma S.", role: "Wedding Photographer" },
        { quote: "The ability to present three package tiers cleanly has increased my average booking value by $1,200. Clients easily see the value in upgrading.", author: "Lucas B.", role: "Commercial Videographer" },
        { quote: "I can generate and send a fully customized proposal from my phone while walking back to my car after a client meeting. The speed is unmatched.", author: "Chloe R.", role: "Brand Photographer" }
      ]}
    />
  );
}
