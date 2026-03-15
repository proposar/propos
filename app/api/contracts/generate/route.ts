import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { generateContractWithOpenAI } from "@/lib/openai";
import { checkAIRateLimit } from "@/lib/rate-limit";
import { getMarketRules } from "@/lib/global-market-rules";

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json().catch(() => ({}));
  const proposalId = body.proposalId as string | undefined;
  if (!proposalId) return NextResponse.json({ error: "proposalId required" }, { status: 400 });

  const { data: proposal } = await supabase
    .from("proposals")
    .select("id, title, client_name, client_email, client_company, project_type, project_scope, budget_amount, budget_currency, timeline, deliverables, user_id")
    .eq("id", proposalId)
    .eq("user_id", user.id)
    .single();

  if (!proposal) return NextResponse.json({ error: "Proposal not found" }, { status: 404 });

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, business_name, country")
    .eq("id", user.id)
    .single();

  const freelancerName = profile?.full_name ?? "Freelancer";
  const businessName = profile?.business_name ?? "";
  const freelancerCountry = profile?.country ?? "Freelancer's jurisdiction";
  const rules = getMarketRules(profile?.country);

  const prompt = `Act as a Senior Legal Counsel specializing in freelance and agency service agreements. Generate a premium Service Agreement between:

Service Provider (Freelancer): ${freelancerName}, ${businessName} (Located in: ${freelancerCountry})
Client: ${proposal.client_name}, ${proposal.client_company ?? "Individual"}
Project: ${proposal.project_type}
Scope: ${proposal.project_scope}
Contract Value: ${proposal.budget_currency ?? "USD"} ${proposal.budget_amount ?? 0}
Timeline: ${proposal.timeline ?? "To be defined in milestones"}

Jurisdiction pack selected: ${rules.displayCountry}
Governing law guidance: ${rules.contract.governingLaw}
Late fee guidance: ${rules.contract.lateFeeClause}
E-sign guidance: ${rules.contract.eSignatureClause}
Mediation window: ${rules.contract.mediationDays} days

CORE OBJECTIVE: Protect the Freelancer/Agency from ghosting, scope creep, IP misuse, and non-payment while remaining commercially fair.

The contract MUST include these clauses in professional legal language:
1. Detailed Scope & Deliverables aligned to provided project context.
2. Anti-ghosting payment schedule:
   - Mandatory upfront deposit: 50% before work starts.
   - Milestone triggers for remaining balance.
   - Late-payment clause aligned with this guidance: ${rules.contract.lateFeeClause}
3. Kill-fee / early termination: 25% of remaining contract value if client terminates for convenience or is unresponsive for >14 days, plus payment for completed work.
4. IP transfer only after full and final payment.
5. Revision policy: maximum 2 minor rounds; major changes require new SOW.
6. Governing law clause aligned to: ${rules.contract.governingLaw}
7. Dispute resolution with ${rules.contract.mediationDays}-day mediation before formal proceedings.
8. E-signature enforceability clause aligned to: ${rules.contract.eSignatureClause}
9. Professional legal caution note at the end using this wording:
   "${rules.contract.cautionNote}"

Formatting requirements:
- Use clean Markdown headings.
- Use numbered clauses and bullet points for obligations.
- Add a signature block for both Freelancer and Client.
- Avoid placeholder markers like [Insert] or TODO.`;

  const rateCheck = checkAIRateLimit(user.id);
  if (!rateCheck.ok) {
    return NextResponse.json(
      { error: "Too many AI requests. Please wait a moment.", retryAfter: rateCheck.retryAfter },
      { status: 429 }
    );
  }

  const content = await generateContractWithOpenAI(prompt);
  const { data: prop } = await supabase.from("proposals").select("client_name, client_email").eq("id", proposalId).single();
  return NextResponse.json({
    content,
    title: `Contract: ${proposal.title}`,
    clientName: prop?.client_name ?? proposal.client_name,
    clientEmail: prop?.client_email ?? null,
  });
}
