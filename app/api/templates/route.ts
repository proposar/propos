import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { templateCreateSchema, templateSearchSchema } from "@/lib/validators";
import { PLAN_LIMITS } from "@/lib/config";
import type { Template } from "@/types";

export async function GET(request: Request): Promise<NextResponse<Template[] | { error: string }>> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const queryObj = {
    search: searchParams.get("search"),
    sort: searchParams.get("sort"),
    order: searchParams.get("order"),
  };

  // Validate query parameters
  const validationResult = templateSearchSchema.safeParse(queryObj);
  if (!validationResult.success) {
    return NextResponse.json(
      { error: `Invalid query: ${validationResult.error.message}` },
      { status: 400 }
    );
  }

  const { search, sort, order } = validationResult.data;

  let query = supabase
    .from("templates")
    .select("id, name, description, project_type, content, is_public, is_premium, use_count, created_at")
    .or(`is_public.eq.true,and(user_id.eq.${user.id})`);

  if (search?.trim()) {
    query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`);
  }

  const { data, error } = await query
    .order(sort, { ascending: order === "asc" })
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json<Template[]>((data as Template[]) ?? []);
}

export async function POST(request: Request): Promise<NextResponse<Template | { error: string }>> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: profile } = await supabase
    .from("profiles")
    .select("subscription_plan")
    .eq("id", user.id)
    .single();

  const plan = (profile?.subscription_plan as keyof typeof PLAN_LIMITS) ?? "free";
  const templateLimit = PLAN_LIMITS[plan].templates;
  if (templateLimit >= 0) {
    const { count, error: countError } = await supabase
      .from("templates")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id);

    if (countError) {
      return NextResponse.json({ error: countError.message }, { status: 500 });
    }

    if ((count ?? 0) >= templateLimit) {
      return NextResponse.json(
        {
          error: "Template limit reached for your current plan",
          upgradeUrl: "/billing?plan=starter",
        },
        { status: 402 }
      );
    }
  }

  const body = await request.json();

  // Validate request body
  const validationResult = templateCreateSchema.safeParse(body);
  if (!validationResult.success) {
    return NextResponse.json(
      { error: `Validation error: ${validationResult.error.message}` },
      { status: 400 }
    );
  }

  const { name, description, content, project_type } = validationResult.data;

  const { data, error } = await supabase
    .from("templates")
    .insert({
      user_id: user.id,
      name: name.trim(),
      description: description?.trim() || null,
      content,
      project_type: project_type?.trim() || null,
      is_public: false,
      is_premium: false,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json<Template>(data);
}
