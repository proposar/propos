import { Metadata } from 'next';
import { IndustryPage } from '@/components/seo/IndustryPage';

export const metadata: Metadata = {
  title: 'Proposal Software for Web Designers — Win More Design Projects | Proposar',
  description: 'AI proposal software built for freelance web designers and dev agencies. Generate gorgeous web design proposals in 60 seconds with built-in scope protection.',
  alternates: {
    canonical: 'https://proposar.com/for/web-designers',
  },
};

export default function WebDesignersPage() {
  return (
    <IndustryPage
      industry="Web Design"
      heroHeading="Proposal Software for Web Designers"
      heroSubheading="Stop spending hours writing proposals for clients who ghost you. Generate gorgeous, scope-protected web design proposals in 60 seconds."
      problemStatement="As a web designer, your proposals are visual representations of your brand. But designing a custom PDF in Figma or InDesign for every prospect takes hours of unpaid time. Worse, standard Word documents make your premium design services look cheap."
      marketStats="Web designers who use interactive, web-based proposals instead of PDFs close deals 32% faster on average."
      solutions={[
        {
          title: "Pre-written Design Assets",
          desc: "Proposar's AI knows exactly how to describe UX/UI phases, wireframing, development, and launch milestones professionally.",
          icon: "🎨"
        },
        {
          title: "Scope Creep Protection",
          desc: "Our web design templates explicitly define out-of-scope revisions and maintenance add-ons to protect your margins.",
          icon: "🛡️"
        },
        {
          title: "Mobile-First Viewing",
          desc: "Your clients are reading proposals on their phones. Our generated proposals look perfect on any device, guaranteeing a great first UX impression.",
          icon: "📱"
        }
      ]}
      testimonials={[
        { quote: "Before Proposar, I spent 2-3 hours designing custom PDF proposals in Figma. Now, I enter the project details and the AI spits out a perfectly structured design proposal in a minute. It's unreal.", author: "Marcus Allen", role: "Freelance UI/UX Designer" },
        { quote: "The scope protection language the AI generates has saved me from at least three nightmare clients. It clearly defines round limits and maintenance costs without sounding aggressive.", author: "Sophia T.", role: "Webflow Agency Owner" },
        { quote: "My close rate jumped from 30% to over 50% simply because I'm able to send the proposal 5 minutes after the discovery call instead of three days later.", author: "David K.", role: "WordPress Developer" }
      ]}
    />
  );
}
