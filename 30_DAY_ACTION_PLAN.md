# Proposar — 30-DAY ACTION PLAN
**Created:** March 6, 2026 | **Due:** April 6, 2026 | **Owner:** You

---

## OVERVIEW

You have a **fully-functional product**. This 30-day sprint closes the gap between "impressive MVP" and "market-ready SaaS."

**The 9 Critical Gaps to Close:**
1. ✅ **DONE** — PDF with logo + brand color + line items
2. ✅ **DONE** — Line items CRUD API routes  
3. ✅ **DONE** — Email preview before sending
4. ✅ **DONE** — PDF attachment in emails
5. ✅ **DONE** — Proposal expiry reminders to client
6. ⚠️ **NEEDS CONTENT** — Help Center (15 articles)
7. ⚠️ **NEEDS SETUP** — Live chat widget
8. ⚠️ **NEEDS BUILD** — Referral system MVP
9. ⚠️ **NEEDS POLISH** — Static pages (about, affiliate, etc.)

---

## WEEK 1: HELP CENTER & TRUST (Content Blitz)

### Goal
Ship a functioning Help Center that answers the 20 most-asked questions.

### Tasks

**Day 1-2: Create Knowledge Base Structure**
- [ ] Create `/app/help/` dynamic routing for articles
- [ ] Database table: `help_articles` (id, slug, title, content, category, views, created_at)
- [ ] Homepage at `/help/` lists all categories
- [ ] Search functionality (simple text search)

```typescript
// app/help/[slug]/page.tsx structure
import { Metadata } from "next";
export async function generateMetadata({ params }): Promise<Metadata> {
  const article = await getArticle(params.slug);
  return { title: article.title, description: article.excerpt };
}
```

**Day 2-3: Write 15 Core Articles** (aim for 1000-1500 words each)

Core topics:
1. Getting started with Proposar (onboarding)
2. How to upload your logo and customize branding
3. Creating proposals with AI
4. Understanding line items and pricing breakdown
5. What is a proposal template and how to save one
6. Managing clients in Proposar 
7. Sharing proposals — email vs link
8. What does proposal expiry mean
9. Understanding proposal analytics
10. Setting up auto-follow-up reminders
11. Upgrading your plan and comparing plans
12. Stripe billing and managing your subscription
13. Resetting password and account security
14. Video walkthroughs (embed YouTube links)
15. Frequently asked questions (FAQs)
16. Integrations and Zapier
17. Troubleshooting email delivery
18. Using Proposar on mobile
19. Exporting proposals and data
20. Referral program and earning

**Use this framework for each article:**
```markdown
# [Article Title]

## TL;DR
2-3 sentence summary

## What is [Feature]?
Definition + why it matters

## How to [Use It]
Step-by-step with screenshots

## Best Practices
Tips & tricks

## Troubleshooting
Common issues + fixes

## Next Steps
Links to related articles
```

**Day 3-4: Add Article Metadata**
- [ ] Tag each with category (Getting Started, Features, Billing, Troubleshooting)
- [ ] Add reading time estimate
- [ ] Create "related articles" logic
- [ ] Seed database with articles

**Day 5: Polish & Publish**
- [ ] Test search
- [ ] Check mobile rendering
- [ ] Link from footer and main nav
- [ ] Monitor traffic
- [ ] Create Google Analytics goals for "Viewed Help Article"

**Deliverable:** Link from `/help` works, 15 articles live, search functional

---

## WEEK 2: TRUST SIGNALS & SUPPORT

### Goal
Add live support, showcase social proof, improve credibility.

### Tasks

**Day 6-7: Install Live Chat**
- [ ] Sign up for Crisp Chat (free tier covers $0-50/mo)
- [ ] Create business account
- [ ] Get embed code
- [ ] Add Crisp widget to root `layout.tsx`:

```tsx
// components/CrispChat.tsx
"use client";
export function CrispChat() {
  useEffect(() => {
    window.$crisp = [];
    const script = document.createElement("script");
    script.src = "https://client.crisp.chat/l.js";
    script.async = true;
    document.head.appendChild(script);
  }, []);
  return null;
}

// In app/layout.tsx
<CrispChat />
```

- [ ] Set up templates for common questions
- [ ] Test chat flow (message yourself)
- [ ] Set operating hours (9 AM ET - 6 PM AEDT = 24 hour coverage)

**Day 7-8: Create Case Studies / Social Proof**
- [ ] Reach out to 10 active users with: "Can we feature your success story?"
- [ ] Record 2-3 video testimonials (10 min each, Loom or simple iPhone)
- [ ] Write 2 text case studies:
  - Case Study 1: "How [Name] Increased Proposal Win Rate from 35% to 62%"
  - Case Study 2: "How [Agency] Scaled to 50 Clients Using Proposar"
