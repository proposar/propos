export const PROJECT_TYPES = [
  // AI & Automation
  "AI Agents",
  "AI Automation",
  "Voice Agents",
  "Custom AI Solutions",
  "Automation Workflows",
  // Design & creative
  "Web Design",
  "UI/UX Design",
  "Brand Identity",
  "Logo Design",
  "Graphic Design",
  "Illustration",
  "Motion Graphics / Animation",
  "Photography",
  "Video Production",
  "3D Design / Modeling",
  // Development
  "Web Development",
  "Mobile App",
  "App Development",
  "WordPress Site",
  "Shopify Store",
  "E-commerce Development",
  "Custom Software",
  "API / Backend Development",
  "Landing Page",
  "Chatbot / AI Integration",
  // Marketing & growth
  "SEO",
  "Content Writing",
  "Copywriting",
  "Email Marketing",
  "Social Media",
  "PPC Management",
  "Meta Ads",
  "Google Ads",
  "Marketing Strategy",
  "Lead Generation",
  "Sales Funnel",
  "Marketing Automation",
  // Business & ops
  "Consulting",
  "Data Analysis",
  "Business Plan / Strategy",
  "Virtual Assistant",
  "Technical Writing / Documentation",
  "Translation / Localization",
  "Editing / Proofreading",
  "Grant Writing",
  "Resume / Career",
  // Audio & media
  "Podcast Production",
  "Voice Over",
  // Other
  "Other",
] as const;

export const PROPOSAL_SECTIONS = [
  "Executive Summary",
  "Understanding Your Challenge",
  "Proposed Solution",
  "Deliverables",
  "Timeline & Milestones",
  "Investment / Pricing",
  "About Us / Why Choose Us",
  "Next Steps",
  "Case Studies / Past Work",
  "Testimonials",
  "Terms & Conditions",
] as const;

export const CURRENCIES = ["USD", "GBP", "EUR", "AUD", "CAD", "INR"] as const;

export const TIMELINE_OPTIONS = [
  "1 week",
  "2 weeks",
  "3 weeks",
  "1 month",
  "6 weeks",
  "2 months",
  "3 months",
  "6 months",
  "Custom",
] as const;

export const TONE_OPTIONS = [
  { value: "professional", label: "Professional", emoji: "🤝", description: "Formal, polished, enterprise-ready" },
  { value: "friendly", label: "Friendly", emoji: "😊", description: "Warm, personable, relationship-first" },
  { value: "bold", label: "Bold", emoji: "💪", description: "Confident, punchy, results-focused" },
  { value: "formal", label: "Formal", emoji: "📊", description: "Conservative, detailed, corporate" },
] as const;

export const INDUSTRIES = [
  "Technology",
  "E-commerce",
  "Healthcare",
  "Finance",
  "Real Estate",
  "Education",
  "Legal",
  "Hospitality",
  "Creative Agency",
  "Marketing / Advertising",
  "SaaS / Startups",
  "Non-profit",
  "Manufacturing",
  "Retail",
  "Media / Entertainment",
  "Government",
  "Other",
] as const;

/** When user selects an industry, we suggest project title placeholder and relevant project types (Fiverr/Upwork-style). */
export const INDUSTRY_SUGGESTIONS: Record<
  (typeof INDUSTRIES)[number],
  { projectTitlePlaceholder: string; suggestedProjectTypes: (typeof PROJECT_TYPES)[number][] }
