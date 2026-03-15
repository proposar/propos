import { verifyOTP } from "@/lib/otp";
import { createAdminClient } from "@/lib/supabase/server";
import { checkRateLimit, getRequestIp } from "@/lib/rate-limit";
import { enforceSameOrigin } from "@/lib/request-guards";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const guard = enforceSameOrigin(req);
    if (guard) return guard;

    let { email, code } = await req.json();
    
    email = email?.trim().toLowerCase();

    if (!email || !code) {
      return NextResponse.json(
        { error: "Email and code required" },
        { status: 400 }
      );
    }

    const ip = getRequestIp(req);
    const ipLimit = await checkRateLimit({
      key: `rl:verify-login-otp:ip:${ip}`,
      limit: 30,
      windowSec: 10 * 60,
    });
    if (!ipLimit.allowed) {
      return NextResponse.json(
        { error: "Too many verification attempts. Please wait and try again." },
        { status: 429, headers: { "Retry-After": String(ipLimit.retryAfter) } }
      );
    }

    const emailLimit = await checkRateLimit({
      key: `rl:verify-login-otp:email:${email}`,
      limit: 15,
      windowSec: 10 * 60,
    });
    if (!emailLimit.allowed) {
      return NextResponse.json(
        { error: "Too many verification attempts for this email. Please request a new OTP." },
        { status: 429, headers: { "Retry-After": String(emailLimit.retryAfter) } }
      );
    }

    // Verify OTP
    const otpResult = await verifyOTP(email, code);
    if (!otpResult.valid) {
      return NextResponse.json(
        { error: otpResult.error },
        { status: 400 }
      );
    }

    const adminClient = createAdminClient();

    // Get user via profile (case-insensitive email match)
    const { data: profiles, error: profileError } = await adminClient
      .from("profiles")
      .select("id")
      .ilike("email", email)
      .limit(1);

    if (profileError) {
      console.error("Verify login OTP profile lookup error:", profileError);
      return NextResponse.json({ error: "Failed to process request" }, { status: 500 });
    }
    const profile = Array.isArray(profiles) && profiles.length > 0 ? profiles[0] : null;

    if (!profile) {
      return NextResponse.json(
        { error: "User not found. Please sign up instead." },
        { status: 404 }
      );
    }

    // Generate a sign-in token so the frontend can establish a session
    const { data: linkData, error: linkError } = await adminClient.auth.admin.generateLink({
      type: "magiclink",
      email,
    });

    if (linkError) {
      console.error("Generate link error:", linkError);
      return NextResponse.json(
        { error: "Failed to create session" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        userId: profile.id,
        token_hash: linkData.properties.hashed_token,
        email_otp: linkData.properties.email_otp,
        message: "OTP verified successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Verify login OTP error:", error);
    return NextResponse.json(
      { error: "Failed to verify OTP" },
      { status: 500 }
    );
  }
}
