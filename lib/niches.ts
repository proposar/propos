export interface NicheInfo {
  slug: string;
  industry: string;
  title: string;
  description: string;
  heroTitle: string;
  heroSub: string;
  keywords: string[];
}

export const niches: NicheInfo[] = [
  {
    slug: "web-developers",
    industry: "Web Development",
    title: "AI Proposal Generator for Web Developers",
    description: "The A-to-Z workflow for Web Developers. Generate tech-focused AI proposals, share via WhatsApp, and close with legal-grade development contracts.",
    heroTitle: "Write Development Proposals that Actually Win.",
    heroSub: "Proposar is the only partner that handles your entire lifecycle—from AI strategy to smart contracts and final payment. Stop spending hours on dev specs.",
    keywords: ["web dev proposals", "proposal tool for developers", "software development contract", "dev agency proposals"],
  },
  {
    slug: "graphic-designers",
    industry: "Graphic Design",
    title: "AI Proposal Generator for Graphic Designers",
    description: "The A-to-Z workflow for Designers. Portfolio-ready AI proposals, WhatsApp sharing, and Smart Contracts with IP Protection.",
    heroTitle: "Protect Your Creativity. Get Paid Faster.",
    heroSub: "Stop being ghosted after sending design mocks. Create beautiful proposals, secure your IP with smart contracts, and track every open.",
    keywords: ["design proposals", "freelance designer tool", "IP protection for designers", "creative agency software"],
  },
  {
    slug: "marketing-agencies",
    industry: "Marketing Agencies",
    title: "The All-in-One Sales Engine for Marketing Agencies",
    description: "Automate your entire agency workflow. AI-powered proposal strategy, multi-channel sharing, and automated invoicing for high-growth agencies.",
    heroTitle: "Scale Your Agency Without the Admin Bloat.",
    heroSub: "Proposar replaces 3 expensive tools with one A-to-Z workflow. Proposal, Follow-up, Contract, and Payment—all in one place.",
    keywords: ["agency proposal software", "marketing sales tool", "agency closing engine", "automated agency invoicing"],
  },
  {
    slug: "video-editors",
    industry: "Video Production",
    title: "AI Proposals & Contracts for Video Editors",
    description: "The secure way to manage video client deals. A-to-Z workflow with smart contracts that include revision limits and kill-fees.",
    heroTitle: "No More 'Unlimited Revision' Hell.",
    heroSub: "Proposar's AI generates proposals that set clear boundaries. Smart contracts ensure you get paid for every hour you edit.",
    keywords: ["video production proposals", "editor contracts", "video editing sales tool", "freelance editor workflow"],
  },
];
