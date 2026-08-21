-- Run this once in Supabase: Project -> SQL Editor -> New Query -> paste -> Run

create table if not exists submissions (
  id uuid primary key default gen_random_uuid(),
  member_name text not null,
  member_email text not null,
  position text not null,
  shift_schedule text not null,
  week_range text not null,
  key_projects text not null,
  ai_tools text not null,
  efficiency_learnings text not null,
  future_automations text not null,
  human_impact text not null,
  challenges text not null,
  next_steps text not null default '',
  is_test boolean not null default false,
  submitted_at timestamptz not null default now()
);

create index if not exists submissions_week_range_idx on submissions (week_range);
create index if not exists submissions_member_name_idx on submissions (member_name);

-- Row Level Security stays ON, but no policies are defined for the anon key,
-- so the table is unreachable from the browser. Only the server-side API
-- routes (using the service role key) can read/write. Do not add an anon
-- policy unless you also add real authentication.
alter table submissions enable row level security;
