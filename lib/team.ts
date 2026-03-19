type WorkspaceContext = {
  workspaceOwnerId: string;
  workspaceUserIds: string[];
  isWorkspaceOwner: boolean;
};

export async function resolveWorkspaceOwnerId(supabase: any, userId: string): Promise<{ workspaceOwnerId: string; isWorkspaceOwner: boolean }> {
  const { data: membership } = await supabase
    .from("team_memberships")
    .select("owner_user_id")
    .eq("member_user_id", userId)
    .eq("status", "active")
    .maybeSingle();

  if (membership?.owner_user_id) {
    return { workspaceOwnerId: membership.owner_user_id, isWorkspaceOwner: false };
  }

  return { workspaceOwnerId: userId, isWorkspaceOwner: true };
}

export async function getWorkspaceUserIds(supabase: any, workspaceOwnerId: string): Promise<string[]> {
  const { data: members } = await supabase
    .from("team_memberships")
    .select("member_user_id")
    .eq("owner_user_id", workspaceOwnerId)
    .eq("status", "active")
    .not("member_user_id", "is", null);

  const ids = new Set<string>([workspaceOwnerId]);
  for (const row of members ?? []) {
    if (row?.member_user_id) {
      ids.add(row.member_user_id);
    }
  }
  return Array.from(ids);
}

export async function getWorkspaceContext(supabase: any, userId: string): Promise<WorkspaceContext> {
  const { workspaceOwnerId, isWorkspaceOwner } = await resolveWorkspaceOwnerId(supabase, userId);
  const workspaceUserIds = await getWorkspaceUserIds(supabase, workspaceOwnerId);
  return { workspaceOwnerId, workspaceUserIds, isWorkspaceOwner };
}
