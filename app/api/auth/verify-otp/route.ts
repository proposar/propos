import { verifyOTP } from "@/lib/otp";
import { createAdminClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    let { email, code, fullName, businessType } = await req.json();
    
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

    // **VERIFY OTP FIRST** - Only proceed if OTP is valid
    const otpResult = await verifyOTP(email, code);
    if (!otpResult.valid) {
      return NextResponse.json(
        { error: otpResult.error },
        { status: 400 }
      );
    }

    const adminClient = createAdminClient();

    // Check if auth user already exists by email (handles orphaned auth users)
    const { data: { users: existingUsers } } = await adminClient.auth.admin.listUsers({ perPage: 1000 });
    const existingAuthUser = existingUsers?.find(u => u.email?.toLowerCase() === email);

    let userId: string;
    let isNewUser = true;

    if (existingAuthUser) {
      // Auth user already exists — reuse it
      userId = existingAuthUser.id;
      
      // Check if profile exists
      const { data: existingProfile } = await adminClient
        .from("profiles")
        .select("id")
        .eq("id", userId)
        .single();

      isNewUser = !existingProfile;

      if (!existingProfile) {
        // Create missing profile
        const { error: profileError } = await adminClient
          .from("profiles")
          .insert({
            id: userId,
            email,
            full_name: fullName,
            business_type: businessType,
            onboarding_completed: false,
          });

        if (profileError) {
          console.error("Profile creation error:", profileError);
          return NextResponse.json({ error: "Failed to create profile" }, { status: 500 });
        }
      }
    } else {
      // Create brand new auth user (with retry - database/trigger errors can be transient)
      let data: Awaited<ReturnType<typeof adminClient.auth.admin.createUser>>["data"] | null = null;
      let authError: Awaited<ReturnType<typeof adminClient.auth.admin.createUser>>["error"] = null;

      for (let attempt = 1; attempt <= 2; attempt++) {
        const result = await adminClient.auth.admin.createUser({
          email,
          email_confirm: true,
          user_metadata: {
            full_name: fullName,
            business_type: businessType,
          },
        });
        data = result.data ?? null;
        authError = result.error;
        if (!authError) break;
        const isRetryable =
          authError.message?.toLowerCase().includes("database") ||
          authError.message?.toLowerCase().includes("saving new user");
        if (!isRetryable || attempt === 2) break;
        await new Promise((r) => setTimeout(r, 500));
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

      userId = data.user.id;
      isNewUser = true;

      // Because of the auth trigger (handle_new_user), a basic profile row is already created.
      // Update it with the latest data; if somehow missing, insert it.
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

    console.log(`[Auth] User verified: ${email} (ID: ${userId}, new: ${isNewUser})`);

    return NextResponse.json(
      {
        success: true,
        userId,
        email,
        isNewUser,
        token_hash: linkData.properties.hashed_token,
        email_otp: linkData.properties.email_otp,
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
