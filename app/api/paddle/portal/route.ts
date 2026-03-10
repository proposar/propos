import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getSubscriptionPortalUrl } from "@/lib/paddle";

/**
 * POST /api/paddle/portal
 * Returns the Paddle customer portal URL for the current user's subscription.
 * Used by Settings > Billing > "Manage Billing".
 */
export async function POST() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("stripe_subscription_id")
      .eq("id", user.id)
      .single();

    const subscriptionId = profile?.stripe_subscription_id;
    if (!subscriptionId) {
      return NextResponse.json(
        { error: "No active subscription" },
        { status: 400 }
      );
    }

    const result = await getSubscriptionPortalUrl(subscriptionId);
    if ("error" in result) {
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      );
    }

    return NextResponse.json({ url: result.url });
  } catch (error) {
    console.error("[Paddle Portal Error]", error);
    return NextResponse.json(
      { error: "Failed to get billing portal" },
      { status: 500 }
    );
  }
}
