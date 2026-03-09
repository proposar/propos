import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import crypto from "crypto";

const WEBHOOK_SECRET = process.env.LEMONSQUEEZY_WEBHOOK_SECRET;

function verifySignature(payload: string, signature: string): boolean {
  if (!WEBHOOK_SECRET) return false;
  const hmac = crypto.createHmac("sha256", WEBHOOK_SECRET);
  hmac.update(payload);
  const digest = hmac.digest("hex");
  return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(digest));
}

function planFromVariantId(variantId: number): "starter" | "pro" | "agency" {
  const starter = process.env.LEMONSQUEEZY_STARTER_VARIANT_ID;
  const pro = process.env.LEMONSQUEEZY_PRO_VARIANT_ID;
  const agency = process.env.LEMONSQUEEZY_AGENCY_VARIANT_ID;
  if (String(variantId) === agency) return "agency";
  if (String(variantId) === pro) return "pro";
  return "starter";
}

export async function POST(request: Request) {
  try {
    const rawBody = await request.text();
    const signature = request.headers.get("x-signature") ?? "";

    if (!WEBHOOK_SECRET) {
      return NextResponse.json({ error: "Webhook not configured" }, { status: 503 });
    }
    if (!verifySignature(rawBody, signature)) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    const payload = JSON.parse(rawBody);
    const eventName = payload?.meta?.event_name;
    const data = payload?.data;

    if (!eventName || !data) {
      return NextResponse.json({ received: true });
    }

    const admin = createAdminClient();

    if (eventName === "order_created" || eventName === "subscription_created") {
      const attrs = data.attributes ?? {};
      const meta = payload?.meta ?? {};
      const customData = (meta.custom_data ?? attrs?.first_order_item?.product_options?.custom ?? attrs?.product_options?.custom) as Record<string, string> | undefined;
      const userId = customData?.user_id;

      if (!userId) return NextResponse.json({ received: true });

      const variantId = attrs?.first_order_item?.variant_id ?? attrs?.variant_id;
      const plan = variantId ? planFromVariantId(Number(variantId)) : "pro";
      const subId = String(attrs?.subscription_id ?? attrs?.order_id ?? data.id);
      const customerId = String(attrs?.user_email ?? attrs?.user_name ?? userId);

      await admin
        .from("profiles")
        .update({
          subscription_plan: plan,
          stripe_customer_id: String(customerId),
          stripe_subscription_id: String(subId),
          subscription_status: "active",
          updated_at: new Date().toISOString(),
        })
        .eq("id", userId);

      return NextResponse.json({ received: true });
    }

    if (eventName === "subscription_updated" || eventName === "subscription_resumed") {
      const attrs = data.attributes ?? {};
      const userId = (attrs?.urls as { update_payment_method?: string }) ?? attrs?.user_id;
      // Match by subscription - we need to find profile by stripe_subscription_id
      const subId = String(data.id);

      const { data: profiles } = await admin
        .from("profiles")
        .select("id")
        .eq("stripe_subscription_id", subId);

      if (profiles?.[0]) {
        const variantId = attrs?.variant_id;
        const plan = variantId ? planFromVariantId(Number(variantId)) : undefined;
        await admin
          .from("profiles")
          .update({
            ...(plan && { subscription_plan: plan }),
            subscription_status: attrs?.status ?? "active",
            subscription_period_end: attrs?.renews_at ?? null,
            updated_at: new Date().toISOString(),
          })
          .eq("id", profiles[0].id);
      }

      return NextResponse.json({ received: true });
    }

    if (eventName === "subscription_cancelled" || eventName === "subscription_expired") {
      const subId = String(data.id);
      await admin
        .from("profiles")
        .update({
          subscription_plan: "free",
          subscription_status: "cancelled",
          stripe_subscription_id: null,
          updated_at: new Date().toISOString(),
        })
        .eq("stripe_subscription_id", subId);

      return NextResponse.json({ received: true });
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("Lemonsqueezy webhook error:", err);
    return NextResponse.json({ error: "Webhook failed" }, { status: 500 });
  }
}
