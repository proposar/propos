import Anthropic from "@anthropic-ai/sdk";

export const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY ?? "",
});

const SYSTEM_PROMPT = `You are an elite business proposal writer with 20 years of experience helping freelancers and agencies win high-value contracts. You have studied thousands of winning proposals. You write proposals that are persuasive, professional, and make clients feel completely understood. Your proposals have helped win over $50M in contracts. You write in clear, confident English targeting US, UK, AUS, and Canadian clients.`;

export interface ProposalPromptInput {
  yourName?: string;
  businessName?: string;
  yourTitle?: string;
  clientName: string;
  clientCompany?: string;
  industry: string;
  projectTitle: string;
  projectType: string;
  customServiceDescription?: string;
  customServices?: { name: string; description: string }[];
  projectScope: string;
  budgetAmount: number;
  budgetType: string;
  currency: string;
  timeline: string;
  paymentTerms: string;
  startDate?: string;
  tone: string;
  toneDescription: string;
  sections: string[];
  additionalContext?: string;
  lineItemsEnabled?: boolean;
  lineItems?: { item_name: string; quantity: number; unit: string; rate: number }[];
  subtotal?: number;
  discountPercent?: number;
  taxPercent?: number;
  grandTotal?: number;
}

export function buildProposalUserPrompt(input: ProposalPromptInput): string {
  let pricingContext = `Budget: ${input.currency}${input.budgetAmount} (${input.budgetType})`;

  if (input.lineItemsEnabled && input.lineItems && input.lineItems.length > 0) {
    const currency = input.currency === "USD" ? "$" : (input.currency === "GBP" ? "£" : (input.currency === "EUR" ? "€" : ""));
    const itemsStr = input.lineItems.map(item => `- ${item.item_name}: ${item.quantity} ${item.unit} × ${currency}${item.rate} = ${currency}${(item.quantity * item.rate)}`).join('\n');
    pricingContext = `
The client's itemized pricing is:
${itemsStr}
Subtotal: ${currency}${input.subtotal}
${(input.discountPercent && input.discountPercent > 0) ? `Discount: ${input.discountPercent}%` : ''}
${(input.taxPercent && input.taxPercent > 0) ? `Tax: ${input.taxPercent}%` : ''}
Grand Total: ${currency}${input.grandTotal}

Reference these exact numbers in the Investment section. Do not change or round the amounts.
    `.trim();
  }

  // Mitigate prompt injection: treat user content as data, not instructions
  const safeContext = (input.additionalContext ?? "")
    .slice(0, 3000)
    .replace(/\b(ignore|disregard|forget|override)\s+(previous|prior|above|all)\s+(instructions?|prompts?)\b/gi, "[filtered]");
  const safeScope = (input.projectScope ?? "").slice(0, 4000);

  // Build custom services section if provided
  let customServicesSection = "";
  if (input.customServices && input.customServices.length > 0) {
    const servicesText = input.customServices
      .map((s) => `- **${s.name}**: ${s.description.slice(0, 300)}`)
      .join("\n");
    customServicesSection = `

CUSTOM SERVICES YOU OFFER:
${servicesText}

When describing the project solution, reference these specific services that match what the client needs.`;
  }

  return `Write a complete, professional business proposal with the following details:

FREELANCER/AGENCY INFORMATION:
- Name: ${input.yourName ?? "Freelancer"}
- Business: ${input.businessName ?? "—"}
- Title: ${input.yourTitle ?? "—"}

CLIENT INFORMATION:
- Client Name: ${input.clientName}
- Company: ${input.clientCompany ?? "—"}
- Industry: ${input.industry}

PROJECT DETAILS:
- Project Title: ${input.projectTitle}
- Project Type: ${input.projectType}${input.projectType === "Other" && input.customServiceDescription ? ` (Freelancer's service: ${input.customServiceDescription.slice(0, 400)})` : ""}
- Scope: ${safeScope}
- ${pricingContext}
- Timeline: ${input.timeline}
- Payment Terms: ${input.paymentTerms}
- Start Date: ${input.startDate ?? "—"}
${customServicesSection}

TONE: ${input.tone} — ${input.toneDescription}

SECTIONS TO INCLUDE: ${input.sections.join(", ")}

ADDITIONAL CONTEXT: ${safeContext || "None"}

WRITING RULES:
1. Open with the CLIENT'S problem — not your credentials
2. Use the client's name ${input.clientName} at least 3 times naturally
3. Make them feel understood before selling anything
4. Quantify benefits wherever possible (save X hours, increase Y by Z%)
5. Use confident language — avoid "I think", "maybe", "possibly"
6. The investment section should list what's included clearly with your pricing. If an itemized breakdown was provided, display the itemized breakdown exactly in the Investment section.
7. End with ONE clear next step — not multiple options
8. Write in ${input.tone} voice throughout
9. Total length: 600-800 words (not counting headers)
10. Format in clean markdown with ## headers for each section
11. In the "Proposed Solution" section, specifically mention which custom services will be used to solve the client's problem

Write the complete proposal now. This is a final, ready-to-send document.`;
}

export async function generateProposal(userPrompt: string): Promise<string> {
  if (!process.env.ANTHROPIC_API_KEY) {
    console.warn("[Anthropic] API key not configured, falling back to OpenAI");
    throw new Error("ANTHROPIC_API_KEY not configured");
  }
  
  try {
    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 4000,
      temperature: 0.7,
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: userPrompt }],
    });
    const text = message.content.find((c) => c.type === "text");
    return text && "text" in text ? text.text : "";
  } catch (error) {
    console.error("[Anthropic] Generation failed:", error instanceof Error ? error.message : error);
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

export async function generateChaseEmail(input: ChaseEmailInput): Promise<{ subject: string; body: string }> {
  const { freelancerName, clientName, projectType, currency, amount, step } = input;
  const prompts: Record<1 | 2 | 3 | 4, string> = {
    1: `Write a short follow-up email from ${freelancerName} to ${clientName} about a proposal for ${projectType} worth ${currency}${amount}. The client hasn't opened it yet. Be casual and check if it arrived. Subject line first, then email body.`,
    2: `Write a follow-up email from ${freelancerName} to ${clientName}. They sent a proposal 7 days ago. Client hasn't responded. Acknowledge they're probably busy. Offer to answer questions. Include a 3-bullet summary of what's included. Subject line first, then email body.`,
    3: `Write a re-engagement email from ${freelancerName} to ${clientName}. 2 weeks since proposal. No response. Be brief and direct. Ask a simple yes/no question: 'Is this still something you'd like to explore?' Give them an easy out if timing is bad. Subject line first, then email body.`,
    4: `Write a final follow-up email. It's been 3 weeks. Create gentle urgency — proposal expires soon. Keep it 2 sentences max. No hard sell. Make it easy to reply with just one word. Subject line first, then email body.`,
  };

  if (!process.env.ANTHROPIC_API_KEY) {
    const fallbacks: Record<1 | 2 | 3 | 4, { subject: string; body: string }> = {
      1: {
        subject: `Quick check – did you get my proposal?`,
        body: `Hi ${clientName}, just wanted to make sure the proposal for our ${projectType} project arrived. Happy to answer any questions.`,
      },
      2: {
        subject: `Following up on ${projectType} proposal`,
        body: `Hi ${clientName}, I know things get busy. Here's a quick summary of what's included: [deliverables]. Let me know if you have any questions.`,
      },
      3: {
        subject: `Is this still on your radar?`,
        body: `Hi ${clientName}, checking in – is this project still something you'd like to explore? No worries if the timing has changed.`,
      },
      4: {
        subject: `Last note – proposal expiring soon`,
        body: `Hi ${clientName}, just a heads-up the proposal expires soon. A simple "yes" or "not now" works.`,
      },
    };
    return fallbacks[step];
  }

  const message = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 500,
    temperature: 0.6,
    system: CHASE_SYSTEM_PROMPT,
    messages: [{ role: "user", content: prompts[step] }],
  });
  const text = message.content.find((c) => c.type === "text");
  const raw = text && "text" in text ? text.text : "";
  const [subject = "", body = ""] = raw.split(/\n([\s\S]*)/).map((s) => s.trim());
  return { subject: subject || "Following up", body: body || raw };
}

const CONTRACT_SYSTEM = `You are a professional contract writer for freelancers.
Write clear, simple, legally-sensible contracts.
Not overly legal. Plain English. Protects both parties fairly.`;

export async function generateContract(userPrompt: string): Promise<string> {
  if (!process.env.ANTHROPIC_API_KEY) {
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
  const message = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 3000,
    temperature: 0.4,
    system: CONTRACT_SYSTEM,
    messages: [{ role: "user", content: userPrompt }],
  });
  const text = message.content.find((c) => c.type === "text");
  return text && "text" in text ? text.text : "";
}
