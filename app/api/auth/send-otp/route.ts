import { sendOTP } from "@/lib/otp";
import { validateEmail } from "@/lib/email-validation";
import { createAdminClient } from "@/lib/supabase/server";
import { checkRateLimit, getRequestIp } from "@/lib/rate-limit";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    let { email, fullName } = await req.json();
    
    email = email?.trim().toLowerCase();
    fullName = fullName?.trim();

    if (!email) {
      return NextResponse.json({ error: "Email required" }, { status: 400 });
    }

    if (!fullName) {
      return NextResponse.json({ error: "Full name required" }, { status: 400 });
    }

    const ip = getRequestIp(req);
    const ipLimit = await checkRateLimit({
      key: `rl:signup-otp:ip:${ip}`,
      limit: 12,
      windowSec: 10 * 60,
    });
    if (!ipLimit.allowed) {
      return NextResponse.json(
        { error: "Too many requests. Please try again shortly." },
        { status: 429, headers: { "Retry-After": String(ipLimit.retryAfter) } }
      );
    }

    const emailLimit = await checkRateLimit({
      key: `rl:signup-otp:email:${email}`,
      limit: 4,
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

    // Fast check: existing profile means account already exists
    const adminClient = createAdminClient();
    const { data: existingProfiles, error: existingProfilesError } = await adminClient
      .from("profiles")
      .select("id")
      .ilike("email", email)
      .limit(1);

    if (existingProfilesError) {
      console.error("Send OTP profile lookup error:", existingProfilesError);
      return NextResponse.json(
        { error: "Failed to process request" },
        { status: 500 }
      );
    }

    if (Array.isArray(existingProfiles) && existingProfiles.length > 0) {
      return NextResponse.json(
        { error: "This email is already in use. Please sign in instead." },
        { status: 400 }
      );
    }

    // Send OTP
    const result = await sendOTP(email, fullName);

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
    console.error("Send OTP error:", error);
    return NextResponse.json(
      { error: "Failed to send OTP" },
      { status: 500 }
    );
  }
}
