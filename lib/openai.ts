/**
 * OpenAI (ChatGPT) integration for proposal, chase email, and contract generation
 */

import OpenAI from "openai";

function getOpenAI(): OpenAI | null {
  // Use environment variable from Vercel or .env.local
  const apiKey = (process.env.OPENAI_API_KEY ?? "").trim();
  
  if (!apiKey || apiKey === "placeholder") {
    console.warn("OpenAI API key not configured");
    return null;
  }
  
  try {
    return new OpenAI({ apiKey });
  } catch (e) {
    console.error("Failed to initialize OpenAI client:", e instanceof Error ? e.message : e);
    return null;
  }
}

export async function generateProposalWithOpenAI(userPrompt: string): Promise<string> {
  const openai = getOpenAI();
  
  if (!openai) {
    // Return detailed template when OpenAI is not configured
    return `# Professional Business Proposal

## Executive Summary
We are pleased to present this comprehensive proposal. Our team understands your needs and is prepared to deliver exceptional results.

## Proposed Solution
We will deliver a professional solution tailored to your specific requirements.

## Deliverables
- Strategic planning and consultation
- Implementation and execution
- Quality assurance and testing
- Training and documentation
- Post-launch support

## Timeline
We estimate this project will require 2-4 weeks for completion, with regular milestone updates.

## Investment
We believe in transparent pricing. Our proposal includes all services outlined above.

## Next Steps
We'd love to discuss this proposal with you. Please reply with any questions, feedback, or to move forward.

---
*Configure OPENAI_API_KEY in Vercel environment variables to enable AI-powered proposals.*`;
  }

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      max_tokens: 4000,
      temperature: 0.7,
      messages: [
        {
          role: "system",
          content: `You are an elite business proposal writer with 20 years of experience helping freelancers and agencies win high-value contracts. You write proposals that are persuasive, professional, and make clients feel completely understood. Write in clear, confident English targeting US, UK, AUS, and Canadian clients.`,
        },
        { role: "user", content: userPrompt },
      ],
    });

    const text = completion.choices[0]?.message?.content ?? "";
    if (!text) throw new Error("Empty response from OpenAI");
    return text;
  } catch (error) {
    console.error("OpenAI API error:", error instanceof Error ? error.message : error);
    // Return professional template on API error
    return `# Professional Business Proposal

## Executive Summary
Thank you for considering our services. We have prepared this proposal based on your requirements.

## Proposed Solution
We will deliver a comprehensive solution tailored to your business needs, ensuring maximum value and timely delivery.

## Deliverables
- Detailed project scope and specifications
- Professional implementation
- Quality assurance
- Ongoing support

## Timeline & Budget
Please see the detailed breakdown below for timeline and investment details.

## Why Choose Us
- Proven track record with similar projects
- Professional and responsive team
- Commitment to exceeding expectations
- Transparent communication throughout

## Next Steps
We're excited about the opportunity to work with you. Reply to this proposal to schedule a call or ask any questions.

---
*Note: This is a template proposal. For fully AI-generated proposals, ensure OPENAI_API_KEY is configured.*`;
  }
}


const CHASE_SYSTEM_PROMPT = `You are writing follow-up emails for a freelancer chasing a client who hasn't responded to a proposal.
Write short, warm, non-pushy emails that get replies.
Never sound desperate. Always sound confident and busy.
Maximum 4 sentences per email.
Format your response as exactly two lines: first line is the subject (no prefix), second line is the body. Separate with a single newline.`;

export interface ChaseEmailInput {
  freelancerName: string;
  clientName: string;
  projectType: string;
  currency: string;
  amount: number;
  step: 1 | 2 | 3 | 4;
}

const CHASE_PROMPTS: Record<1 | 2 | 3 | 4, (input: ChaseEmailInput) => string> = {
  1: (i) => `Write a short follow-up email from ${i.freelancerName} to ${i.clientName} about a proposal for ${i.projectType} worth ${i.currency}${i.amount}. The client hasn't opened it yet. Be casual and check if it arrived. Subject line first, then email body.`,
  2: (i) => `Write a follow-up email from ${i.freelancerName} to ${i.clientName}. They sent a proposal 7 days ago. Client hasn't responded. Acknowledge they're probably busy. Offer to answer questions. Include a 3-bullet summary of what's included. Subject line first, then email body.`,
  3: (i) => `Write a re-engagement email from ${i.freelancerName} to ${i.clientName}. 2 weeks since proposal. No response. Be brief and direct. Ask a simple yes/no question: 'Is this still something you'd like to explore?' Give them an easy out if timing is bad. Subject line first, then email body.`,
  4: (i) => `Write a final follow-up email. It's been 3 weeks. Create gentle urgency — proposal expires soon. Keep it 2 sentences max. No hard sell. Make it easy to reply with just one word. Subject line first, then email body.`,
};

export async function generateChaseEmailWithOpenAI(input: ChaseEmailInput): Promise<{ subject: string; body: string }> {
  const fallbacks: Record<1 | 2 | 3 | 4, { subject: string; body: string }> = {
    1: { subject: `Quick check – did you get my proposal?`, body: `Hi ${input.clientName}, just wanted to make sure the proposal for our ${input.projectType} project arrived. Happy to answer any questions.` },
    2: { subject: `Following up on ${input.projectType} proposal`, body: `Hi ${input.clientName}, I know things get busy. Here's a quick summary of what's included: [deliverables]. Let me know if you have any questions.` },
    3: { subject: `Is this still on your radar?`, body: `Hi ${input.clientName}, checking in – is this project still something you'd like to explore? No worries if the timing has changed.` },
    4: { subject: `Last note – proposal expiring soon`, body: `Hi ${input.clientName}, just a heads-up the proposal expires soon. A simple "yes" or "not now" works.` },
  };

  if (!getOpenAI()) return fallbacks[input.step];

  const completion = await getOpenAI()!.chat.completions.create({
    model: "gpt-4o-mini",
    max_tokens: 500,
    temperature: 0.6,
    messages: [
      { role: "system", content: CHASE_SYSTEM_PROMPT },
      { role: "user", content: CHASE_PROMPTS[input.step](input) },
    ],
  });
  const raw = completion.choices[0]?.message?.content ?? "";
  const [subject = "", body = ""] = raw.split(/\n([\s\S]*)/).map((s) => s.trim());
  return { subject: subject || "Following up", body: body || raw };
}

const CONTRACT_SYSTEM = `You are a professional contract writer for freelancers.
Write clear, simple, legally-sensible contracts.
Not overly legal. Plain English. Protects both parties fairly.`;

export async function generateContractWithOpenAI(userPrompt: string): Promise<string> {
  if (!getOpenAI()) {
    return `# Freelance Contract

## 1. Project scope and deliverables
[To be filled from proposal]

## 2. Timeline and milestones
[To be filled from proposal]

## 3. Payment terms and schedule
[To be filled from proposal]

## 4. Revision policy
Maximum 2 rounds of revisions included.

## 5. Intellectual property
Client owns final work upon full payment.

## 6. Confidentiality
Both parties agree to keep project details confidential.

## 7. Termination
14 days written notice required.

## 8. Signatures
Freelancer: _________________________ Date: _______
Client: _________________________ Date: _______
`;
  }
  const completion = await getOpenAI()!.chat.completions.create({
    model: "gpt-4o-mini",
    max_tokens: 3000,
    temperature: 0.4,
    messages: [
      { role: "system", content: CONTRACT_SYSTEM },
      { role: "user", content: userPrompt },
    ],
  });
  return completion.choices[0]?.message?.content ?? "";
}
