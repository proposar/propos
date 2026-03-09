import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { sendSequenceStepEmail } from "@/lib/resend";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://proposar.io";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string; stepId: string }> }
) {
  const { id: proposalId, stepId } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: step } = await supabase
    .from("follow_up_steps")
    .select("id, subject, body, status, sequence_id")
    .eq("id", stepId)
    .eq("proposal_id", proposalId)
    .single();

  if (!step || step.status !== "scheduled")
    return NextResponse.json({ error: "Step not found or already sent" }, { status: 404 });

  const { data: proposal } = await supabase
    .from("proposals")
    .select("id, share_id, client_name, client_email, user_id")
    .eq("id", proposalId)
    .eq("user_id", user.id)
    .single();

  if (!proposal || !proposal.client_email)
    return NextResponse.json({ error: "Proposal or client email not found" }, { status: 404 });

  const { data: profile } = await supabase
    .from("profiles")
    .select("email")
    .eq("id", user.id)
    .single();

  const proposalLink = `${APP_URL}/proposal/${proposal.share_id}`;

  try {
    await sendSequenceStepEmail({
      to: proposal.client_email,
      subject: step.subject ?? "Following up",
      body: step.body ?? "",
      replyTo: profile?.email ?? undefined,
      proposalLink,
    });
  } catch (e) {
    console.error("Send step error:", e);
    return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
  }

  await supabase
    .from("follow_up_steps")
    .update({ status: "sent", sent_at: new Date().toISOString() })
    .eq("id", stepId);

  const { data: steps } = await supabase
    .from("follow_up_steps")
    .select("step_number")
    .eq("sequence_id", step.sequence_id)
    .eq("status", "sent");

  if (steps?.length === 4) {
    await supabase
      .from("follow_up_sequences")
      .update({ status: "completed" })
      .eq("id", step.sequence_id);
  }

  return NextResponse.json({ success: true });
}
