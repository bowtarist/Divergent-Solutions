alter table public.leads
  add column if not exists name text not null default '';
