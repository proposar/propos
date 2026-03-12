import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import {
  isPaddleConfigured,
  createCheckout,
  isPaddlePlanId,
  type PaddlePlanId,
} from "@/lib/paddle";
import { APP_METADATA } from "@/lib/config";

export async function POST(request: Request) {
  try {
    if (!isPaddleConfigured()) {
      return NextResponse.json(
        { error: "Paddle billing is not configured" },
        { status: 503 }
      );
    }

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const rawPlan = body.plan;
    if (!isPaddlePlanId(rawPlan)) {
      return NextResponse.json({ error: "Invalid plan selected" }, { status: 400 });
    }
    const plan: PaddlePlanId = rawPlan;
    const customSuccessUrl = body.successUrl as string | undefined;

    // Get user profile for checkout data
    const { data: profile } = await supabase
      .from("profiles")
      .select("email")
      .eq("id", user.id)
      .single();

    const baseUrl = APP_METADATA.url;
    const defaultRedirectUrl = customSuccessUrl ?? `${baseUrl}/billing`;
    const result = await createCheckout(plan, {
      email: profile?.email ?? user.email ?? undefined,
      customData: { user_id: user.id },
      redirectUrl: defaultRedirectUrl,
    });

    if ("error" in result) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({ url: result.url });
  } catch (error) {
    console.error("[Paddle Checkout Error]", error);
    return NextResponse.json(
      { error: "Checkout creation failed" },
      { status: 500 }
    );
  }
}
