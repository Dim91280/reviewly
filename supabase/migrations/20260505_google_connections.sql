-- Table to store Google OAuth tokens per user
create table if not exists google_connections (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  access_token text not null,
  refresh_token text not null,
  account_id text,
  location_id text,
  expires_at timestamptz not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique (user_id)
);

alter table google_connections enable row level security;

create policy "Users can read own connection"
  on google_connections for select
  using (auth.uid() = user_id);

-- Allow upsert of google_review_id on reviews table
alter table reviews add column if not exists google_review_id text unique;
