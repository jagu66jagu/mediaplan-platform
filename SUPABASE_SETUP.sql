-- Run this in Supabase SQL editor

create table media_plans (
  id uuid default gen_random_uuid() primary key,
  created_at timestamptz default now(),
  brand text not null,
  sector text not null,
  objective text,
  budget numeric,
  month text,
  duration text,
  audience text,
  brief text,
  plan_data jsonb
);

-- Enable RLS (optional for now)
alter table media_plans enable row level security;

-- Allow all reads/writes (tighten later with auth)
create policy "allow all" on media_plans for all using (true);
