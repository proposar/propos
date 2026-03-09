import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const {
      testId,
      proposalId,
      variant,
      toneUsed,
      openedAt,
      acceptedAt,
      rejectedAt,
      viewDuration = 0,
      scrollPercentage = 0,
    } = await request.json();

    // Record result
    const { data, error } = await supabase
      .from("proposal_test_results")
      .insert({
        test_id: testId,
        proposal_id: proposalId,
        variant,
        tone_used: toneUsed,
        sent_at: new Date().toISOString(),
        opened_at: openedAt ? new Date(openedAt).toISOString() : null,
        accepted_at: acceptedAt ? new Date(acceptedAt).toISOString() : null,
        rejected_at: rejectedAt ? new Date(rejectedAt).toISOString() : null,
        view_duration: viewDuration,
        scroll_percentage: scrollPercentage,
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Failed to record result" },
      { status: 500 }
    );
  }
}
