import { Metadata } from 'next';
import { BlogPostLayout, InlineCTA } from '@/components/seo/BlogPostLayout';

export const metadata: Metadata = {
  title: 'Free Freelance Proposal Template (PDF & Word Docs) | Proposar',
  description: 'Download our free, highly-converting freelance proposal template. Perfect for independent designers, writers, and consultants. Or generate one instantly with AI.',
  alternates: {
    canonical: 'https://proposar.com/blog/freelance-proposal-template',
  },
};

export default function BlogPost() {
  return (
    <BlogPostLayout
      title="The Ultimate Freelance Proposal Template"
      description="Download our free, highly-converting freelance proposal template. Perfect for independent designers, writers, and consultants."
      publishDate="March 4, 2025"
      readTime="4 min read"
      author="Proposar Templates Team"
      slug="freelance-proposal-template"
    >
      <p>Are you tired of staring at a blank Google Doc every time a prospect asks "Can you send over a proposal?"</p>
      
      <p>We analyzed over 10,000 successful freelance proposals across dozens of industries to see exactly what sections actually convince clients to sign. We compiled those insights into this definitive freelance proposal template.</p>

      <h2>The Core Structure of a Winning Proposal</h2>
      <p>If you prefer to build your own template in Word or Canva, make sure it strictly follows this 6-part structure:</p>
      
      <ol>
        <li><strong>Title Page:</strong> Project name, client logo, your logo, and date. Keep it clean.</li>
        <li><strong>Executive Summary:</strong> A maximum of 3 paragraphs outlining their core business problem and your high-level solution.</li>
        <li><strong>Project Scope & Deliverables:</strong> A bulleted list of what you will literally hand over to them.</li>
        <li><strong>Timeline & Process:</strong> A structured list of milestones (e.g., Week 1: Discovery, Week 2: Initial Drafts).</li>
        <li><strong>Investment / Pricing:</strong> Never call it "Costs." Always provide 2-3 tiered package options.</li>
        <li><strong>Next Steps & Sign-off:</strong> Clear instructions on how to pay the deposit and sign the document.</li>
      </ol>

      <InlineCTA />

      <h2>Copy-Paste Template (Text Version)</h2>
      <p>You can copy and paste the text below into your editor of choice.</p>
      
      <pre className="bg-[#12121e] border border-[#1e1e2e] p-4 text-sm text-[#d1d1d6] overflow-x-auto rounded-lg">
## Executive Summary
[Client Company] is currently experiencing [Pain Point]. Based on our discovery call, your goal is to [Desired Business Outcome] by [Date/Quarter]. 

To achieve this, I will design/build/write a custom [Solution] that directly addresses the bottleneck in your current workflow.

## Deliverables & Scope
If hired, I will deliver the following assets:
- Asset 1 (e.g., 5-page Webflow website)
- Asset 2 (e.g., Mobile responsive layouts)
- 2 Rounds of revisions included

Exclusions: This scope does not include [Boundaries, e.g., custom animations, logo redesign].

## Investment
**Option 1: The Core Package — $3,000**
Includes all deliverables listed above. 

**Option 2: The Growth Package — $4,500**
Includes all deliverables + [Value Add, e.g., 3 months of priority support and SEO optimization].

## Next Steps
To officially secure your spot in my project schedule:
1. Select your preferred package above.
2. Sign this document below.
3. Process the initial 50% deposit invoice (sent separately).
      </pre>

      <h2>The Problem with Static Templates</h2>
      <p>While the template above is strong, the reality is that filling in those bracketed fields for every client is tedious. It still takes 30-45 minutes to customize a Google Doc.</p>
      
      <p>Worse, PDFs cannot be tracked. You won't know if the client laughed at the price or never opened the email.</p>
      
      <p>This is why top-earning freelancers abandon static templates and use AI software. With Proposar, the AI understands the context of the deal and actually writes the Executive Summary <em>for</em> you. It then tracks when the client opens it, reducing your admin time from 45 minutes to exactly 60 seconds.</p>
    </BlogPostLayout>
  );
}
