import { verifyOTP } from "@/lib/otp";
import { createAdminClient } from "@/lib/supabase/server";
import { checkRateLimit, getRequestIp } from "@/lib/rate-limit";
import { enforceSameOrigin } from "@/lib/request-guards";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const guard = enforceSameOrigin(req);
    if (guard) return guard;

    let { email, code, fullName, businessType, password } = await req.json();
    
    email = email?.trim().toLowerCase();
    fullName = fullName?.trim();
    businessType = businessType?.trim();

    if (!email || !code) {
      return NextResponse.json(
        { error: "Email and code required" },
        { status: 400 }
      );
    }

    if (!fullName) {
      return NextResponse.json(
        { error: "Full name is required" },
        { status: 400 }
      );
    }

    if (!businessType) {
      return NextResponse.json(
        { error: "Business type is required" },
        { status: 400 }
      );
    }

    if (!password || typeof password !== "string" || password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters" },
        { status: 400 }
      );
    }

    const ip = getRequestIp(req);
    const ipLimit = await checkRateLimit({
      key: `rl:verify-signup-otp:ip:${ip}`,
      limit: 25,
      windowSec: 10 * 60,
    });
    if (!ipLimit.allowed) {
      return NextResponse.json(
        { error: "Too many verification attempts. Please wait and try again." },
        { status: 429, headers: { "Retry-After": String(ipLimit.retryAfter) } }
      );
    }

    const emailLimit = await checkRateLimit({
      key: `rl:verify-signup-otp:email:${email}`,
      limit: 12,
      windowSec: 10 * 60,
    });
    if (!emailLimit.allowed) {
      return NextResponse.json(
        { error: "Too many verification attempts for this email. Please request a new OTP." },
        { status: 429, headers: { "Retry-After": String(emailLimit.retryAfter) } }
      );
    }

    // **VERIFY OTP FIRST** - Only proceed if OTP is valid
    const otpResult = await verifyOTP(email, code);
    if (!otpResult.valid) {
      return NextResponse.json(
        { error: otpResult.error },
        { status: 400 }
      );
    }

    const adminClient = createAdminClient();

    // Create brand new auth user only AFTER OTP success
    let data: Awaited<ReturnType<typeof adminClient.auth.admin.createUser>>["data"] | null = null;
    let authError: Awaited<ReturnType<typeof adminClient.auth.admin.createUser>>["error"] = null;

    for (let attempt = 1; attempt <= 2; attempt++) {
      const result = await adminClient.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: {
          full_name: fullName,
          business_type: businessType,
        },
        app_metadata: {
          has_password: true,
        },
      });
      data = result.data ?? null;
      authError = result.error;
      if (!authError) break;
      const isRetryable =
        authError.message?.toLowerCase().includes("database") ||
        authError.message?.toLowerCase().includes("saving new user");
      if (!isRetryable || attempt === 2) break;
      await new Promise((r) => setTimeout(r, 250));
    }

    if (authError || !data?.user) {
      if (authError) {
        console.error("[Auth] createUser failed:", authError.message, authError);
      }
      const msg =
        authError?.message?.toLowerCase().includes("already") ||
        authError?.message?.toLowerCase().includes("exists")
          ? "This email is already registered. Please sign in instead."
          : authError?.message?.toLowerCase().includes("database") ||
              authError?.message?.toLowerCase().includes("saving new user")
            ? "Account creation failed. Please try again or use Google sign-in."
            : "Failed to create account. Please try again.";
      return NextResponse.json({ error: msg }, { status: 500 });
    }

    const userId = data.user.id;
    const isNewUser = true;

    // handle_new_user trigger inserts a profile; update fields and fallback insert if needed
    const { data: existingProfile, error: profileLookupError } = await adminClient
      .from("profiles")
      .select("id")
      .eq("id", userId)
      .maybeSingle();

    if (profileLookupError) {
      console.error("Profile lookup error after user creation:", profileLookupError);
    }

    let profileError = null;

    if (existingProfile) {
      const { error } = await adminClient
        .from("profiles")
        .update({
          email,
          full_name: fullName,
          business_type: businessType,
          onboarding_completed: false,
        })
        .eq("id", userId);
      profileError = error;
    } else {
      const { error } = await adminClient
        .from("profiles")
        .insert({
          id: userId,
          email,
          full_name: fullName,
          business_type: businessType,
          onboarding_completed: false,
        });
      profileError = error;
    }

    if (profileError) {
      console.error("Profile upsert error:", profileError);
      await adminClient.auth.admin.deleteUser(userId);
      return NextResponse.json({ error: "Failed to create profile" }, { status: 500 });
    }

    console.log(`[Auth] User verified: ${email} (ID: ${userId}, new: ${isNewUser})`);

    return NextResponse.json(
      {
        success: true,
        userId,
        email,
        isNewUser,
        message: "Email verified successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Verify OTP error:", error);
    return NextResponse.json(
      { error: "Failed to verify OTP" },
      { status: 500 }
    );
  }
}
