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

    // Check if user already exists via profiles table (efficient)
    const { data: existingProfile } = await adminClient
      .from("profiles")
      .select("id")
      .eq("email", email)
      .single();

    let userId: string;
    const isNewUser = !existingProfile;

    if (existingProfile) {
      userId = existingProfile.id;
    } else {
      // Create new auth user - email already verified via OTP
      const { data, error: authError } = await adminClient.auth.admin.createUser({
        email,
        email_confirm: true,
        user_metadata: {
          full_name: fullName,
          business_type: businessType,
        },
      });

      if (authError) {
        console.error("Auth user creation error:", authError);
        return NextResponse.json(
          { error: "Failed to create account" },
          { status: 500 }
        );
      }

      userId = data.user.id;

      // Create profile
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
        // Clean up auth user if profile creation failed
        await adminClient.auth.admin.deleteUser(userId);
        return NextResponse.json(
          { error: "Failed to create profile" },
          { status: 500 }
        );
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
