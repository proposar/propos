import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { userId, email, fullName, businessType, hasPassword } = await req.json();

    if (!userId || !email) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const supabase = await createClient();
    const { data: { user: sessionUser } } = await supabase.auth.getUser();
    if (sessionUser?.id !== userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if profile already exists
    const { data: existing } = await supabase
      .from("profiles")
      .select("id")
      .eq("id", userId)
      .single();

    if (existing) {
      // Profile exists (e.g. from handle_new_user). Update full_name and business_type.
      const { error: updateError } = await supabase
        .from("profiles")
        .update({
          full_name: fullName || undefined,
          business_type: businessType || undefined,
        })
        .eq("id", userId);
      if (updateError) console.error("Profile update error:", updateError);
      // Mark user as having password auth (for correct login error messages)
      if (hasPassword) {
        const admin = await createAdminClient();
        const { data: u } = await admin.auth.admin.getUserById(userId);
        if (u?.user) {
          await admin.auth.admin.updateUserById(userId, {
            app_metadata: { ...u.user.app_metadata, has_password: true },
          });
        }
      }
      return NextResponse.json({ success: true, isNewUser: false });
    }

    // Create new profile
    const { error } = await supabase.from("profiles").insert({
      id: userId,
      email: email.toLowerCase(),
      full_name: fullName,
      business_type: businessType,
      onboarding_completed: false,
    });

    if (error) {
      console.error("Profile creation error:", error);
      throw error;
    }

    if (hasPassword) {
      const admin = await createAdminClient();
      const { data: u } = await admin.auth.admin.getUserById(userId);
      if (u?.user) {
        await admin.auth.admin.updateUserById(userId, {
          app_metadata: { ...u.user.app_metadata, has_password: true },
        });
      }
    }

    return NextResponse.json(
      { success: true, isNewUser: true },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create profile error:", error);
    return NextResponse.json(
      { error: "Failed to create profile" },
      { status: 500 }
    );
  }
}
