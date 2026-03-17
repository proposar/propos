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
    console.error("[OpenAI] API key not configured - OPENAI_API_KEY is missing from environment");
    throw new Error("OpenAI API key not configured. Please set OPENAI_API_KEY in Vercel environment variables.");
  }

  try {
    console.log("[OpenAI] Calling ChatGPT API for proposal generation...");
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      max_tokens: 4000,
      temperature: 0.7,
      messages: [
        {
          role: "system",
          content: `You are an elite business proposal writer for freelancers. You write in a clear, professional, and persuasive tone. You write the complete proposal in the target language requested by the user.`,
        },
        { role: "user", content: userPrompt },
      ],
    });

    const text = completion.choices[0]?.message?.content ?? "";
    if (!text) {
      throw new Error("OpenAI returned empty response");
    }
    console.log("[OpenAI] ✅ Successfully generated proposal content");
    return text;
  } catch (error) {
    console.error("[OpenAI] API call failed:", error instanceof Error ? error.message : error);
    throw error;
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
Protect both parties fairly. You write the complete contract in the target language requested by the user.`;

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
