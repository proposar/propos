import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { sendExpiryReminderEmail } from "@/lib/resend";

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
    // 2. Define the window for "expiring soon" (e.g., within the next 48 hours)
    const now = new Date();
    const in48Hours = new Date(now.getTime() + 48 * 60 * 60 * 1000);

    const nowStr = now.toISOString();
    const in48HoursStr = in48Hours.toISOString();

    // 3. Query proposals that:
    //    - Have an expires_at between now and 48 hours from now
    //    - Are in 'sent' or 'viewed' status (not already accepted/declined/expired)
    //    - Haven't had a reminder sent yet
    const { data: proposals, error } = await supabase
      .from("proposals")
      .select(`
        id, 
        title, 
        client_name, 
        client_email, 
        share_id,
        user_id,
        expires_at
      `)
      .in("status", ["sent", "viewed"])
      .gte("expires_at", nowStr)
      .lte("expires_at", in48HoursStr)
      .eq("expiry_reminder_sent", false)
      .not("client_email", "is", null);

    if (error) {
      console.error("Error fetching expiring proposals:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!proposals || proposals.length === 0) {
      return NextResponse.json({
        message: "No proposals expiring soon requiring a reminder.",
        count: 0,
      });
    }

    let sentCount = 0;
    const errors = [];

    // 4. Process each proposal
    for (const proposal of proposals) {
      try {
        if (!proposal.client_email || !proposal.share_id) continue;

        // Fetch the freelancer's profile to get their name
        const { data: profile } = await supabase
          .from("profiles")
          .select("full_name, business_name")
          .eq("id", proposal.user_id)
          .single();

        const freelancerName =
          profile?.full_name || profile?.business_name || undefined;

        const proposalLink = `${process.env.NEXT_PUBLIC_APP_URL || "https://proposar.io"}/proposal/${proposal.share_id}`;

        // 5. Send the email
        await sendExpiryReminderEmail(
          proposal.client_email,
          proposal.client_name,
          proposal.title,
          proposalLink,
          freelancerName,
        );

        // 6. Mark the reminder as sent
        await supabase
          .from("proposals")
          .update({ expiry_reminder_sent: true })
          .eq("id", proposal.id);

        sentCount++;
      } catch (err: any) {
        console.error(`Failed to process proposal ${proposal.id}:`, err);
        errors.push({ id: proposal.id, error: err.message });
      }
    }

    return NextResponse.json({
      message: `Successfully sent ${sentCount} reminders.`,
      count: sentCount,
      errors: errors.length > 0 ? errors : undefined,
    });
  } catch (error: any) {
    console.error("Cron job failed:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
