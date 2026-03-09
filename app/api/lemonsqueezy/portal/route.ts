import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getSubscription } from "@/lib/lemonsqueezy";
import { isLemonsqueezyConfigured } from "@/lib/lemonsqueezy";

const STORE_LINK = process.env.NEXT_PUBLIC_LEMONSQUEEZY_STORE_LINK ?? "https://app.lemonsqueezy.com";

export async function POST() {
  try {
    if (!isLemonsqueezyConfigured()) {
      return NextResponse.json(
        { error: "Lemonsqueezy billing is not configured" },
        { status: 503 }
      );
    }

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { data: profile } = await supabase
      .from("profiles")
      .select("stripe_subscription_id")
      .eq("id", user.id)
      .single();

    const subId = profile?.stripe_subscription_id;
    if (!subId) {
      return NextResponse.json(
        { error: "No active subscription" },
        { status: 400 }
      );
    }

    const sub = await getSubscription(String(subId));
    const url = sub?.updatePaymentUrl ?? `${STORE_LINK}/my-orders`;

    return NextResponse.json({ url });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Portal failed" },
      { status: 500 }
    );
  }
}
