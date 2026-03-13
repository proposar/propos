import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { generateContractWithOpenAI } from "@/lib/openai";
import { checkAIRateLimit } from "@/lib/rate-limit";

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
  const prompt = `Act as a Senior Legal Counsel specializing in Freelance and Agency Law. Generate a high-performance, premium Service Agreement between:

Lessor/Service Provider (Freelancer): ${freelancerName}, ${businessName} (Located in: ${freelancerCountry})
Lessee/Client: ${proposal.client_name}, ${proposal.client_company ?? "Individual"}
Project: ${proposal.project_type}
Scope: ${proposal.project_scope}
Contract Value: ${proposal.budget_currency ?? "USD"} ${proposal.budget_amount ?? 0}
Timeline: ${proposal.timeline ?? "To be defined in milestones"}

CORE OBJECTIVE: Protect the Freelancer/Agency from 'Ghosting', Scope Creep, and Non-Payment.

The contract MUST include these specific clauses in professional legal language:
1. Detailed Scope & Deliverables: Based on the provided project description.
2. Anti-Ghosting Payment Schedule:
   - Mandatory Upfront Deposit: 50% required before work commences.
   - Milestone Payments: Clear triggers for remaining 50% (e.g., 25% on first draft, 25% on final delivery).
   - Late Payment Terms: 5% weekly interest on overdue invoices.
3. Kill-Fee / Early Termination: If the client terminates for convenience or disappears (ghosts) for >14 days, a 25% "Kill Fee" of the remaining contract value is immediately due plus payment for all work done.
4. Intellectual Property (IP) Protection: Crucial - IP transfer ONLY happens upon receipt of FULL AND FINAL PAYMENT. The client has no right to use the work if a balance remains.
5. Revision Policy: Max 2 rounds of minor revisions. Major changes require a new SOW.
6. Governing Law: Use ${freelancerCountry} law. If India, reference the Information Technology Act 2000.
7. Dispute Resolution: Mandatory 14-day mediation before any legal action.
8. Electronic Signatures: Explicitly state that e-signatures through this platform are legally binding and enforceable.

Format the output in clean Markdown with clear headings and a Signature Block at the end.`;

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
