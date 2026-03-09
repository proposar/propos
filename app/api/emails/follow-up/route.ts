import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { sendFollowUpReminder, sendSequenceStepEmail } from "@/lib/resend";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://proposar.io";

interface FollowUpResponse {
  sent: number;
  sequenceSteps?: number;
  error?: string;
}

export async function POST(request: Request): Promise<NextResponse<FollowUpResponse>> {
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ sent: 0, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const admin = createAdminClient();
    const now = new Date().toISOString();

    // 1. SMART SEQUENCE STEPS — process due follow_up_steps first
    const { data: dueStepsRaw } = await admin
      .from("follow_up_steps")
      .select(
        `id, step_number, subject, body, proposal_id,
        proposals (id, title, share_id, client_name, client_email, status, user_id),
        follow_up_sequences (status)`
      )
      .eq("status", "scheduled")
      .eq("channel", "email")
      .lte("scheduled_for", now);

    const dueSteps = Array.isArray(dueStepsRaw)
      ? dueStepsRaw.filter((s: { follow_up_sequences?: { status: string } | { status: string }[] }) => {
          const seq = s.follow_up_sequences;
          const status = Array.isArray(seq) ? seq[0]?.status : seq?.status;
          return status === "active";
        })
      : [];

    let sequenceStepsSent = 0;
    for (const step of dueSteps) {
      const rawProposals = step.proposals;
      const prop = Array.isArray(rawProposals) ? rawProposals[0] : rawProposals;
      if (!prop || !prop.client_email || prop.status === "accepted" || prop.status === "declined") {
        if (prop && (prop.status === "accepted" || prop.status === "declined")) {
          await admin.from("follow_up_steps").update({ status: "skipped" }).eq("id", step.id);
        }
        continue;
      }

      const { data: profile } = await admin.from("profiles").select("email").eq("id", prop.user_id).single();
      const proposalLink = `${APP_URL}/proposal/${prop.share_id}`;

      try {
        await sendSequenceStepEmail({
          to: prop.client_email,
          subject: step.subject ?? "Following up",
          body: step.body ?? "",
          replyTo: profile?.email ?? undefined,
          proposalLink,
        });

        await admin
          .from("follow_up_steps")
          .update({ status: "sent", sent_at: new Date().toISOString() })
          .eq("id", step.id);

        if (step.step_number === 4) {
          await admin.from("follow_up_sequences").update({ status: "completed" }).eq("proposal_id", prop.id);
        }
        sequenceStepsSent++;
      } catch (e) {
        console.error(`Sequence step error for step ${step.id}:`, e);
      }
    }

    // 2. LEGACY FOLLOW-UP — profiles with auto_follow_up_enabled
    const { data: profiles, error: profileError } = await admin
      .from("profiles")
      .select("id, auto_follow_up_enabled, auto_follow_up_days")
      .eq("auto_follow_up_enabled", true);

    if (profileError) {
      return NextResponse.json({ sent: 0, error: profileError.message }, { status: 500 });
    }

    if (!profiles?.length) {
      return NextResponse.json({ sent: 0 });
    }

    const daysMap = new Map(profiles.map((p) => [p.id, p.auto_follow_up_days ?? 7]));

    const { data: proposals, error: proposalError } = await admin
      .from("proposals")
      .select("id, user_id, title, client_name, sent_at")
      .eq("status", "sent")
      .eq("follow_up_sent", false)
      .not("sent_at", "is", null);

    if (proposalError) {
      return NextResponse.json({ sent: 0, error: proposalError.message }, { status: 500 });
    }

    if (!proposals?.length) {
      return NextResponse.json({ sent: 0 });
    }

    let sent = 0;
    for (const p of proposals) {
      const daysToWait = daysMap.get(p.user_id) ?? 7;
      const sentAt = new Date(p.sent_at);
      const daysSince = Math.floor((Date.now() - sentAt.getTime()) / 86400000);
      
      // Skip if not enough time has passed
      if (daysSince < daysToWait) continue;

      const { data: profile, error: profileLookupError } = await admin
        .from("profiles")
        .select("email, notify_proposal_expired")
        .eq("id", p.user_id)
        .single();

      if (profileLookupError || !profile?.email) {
        console.warn(`Could not find email for user ${p.user_id}`);
        continue;
      }

      try {
        await sendFollowUpReminder(
          profile.email,
          p.client_name,
          p.title,
          daysSince,
          `${APP_URL}/proposals/${p.id}`
        );
        
        const { error: updateError } = await admin
          .from("proposals")
          .update({ follow_up_sent: true, follow_up_at: new Date().toISOString() })
          .eq("id", p.id);

        if (!updateError) {
          sent++;
        }
      } catch (e) {
        console.error(`Follow-up email error for proposal ${p.id}:`, e);
      }
    }

    return NextResponse.json({ sent, sequenceSteps: sequenceStepsSent });
  } catch (e) {
    console.error("Follow-up cron job error:", e);
    return NextResponse.json(
      { sent: 0, error: "Internal server error" },
      { status: 500 }
    );
  }
}