> = {
  Technology: {
    projectTitlePlaceholder: "e.g. AI Agent for Customer Support or SaaS Dashboard",
    suggestedProjectTypes: ["AI Agents", "AI Automation", "Web Development", "UI/UX Design", "Custom Software", "API / Backend Development", "Landing Page"],
  },
  "E-commerce": {
    projectTitlePlaceholder: "e.g. Shopify Store or E-commerce Website",
    suggestedProjectTypes: ["Shopify Store", "E-commerce Development", "Web Design", "SEO", "Photography"],
  },
  Healthcare: {
    projectTitlePlaceholder: "e.g. Healthcare Website or Patient Portal",
    suggestedProjectTypes: ["Web Design", "Content Writing", "SEO", "Brand Identity", "Consulting"],
  },
  Finance: {
    projectTitlePlaceholder: "e.g. Fintech App or Finance Website",
    suggestedProjectTypes: ["Web Development", "Custom Software", "Data Analysis", "Consulting", "Copywriting"],
  },
  "Real Estate": {
    projectTitlePlaceholder: "e.g. Real Estate Website or Property Listings",
    suggestedProjectTypes: ["Web Design", "Web Development", "Photography", "SEO", "Social Media"],
  },
  Education: {
    projectTitlePlaceholder: "e.g. Learning Platform or Course Website",
    suggestedProjectTypes: ["Web Development", "Content Writing", "Video Production", "Consulting", "UI/UX Design"],
  },
  Legal: {
    projectTitlePlaceholder: "e.g. Law Firm Website or Legal Content",
    suggestedProjectTypes: ["Web Design", "Copywriting", "Content Writing", "Brand Identity", "Consulting"],
  },
  Hospitality: {
    projectTitlePlaceholder: "e.g. Restaurant / Hotel Website or Menu Design",
    suggestedProjectTypes: ["Web Design", "Brand Identity", "Social Media", "Photography", "Graphic Design"],
  },
  "Creative Agency": {
    projectTitlePlaceholder: "e.g. Brand Campaign or Creative Project",
    suggestedProjectTypes: ["Brand Identity", "Graphic Design", "Video Production", "Social Media", "Copywriting"],
  },
  "Marketing / Advertising": {
    projectTitlePlaceholder: "e.g. Marketing Automation or AI-Powered Campaign",
    suggestedProjectTypes: ["AI Automation", "Marketing Automation", "Meta Ads", "Google Ads", "SEO", "Content Writing", "Social Media", "Lead Generation"],
  },
  "SaaS / Startups": {
    projectTitlePlaceholder: "e.g. AI Agent Development or SaaS Landing Page",
    suggestedProjectTypes: ["AI Agents", "Voice Agents", "Custom AI Solutions", "Landing Page", "Web Development", "UI/UX Design", "Copywriting", "Marketing Strategy"],
  },
  "Non-profit": {
    projectTitlePlaceholder: "e.g. Non-profit Website or Grant Proposal",
    suggestedProjectTypes: ["Web Design", "Grant Writing", "Content Writing", "Social Media", "Consulting"],
  },
  Manufacturing: {
    projectTitlePlaceholder: "e.g. Industrial Website or Catalog Design",
    suggestedProjectTypes: ["Web Design", "Graphic Design", "Technical Writing / Documentation", "Data Analysis", "Consulting"],
  },
  Retail: {
    projectTitlePlaceholder: "e.g. Retail Store Website or Product Photos",
    suggestedProjectTypes: ["E-commerce Development", "Web Design", "Photography", "Social Media", "SEO"],
  },
  "Media / Entertainment": {
    projectTitlePlaceholder: "e.g. Video Content or Media Website",
    suggestedProjectTypes: ["Video Production", "Content Writing", "Social Media", "Web Design", "Podcast Production"],
  },
  Government: {
    projectTitlePlaceholder: "e.g. Government Portal or Public Content",
    suggestedProjectTypes: ["Web Development", "Technical Writing / Documentation", "Consulting", "Data Analysis", "Content Writing"],
  },
  Other: {
    projectTitlePlaceholder: "e.g. Brand Identity for TechStartup",
    suggestedProjectTypes: ["Web Design", "Consulting", "Content Writing", "Other"],
  },
};

export const BUDGET_TYPES = ["Fixed Price", "Hourly Rate", "Monthly Retainer"] as const;

export const PAYMENT_TERMS = [
  "50% upfront / 50% on completion",
  "100% upfront",
  "Monthly",
  "Net 30",
  "Custom",
] as const;
