import { NextResponse } from "next/server";
import { createClient, createAdminClient } from "@/lib/supabase/server";
import { sendProposalViewedAlert } from "@/lib/resend";
import { proposalTrackingSchema } from "@/lib/validators";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();
  const admin = createAdminClient();

  const { data: proposal } = await supabase
    .from("proposals")
    .select("id, user_id, title, client_name")
    .eq("id", id)
    .single();

  if (!proposal) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const body = await request.json().catch(() => ({}));
  
  // Validate request body with Zod
  const validationResult = proposalTrackingSchema.safeParse(body);
  if (!validationResult.success) {
    return NextResponse.json(
      { error: "Validation failed", details: validationResult.error.flatten() },
      { status: 400 }
    );
  }

  const { scrolled_to_percent: scrollDepth, duration_seconds: durationSeconds } = validationResult.data;
  const userAgent = request.headers.get("user-agent") ?? undefined;

  await supabase.from("proposal_views").insert({
    proposal_id: id,
    scrolled_to_percent: scrollDepth,
    duration_seconds: durationSeconds,
    user_agent: userAgent,
  });

  const { data: row } = await supabase.from("proposals").select("view_count").eq("id", id).single();
  const viewCount = (row?.view_count ?? 0) + 1;
  await supabase.from("proposals").update({
    view_count: viewCount,
    viewed_at: new Date().toISOString(),
    last_viewed_at: new Date().toISOString(),
    status: "viewed",
  }).eq("id", id);

  const { data: profile } = await admin.from("profiles").select("email, notify_proposal_viewed").eq("id", proposal.user_id).single();
  if (profile?.notify_proposal_viewed !== false && profile?.email) {
    const viewTime = durationSeconds >= 60 ? `${Math.floor(durationSeconds / 60)} min` : durationSeconds > 0 ? `${durationSeconds} sec` : "";
    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://proposar.io";
    sendProposalViewedAlert(profile.email, proposal.client_name, proposal.title, viewTime, `${appUrl}/proposals/${id}`).catch(console.error);
  }

  return NextResponse.json({ tracked: true });
}
