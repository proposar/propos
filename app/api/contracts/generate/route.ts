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
  const prompt = `Generate a freelance contract for:
Freelancer: ${freelancerName}, ${businessName}
Client: ${proposal.client_name}, ${proposal.client_company ?? ""}
Project: ${proposal.project_type}, ${proposal.project_scope}
Value: ${proposal.budget_currency ?? "USD"} ${proposal.budget_amount ?? 0}
Timeline: ${proposal.timeline ?? "To be agreed"}
Payment terms: From proposal
Deliverables: ${Array.isArray(proposal.deliverables) ? proposal.deliverables.join(", ") : "From proposal"}

Include sections:
1. Project scope and deliverables
2. Timeline and milestones
 3. Payment terms and schedule (including deposits, milestone payments, late fees/interest, and what happens if the client does not pay on time)
 4. Revision policy (max 2 rounds)
 5. Intellectual property (client owns final work)
 6. Confidentiality (basic)
 7. Termination (14 days notice, including for non-payment)
 8. Limitation of liability
 9. Governing law and dispute resolution (use ${freelancerCountry} as the governing law; include that electronic signatures are valid)
 10. Signature block (freelancer + client, ready for e-signing)`;

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
