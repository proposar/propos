import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { generateChaseEmailWithOpenAI } from "@/lib/openai";
import { checkAIRateLimit } from "@/lib/rate-limit";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: proposalId } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: seq } = await supabase
    .from("follow_up_sequences")
    .select("id, status, created_at")
    .eq("proposal_id", proposalId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (!seq) return NextResponse.json({ sequence: null });

  const { data: steps } = await supabase
    .from("follow_up_steps")
    .select("id, step_number, day_offset, status, subject, scheduled_for, sent_at")
    .eq("sequence_id", seq.id)
    .order("step_number");

  return NextResponse.json({ sequence: { ...seq, steps: steps ?? [] } });
}

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: proposalId } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: proposal, error: propErr } = await supabase
    .from("proposals")
    .select("id, user_id, title, client_name, client_email, project_type, budget_amount, budget_currency, sent_at")
    .eq("id", proposalId)
    .eq("user_id", user.id)
    .single();

  if (propErr || !proposal) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (!proposal.sent_at) return NextResponse.json({ error: "Proposal must be sent first" }, { status: 400 });

  const { data: existing } = await supabase
    .from("follow_up_sequences")
    .select("id")
    .eq("proposal_id", proposalId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (existing) return NextResponse.json({ error: "Sequence already exists" }, { status: 400 });

  const rateCheck = checkAIRateLimit(user.id);
  if (!rateCheck.ok) {
    return NextResponse.json(
      { error: "Too many AI requests. Please wait a moment.", retryAfter: rateCheck.retryAfter },
      { status: 429 }
    );
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, email")
    .eq("id", user.id)
    .single();

  const freelancerName = profile?.full_name ?? "Freelancer";
  const clientName = proposal.client_name ?? "Client";
  const projectType = proposal.project_type ?? "Project";
  const currency = proposal.budget_currency ?? "USD";
  const amount = Number(proposal.budget_amount ?? 0);

  const steps: { step_number: number; day_offset: number }[] = [
    { step_number: 1, day_offset: 3 },
    { step_number: 2, day_offset: 7 },
    { step_number: 3, day_offset: 14 },
    { step_number: 4, day_offset: 21 },
  ];

  const baseDate = new Date(proposal.sent_at);

  const { data: sequence, error: seqErr } = await supabase
    .from("follow_up_sequences")
    .insert({ proposal_id: proposalId, user_id: user.id, status: "active" })
    .select("id")
    .single();

  if (seqErr) return NextResponse.json({ error: seqErr.message }, { status: 500 });

  const generateChase = generateChaseEmailWithOpenAI;

  for (const { step_number, day_offset } of steps) {
    const { subject, body } = await generateChase({
      freelancerName,
      clientName,
      projectType,
      currency,
      amount,
      step: step_number as 1 | 2 | 3 | 4,
    });

    const scheduledFor = new Date(baseDate);
    scheduledFor.setDate(scheduledFor.getDate() + day_offset);

    await supabase.from("follow_up_steps").insert({
      sequence_id: sequence.id,
      proposal_id: proposalId,
      step_number,
      day_offset,
      status: "scheduled",
      channel: "email",
      subject,
      body: body.replace(/\n/g, "\n\n"),
      scheduled_for: scheduledFor.toISOString(),
    });
  }

  await supabase
    .from("proposals")
    .update({ sequence_active: true, sequence_paused: false })
    .eq("id", proposalId)
    .eq("user_id", user.id);

  return NextResponse.json({ success: true, sequenceId: sequence.id });
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: proposalId } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json().catch(() => ({}));
  const status = body.status as string | undefined;
  if (!status || !["active", "paused"].includes(status)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  const { data: seq } = await supabase
    .from("follow_up_sequences")
    .select("id")
    .eq("proposal_id", proposalId)
    .eq("user_id", user.id)
    .single();

  if (!seq) return NextResponse.json({ error: "Not found" }, { status: 404 });

  await supabase.from("follow_up_sequences").update({ status }).eq("id", seq.id);
  await supabase
    .from("proposals")
    .update({ sequence_paused: status === "paused" })
    .eq("id", proposalId)
    .eq("user_id", user.id);

  return NextResponse.json({ success: true });
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: proposalId } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: seq } = await supabase
    .from("follow_up_sequences")
    .select("id")
    .eq("proposal_id", proposalId)
    .eq("user_id", user.id)
    .single();

  if (!seq) return NextResponse.json({ error: "Not found" }, { status: 404 });

  await supabase.from("follow_up_steps").update({ status: "cancelled" }).eq("sequence_id", seq.id).eq("status", "scheduled");
  await supabase.from("follow_up_sequences").update({ status: "cancelled" }).eq("id", seq.id);
  await supabase.from("proposals").update({ sequence_active: false, sequence_paused: false }).eq("id", proposalId).eq("user_id", user.id);

  return NextResponse.json({ success: true });
}
