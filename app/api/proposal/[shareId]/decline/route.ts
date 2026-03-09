import { NextResponse } from "next/server";
import { createClient, createAdminClient } from "@/lib/supabase/server";
import { sendProposalDeclinedEmail } from "@/lib/resend";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ shareId: string }> }
) {
  const { shareId } = await params;
  const supabase = await createClient();
  let admin: ReturnType<typeof createAdminClient>;
  try {
    admin = createAdminClient();
  } catch {
    return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
  }

  const { data: proposal, error: fetchErr } = await supabase
    .from("proposals")
    .select("id, user_id, title, client_name")
    .eq("share_id", shareId)
    .single();

  if (fetchErr || !proposal) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if ((proposal as { status?: string }).status === "declined") {
    return NextResponse.json({ error: "Already declined" }, { status: 400 });
  }

  const body = await request.json().catch(() => ({}));
  const reason = (body.reason as string)?.trim();

  const { error: updateErr } = await admin
    .from("proposals")
    .update({
      status: "declined",
      declined_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq("id", proposal.id);

  if (updateErr) return NextResponse.json({ error: updateErr.message }, { status: 500 });

  await admin.from("activity_log").insert({
    user_id: proposal.user_id,
    proposal_id: proposal.id,
    event_type: "proposal_declined",
    metadata: reason ? { reason } : {},
  });

  const { data: profile } = await admin.from("profiles").select("email, notify_proposal_declined").eq("id", proposal.user_id).single();
  if (profile?.notify_proposal_declined !== false && profile?.email) {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://proposar.io";
    sendProposalDeclinedEmail(profile.email, proposal.client_name, proposal.title, reason, `${appUrl}/proposals/new`).catch(console.error);
  }

  return NextResponse.json({ success: true });
}
