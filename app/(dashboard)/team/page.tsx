"use client";

import { useEffect, useState } from "react";

type TeamMember = {
  membershipId: string | null;
  userId: string | null;
  email: string | null;
  fullName: string | null;
  role: string;
  status: string;
  invitedAt: string | null;
  acceptedAt: string | null;
  isOwner: boolean;
};

type PendingInvite = {
  id: string;
  owner_user_id: string;
  member_email: string;
  role: string;
  invited_at: string;
};

export default function TeamPage() {
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [acceptingId, setAcceptingId] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"member" | "manager">("member");
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<{
    workspaceName: string;
    isWorkspaceOwner: boolean;
    members: TeamMember[];
    pendingInvites: PendingInvite[];
  } | null>(null);

  async function loadTeam() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/team");
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error ?? "Failed to load team");
      setData(json);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load team");
      setData(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadTeam();
  }, []);

  async function inviteMember() {
    if (!email.trim()) return;
    setSending(true);
    setError(null);
    try {
      const res = await fetch("/api/team", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), role }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json?.error ?? "Failed to invite member");
      setEmail("");
      await loadTeam();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to invite member");
    } finally {
      setSending(false);
    }
  }

  async function removeMember(membershipId: string) {
    setRemovingId(membershipId);
    setError(null);
    try {
      const res = await fetch("/api/team", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ membershipId }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json?.error ?? "Failed to remove member");
      await loadTeam();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to remove member");
    } finally {
      setRemovingId(null);
    }
  }

  async function acceptInvite(membershipId: string) {
    setAcceptingId(membershipId);
    setError(null);
    try {
      const res = await fetch("/api/team/accept", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ membershipId }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json?.error ?? "Failed to accept invite");
      await loadTeam();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to accept invite");
    } finally {
      setAcceptingId(null);
    }
  }

  const members = data?.members ?? [];
  const activeCount = members.filter((m) => m.status === "active").length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-2xl font-bold text-[#faf8f4]">Team Workspace</h1>
        <p className="text-sm text-[#888890] mt-1">
          {data?.workspaceName ?? "Workspace"} • {activeCount} active members
        </p>
      </div>

      {error && (
        <div className="rounded-lg border border-red-500/40 bg-red-500/10 text-red-300 px-4 py-3 text-sm">
          {error}
        </div>
      )}

      {data?.pendingInvites?.length ? (
        <div className="rounded-xl border border-[#1e1e2e] bg-[#12121e] p-5">
          <h2 className="font-semibold text-[#faf8f4] mb-3">Pending invites for you</h2>
          <div className="space-y-2">
            {data.pendingInvites.map((invite) => (
              <div key={invite.id} className="flex items-center justify-between rounded-lg border border-[#1e1e2e] px-3 py-2">
                <div>
                  <p className="text-sm text-[#faf8f4]">Role: {invite.role}</p>
                  <p className="text-xs text-[#888890]">Invited on {new Date(invite.invited_at).toLocaleDateString()}</p>
                </div>
                <button
                  type="button"
                  onClick={() => acceptInvite(invite.id)}
                  disabled={acceptingId === invite.id}
                  className="rounded-lg bg-gold px-3 py-1.5 text-sm font-medium text-[#0a0a14] disabled:opacity-50"
                >
                  {acceptingId === invite.id ? "Accepting..." : "Accept"}
                </button>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {data?.isWorkspaceOwner ? (
        <div className="rounded-xl border border-[#1e1e2e] bg-[#12121e] p-5">
          <h2 className="font-semibold text-[#faf8f4] mb-3">Invite team member</h2>
          <div className="grid md:grid-cols-4 gap-3">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="member@company.com"
              className="md:col-span-2 rounded-lg border border-[#1e1e2e] bg-[#0a0a14] px-3 py-2 text-[#faf8f4]"
            />
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as "member" | "manager")}
              className="rounded-lg border border-[#1e1e2e] bg-[#0a0a14] px-3 py-2 text-[#faf8f4]"
            >
              <option value="member">Member</option>
              <option value="manager">Manager</option>
            </select>
            <button
              type="button"
              onClick={inviteMember}
              disabled={sending || !email.trim()}
              className="rounded-lg bg-gold px-4 py-2 text-sm font-medium text-[#0a0a14] disabled:opacity-50"
            >
              {sending ? "Sending..." : "Send Invite"}
            </button>
          </div>
        </div>
      ) : null}

      <div className="rounded-xl border border-[#1e1e2e] bg-[#12121e] overflow-hidden">
        <div className="px-5 py-4 border-b border-[#1e1e2e]">
          <h2 className="font-semibold text-[#faf8f4]">Members</h2>
        </div>

        {loading ? (
          <div className="p-5 text-sm text-[#888890]">Loading team...</div>
        ) : members.length === 0 ? (
          <div className="p-5 text-sm text-[#888890]">No members yet.</div>
        ) : (
          <div className="divide-y divide-[#1e1e2e]">
            {members.map((m) => (
              <div key={m.membershipId ?? m.userId ?? m.email ?? Math.random()} className="p-4 flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm text-[#faf8f4]">{m.fullName || m.email || "Unknown"}</p>
                  <p className="text-xs text-[#888890]">
                    {m.email || "No email"} • {m.role} • {m.status}
                  </p>
                </div>
                {data?.isWorkspaceOwner && !m.isOwner && m.membershipId ? (
                  <button
                    type="button"
                    onClick={() => removeMember(m.membershipId!)}
                    disabled={removingId === m.membershipId}
                    className="rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-1.5 text-xs text-red-300 hover:bg-red-500/20 disabled:opacity-50"
                  >
                    {removingId === m.membershipId ? "Removing..." : "Remove"}
                  </button>
                ) : null}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
