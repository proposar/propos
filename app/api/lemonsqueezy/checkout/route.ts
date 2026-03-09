import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import {
  createCheckout,
  getVariantId,
  isLemonsqueezyConfigured,
  type LemonPlanId,
} from "@/lib/lemonsqueezy";
import { APP_METADATA } from "@/lib/config";

export async function POST(request: Request) {
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

    const body = await request.json();
    const plan = (body.plan as LemonPlanId) ?? "pro";
    const interval = (body.interval as "month" | "year") ?? "month";

    const variantId = getVariantId(plan, interval);
    if (!variantId) {
      return NextResponse.json(
        { error: "Variant not configured for this plan" },
        { status: 400 }
      );
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("full_name, email")
      .eq("id", user.id)
      .single();

    const baseUrl = APP_METADATA.url;
    const result = await createCheckout(variantId, {
      email: profile?.email ?? user.email ?? undefined,
      name: profile?.full_name ?? undefined,
      customData: { user_id: user.id },
      redirectUrl: `${baseUrl}/dashboard?upgrade=success`,
    });

    if ("error" in result) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    return NextResponse.json({ url: result.url });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Checkout failed" },
      { status: 500 }
    );
  }
}
