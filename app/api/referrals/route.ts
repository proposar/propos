import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Get user's referral data
  const { data: profile } = await supabase
    .from("profiles")
    .select("referral_code, referral_earnings, referral_count")
    .eq("id", user.id)
    .single();

  // Get recent referrals
  const { data: referrals } = await supabase
    .from("referral_signups")
    .select("id, referred_email, signed_up_at, converted_to_paid", {
      count: "exact",
    })
    .eq("referrer_id", user.id)
    .order("signed_up_at", { ascending: false })
    .limit(10);

  return NextResponse.json({
    referral_code: profile?.referral_code || "",
    referral_earnings: profile?.referral_earnings || 0,
    referral_count: profile?.referral_count || 0,
    recent_referrals: referrals || [],
  });
}

export async function POST(request: Request) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { action } = body;

  if (action === "generate_code") {
    // Generate unique referral code
    const code = `REF-${user.id.substring(0, 8).toUpperCase()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

    const { error } = await supabase
      .from("profiles")
      .update({ referral_code: code })
      .eq("id", user.id);

    if (error) {
      return NextResponse.json(
        { error: "Failed to generate code" },
        { status: 500 }
      );
    }

    return NextResponse.json({ referral_code: code });
  }

  return NextResponse.json({ error: "Unknown action" }, { status: 400 });
}
