import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { resolveWorkspaceOwnerId } from "@/lib/team";

const inviteSchema = z.object({
  email: z.string().email(),
  role: z.enum(["member", "manager"]).default("member"),
});

const removeSchema = z.object({
  membershipId: z.string().uuid(),
});

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { workspaceOwnerId, isWorkspaceOwner } = await resolveWorkspaceOwnerId(supabase, user.id);

  const { data: ownerProfile } = await supabase
    .from("profiles")
    .select("id, email, full_name, business_name")
    .eq("id", workspaceOwnerId)
    .single();

  const { data: memberships } = await supabase
    .from("team_memberships")
    .select("id, owner_user_id, member_user_id, member_email, role, status, invited_at, accepted_at")
    .eq("owner_user_id", workspaceOwnerId)
    .order("invited_at", { ascending: false });

  const memberIds = (memberships ?? [])
    .map((m) => m.member_user_id)
    .filter((v): v is string => Boolean(v));

  const { data: memberProfiles } = memberIds.length
    ? await supabase
        .from("profiles")
        .select("id, email, full_name")
        .in("id", memberIds)
    : { data: [] as Array<{ id: string; email: string | null; full_name: string | null }> };

  const profileMap = new Map((memberProfiles ?? []).map((p) => [p.id, p]));

  const members = [
    {
      membershipId: null,
      userId: workspaceOwnerId,
      email: ownerProfile?.email ?? null,
      fullName: ownerProfile?.full_name ?? ownerProfile?.business_name ?? "Workspace Owner",
      role: "owner",
      status: "active",
      invitedAt: null,
      acceptedAt: null,
      isOwner: true,
    },
    ...(memberships ?? []).map((m) => {
      const profile = m.member_user_id ? profileMap.get(m.member_user_id) : null;
      return {
        membershipId: m.id,
        userId: m.member_user_id,
        email: profile?.email ?? m.member_email,
        fullName: profile?.full_name ?? null,
        role: m.role,
        status: m.status,
        invitedAt: m.invited_at,
        acceptedAt: m.accepted_at,
        isOwner: false,
      };
    }),
  ];

  const { data: pendingInvites } = await supabase
    .from("team_memberships")
    .select("id, owner_user_id, member_email, role, invited_at")
    .eq("status", "pending")
    .eq("member_email", user.email ?? "")
    .order("invited_at", { ascending: false });

  return NextResponse.json({
    workspaceOwnerId,
    isWorkspaceOwner,
    workspaceName: ownerProfile?.business_name ?? ownerProfile?.full_name ?? "Workspace",
    members,
    pendingInvites: pendingInvites ?? [],
  });
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { workspaceOwnerId, isWorkspaceOwner } = await resolveWorkspaceOwnerId(supabase, user.id);
  if (!isWorkspaceOwner) {
    return NextResponse.json({ error: "Only workspace owner can invite members" }, { status: 403 });
  }

  const body = await request.json().catch(() => ({}));
  const parsed = inviteSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.message }, { status: 400 });
  }

  const invitedEmail = parsed.data.email.trim().toLowerCase();

  const { data: ownerProfile } = await supabase
    .from("profiles")
    .select("email")
    .eq("id", workspaceOwnerId)
    .single();

  if (ownerProfile?.email?.toLowerCase() === invitedEmail) {
    return NextResponse.json({ error: "Cannot invite workspace owner" }, { status: 400 });
  }

  const { data: existingMember } = await supabase
    .from("team_memberships")
    .select("id, status")
    .eq("owner_user_id", workspaceOwnerId)
    .eq("member_email", invitedEmail)
    .maybeSingle();

  if (existingMember?.status === "active") {
    return NextResponse.json({ error: "Member already active" }, { status: 409 });
  }

  const { data: memberProfile } = await supabase
    .from("profiles")
    .select("id")
    .eq("email", invitedEmail)
    .maybeSingle();

  const payload = {
    owner_user_id: workspaceOwnerId,
    member_user_id: memberProfile?.id ?? null,
    member_email: invitedEmail,
    role: parsed.data.role,
    status: "pending",
    invited_by_user_id: user.id,
    invited_at: new Date().toISOString(),
    accepted_at: null,
  };

  const query = existingMember
    ? supabase.from("team_memberships").update(payload).eq("id", existingMember.id)
    : supabase.from("team_memberships").insert(payload);

  const { error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ ok: true });
}

export async function DELETE(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { workspaceOwnerId, isWorkspaceOwner } = await resolveWorkspaceOwnerId(supabase, user.id);
  if (!isWorkspaceOwner) {
    return NextResponse.json({ error: "Only workspace owner can remove members" }, { status: 403 });
  }

  const body = await request.json().catch(() => ({}));
  const parsed = removeSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.message }, { status: 400 });
  }

  const { error } = await supabase
    .from("team_memberships")
    .delete()
    .eq("id", parsed.data.membershipId)
    .eq("owner_user_id", workspaceOwnerId);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
