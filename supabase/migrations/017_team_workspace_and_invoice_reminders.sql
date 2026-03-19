-- Team workspace support (owner + members)
create table if not exists team_memberships (
  id uuid primary key default gen_random_uuid(),
  owner_user_id uuid not null references profiles(id) on delete cascade,
  member_user_id uuid references profiles(id) on delete set null,
  member_email text not null,
  role text not null default 'member',
  status text not null default 'pending', -- pending | active | removed
  invited_by_user_id uuid references profiles(id) on delete set null,
  invited_at timestamptz not null default now(),
  accepted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint team_memberships_role_check check (role in ('member', 'manager')),
  constraint team_memberships_status_check check (status in ('pending', 'active', 'removed')),
  constraint team_memberships_owner_email_unique unique (owner_user_id, member_email)
);

create unique index if not exists idx_team_memberships_owner_member_active
  on team_memberships(owner_user_id, member_user_id)
  where member_user_id is not null and status = 'active';

create unique index if not exists idx_team_memberships_member_single_workspace
  on team_memberships(member_user_id)
  where member_user_id is not null and status = 'active';

create index if not exists idx_team_memberships_owner_status on team_memberships(owner_user_id, status);
create index if not exists idx_team_memberships_member_email on team_memberships(lower(member_email));

alter table team_memberships enable row level security;

create policy "Owners can view their team memberships"
  on team_memberships
  for select
  using (owner_user_id = auth.uid());

create policy "Members can view their team memberships"
  on team_memberships
  for select
  using (member_user_id = auth.uid());

create policy "Invited users can view pending invites"
  on team_memberships
  for select
  using (
    status = 'pending'
    and lower(member_email) = lower(coalesce(auth.jwt() ->> 'email', ''))
  );

create policy "Owners can invite members"
  on team_memberships
  for insert
  with check (owner_user_id = auth.uid());

create policy "Owners can update team memberships"
  on team_memberships
  for update
  using (owner_user_id = auth.uid())
  with check (owner_user_id = auth.uid());

create policy "Invited users can accept invite"
  on team_memberships
  for update
  using (
    status = 'pending'
    and lower(member_email) = lower(coalesce(auth.jwt() ->> 'email', ''))
  )
  with check (member_user_id = auth.uid() and status = 'active');

create policy "Owners can remove team memberships"
  on team_memberships
  for delete
  using (owner_user_id = auth.uid());

drop trigger if exists update_team_memberships_updated_at on team_memberships;
create trigger update_team_memberships_updated_at
  before update on team_memberships
  for each row execute function update_updated_at();

-- Invoice payment reminders support
alter table invoices add column if not exists payment_reminder_enabled boolean not null default true;
alter table invoices add column if not exists first_payment_reminder_sent_at timestamptz;
alter table invoices add column if not exists second_payment_reminder_sent_at timestamptz;
alter table invoices add column if not exists final_payment_reminder_sent_at timestamptz;

create index if not exists idx_invoices_due_payment_reminders
  on invoices(user_id, due_date, payment_status, payment_reminder_enabled);
