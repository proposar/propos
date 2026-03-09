import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { sendProposalViewedAlert } from "@/lib/resend";

/** 1x1 transparent GIF */
const PIXEL =
  "R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7" as const;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const shareId = searchParams.get("proposal") ?? searchParams.get("share_id");

  if (!shareId) {
    return new NextResponse(Buffer.from(PIXEL, "base64"), {
      headers: { "Content-Type": "image/gif", "Cache-Control": "no-store" },
    });
  }

  const admin = createAdminClient();

  const { data: proposal } = await admin
    .from("proposals")
    .select("id, user_id, title, client_name")
    .eq("share_id", shareId)
    .single();

  if (proposal) {
    await admin.from("proposal_views").insert({
      proposal_id: proposal.id,
      scrolled_to_percent: 0,
      duration_seconds: 0,
      user_agent: (request.headers.get("user-agent") ?? "") + " [email-open]",
    });

    const { data: row } = await admin
      .from("proposals")
      .select("view_count")
      .eq("id", proposal.id)
      .single();
    const viewCount = (row?.view_count ?? 0) + 1;
    await admin
      .from("proposals")
      .update({
        view_count: viewCount,
        viewed_at: new Date().toISOString(),
        last_viewed_at: new Date().toISOString(),
        status: "viewed",
      })
      .eq("id", proposal.id);

    const { data: profile } = await admin
      .from("profiles")
      .select("email, notify_proposal_viewed")
      .eq("id", proposal.user_id)
      .single();
    if (profile?.notify_proposal_viewed !== false && profile?.email) {
      const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://proposar.io";
      sendProposalViewedAlert(
        profile.email,
        proposal.client_name,
        proposal.title,
        "Opened email",
        `${appUrl}/proposals/${proposal.id}`
      ).catch(console.error);
    }
  }

  return new NextResponse(Buffer.from(PIXEL, "base64"), {
    headers: { "Content-Type": "image/gif", "Cache-Control": "no-store" },
  });
}
