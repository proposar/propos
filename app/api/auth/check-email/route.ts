import { createAdminClient } from "@/lib/supabase/server";
import { checkRateLimit, getRequestIp } from "@/lib/rate-limit";
import { enforceSameOrigin, normalizeEmail } from "@/lib/request-guards";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const guard = enforceSameOrigin(req);
    if (guard) return guard;

    const body = await req.json();
    const email = normalizeEmail(body?.email);

    if (!email) {
      return NextResponse.json({ error: "Email required" }, { status: 400 });
    }

    const ip = getRequestIp(req);
    const ipLimit = await checkRateLimit({
      key: `rl:check-email:ip:${ip}`,
      limit: 30,
      windowSec: 10 * 60,
    });
    if (!ipLimit.allowed) {
      return NextResponse.json(
        { error: "Too many requests" },
        { status: 429, headers: { "Retry-After": String(ipLimit.retryAfter) } }
      );
    }

    const supabase = createAdminClient();

    // Check if user already exists in auth or profiles
    const { data, error } = await supabase
      .from("profiles")
      .select("id, email")
      .ilike("email", email)
      .limit(1);

    if (error) {
      throw error;
    }

    if (Array.isArray(data) && data.length > 0) {
      // Email already registered
      return NextResponse.json(
        { exists: true, message: "Email already registered. Please sign in instead." },
        { status: 200 }
      );
    }

    return NextResponse.json({ exists: false }, { status: 200 });
  } catch (error) {
    console.error("Check email error:", error);
    return NextResponse.json(
      { error: "Failed to check email" },
      { status: 500 }
    );
  }
}
