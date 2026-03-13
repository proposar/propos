import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * GET /api/referrals
 * Returns the current user's referral code, earnings, count, and recent referrals
 */
export async function GET() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Get user's referral data from profile
  const { data: profile } = await supabase
    .from("profiles")
    .select("referral_code, referral_earnings, referral_count")
    .eq("id", user.id)
    .single();

  // Auto-generate referral code if missing (for users created before migration 012)
  let referralCode = profile?.referral_code ?? "";
  if (!referralCode) {
    const generated = await generateAndSaveCode(supabase, user.id);
    if (generated) referralCode = generated;
  }

  // Get recent referrals via the referrals table
  const { data: referrals } = await supabase
    .from("referrals")
    .select("id, referee_email, referred_at, completed_upgrade_at")
    .eq("referrer_id", user.id)
    .order("referred_at", { ascending: false })
    .limit(10);

  const recentReferrals = (referrals ?? []).map((r) => ({
    id: r.id,
    referred_email: r.referee_email,
    signed_up_at: r.referred_at,
    converted_to_paid: !!r.completed_upgrade_at,
  }));

  return NextResponse.json({
    referral_code: referralCode,
    referral_earnings: profile?.referral_earnings ?? 0,
    referral_count: profile?.referral_count ?? 0,
    recent_referrals: recentReferrals,
  });
}

/**
 * POST /api/referrals
 * Body: { action: "generate_code" }
 * Generates a new unique referral code for the user
 */
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
    const code = await generateAndSaveCode(supabase, user.id);
    if (!code) {
      return NextResponse.json(
        { error: "Failed to generate code" },
        { status: 500 }
      );
    }
    return NextResponse.json({ referral_code: code });
  }

  return NextResponse.json({ error: "Unknown action" }, { status: 400 });
}

import { SupabaseClient } from "@supabase/supabase-js";

/**
 * Generate a unique referral code and persist it.
 * Format: PROP-XXXX-XXXXXX (user-based prefix + random suffix)
 */
async function generateAndSaveCode(
  supabase: SupabaseClient,
  userId: string
): Promise<string | null> {
  const prefix = userId.replace(/-/g, "").substring(0, 4).toUpperCase();
  const suffix = Math.random().toString(36).substring(2, 8).toUpperCase();
  const code = `PROP-${prefix}-${suffix}`;

  const { error } = await supabase
    .from("profiles")
    .update({ referral_code: code })
    .eq("id", userId);

  return error ? null : code;
}
