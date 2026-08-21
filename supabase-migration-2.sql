-- Run this in your EXISTING Supabase project's SQL Editor.
-- It adds the two new columns without touching any data you already have.

alter table submissions
  add column if not exists next_steps text not null default '';

alter table submissions
  add column if not exists is_test boolean not null default false;
