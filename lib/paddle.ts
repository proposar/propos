/**
 * Paddle billing integration
 * Handles checkout creation and subscription management
 */

const API_KEY = process.env.PADDLE_API_KEY;
const CLIENT_TOKEN = process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN;

export const PADDLE_PLANS = {
  starter: "pri_01kkb4b6emz06m4e04r88781d1",
  pro: "pri_01kkb4nc7avgf32vvav6neaerc",
  agency: "pri_01kkb4r14m0n6v88w20tf6hwjz",
} as const;

export type PaddlePlanId = keyof typeof PADDLE_PLANS;

export function getPriceId(plan: PaddlePlanId): string {
  return PADDLE_PLANS[plan];
}

export function isPaddleConfigured(): boolean {
  return !!(API_KEY && CLIENT_TOKEN && API_KEY !== "placeholder");
}

/**
 * Create a Paddle checkout URL for a given plan
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
    // Paddle checkout is handled client-side via SDK
    // This helper generates the checkout intent on the server
    const priceId = getPriceId(plan);
    
    const response = await fetch("https://api.paddle.com/checkout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        items: [
          {
            price_id: priceId,
            quantity: 1,
          },
        ],
        customer: {
          email: options.email,
        },
        custom_data: options.customData || {},
        return_url: options.redirectUrl,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      return { error: `Checkout creation failed: ${error}` };
    }

    const data = await response.json();
    return { url: data.url };
  } catch (error) {
    console.error("Paddle checkout error:", error);
    return { error: "Failed to create checkout" };
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
