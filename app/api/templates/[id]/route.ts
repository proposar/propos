import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { templateUpdateSchema } from "@/lib/validators";
import type { Template } from "@/types";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse<Template | { error: string }>> {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data, error } = await supabase
    .from("templates")
    .select("*")
    .eq("id", id)
    .or(`is_public.eq.true,user_id.eq.${user.id}`)
    .single();

  if (error || !data) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json<Template>(data);
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse<Template | { error: string }>> {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();

  // Validate request body
  const validationResult = templateUpdateSchema.safeParse(body);
  if (!validationResult.success) {
    return NextResponse.json(
      { error: `Validation error: ${validationResult.error.message}` },
      { status: 400 }
    );
  }

  const allowed = ["name", "description", "project_type", "content"];
  const updates: Record<string, unknown> = {};
  const validated = validationResult.data;

  for (const k of allowed) {
    if (k in validated) {
      updates[k] = validated[k as keyof typeof validated];
    }
  }

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: "No valid updates provided" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("templates")
    .update(updates)
    .eq("id", id)
    .eq("user_id", user.id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json<Template>(data);
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse<{ deleted: boolean } | { error: string }>> {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { error } = await supabase
    .from("templates")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ deleted: true });
}
