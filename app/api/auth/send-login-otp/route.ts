import { sendOTP } from "@/lib/otp";
import { validateEmail } from "@/lib/email-validation";
import { createAdminClient } from "@/lib/supabase/server";
import { checkRateLimit, getRequestIp } from "@/lib/rate-limit";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    let { email } = await req.json();
    
    email = email?.trim().toLowerCase();

    if (!email) {
      return NextResponse.json({ error: "Email required" }, { status: 400 });
    }

    const ip = getRequestIp(req);
    const ipLimit = await checkRateLimit({
      key: `rl:login-otp:ip:${ip}`,
      limit: 15,
      windowSec: 10 * 60,
    });
    if (!ipLimit.allowed) {
      return NextResponse.json(
        { error: "Too many requests. Please try again shortly." },
        { status: 429, headers: { "Retry-After": String(ipLimit.retryAfter) } }
      );
    }

    const emailLimit = await checkRateLimit({
      key: `rl:login-otp:email:${email}`,
      limit: 5,
      windowSec: 10 * 60,
    });
    if (!emailLimit.allowed) {
      return NextResponse.json(
        { error: "Too many OTP requests for this email. Please wait and try again." },
        { status: 429, headers: { "Retry-After": String(emailLimit.retryAfter) } }
      );
    }

    // Validate email
    const emailValidation = validateEmail(email);
    if (!emailValidation.valid) {
      return NextResponse.json(
        { error: emailValidation.error },
        { status: 400 }
      );
    }

    // Check if email exists (case-insensitive - profile may have different casing)
    const adminClient = createAdminClient();
    const { data: profiles, error: profileError } = await adminClient
      .from("profiles")
      .select("id")
      .ilike("email", email)
      .limit(1);

    if (profileError) {
      console.error("Send login OTP profile lookup error:", profileError);
      return NextResponse.json({ error: "Failed to process request" }, { status: 500 });
    }
    const profile = Array.isArray(profiles) && profiles.length > 0 ? profiles[0] : null;

    if (!profile) {
      return NextResponse.json(
        { error: "No account found with this email. Please sign up instead." },
        { status: 400 }
      );
    }

    // Send OTP
    const result = await sendOTP(email);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || "Failed to send OTP" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: true, message: "OTP sent to email" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Send login OTP error:", error);
    return NextResponse.json(
      { error: "Failed to send OTP" },
      { status: 500 }
    );
  }
}
