import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const acceptSchema = z.object({
  membershipId: z.string().uuid(),
});

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json().catch(() => ({}));
  const parsed = acceptSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.message }, { status: 400 });
  }

  const { data: invite } = await supabase
    .from("team_memberships")
    .select("id, member_email, status")
    .eq("id", parsed.data.membershipId)
    .maybeSingle();

  if (!invite || invite.status !== "pending") {
    return NextResponse.json({ error: "Invite not found" }, { status: 404 });
  }

  if ((invite.member_email ?? "").toLowerCase() !== (user.email ?? "").toLowerCase()) {
    return NextResponse.json({ error: "This invite is for a different email" }, { status: 403 });
  }

  const { error } = await supabase
    .from("team_memberships")
    .update({
      status: "active",
      member_user_id: user.id,
      accepted_at: new Date().toISOString(),
    })
    .eq("id", invite.id)
    .eq("status", "pending");

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
