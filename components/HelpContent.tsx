'use client';

import Link from 'next/link';
import { Search, ChevronRight, BookOpen, FileText, BarChart3, Zap } from 'lucide-react';
import { useState } from 'react';
import { WhatsAppButton } from '@/components/WhatsAppButton';

const articles = [
  // Getting Started
  {
    id: 'signup-login',
    category: 'Getting Started',
    categoryIcon: Zap,
    title: 'How to Sign Up & Login',
    description: 'Create your Proposar account in seconds and secure your workspace.',
    readTime: '3 min',
    href: '/help/signup-login',
  },
  {
    id: 'onboarding',
    category: 'Getting Started',
    categoryIcon: Zap,
    title: 'Onboarding Walkthrough',
    description: 'Complete setup guide: profiles, templates, clients, and your first proposal.',
    readTime: '8 min',
    href: '/help/onboarding',
  },
  {
    id: 'profile-setup',
    category: 'Getting Started',
    categoryIcon: Zap,
    title: 'Set Up Your Profile',
    description: 'Add your logo, branding, and professional information.',
    readTime: '5 min',
    href: '/help/profile-setup',
  },
  {
    id: 'first-proposal',
    category: 'Getting Started',
    categoryIcon: Zap,
    title: 'Create Your First Proposal',
    description: 'Step-by-step guide to generating your first client proposal.',
    readTime: '6 min',
    href: '/help/first-proposal',
  },

  // Proposals
  {
    id: 'proposal-creation',
    category: 'Proposals',
    categoryIcon: FileText,
    title: 'Creating & Editing Proposals',
    description: 'Master the proposal editor: sections, formatting, and customization.',
    readTime: '7 min',
    href: '/help/proposal-creation',
  },
  {
    id: 'ai-generation',
    category: 'Proposals',
    categoryIcon: FileText,
    title: 'AI-Powered Generation (60 Seconds)',
    description: 'Use Claude AI to generate full proposals with custom tone and details.',
    readTime: '5 min',
    href: '/help/ai-generation',
  },
  {
    id: 'templates',
    category: 'Proposals',
    categoryIcon: FileText,
    title: 'Using & Creating Templates',
    description: 'Build reusable proposal templates to save time on future deals.',
    readTime: '6 min',
    href: '/help/templates',
  },
  {
    id: 'proposal-sharing',
    category: 'Proposals',
    categoryIcon: FileText,
    title: 'Sharing & Tracking Proposals',
    description: 'Send proposals and track opens, views, and engagement in real-time.',
    readTime: '5 min',
    href: '/help/proposal-sharing',
  },

  // Contracts & Invoices
  {
    id: 'contract-workflow',
    category: 'Contracts & Invoices',
    categoryIcon: BookOpen,
    title: 'Contract Workflow & E-Signing',
    description: 'Create contracts, send for signature, and track completion.',
    readTime: '7 min',
    href: '/help/contract-workflow',
  },
  {
    id: 'invoice-creation',
    category: 'Contracts & Invoices',
    categoryIcon: BookOpen,
    title: 'Creating & Sending Invoices',
    description: 'Generate invoices from proposals and track payments.',
    readTime: '5 min',
    href: '/help/invoice-creation',
  },
  {
    id: 'payment-tracking',
    category: 'Contracts & Invoices',
    categoryIcon: BookOpen,
    title: 'Payment Tracking & Reminders',
    description: 'Monitor invoice status and automate payment follow-ups.',
    readTime: '4 min',
    href: '/help/payment-tracking',
  },
  {
    id: 'contract-templates',
    category: 'Contracts & Invoices',
    categoryIcon: BookOpen,
    title: 'Standard Contract Templates',
    description: 'Explore built-in contract templates for common business scenarios.',
    readTime: '4 min',
    href: '/help/contract-templates',
  },

  // Analytics & Growth
  {
    id: 'analytics-dashboard',
    category: 'Analytics & Growth',
    categoryIcon: BarChart3,
    title: 'Analytics Dashboard Overview',
    description: 'Understand proposal metrics: view rates, acceptance rates, and revenue.',
    readTime: '5 min',
    href: '/help/analytics-dashboard',
  },
  {
    id: 'increase-win-rate',
    category: 'Analytics & Growth',
    categoryIcon: BarChart3,
    title: 'Tips to Increase Win Rate',
    description: 'Best practices for writing winning proposals and closing deals.',
    readTime: '6 min',
    href: '/help/increase-win-rate',
  },
  {
    id: 'referral-program',
    category: 'Analytics & Growth',
    categoryIcon: BarChart3,
    title: 'Referral Program Guide',
    description: 'Earn $10 per referral when users upgrade. Share your unique link.',
    readTime: '4 min',
    href: '/help/referral-program',
  },
];

const categories = [
  { name: 'Getting Started', icon: Zap, color: 'text-blue-400' },
  { name: 'Proposals', icon: FileText, color: 'text-purple-400' },
  { name: 'Contracts & Invoices', icon: BookOpen, color: 'text-emerald-400' },
  { name: 'Analytics & Growth', icon: BarChart3, color: 'text-amber-400' },
];

