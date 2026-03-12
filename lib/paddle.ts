/**
 * Paddle billing integration
 * Handles checkout creation and subscription management
 */

const API_KEY = process.env.PADDLE_API_KEY;
const CLIENT_TOKEN = process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN;

/** Replace with your Paddle price IDs from Dashboard > Products > Prices */
export const PADDLE_PLANS = {
  starter: process.env.PADDLE_STARTER_PRICE_ID ?? "pri_01kkb4b6emz06m4e04r88781d1",
  pro: process.env.PADDLE_PRO_PRICE_ID ?? "pri_01kkb4nc7avgf32vvav6neaerc",
  agency: process.env.PADDLE_AGENCY_PRICE_ID ?? "pri_01kkb4r14m0n6v88w20tf6hwjz",
} as const;

export type PaddlePlanId = keyof typeof PADDLE_PLANS;

export function getPriceId(plan: PaddlePlanId): string {
  return PADDLE_PLANS[plan];
}

export function isPaddleConfigured(): boolean {
  return !!(API_KEY && API_KEY !== "placeholder");
}

/**
 * Create a Paddle Billing transaction and return the checkout URL.
 * Uses POST /transactions; response includes checkout.url for redirect.
 */
export async function createCheckout(
  plan: PaddlePlanId,
  options: {
    email?: string;
    customData?: Record<string, string>;
    redirectUrl?: string;
  }
): Promise<{ url: string } | { error: string }> {
  if (!API_KEY) {
    return { error: "Paddle API key not configured" };
  }

  try {
    const priceId = getPriceId(plan);
    const body = {
      items: [{ price_id: priceId, quantity: 1 }],
      custom_data: options.customData ?? {},
      collection_mode: "automatic" as const,
      // Where Paddle should send the customer after checkout
      ...(options.redirectUrl ? { redirect_url: options.redirectUrl } : {}),
    };

    const response = await fetch("https://api.paddle.com/transactions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_KEY}`,
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errText = await response.text();
      return { error: `Checkout failed: ${errText}` };
    }

    const json = await response.json();
    const url = json?.data?.checkout?.url ?? json?.checkout?.url;
    if (!url || typeof url !== "string") {
      return { error: "No checkout URL in response" };
    }
    return { url };
  } catch (error) {
    console.error("Paddle checkout error:", error);
    return { error: "Failed to create checkout" };
  }
}

/**
 * Get customer portal URL for a subscription (update payment, cancel, etc.).
 * Requires subscription_id (stored as stripe_subscription_id in profiles).
 */
export async function getSubscriptionPortalUrl(
  subscriptionId: string
): Promise<{ url: string } | { error: string }> {
  if (!API_KEY) return { error: "Paddle API key not configured" };
  if (!subscriptionId) return { error: "No subscription" };

  try {
    const response = await fetch(
      `https://api.paddle.com/subscriptions/${subscriptionId}`,
      {
        headers: { Authorization: `Bearer ${API_KEY}` },
      }
    );
    if (!response.ok) {
      const errText = await response.text();
      return { error: `Failed to get subscription: ${errText}` };
    }
    const json = await response.json();
    const urls = json?.data?.management_urls ?? json?.management_urls;
    const portalUrl =
      urls?.update_payment_method ?? urls?.cancel ?? null;
    if (!portalUrl) return { error: "No portal URL available" };
    return { url: portalUrl };
  } catch (error) {
    console.error("Paddle portal error:", error);
    return { error: "Failed to get portal URL" };
  }
}

/**
 * Verify Paddle webhook signature
 */
export function verifyWebhookSignature(
  body: string,
  signature: string,
  secret: string
): boolean {
  try {
    const crypto = require("crypto");
    const hmac = crypto.createHmac("sha256", secret);
    hmac.update(body);
    const digest = hmac.digest("hex");
    return digest === signature;
  } catch (error) {
    console.error("Webhook signature verification failed:", error);
    return false;
  }
}

/**
 * Get current subscription details from Paddle
 */
export async function getSubscription(subscriptionId: string): Promise<{
  status?: string;
  customerId?: string;
  currentPeriodStart?: string;
  currentPeriodEnd?: string;
} | null> {
  if (!API_KEY) return null;

  try {
    const response = await fetch(
      `https://api.paddle.com/subscriptions/${subscriptionId}`,
      {
        headers: {
          Authorization: `Bearer ${API_KEY}`,
        },
      }
    );

    if (!response.ok) return null;

    const data = await response.json();
    return {
      status: data.data?.status,
      customerId: data.data?.customer_id,
      currentPeriodStart: data.data?.current_billing_period?.starts_at,
      currentPeriodEnd: data.data?.current_billing_period?.ends_at,
    };
  } catch (error) {
    console.error("Error fetching subscription:", error);
    return null;
  }
}

/**
 * Determine plan from Paddle price ID
 */
export function planFromPriceId(
  priceId: string
): PaddlePlanId {
  const entries = Object.entries(PADDLE_PLANS) as [PaddlePlanId, string][];
  const plan = entries.find(([_, id]) => id === priceId)?.[0];
  return plan || "pro";
}