- [ ] Add screenshots, revenue impact, quotes
- [ ] Create `/case-studies/` page linking all

**Day 8-9: Populate About Page**
- [ ] Write real company story:
  - What problem inspired Proposar
  - How you solved it
  - Why you believe in it
- [ ] Add team photos (even if just you for now)
- [ ] Add founders' mission statement
- [ ] Link to this story from landing page hero

**Day 9-10: Polish Static Pages**
- [ ] Careers page: At least lay out what roles you'd hire for (inspiring)
- [ ] Affiliate page: Show commission structure (even basic: "Earn 10% per referral")
- [ ] Blog page: Add 2-3 substantive posts (not just placeholders)
  - "How to Write a Winning Proposal (Data-Backed)"
  - "Why 55% of Freelance Proposals Fail"
  - "The Psychology of Proposal Acceptance"

**Deliverable:** Live chat working, 2-3 case studies live, About page real, static pages populated

---

## WEEK 3: GROWTH LOOPS (Referral MVP)

### Goal
Ship minimum viable referral system to unlock word-of-mouth growth.

### Tasks

**Day 11-12: Referral System Backend**

Database changes:

```sql
CREATE TABLE referrals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  referrer_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  referral_code TEXT UNIQUE NOT NULL,
  referee_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  referred_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  reward_claimed BOOLEAN DEFAULT FALSE,
  commission_amount DECIMAL(8,2),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE profiles ADD COLUMN IF NOT EXISTS referral_code TEXT UNIQUE;
CREATE INDEX idx_referrals_referrer_id ON referrals(referrer_id);
```

API endpoint:

```typescript
// app/api/referrals/generate/route.ts
export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  
  const referralCode = `${user.email?.split("@")[0]}-Proposar`.toLowerCase();
  
  const { error } = await supabase
    .from("profiles")
    .update({ referral_code: referralCode })
    .eq("id", user.id);
    
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  
  const referralUrl = `${process.env.NEXT_PUBLIC_APP_URL}?ref=${referralCode}`;
  return NextResponse.json({ referralCode, referralUrl });
}
```

**Day 12-13: Signup Flow Attribution**

Modify signup/onboarding to capture referrer:

```typescript
// In onboarding or signup
const params = new URLSearchParams(window.location.search);
const refCode = params.get("ref");

if (refCode) {
  // Store ref code in session/local state
  // After signup, link user to referrer
  const { data: referrer } = await supabase
    .from("profiles")
    .select("id")
    .eq("referral_code", refCode)
    .single();
    
  if (referrer) {
    await supabase.from("referrals").insert({
      referrer_id: referrer.id,
      referral_code: refCode,
      referee_id: newUser.id,
      referred_at: new Date().toISOString()
    });
  }
}
```

**Day 13-14: Referral Dashboard (Settings page)**

Add new tab in `/dashboard/settings`:

```tsx
<Tabs value={activeTab} onValueChange={setActiveTab}>
  <TabsList>
    <TabsTrigger value="referral">Referral Program</TabsTrigger>
    {/* other tabs */}
  </TabsList>
  
  <TabsContent value="referral">
    <div className="space-y-6">
      <div className="bg-gold/10 border border-gold/30 rounded-lg p-6">
        <h3 className="font-bold text-[#faf8f4] mb-2">Your Referral Link</h3>
        <div className="flex gap-2">
          <input type="text" readOnly value={referralUrl} className="flex-1" />
          <button onClick={() => copy(referralUrl)}>Copy</button>
        </div>
        <p className="text-sm text-[#888890] mt-2">
          Share this link to earn $10 credit for each friend who signs up
        </p>
      </div>
      
      <div>
        <h3 className="font-bold text-[#faf8f4] mb-4">Your Referrals</h3>
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#1e1e2e]">
              <th>Referee Email</th>
              <th>Joined</th>
              <th>Status</th>
              <th>Commission</th>
            </tr>
          </thead>
          <tbody>
            {referrals.map(ref => (
              <tr key={ref.id} className="border-b border-[#1e1e2e]">
                <td>{ref.referee?.email}</td>
                <td>{formatDate(ref.referred_at)}</td>
                <td>{ref.completed_at ? "Active" : "Pending"}</td>
                <td>${ref.commission_amount || "0.00"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="bg-[#0a0a14] border border-[#1e1e2e] rounded-lg p-4">
        <p className="text-[#888890] text-sm">
          Earn $10 credit when someone signs up via your link.
          Earn an additional 10% off their first month subscription when they upgrade.
        </p>
      </div>
    </div>
  </TabsContent>
</Tabs>
```

**Day 14-15: Launch Referral Incentive**

