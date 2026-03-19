import Link from "next/link";
import type { Metadata } from "next";

const articleMap: Record<string, { title: string; summary: string; steps: string[] }> = {
  "signup-login": {
    title: "How to Sign Up & Login",
    summary: "Create your account and securely access your workspace.",
    steps: [
      "Go to signup and create your account with email or OAuth.",
      "Verify your email if prompted.",
      "Log in and complete onboarding details.",
      "You will be redirected to the dashboard."
    ]
  },
  "onboarding": {
    title: "Onboarding Walkthrough",
    summary: "Set up profile, brand, and defaults before your first proposal.",
    steps: [
      "Add business details and preferred currency.",
      "Upload logo and brand color.",
      "Configure default sections and tone.",
      "Create your first proposal from dashboard."
    ]
  },
  "profile-setup": {
    title: "Set Up Your Profile",
    summary: "Build trust with complete public-facing business details.",
    steps: [
      "Open Settings → Profile.",
      "Fill in name, business details, phone, and website.",
      "Upload logo/avatar and save.",
      "Confirm updates in proposal/invoice previews."
    ]
  },
  "first-proposal": {
    title: "Create Your First Proposal",
    summary: "Generate, review, and send your first proposal in minutes.",
    steps: [
      "Go to New Proposal.",
      "Enter client and project details.",
      "Generate draft and review sections.",
      "Send via share link, email, or WhatsApp."
    ]
  },
  "proposal-creation": {
    title: "Creating & Editing Proposals",
    summary: "Use the proposal editor effectively for better close rates.",
    steps: [
      "Start with AI draft or template.",
      "Refine scope, deliverables, and timeline.",
      "Set pricing and optional line items.",
      "Preview and save before sending."
    ]
  },
  "ai-generation": {
    title: "AI-Powered Generation",
    summary: "Generate proposal drafts with consistent tone and structure.",
    steps: [
      "Choose tone and sections.",
      "Provide clear project scope and client context.",
      "Generate and refine output.",
      "Save and send with confidence."
    ]
  },
  "templates": {
    title: "Using & Creating Templates",
    summary: "Reuse winning formats to speed up proposal creation.",
    steps: [
      "Open Templates from sidebar.",
      "Save a proposal as template.",
      "Apply template for similar projects.",
      "Keep templates updated based on outcomes."
    ]
  },
  "proposal-sharing": {
    title: "Sharing & Tracking Proposals",
    summary: "Send proposal links and track engagement in one place.",
    steps: [
      "Open a proposal and click Share.",
      "Send via email/link/WhatsApp.",
      "Track view status and follow-ups.",
      "Convert accepted proposals to contracts/invoices."
    ]
  },
  "contract-workflow": {
    title: "Contract Workflow & E-Signing",
    summary: "Move from accepted proposal to signed contract quickly.",
    steps: [
      "Create contract from proposal.",
      "Review legal terms and send to client.",
      "Client signs via secure link.",
      "Download signed copy for records."
    ]
  },
  "invoice-creation": {
    title: "Creating & Sending Invoices",
    summary: "Generate invoices manually or from proposals.",
    steps: [
      "Open Invoices → New Invoice.",
      "Select proposal or enter details manually.",
      "Set due date and payment link.",
      "Send to client and track status."
    ]
  },
  "payment-tracking": {
    title: "Payment Tracking & Reminders",
    summary: "Track partial/full payments and automate reminders.",
    steps: [
      "Record amount received on invoice.",
      "Check payment status (pending/deposit/paid).",
      "Monitor remaining balance.",
      "Use reminders for unpaid overdue invoices."
    ]
  },
  "contract-templates": {
    title: "Standard Contract Templates",
    summary: "Use standard contract sections and customize as needed.",
    steps: [
      "Start with standard structure.",
      "Adjust scope, payment terms, and revisions.",
      "Include signatures and dates.",
      "Send for client approval."
    ]
  },
  "analytics-dashboard": {
    title: "Analytics Dashboard Overview",
    summary: "Understand your pipeline and conversion metrics.",
    steps: [
      "Review acceptance and view rates.",
      "Track proposals created this week/month.",
      "Check value won and pending pipeline.",
      "Act on proposals needing follow-up."
    ]
  },
  "increase-win-rate": {
    title: "Tips to Increase Win Rate",
    summary: "Improve proposal quality and close more deals.",
    steps: [
      "Personalize opening and client outcomes.",
      "Use clear scope and pricing.",
      "Send quickly and follow up consistently.",
      "Review analytics and iterate templates."
    ]
  },
  "referral-program": {
    title: "Referral Program Guide",
    summary: "Understand referral page and share flow.",
    steps: [
      "Open Referrals from sidebar.",
      "Copy your referral link.",
      "Share with peers.",
      "Track referred signups and earnings."
    ]
  }
};

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const article = articleMap[params.slug];
  return {
    title: article ? `${article.title} — Help Center` : "Help Article — Proposar",
    description: article?.summary ?? "Proposar help article"
  };
}

export default function HelpArticlePage({ params }: { params: { slug: string } }) {
  const article = articleMap[params.slug];

  if (!article) {
    return (
      <div className="min-h-screen bg-[#0a0a14] text-[#c4c4cc] px-6 py-12">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-2xl font-bold text-[#faf8f4] mb-3">Article not found</h1>
          <p className="text-[#888890] mb-6">This help article does not exist or has been moved.</p>
          <Link href="/help" className="text-gold hover:underline">← Back to Help Center</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a14] text-[#c4c4cc] px-6 py-12">
      <div className="max-w-3xl mx-auto">
        <Link href="/help" className="text-gold hover:underline">← Back to Help Center</Link>
        <h1 className="text-3xl font-bold text-[#faf8f4] mt-4 mb-3">{article.title}</h1>
        <p className="text-[#888890] mb-8">{article.summary}</p>
        <ol className="space-y-3 list-decimal pl-5">
          {article.steps.map((step, index) => (
            <li key={index} className="text-[#c4c4cc]">{step}</li>
          ))}
        </ol>
      </div>
    </div>
  );
}