export function HelpContent() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredArticles = articles.filter((article) =>
    article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    article.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    article.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const groupedArticles = categories.map((category) => ({
    ...category,
    articles: filteredArticles.filter((a) => a.category === category.name),
  }));

  return (
    <div className="min-h-screen bg-[#0a0a14] text-[#c4c4cc]">
      {/* Breadcrumb Navigation */}
      <div className="border-b border-[#1e1e2e] bg-[#0a0a14] px-4 py-3 sm:px-6">
        <div className="mx-auto max-w-4xl">
          <Link href="/" className="flex items-center gap-2 text-sm text-[#888890] hover:text-gold transition-colors w-fit">
            <span>← Home</span>
          </Link>
        </div>
      </div>

      {/* Hero Section */}
      <div className="border-b border-[#1e1e2e] bg-gradient-to-b from-[#0a0a14] via-[#12121e] to-[#0a0a14] px-4 py-12 sm:px-6 sm:py-16">
        <div className="mx-auto max-w-4xl">
          <div className="text-center">
            <div className="mb-4 inline-flex rounded-lg bg-gold/20 px-3 py-1">
              <span className="text-sm font-medium text-gold">Help & Documentation</span>
            </div>
            <h1 className="mb-4 text-4xl font-bold text-[#faf8f4] sm:text-5xl">
              How can we help?
            </h1>
            <p className="mb-8 text-lg text-[#888890]">
              Find answers, tutorials, and best practices to master Proposar.
            </p>

            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#888890]" />
              <input
                type="text"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-lg border border-[#1e1e2e] bg-[#12121e] py-3 pl-12 pr-4 text-[#faf8f4] placeholder-[#888890] transition-all focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Articles by Category */}
      <div className="px-4 py-12 sm:px-6">
        <div className="mx-auto max-w-6xl">
          {groupedArticles.map((categoryGroup) => (
            categoryGroup.articles.length > 0 && (
              <div key={categoryGroup.name} className="mb-12">
                {/* Category Header */}
                <div className="mb-6 flex items-center gap-3">
                  <categoryGroup.icon className={`h-6 w-6 ${categoryGroup.color}`} />
                  <h2 className="text-2xl font-bold text-[#faf8f4]">{categoryGroup.name}</h2>
                </div>

                {/* Article Grid */}
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {categoryGroup.articles.map((article) => (
                    <Link
                      key={article.id}
                      href={article.href}
                      className="group rounded-lg border border-[#1e1e2e] bg-[#12121e] p-6 transition-all hover:border-gold/50 hover:bg-[#12121e]/80"
                    >
                      <div className="mb-3 flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-[#faf8f4] transition-colors group-hover:text-gold">
                            {article.title}
                          </h3>
                        </div>
                        <ChevronRight className="h-5 w-5 text-[#888890] transition-all group-hover:text-gold group-hover:translate-x-1" />
                      </div>
                      <p className="mb-4 text-sm text-[#888890]">{article.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-[#666672]">{article.readTime} read</span>
                        <span className="text-xs font-medium text-gold/70">{article.category}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )
          ))}

          {/* No Results */}
          {filteredArticles.length === 0 && (
            <div className="rounded-lg border border-[#1e1e2e] bg-[#12121e] py-12 text-center">
              <BookOpen className="mx-auto mb-4 h-12 w-12 text-[#666672]" />
              <h3 className="mb-2 text-lg font-semibold text-[#faf8f4]">No articles found</h3>
              <p className="text-[#888890]">
                Try a different search or browse all categories above.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Quick Links / CTA */}
      <div className="border-t border-[#1e1e2e] bg-[#12121e] px-4 py-12 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="rounded-lg border border-green-500/30 bg-green-500/5 p-6">
              <div className="mb-2 text-sm font-medium text-green-400">💬 Need instant help?</div>
              <p className="mb-4 text-[#888890]">
                Chat with our team on WhatsApp. We usually reply within minutes!
              </p>
              <WhatsAppButton className="inline-flex items-center gap-2 text-sm font-medium text-white bg-green-500 hover:bg-green-600 px-4 py-2 rounded-lg transition" />
            </div>

            <div className="rounded-lg border border-[#1e1e2e] bg-[#0a0a14]/50 p-6">
              <div className="mb-2 text-sm font-medium text-gold">📧 Prefer email?</div>
              <p className="mb-4 text-[#888890]">
                Send us a message and we&apos;ll get back to you within 24 hours.
              </p>
              <a
                href="mailto:support@proposar.io"
                className="inline-flex items-center gap-2 text-sm font-medium text-gold hover:text-gold/80"
              >
                Email Support
                <ChevronRight className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Stats */}
      <div className="border-t border-[#1e1e2e] bg-[#0a0a14] px-4 py-8 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-6 text-center sm:grid-cols-3">
            <div>
              <div className="text-2xl font-bold text-gold">{articles.length}+</div>
              <p className="text-sm text-[#888890]">Help articles</p>
            </div>
            <div>
              <div className="text-2xl font-bold text-gold">{categories.length}</div>
              <p className="text-sm text-[#888890]">Categories</p>
            </div>
            <div>
              <div className="text-2xl font-bold text-gold">24/7</div>
              <p className="text-sm text-[#888890]">AI support available</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
