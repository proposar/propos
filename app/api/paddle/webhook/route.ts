import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { planFromPriceId } from "@/lib/paddle";
import crypto from "crypto";

const WEBHOOK_SECRET = process.env.PADDLE_WEBHOOK_SECRET;

/**
 * Verify Paddle webhook signature
 * Paddle uses HMAC-SHA256 with header X-Paddle-Signature
 */
function verifySignature(body: string, signature: string): boolean {
  if (!WEBHOOK_SECRET) {
    console.error("Paddle webhook secret not configured");
    return false;
  }

  try {
    const hmac = crypto.createHmac("sha256", WEBHOOK_SECRET);
    hmac.update(body);
    const calculatedSignature = hmac.digest("hex");
    return crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(calculatedSignature)
    );
  } catch (error) {
    console.error("Signature verification error:", error);
    return false;
  }
}

export async function POST(request: Request) {
  try {
    const rawBody = await request.text();
    const signature = request.headers.get("x-paddle-signature") ?? "";

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
      const customData = data.custom_data ?? {};
      const userId = customData.user_id;

      if (!userId) {
        console.error("No user_id in custom_data");
        return NextResponse.json({ received: true });
      }

      const subscriptionId = data.id;
      const priceId = data.items?.[0]?.price?.id;
      const plan = priceId ? planFromPriceId(priceId) : "pro";

      // Update user's subscription in Supabase
      const { error: updateError } = await admin
        .from("profiles")
        .update({
          plan,
          paddle_subscription_id: subscriptionId,
          paddle_customer_id: data.customer_id,
          subscription_status: "active",
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
      const customData = data.custom_data ?? {};
      const userId = customData.user_id;

      if (!userId) return NextResponse.json({ received: true });

      const priceId = data.items?.[0]?.price?.id;
      const plan = priceId ? planFromPriceId(priceId) : "pro";

      const { error: updateError } = await admin
        .from("profiles")
        .update({
          plan,
          subscription_status: data.status,
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
      const customData = data.custom_data ?? {};
      const userId = customData.user_id;

      if (!userId) return NextResponse.json({ received: true });

      const { error: updateError } = await admin
        .from("profiles")
        .update({
          plan: "free",
          paddle_subscription_id: null,
          subscription_status: "canceled",
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
