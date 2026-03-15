import { createAdminClient } from "@/lib/supabase/server";
import { checkRateLimit, getRequestIp } from "@/lib/rate-limit";
import { enforceSameOrigin, normalizeEmail } from "@/lib/request-guards";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const guard = enforceSameOrigin(request);
    if (guard) return guard;

    const body = await request.json();
    const email = normalizeEmail(body?.email);
    
    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    const ip = getRequestIp(request);
    const ipLimit = await checkRateLimit({
      key: `rl:check-password-account:ip:${ip}`,
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

    const { data: profiles, error: profileError } = await supabase
      .from("profiles")
      .select("id")
      .ilike("email", email)
      .limit(1);

    if (profileError) {
      return NextResponse.json(
        { error: "Failed to check account" },
        { status: 500 }
      );
    }

    const profile = Array.isArray(profiles) && profiles.length > 0 ? profiles[0] : null;

    if (!profile?.id) {
      return NextResponse.json({
        exists: false,
        hasPassword: false,
      });
    }

    const { data: u, error: userError } = await supabase.auth.admin.getUserById(profile.id);
    if (userError || !u?.user) {
      return NextResponse.json({
        exists: true,
        hasPassword: false,
      });
    }

    // Use app_metadata.has_password when set (password signup or reset-password).
    // Otherwise assume no password (Google/OTP) to avoid misleading "Invalid password".
    const hasPassword = u.user.app_metadata?.has_password === true;

    return NextResponse.json({
      exists: true,
      hasPassword,
    });
  } catch (error) {
    console.error("Check password account error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
