-- Referral system for growth loops
create table if not exists referrals (
  id uuid primary key default gen_random_uuid(),
  referrer_id uuid not null references profiles(id) on delete cascade,
  referral_code text not null unique,
  referee_email text not null,
  referee_id uuid references profiles(id) on delete set null,
  referred_at timestamp with time zone default now(),
  completed_signup_at timestamp with time zone,
  completed_upgrade_at timestamp with time zone,
  commission_amount decimal(8, 2),
  reward_claimed boolean default false,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- RLS: Users can only view their own referrals (as referrer)
alter table referrals enable row level security;

create policy "Users can view their own referrals"
  on referrals
  for select
  using (auth.uid() = referrer_id);

create policy "Users can create referrals"
  on referrals
  for insert
  with check (auth.uid() = referrer_id);

create policy "Users can update their own referrals"
  on referrals
  for update
  using (auth.uid() = referrer_id);

-- Indexes for performance
create index if not exists idx_referrals_referrer_id on referrals(referrer_id);
create index if not exists idx_referrals_referral_code on referrals(referral_code);
create index if not exists idx_referrals_referee_email on referrals(referee_email);
create index if not exists idx_referrals_referee_id on referrals(referee_id);
create index if not exists idx_referrals_created_at on referrals(created_at);
create index if not exists idx_referrals_completed_upgrade_at on referrals(completed_upgrade_at);

-- Referral rewards tracking table (for analytics)
create table if not exists referral_rewards (
  id uuid primary key default gen_random_uuid(),
  referral_id uuid not null references referrals(id) on delete cascade,
  reward_type text not null, -- 'commission', 'credit', 'bonus'
  amount decimal(8, 2) not null,
  currency text default 'USD',
  description text,
  claimed_at timestamp with time zone,
  created_at timestamp with time zone default now()
);

alter table referral_rewards enable row level security;

create policy "Users can view their referral rewards"
  on referral_rewards
  for select
  using (
    exists (
      select 1 from referrals
      where referrals.id = referral_rewards.referral_id
      and referrals.referrer_id = auth.uid()
    )
  );

create index if not exists idx_referral_rewards_referral_id on referral_rewards(referral_id);
create index if not exists idx_referral_rewards_created_at on referral_rewards(created_at);
