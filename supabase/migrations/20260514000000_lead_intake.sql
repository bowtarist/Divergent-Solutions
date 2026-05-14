create extension if not exists pgcrypto with schema extensions;

create table if not exists public.leads (
  id uuid primary key default extensions.gen_random_uuid(),
  source text not null default 'website'
    check (source in ('website', 'manual')),
  status text not null default 'new'
    check (status in ('new', 'attempting_contact', 'qualified', 'quoted', 'won', 'lost')),
  assigned_user_id uuid,
  contact_name text not null,
  first_name text not null,
  last_name text,
  email text not null,
  phone text not null,
  project_type text not null,
  project_description text not null,
  preferred_timing text,
  initial_service_address_text text not null,
  service_city text not null,
  customer_type text not null,
  property_type text,
  submitted_at timestamptz not null,
  call_status text not null default 'open'
    check (call_status in ('open', 'completed', 'dismissed')),
  call_reminder_due_at timestamptz not null,
  customer_id uuid,
  job_id uuid,
  qualified_at timestamptz,
  lost_reason text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists leads_status_created_at_idx
  on public.leads (status, created_at desc);

create index if not exists leads_call_status_due_at_idx
  on public.leads (call_status, call_reminder_due_at);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_leads_updated_at on public.leads;

create trigger set_leads_updated_at
before update on public.leads
for each row
execute function public.set_updated_at();

alter table public.leads enable row level security;

revoke all on table public.leads from anon, authenticated;
grant usage on schema public to service_role;
grant select, insert, update, delete on table public.leads to service_role;
