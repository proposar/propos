/**
 * Lemonsqueezy billing integration
 * Used when LEMONSQUEEZY_API_KEY is configured (replaces Stripe for checkout/portal)
 */

const API_KEY = process.env.LEMONSQUEEZY_API_KEY;
const STORE_ID = process.env.LEMONSQUEEZY_STORE_ID;

export const LEMON_PLANS = ["starter", "pro", "agency"] as const;
export type LemonPlanId = (typeof LEMON_PLANS)[number];

export function getVariantId(
  plan: LemonPlanId,
  interval: "month" | "year" = "month"
): string | undefined {
  const key =
    interval === "year"
      ? `LEMONSQUEEZY_${plan.toUpperCase()}_ANNUAL_VARIANT_ID`
      : `LEMONSQUEEZY_${plan.toUpperCase()}_VARIANT_ID`;
  return process.env[key];
}

export function isLemonsqueezyConfigured(): boolean {
  return !!(API_KEY && STORE_ID && API_KEY !== "placeholder");
}

export async function createCheckout(
  variantId: string,
  options: {
    email?: string;
    name?: string;
    customData?: Record<string, string>;
    redirectUrl?: string;
  }
): Promise<{ url: string } | { error: string }> {
  if (!API_KEY || !STORE_ID) {
    return { error: "Lemonsqueezy not configured" };
  }

  const body: Record<string, unknown> = {
    data: {
      type: "checkouts",
      attributes: {
        store_id: Number(STORE_ID),
        variant_id: Number(variantId),
        product_options: {
          redirect_url: options.redirectUrl ?? undefined,
        },
        checkout_data: {
          email: options.email ?? undefined,
          name: options.name ?? undefined,
          custom: options.customData ?? {},
        },
      },
    },
  };

  const res = await fetch("https://api.lemonsqueezy.com/v1/checkouts", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      "Content-Type": "application/vnd.api+json",
      Accept: "application/vnd.api+json",
    },
    body: JSON.stringify(body),
  });

  const json = await res.json();
  if (!res.ok) {
    return { error: json?.errors?.[0]?.detail ?? "Checkout creation failed" };
  }

  const url = json?.data?.attributes?.url;
  if (!url) return { error: "No checkout URL returned" };
  return { url };
}

export async function getSubscription(subscriptionId: string): Promise<{
  updatePaymentUrl?: string;
  status?: string;
  userId?: string;
} | null> {
  if (!API_KEY) return null;

  const res = await fetch(
    `https://api.lemonsqueezy.com/v1/subscriptions/${subscriptionId}?include=order`,
    {
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        Accept: "application/vnd.api+json",
      },
    }
  );

  const json = await res.json();
  if (!res.ok || !json?.data) return null;

  const attrs = json.data.attributes;
  const urls = attrs?.urls as { update_payment_method?: string } | undefined;
  const firstOrder = json.included?.[0];
  const customData = firstOrder?.attributes?.first_order_item?.product_options?.custom as Record<string, string> | undefined;

  return {
    updatePaymentUrl: urls?.update_payment_method,
    status: attrs?.status,
    userId: customData?.user_id,
  };
}
