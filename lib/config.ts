export const PLANS = {
  free: {
    name: "Free",
    priceMonthly: 0,
    priceYearly: 0,
    proposalsPerMonth: 3,
    templates: 1,
    clients: 10,
  },
  starter: {
    name: "Starter",
    priceMonthly: 19,
    priceYearly: 180,
    proposalsPerMonth: 10,
    templates: 3,
    clients: 50,
  },
  pro: {
    name: "Pro",
    priceMonthly: 29,
    priceYearly: 276,
    proposalsPerMonth: -1, // unlimited
    templates: -1,
    clients: -1,
  },
  agency: {
    name: "Agency",
    priceMonthly: 79,
    priceYearly: 756,
    proposalsPerMonth: -1,
    templates: -1,
    clients: -1,
    teamMembers: 5,
  },
} as const;

export const PLAN_LIMITS = {
  free: {
    proposalsPerMonth: 3,
    templates: 1,
    clients: 10,
  },
  starter: {
    proposalsPerMonth: 10,
    templates: 3,
    clients: 50,
  },
  pro: {
    proposalsPerMonth: -1,
    templates: -1,
    clients: -1,
  },
  agency: {
    proposalsPerMonth: -1,
    templates: -1,
    clients: -1,
  },
} as const;

export const APP_METADATA = {
  name: process.env.NEXT_PUBLIC_APP_NAME ?? "Proposar",
  description:
    "AI-powered proposal generator for freelancers and agencies. Write winning proposals in 60 seconds.",
  url: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
  social: {
    twitter: "https://twitter.com/Proposar",
    linkedin: "https://linkedin.com/company/Proposar",
    instagram: "https://instagram.com/Proposar",
  },
} as const;

export const FEATURE_FLAGS = {
  enableStripe: false,
  enableEmail: true,
  enableTemplates: true,
  enableClientDashboard: true,
} as const;
