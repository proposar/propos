import Link from 'next/link';

interface InternalLinkProps {
  category: 'templates' | 'industries' | 'locations' | 'tools' | 'competitors';
}

const linkData = {
  templates: [
    { label: 'Web Design Proposal Template', href: '/proposal-templates/web-design' },
    { label: 'Digital Marketing Proposal', href: '/proposal-templates/marketing' },
    { label: 'SEO Retainer Proposal', href: '/proposal-templates/seo' },
    { label: 'Freelance Photography Quote', href: '/proposal-templates/photography' },
  ],
  industries: [
    { label: 'Proposal Software for Consultants', href: '/for/consultants' },
    { label: 'Proposal Tool for Agencies', href: '/for/marketing-agencies' },
    { label: 'Dev Agency Proposals', href: '/for/developers' },
    { label: 'Copywriting Retainers', href: '/for/copywriters' },
  ],
  locations: [
    { label: 'Freelancers in USA', href: '/for/freelancers-usa' },
    { label: 'UK Contractor Proposals', href: '/for/freelancers-uk' },
    { label: 'Australian Freelancers', href: '/for/freelancers-australia' },
    { label: 'Canadian Agency Tech', href: '/for/freelancers-canada' },
  ],
  tools: [
    { label: 'AI Proposal Generator', href: '/ai-proposal-generator' },
    { label: 'Freelance Proposal Generator', href: '/proposal-generator-for-freelancers' },
    { label: 'Proposal Word Count Checker', href: '/tools/word-count' },
    { label: 'Freelance Win Rate Calculator', href: '/tools/win-rate' },
  ],
  competitors: [
    { label: 'Proposify Alternative', href: '/vs/proposify' },
    { label: 'PandaDoc Alternative', href: '/vs/pandadoc' },
    { label: 'Better Proposals Alternative', href: '/vs/better-proposals' },
    { label: 'Qwilr Alternative', href: '/vs/qwilr' },
  ]
};

const headings = {
  templates: 'Popular Free Templates',
  industries: 'Who Uses Proposar?',
  locations: 'Global Freelancers',
  tools: 'Free Freelance Tools',
  competitors: 'Compare Proposar'
};

export function InternalLinks({ category }: InternalLinkProps) {
  const links = linkData[category];
  
  return (
    <div className="py-6 border-t border-[#1e1e2e] mt-12 text-sm">
      <h4 className="font-bold text-[#faf8f4] mb-4">{headings[category]}</h4>
      <ul className="flex flex-col gap-2">
        {links.map((link, i) => (
          <li key={i}>
            <Link href={link.href} className="text-[#888890] hover:text-emerald-400 transition-colors">
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
