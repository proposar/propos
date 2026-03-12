export type PaddlePlan = "starter" | "pro" | "agency";

interface PaddleConfig {
  clientToken: string | null;
  isSandbox: boolean;
  priceIds: Record<PaddlePlan, string>;
}

type PaddleGlobal = {
  Initialize: (opts: {
    token: string;
    checkout?: {
      settings?: Record<string, unknown>;
    };
  }) => void;
  Environment?: { set: (env: string) => void };
  Checkout: {
    open: (opts: {
      items: Array<{ priceId: string; quantity: number }>;
      settings?: Record<string, unknown>;
      customData?: Record<string, string>;
    }) => void;
  };
};

declare global {
  interface Window {
    Paddle?: PaddleGlobal;
  }
}

let paddleInitPromise: Promise<PaddleGlobal | null> | null = null;

async function loadPaddleScript(): Promise<PaddleGlobal | null> {
  if (typeof window === "undefined") return null;
  if (window.Paddle) return window.Paddle;

  await new Promise<void>((resolve, reject) => {
    const existing = document.querySelector(
      'script[src="https://cdn.paddle.com/paddle/v2/paddle.js"]',
    ) as HTMLScriptElement | null;

    if (existing) {
      if (window.Paddle) {
        resolve();
        return;
      }
      existing.addEventListener("load", () => resolve(), { once: true });
      existing.addEventListener("error", () => reject(new Error("Script load failed")), {
        once: true,
      });
      return;
    }

    const script = document.createElement("script");
    script.src = "https://cdn.paddle.com/paddle/v2/paddle.js";
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Script load failed"));
    document.head.appendChild(script);
  });

  return window.Paddle ?? null;
}

async function initializePaddle(config: PaddleConfig): Promise<PaddleGlobal | null> {
  const token = config.clientToken;
  if (!token) return null;

  if (!paddleInitPromise) {
    paddleInitPromise = (async () => {
      const paddle = await loadPaddleScript();
      if (!paddle) return null;

      if (config.isSandbox) {
        paddle.Environment?.set("sandbox");
      }

      paddle.Initialize({
        token,
        checkout: {
          settings: {
            theme: "dark",
            locale: "en",
            displayMode: "overlay",
          },
        },
      });

      return paddle;
    })();
  }

  return paddleInitPromise;
}

async function startServerCheckout(
  plan: PaddlePlan,
  successUrl?: string,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const response = await fetch("/api/paddle/checkout", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ plan, successUrl }),
  });

  let payload: { url?: string; error?: string } | null = null;
  try {
    payload = await response.json();
  } catch {
    payload = null;
  }

  if (!response.ok) {
    return { ok: false, error: payload?.error ?? "Checkout unavailable" };
  }

  if (!payload?.url) {
    return { ok: false, error: payload?.error ?? "No checkout URL returned" };
  }

  window.location.href = payload.url;
  return { ok: true };
}

export async function openCheckout(
  plan: PaddlePlan,
  options?: { successUrl?: string },
): Promise<{ ok: true } | { ok: false; error: string }> {
  try {
    console.log("[openCheckout] Starting checkout for plan:", plan, "with options:", options);
    
    const configResponse = await fetch("/api/paddle/config", { cache: "no-store" });
    console.log("[openCheckout] Config response status:", configResponse.status);
    
    const config: PaddleConfig | null = configResponse.ok
      ? ((await configResponse.json()) as PaddleConfig)
      : null;

    const successUrl = options?.successUrl ?? `${window.location.origin}/dashboard?upgrade=success`;
    console.log("[openCheckout] Using successUrl:", successUrl);
    console.log("[openCheckout] Paddle client token exists:", !!config?.clientToken);

    if (config?.clientToken) {
      const paddle = await initializePaddle(config);
      if (paddle) {
        const priceId = config.priceIds[plan];
        console.log("[openCheckout] Opening Paddle overlay with priceId:", priceId);
        paddle.Checkout.open({
          items: [{ priceId, quantity: 1 }],
          settings: {
            displayMode: "overlay",
            successUrl,
          },
        });
        console.log("[openCheckout] Paddle overlay opened successfully");
        return { ok: true };
      }
    }

    console.log("[openCheckout] Falling back to server checkout");
    return await startServerCheckout(plan, successUrl);
  } catch (error) {
    console.error("[openCheckout] Error:", error);
    return {
      ok: false,
      error:
        error instanceof Error ? error.message : "Checkout unavailable. Please try again.",
    };
  }
}
