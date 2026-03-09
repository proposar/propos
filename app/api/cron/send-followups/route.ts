import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { sendFollowUpEmail } from "@/lib/resend";

export async function GET(request: Request) {
  // 1. Authenticate the Cron request
  const authHeader = request.headers.get("Authorization");
  if (
    process.env.CRON_SECRET &&
    authHeader !== `Bearer ${process.env.CRON_SECRET}`
  ) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Use the admin client to bypass RLS since this is a background job
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceRoleKey) {
    return NextResponse.json(
      { error: "Server configuration error" },
      { status: 500 },
    );
  }

  const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

  try {
    const now = new Date();
    const nowStr = now.toISOString();

    // 1. Get all users with auto-follow-up enabled
    const { data: usersWithFollowUp } = await supabase
      .from("profiles")
      .select("id, auto_follow_up_enabled, auto_follow_up_days")
      .eq("auto_follow_up_enabled", true);

    if (!usersWithFollowUp || usersWithFollowUp.length === 0) {
      return NextResponse.json({
        message: "No users have auto-follow-up enabled",
        count: 0,
      });
    }

    let totalSent = 0;
    const errors = [];

    // 2. For each user, find proposals that need follow-ups
    for (const user of usersWithFollowUp) {
      const followUpDays = user.auto_follow_up_days || 7;
      const followUpDate = new Date(now.getTime() - followUpDays * 24 * 60 * 60 * 1000);
      const followUpDateStr = followUpDate.toISOString();

      // Find proposals that:
      // - Were sent between followUpDays ago and now
      // - Are in 'sent' or 'viewed' status
      // - Haven't had a follow-up sent yet
      const { data: proposals, error: fetchError } = await supabase
        .from("proposals")
        .select(`
          id,
          title,
          client_name,
          client_email,
          share_id,
          sent_at,
          budget_amount
        `)
        .eq("user_id", user.id)
        .in("status", ["sent", "viewed"])
        .eq("follow_up_sent", false)
        .lte("sent_at", nowStr)
        .gte("sent_at", followUpDateStr)
        .not("client_email", "is", null);

      if (fetchError) {
        console.error(`Error fetching proposals for user ${user.id}:`, fetchError);
        errors.push({ userId: user.id, error: fetchError.message });
        continue;
      }

      if (!proposals || proposals.length === 0) {
        continue;
      }

      // 3. For each proposal, send a follow-up email
      for (const proposal of proposals) {
        try {
          if (!proposal.client_email || !proposal.share_id) continue;

          // Fetch the freelancer's profile
          const { data: profile } = await supabase
            .from("profiles")
            .select("full_name, business_name, email")
            .eq("id", user.id)
            .single();

          const freelancerName = profile?.full_name || profile?.business_name || "Your freelancer";
          const proposalLink = `${process.env.NEXT_PUBLIC_APP_URL || "https://proposar.io"}/proposal/${proposal.share_id}`;

          // Send follow-up email
          await sendFollowUpEmail(
            proposal.client_email,
            proposal.client_name,
            proposal.title,
            proposalLink,
            freelancerName,
            profile?.email || "hello@proposar.com"
          );

          // Mark as follow-up sent
          await supabase
            .from("proposals")
            .update({
              follow_up_sent: true,
              follow_up_at: nowStr,
            })
            .eq("id", proposal.id);

          totalSent++;
        } catch (err: any) {
          console.error(`Failed to send follow-up for proposal ${proposal.id}:`, err);
          errors.push({ proposalId: proposal.id, error: err.message });
        }
      }
    }

    return NextResponse.json({
      message: `Successfully sent ${totalSent} follow-up emails.`,
      count: totalSent,
      errors: errors.length > 0 ? errors : undefined,
    });
  } catch (error: any) {
    console.error("Follow-up cron job failed:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 },
    );
  }
}
