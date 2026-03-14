import { createAdminClient } from "@/lib/supabase/server";
import { createServerClient } from "@supabase/ssr";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/dashboard";
  const errorFromOAuth = searchParams.get("error");
  const errorDescription = searchParams.get("error_description");

  const safeNext = next.startsWith("/") ? next : "/dashboard";

  const buildErrorRedirect = (errorType = "google_auth_failed", desc?: string | null) => {
    const url = new URL("/login", origin);
    url.searchParams.set("error", errorType);
    if (desc) url.searchParams.set("error_description", desc);
    return url;
  };

  // Supabase/Google may return error in query string on auth failure
  if (errorFromOAuth && !code) {
    return NextResponse.redirect(
      buildErrorRedirect(
        errorFromOAuth === "access_denied" ? "access_denied" : "google_auth_failed",
        errorDescription
      )
    );
  }

  if (code) {
    try {
      const redirectUrl = new URL(safeNext, origin);
      const response = NextResponse.redirect(redirectUrl);

      const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
          cookies: {
            getAll() {
              return request.cookies.getAll();
            },
            setAll(cookiesToSet: Array<{ name: string; value: string; options?: Record<string, unknown> }>) {
              cookiesToSet.forEach(({ name, value, options }) => {
                response.cookies.set(name, value, options);
              });
            },
          },
        }
      );

      const { error } = await supabase.auth.exchangeCodeForSession(code);
      
      if (error) {
        console.error("OAuth code exchange error:", error);
        return NextResponse.redirect(buildErrorRedirect());
      }

      // Get the authenticated user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        // Ensure profile exists for this user (important for Google OAuth)
        const adminClient = createAdminClient();
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

      return response;
    } catch (err) {
      console.error("Callback error:", err);
      return NextResponse.redirect(buildErrorRedirect());
    }
  }

  return NextResponse.redirect(buildErrorRedirect());
}
