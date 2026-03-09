import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
import { createClient } from "@/lib/supabase/server";
import { profileUpdateSchema, type ProfileUpdate } from "@/lib/validators";
import type { Profile } from "@/types";

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json<Profile>(data);
}

const PROFILE_FIELDS = [
  "full_name", "business_name", "business_type", "website", "phone", "address",
  "city", "country", "bio", "signature_text", "currency", "avatar_url", "logo_url",
  "brand_color", "default_payment_terms", "default_tone", "default_expiry_days",
  "default_sections", "auto_follow_up_enabled", "auto_follow_up_days",
  "notify_proposal_viewed", "notify_proposal_accepted", "notify_proposal_declined",
  "notify_proposal_expired", "notify_weekly_summary", "notify_product_updates",
];

export async function PATCH(request: Request): Promise<NextResponse<Profile | { error: string }>> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();

  // Validate request body with Zod
  const validationResult = profileUpdateSchema.safeParse(body);
  if (!validationResult.success) {
    return NextResponse.json(
      { error: `Validation error: ${validationResult.error.message}` },
      { status: 400 }
    );
  }

  const validatedData = validationResult.data as ProfileUpdate;
  const updates: Record<string, unknown> = {};
  
  // Build updates from validated data
  for (const key of PROFILE_FIELDS) {
    if (key in validatedData) {
      updates[key] = validatedData[key as keyof ProfileUpdate];
    }
  }

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: "No valid updates provided" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("profiles")
    .update(updates)
    .eq("id", user.id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json<Profile>(data);
}
