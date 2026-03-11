import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/dashboard";

  if (code) {
    try {
      const supabase = await createClient();
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      
      if (error) {
        return NextResponse.redirect(`${origin}/login?error=auth`);
      }

      // Get the authenticated user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        // Ensure profile exists for this user (important for Google OAuth)
        const adminClient = await createAdminClient();
        const { data: existingProfile } = await adminClient
          .from("profiles")
          .select("id")
          .eq("id", user.id)
          .single();

        if (!existingProfile) {
          // Create profile for new OAuth user
          const { error: profileError } = await adminClient
            .from("profiles")
            .insert({
              id: user.id,
              email: user.email,
              full_name: user.user_metadata?.full_name || user.email?.split("@")[0] || "User",
              business_type: "freelancer", // Default for OAuth users
              auth_provider: "google", // Track the provider
            });

          if (profileError) {
            console.error("Profile creation error:", profileError);
            // Don't fail - profile might already exist
          }
        }
      }

      return NextResponse.redirect(`${origin}${next}`);
    } catch (err) {
      console.error("Callback error:", err);
      return NextResponse.redirect(`${origin}/login?error=auth`);
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth`);
}
