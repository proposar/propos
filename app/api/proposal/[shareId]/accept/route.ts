import { NextResponse } from "next/server";
import { createClient, createAdminClient } from "@/lib/supabase/server";
import { sendProposalAcceptedEmail } from "@/lib/resend";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ shareId: string }> }
) {
  const { shareId } = await params;
  const supabase = await createClient();
  let admin;
  try {
    admin = createAdminClient();
  } catch {
    return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
  }

  const { data: proposal, error: fetchErr } = await supabase
    .from("proposals")
    .select("id, user_id, title, budget_amount, budget_currency, client_name, status")
    .eq("share_id", shareId)
    .single();

  if (fetchErr || !proposal) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (proposal.status === "accepted") {
    return NextResponse.json({ error: "Already accepted" }, { status: 400 });
  }

  const { error: updateErr } = await admin
    .from("proposals")
    .update({
      status: "accepted",
      accepted_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq("id", proposal.id);

  if (updateErr) return NextResponse.json({ error: updateErr.message }, { status: 500 });

  await admin.from("activity_log").insert({
    user_id: proposal.user_id,
    proposal_id: proposal.id,
    event_type: "proposal_accepted",
    metadata: {},
  });

  const { data: profile } = await admin.from("profiles").select("email, notify_proposal_accepted").eq("id", proposal.user_id).single();
  const amount = proposal.budget_amount != null ? `${proposal.budget_currency ?? "USD"} ${Number(proposal.budget_amount).toLocaleString()}` : "";
  if (profile?.notify_proposal_accepted !== false && profile?.email) {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://proposar.io";
    sendProposalAcceptedEmail(profile.email, proposal.client_name, amount, proposal.title, `${appUrl}/proposals/${proposal.id}`).catch(console.error);
  }

  return NextResponse.json({
    success: true,
    proposal: { title: proposal.title, amount: proposal.budget_amount, currency: proposal.budget_currency, client_name: proposal.client_name },
  });
}