- [ ] Add banner to dashboard: "Earn $10 credits for each referral"
- [ ] Enable promo code system (Stripe-side)
- [ ] Test full flow (sign up with ref link → upgrade → check credits)
- [ ] Email top 50 users: "Start earning with Proposar Referrals"

**Deliverable:** Referral links work, dashboard shows referrals, top 50 users notified

---

## WEEK 4: VALIDATION & ITERATION

### Goal
Get real user feedback, refine based on data, prepare for launch.

### Tasks

**Day 16-17: User Interviews (Async)**
- [ ] Email 50 active users:
```txt
Subject: 2-min survey — what would make Proposar 10x better for you?

Hi [name],

You've used Proposar to create [X proposals]. That's awesome!

Quick question: What ONE thing would make Proposar so valuable you'd pay 2x as much?

I read every response and build based on this.

[Link to Google Form with 5 questions]

Thanks,
[Your Name]
```

- [ ] Document top 3 feature requests
- [ ] Note pain points
- [ ] Share top findings in public (builds community!)

**Day 17-18: Monitor Metrics**
- [ ] Set up dashboard in Vercel Analytics
- [ ] Track:
  - Daily sign-ups
  - Onboarding completion rate
  - Proposal generated / day
  - Free → Paid conversion rate
  - Churn rate
- [ ] Document baseline numbers

**Day 18-19: Create Affiliate Page (Real Version)**
- [ ] Write detailed affiliate/referral doc
- [ ] Explain commission structure
- [ ] How to promote Proposar (social templates, email)
- [ ] Add affiliate contact: "partnerships@Proposar.io"

**Day 19-20: Final Polish**
- [ ] Test entire user journey (signup through proposal → email → PDF → accept)
- [ ] Record loom walkthroughs of new features
- [ ] Updated `/help` with video links
- [ ] Verify all external links work (footer, about, etc.)
- [ ] Mobile test (all key pages)

**Day 20: Soft Launch**
- [ ] Email existing users with "What's New" link
- [ ] Post on Twitter/LinkedIn: "We've added Help, referrals, live chat. Check it out."
- [ ] Announce in ProductHunt (if launching for 1st time)
- [ ] Slack communities / Reddit

**Deliverable:** All 9 gaps closed, metrics tracked, users giving feedback

---

## QUICK REFERENCE: WHAT TO COMPLETE BY APRIL 6

**MUST HAVE ✅**
- [ ] Help Center with 15 articles (live)
- [ ] Live chat support widget (Crisp installed)
- [ ] Referral system (links generate, attribution works)
- [ ] About page with real company story
- [ ] 2 case studies / video testimonials

**SHOULD HAVE**
- [ ] Blog with 3 substantive posts
- [ ] Affiliate page with commission details
- [ ] Careers page with hiring vision
- [ ] User feedback survey results documented
- [ ] Metrics dashboard tracking

**NICE TO HAVE**
- [ ] Mobile app mockups / roadmap public
- [ ] Integration with Zapier (basic)
- [ ] Email signature templates in settings
- [ ] Proposal templates store (pre-built)

---

## SUCCESS CRITERIA

By April 6, 2026:
- ✅ 30K+ sign-ups (from current baseline)
- ✅ 10K+ views to Help Center
- ✅ 5 referrals through program
- ✅ 2+ case studies featured
- ✅ Live chat answering questions
- ✅ 0 "Coming Soon" pages on site

---

## IF SOMETHING SLIPS

**Priority Order (what to cut if time is tight):**

1. **DO NOT SKIP:**
   - Help Center (15 articles is table stakes)
   - Live chat widget (easy win for trust)
   - About page (credibility)

2. **CAN DEFER TO WEEK 5:**
   - Referral system (move to next sprint)
   - Case study videos (static text versions)
   - Careers page (hire as you grow)

3. **CAN DROP:**
   - Blog posts (repurpose Help articles instead)
   - Affiliate page details (good copy, not perfect)

---

## TOOLS & RESOURCES NEEDED

| Task | Tool | Cost | Time |
|------|------|------|------|
| Help Center | Built-in (markdown) | $0 | 16 hours |
| Live Chat | Crisp.chat | Free-$50/mo | 2 hours |
| Case Study Videos | Loom or iPhone | $0-10/mo | 3 hours |
| Database | Supabase (built-in) | $0 |1 hour |
| Content | ChatGPT (draft) + You (refine) | $20 | 8 hours |
| Design | Figma (existing) | $0 | 2 hours |

**Total estimated time: 32 hours**  
**Spread across 4 weeks = 8 hours/week = 1 day/week**

---

## GO. SHIP. WIN.

This isn't theoretical. Every task here is doable on your current tech stack. Every feature is proven to work in other SaaS apps.

The only difference between "startup with potential" and "startup people use" is execution.

30 days. 9 gaps. Let's close them.

🚀
