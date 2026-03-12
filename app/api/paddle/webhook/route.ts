import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { planFromPriceId } from "@/lib/paddle";
import crypto from "crypto";

const WEBHOOK_SECRET = process.env.PADDLE_WEBHOOK_SECRET;

async function resolveUserId(
  admin: ReturnType<typeof createAdminClient>,
  data: Record<string, any>
): Promise<string | null> {
  const customUserId = data?.custom_data?.user_id;
  if (typeof customUserId === "string" && customUserId.trim()) {
    return customUserId;
  }

  const subscriptionId = typeof data?.id === "string" ? data.id : null;
  if (subscriptionId) {
    const { data: profileBySubscription } = await admin
      .from("profiles")
      .select("id")
      .eq("stripe_subscription_id", subscriptionId)
      .single();
    if (profileBySubscription?.id) return profileBySubscription.id;
  }

  const customerId = typeof data?.customer_id === "string" ? data.customer_id : null;
  if (customerId) {
    const { data: profileByCustomer } = await admin
      .from("profiles")
      .select("id")
      .eq("stripe_customer_id", customerId)
      .single();
    if (profileByCustomer?.id) return profileByCustomer.id;
  }

  return null;
}

/**
 * Verify Paddle Billing webhook signature.
 * Header format: Paddle-Signature or x-paddle-signature: ts=UNIX_TS;h1=HMAC_HEX
 * HMAC is over "ts:raw_body" with webhook secret.
 */
function verifySignature(body: string, signatureHeader: string): boolean {
  if (!WEBHOOK_SECRET) {
    console.error("Paddle webhook secret not configured");
    return false;
  }
  try {
    const parts = signatureHeader.split(";").reduce((acc, part) => {
      const [k, v] = part.trim().split("=");
      if (k && v) acc[k] = v;
      return acc;
    }, {} as Record<string, string>);
    const ts = parts.ts ?? parts.t;
    const h1 = parts.h1;
    if (!ts || !h1) return false;
    const toSign = `${ts}:${body}`;
    const hmac = crypto.createHmac("sha256", WEBHOOK_SECRET);
    hmac.update(toSign);
    const calculated = hmac.digest("hex");
    return crypto.timingSafeEqual(Buffer.from(h1, "hex"), Buffer.from(calculated, "hex"));
  } catch (error) {
    console.error("Signature verification error:", error);
    return false;
  }
}

export async function POST(request: Request) {
  try {
    const rawBody = await request.text();
    const signature =
      request.headers.get("paddle-signature") ??
      request.headers.get("x-paddle-signature") ??
      "";

    if (!WEBHOOK_SECRET) {
      console.error("Webhook secret not configured");
      return NextResponse.json({ error: "Webhook not configured" }, { status: 503 });
    }

    if (!verifySignature(rawBody, signature)) {
      console.error("Invalid webhook signature");
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    const payload = JSON.parse(rawBody);
    const eventType = payload?.event_type;
    const data = payload?.data;

    if (!eventType || !data) {
      return NextResponse.json({ received: true });
    }

    const admin = createAdminClient();

    // Handle subscription.created event
    if (eventType === "subscription.created") {
      const userId = await resolveUserId(admin, data);

      if (!userId) {
        console.error("No user mapping found for subscription.created", data?.id);
        return NextResponse.json({ received: true });
      }

      const subscriptionId = data.id;
      const priceId = data.items?.[0]?.price?.id;
      const plan = priceId ? planFromPriceId(priceId) : null;
      if (!plan) {
        console.error("Unknown Paddle price ID on subscription.created", priceId);
        return NextResponse.json({ received: true });
      }

      // Update user's subscription in Supabase (profiles uses subscription_plan, stripe_* columns)
      const { error: updateError } = await admin
        .from("profiles")
        .update({
          subscription_plan: plan,
          stripe_subscription_id: subscriptionId,
          stripe_customer_id: data.customer_id ?? null,
          subscription_status: "active",
          subscription_period_end: data.next_billed_at ?? null,
          updated_at: new Date().toISOString(),
        })
        .eq("id", userId);

      if (updateError) {
        console.error("Error updating subscription:", updateError);
        return NextResponse.json({ error: "Database update failed" }, { status: 500 });
      }

      console.log(`Subscription created for user ${userId}, plan: ${plan}`);
      return NextResponse.json({ received: true });
    }

    // Handle subscription.updated event
    if (eventType === "subscription.updated") {
      const userId = await resolveUserId(admin, data);

      if (!userId) return NextResponse.json({ received: true });

      const priceId = data.items?.[0]?.price?.id;
      const plan = priceId ? planFromPriceId(priceId) : null;
      if (!plan) {
        console.error("Unknown Paddle price ID on subscription.updated", priceId);
        return NextResponse.json({ received: true });
      }
      const isActive = data.status === "active" || data.status === "trialing";

      const { error: updateError } = await admin
        .from("profiles")
        .update({
          subscription_plan: isActive ? plan : "free",
          stripe_subscription_id: data.id ?? null,
          stripe_customer_id: data.customer_id ?? null,
          subscription_status: data.status ?? "active",
          subscription_period_end: data.next_billed_at ?? null,
          updated_at: new Date().toISOString(),
        })
        .eq("id", userId);

      if (updateError) {
        console.error("Error updating subscription:", updateError);
      }

      console.log(`Subscription updated for user ${userId}`);
      return NextResponse.json({ received: true });
    }

    // Handle subscription.canceled event
    if (eventType === "subscription.canceled") {
      const userId = await resolveUserId(admin, data);

      if (!userId) return NextResponse.json({ received: true });

      const { error: updateError } = await admin
        .from("profiles")
        .update({
          subscription_plan: "free",
          stripe_subscription_id: null,
          stripe_customer_id: null,
          subscription_status: "canceled",
          subscription_period_end: null,
          updated_at: new Date().toISOString(),
        })
        .eq("id", userId);

      if (updateError) {
        console.error("Error canceling subscription:", updateError);
      }

      console.log(`Subscription canceled for user ${userId}`);
      return NextResponse.json({ received: true });
    }

    // Log unhandled events
    console.log(`Unhandled webhook event: ${eventType}`);
    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("[Paddle Webhook Error]", error);
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
  }
}
