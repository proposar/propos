import { verifyOTP } from "@/lib/otp";
import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

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
    const otpResult = verifyOTP(email, code);
    if (!otpResult.valid) {
      return NextResponse.json(
        { error: otpResult.error },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Check if auth user exists
    const { data: { users } } = await supabase.auth.admin.listUsers();
    const existingAuthUser = users?.find(u => u.email?.toLowerCase() === email);
    
    let userId: string;

    if (existingAuthUser) {
      // User already has an auth account
      userId = existingAuthUser.id;
    } else {
      // Create new auth user (OTP-based, no password)
      const { data, error: authError } = await supabase.auth.admin.createUser({
        email,
        email_confirm: true, // Auto-confirm email since OTP was verified
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
    }

    // **NOW** create or update profile (only after auth user exists)
    const { data: existingProfile } = await supabase
      .from("profiles")
      .select("id")
      .eq("id", userId)
      .single();

    const isNewUser = !existingProfile;

    const { error: profileError } = await supabase
      .from("profiles")
      .upsert({
        id: userId,
        email,
        full_name: fullName,
        business_type: businessType,
        onboarding_completed: isNewUser ? false : undefined,
      });

    if (profileError) {
      console.error("Profile creation error:", profileError);
      return NextResponse.json(
        { error: "Failed to create profile" },
        { status: 500 }
      );
    }

    console.log(`[Auth] User created/updated: ${email} | Name: ${fullName} | Type: ${businessType} (ID: ${userId})`);

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
