import { Metadata } from 'next';
import { BlogPostLayout, InlineCTA } from '@/components/seo/BlogPostLayout';

export const metadata: Metadata = {
  title: 'Proposal Rejected: What to Do Next to Save the Deal | Proposar',
  description: 'Your freelance proposal was rejected for being "too expensive." Here is exactly what you should say next to save the deal without dropping your rates.',
  alternates: {
    canonical: 'https://proposar.com/blog/proposal-rejected-what-to-do',
  },
};

export default function BlogPost() {
  return (
    <BlogPostLayout
      title="Proposal Rejected: What to Do Next to Save the Deal"
      description="Your freelance proposal was rejected for being 'too expensive.' Here is exactly what you should say next to save the deal without dropping your rates."
      publishDate="March 19, 2025"
      readTime="5 min read"
      author="Proposar Sales Team"
      slug="proposal-rejected-what-to-do"
    >
      <p>It's a gut punch. You had a great call, you spent three hours writing a comprehensive $10,000 strategy proposal, and 48 hours later you get the classic email: <em>"We love your work, but this is outside of our budget for Q3."</em></p>

      <p>Most freelancers either accept defeat and walk away, or they immediately panic and offer a 30% discount. <strong>Never offer a blind discount.</strong> When you drop your price for the same amount of work, you teach the client that your original price was inflated.</p>

      <h2>1. The "Reduce Scope" Counter-Offer</h2>
      <p>If the client says $10,000 is too much, do not offer the same work for $7,500. Offer $7,500 for less work.</p>

      <p><strong>Reply Template:</strong><br/>
      <em>"Thanks for the transparency, John. Let's see if we can align this with your Q3 budget. If we remove the custom CRM integration phase and limit the initial launch to the core 5 pages, I can bring the total investment down to $6,500. We can always tackle Phase 2 next quarter. How does that align with your numbers?"</em></p>

      <InlineCTA />

      <h2>2. Pivot to a Paid Discovery Phase</h2>
      <p>Sometimes $10,000 is just too big of a trust leap for a cold lead. If they reject the main proposal, pivot to a micro-commitment.</p>

      <p><strong>Reply Template:</strong><br/>
      <em>"I completely understand. Doing a full digital transformation requires significant capital. Instead of the full build, what if we started with a $1,500 deep-dive Roadmap Audit? We'll spend two weeks analyzing your current bottlenecks and deliver a blueprint. You can then execute that blueprint internally, or hire us later to build it."</em></p>

      <h2>3. The Payment Plan Pivot</h2>
      <p>Often, the objection isn't the total number; it's the cash flow hit. If asking for $5,000 upfront on a $10k project kills the deal, change the terms.</p>

      <p><strong>Reply Template:</strong><br/>
      <em>"I know $10k requires moving some budgets around. What if instead of the standard 50/50 split, we amortized the cost over 4 months at $2,500/mo? I can still start the project Monday."</em></p>

      <h2>Stop Guessing Their Budget</h2>
      <p>The primary reason proposals get rejected on price is that the freelancer only provided one pricing option. If you always use a 3-Tier Pricing Model in your proposals (e.g., $3k, $6k, $12k options), the client doesn't <em>reject</em> the proposal; they just select the $3k option.</p>
    </BlogPostLayout>
  );
}
