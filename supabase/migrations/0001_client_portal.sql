-- Client Portal schema.
--
-- Run once in the Supabase SQL editor (or `supabase db push`). Safe to read top to bottom:
--   1. tables            clients, change_requests, plus two internal tables
--   2. row level security  a client's JWT carries `client_id`; policies match on it
--   3. submit_change_request()  the only way to create a request; checks the quota atomically
--   4. triggers          stamp completed_at, and give an edit back when a request is declined
--   5. storage bucket    private bucket for attachments
--
-- Auth model: the portal API verifies domain + password itself (bcrypt), then mints a JWT signed
-- with this project's JWT secret, with role = authenticated and a `client_id` claim. That JWT is
-- sent to PostgREST, so Postgres — not the API code — decides what each client may read.

create extension if not exists pgcrypto;

-- ---------------------------------------------------------------------------------------------
-- 1. Tables
-- ---------------------------------------------------------------------------------------------

create table if not exists public.clients (
  id                      uuid primary key default gen_random_uuid(),
  company_name            text        not null check (char_length(company_name) between 1 and 120),
  -- Stored normalised: lower case, no scheme, no "www.", no path. The API normalises before lookup.
  domain_name             text        not null unique
                            check (domain_name = lower(domain_name) and domain_name !~ '^(https?://|www\.)' and domain_name !~ '[/\s]'),
  password_hash           text        not null,
  plan_type               text        not null check (plan_type in ('subscription', 'pay_as_you_go', 'cms_handover')),
  -- Added beyond the original spec: the plan card shows billing status and renewal date.
  billing_status          text        not null default 'active' check (billing_status in ('active', 'past_due', 'canceled')),
  current_period_end      timestamptz,
  stripe_customer_id      text,
  stripe_subscription_id  text,
  monthly_edit_limit      integer     not null default 10 check (monthly_edit_limit >= 0),
  edits_used_this_month   integer     not null default 0  check (edits_used_this_month >= 0),
  created_at              timestamptz not null default now()
);

create index if not exists clients_domain_name_idx on public.clients (domain_name);
create index if not exists clients_stripe_customer_idx on public.clients (stripe_customer_id);

create table if not exists public.change_requests (
  id              uuid primary key default gen_random_uuid(),
  client_id       uuid        not null references public.clients (id) on delete cascade,
  title           text        not null check (char_length(title) between 1 and 120),
  description     text        not null check (char_length(description) between 1 and 5000),
  -- Added beyond the original spec: the submit form asks which page the change is for.
  page_url        text        check (page_url is null or char_length(page_url) <= 500),
  -- Storage path inside the private `request-attachments` bucket (the API turns it into a signed URL).
  attachment_url  text,
  status          text        not null default 'pending' check (status in ('pending', 'in_progress', 'completed', 'declined')),
  created_at      timestamptz not null default now(),
  completed_at    timestamptz
);

create index if not exists change_requests_client_idx on public.change_requests (client_id, created_at desc);

-- Webhook idempotency: Stripe retries, so remember which events were already applied.
create table if not exists public.stripe_events (
  id           text primary key,
  type         text        not null,
  received_at  timestamptz not null default now()
);

-- Login throttling. Written and read only by the API with the service role.
create table if not exists public.portal_login_attempts (
  id          bigint generated always as identity primary key,
  domain      text        not null,
  ip          text        not null,
  success     boolean     not null,
  created_at  timestamptz not null default now()
);

create index if not exists portal_login_attempts_domain_idx on public.portal_login_attempts (domain, created_at desc);
create index if not exists portal_login_attempts_ip_idx on public.portal_login_attempts (ip, created_at desc);

-- ---------------------------------------------------------------------------------------------
-- 2. Row level security
-- ---------------------------------------------------------------------------------------------

alter table public.clients               enable row level security;
alter table public.change_requests       enable row level security;
alter table public.stripe_events         enable row level security;
alter table public.portal_login_attempts enable row level security;

-- The client a request is acting for, read from the verified JWT. NULL when absent.
create or replace function public.current_client_id() returns uuid
language sql stable as $$
  select nullif(auth.jwt() ->> 'client_id', '')::uuid
$$;

-- Clients may read only their own row...
drop policy if exists clients_select_own on public.clients;
create policy clients_select_own on public.clients
  for select to authenticated
  using (id = public.current_client_id());

-- ...and only their own requests. No insert/update/delete policies: writes go through
-- submit_change_request() below, and status changes are made by you with the service role.
drop policy if exists change_requests_select_own on public.change_requests;
create policy change_requests_select_own on public.change_requests
  for select to authenticated
  using (client_id = public.current_client_id());

-- Column-level privileges: even their own row never exposes the password hash or Stripe ids.
revoke all on public.clients, public.change_requests, public.stripe_events, public.portal_login_attempts
  from anon, authenticated;

grant select (id, company_name, domain_name, plan_type, billing_status, current_period_end,
              monthly_edit_limit, edits_used_this_month, created_at)
  on public.clients to authenticated;

grant select on public.change_requests to authenticated;

-- ---------------------------------------------------------------------------------------------
-- 3. Submitting a request (atomic quota check)
-- ---------------------------------------------------------------------------------------------

create or replace function public.submit_change_request(
  p_title           text,
  p_description     text,
  p_page_url        text,
  p_attachment_url  text
) returns public.change_requests
language plpgsql
security definer
set search_path = public
as $$
declare
  v_client_id uuid := public.current_client_id();
  v_client    public.clients;
  v_request   public.change_requests;
begin
  if v_client_id is null then
    raise exception 'not_authenticated' using errcode = '28000';
  end if;

  -- Lock the row so two simultaneous submissions cannot both take the last edit.
  select * into v_client from public.clients where id = v_client_id for update;
  if not found then
    raise exception 'not_authenticated' using errcode = '28000';
  end if;

  if v_client.plan_type = 'cms_handover' then
    raise exception 'no_edits_on_plan' using errcode = 'P0001';
  end if;

  if v_client.billing_status = 'canceled' then
    raise exception 'billing_inactive' using errcode = 'P0001';
  end if;

  if v_client.edits_used_this_month >= v_client.monthly_edit_limit then
    raise exception 'quota_exceeded' using errcode = 'P0001';
  end if;

  -- Attachments must live in this client's own folder of the bucket.
  if p_attachment_url is not null and p_attachment_url not like v_client_id::text || '/%' then
    raise exception 'invalid_attachment' using errcode = 'P0001';
  end if;

  insert into public.change_requests (client_id, title, description, page_url, attachment_url)
  values (v_client_id, p_title, p_description, nullif(p_page_url, ''), p_attachment_url)
  returning * into v_request;

  update public.clients set edits_used_this_month = edits_used_this_month + 1 where id = v_client_id;

  return v_request;
end;
$$;

revoke all on function public.submit_change_request(text, text, text, text) from public, anon;
grant execute on function public.submit_change_request(text, text, text, text) to authenticated;

-- ---------------------------------------------------------------------------------------------
-- 4. Status side effects
-- ---------------------------------------------------------------------------------------------

create or replace function public.change_requests_status_effects() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  if new.status is distinct from old.status then
    if new.status in ('completed', 'declined') then
      new.completed_at := coalesce(new.completed_at, now());
    else
      new.completed_at := null;
    end if;

    -- A declined request does not use up one of the client's edits.
    if new.status = 'declined' and old.status <> 'declined' then
      update public.clients
         set edits_used_this_month = greatest(edits_used_this_month - 1, 0)
       where id = new.client_id;
    elsif old.status = 'declined' and new.status <> 'declined' then
      update public.clients
         set edits_used_this_month = edits_used_this_month + 1
       where id = new.client_id;
    end if;
  end if;
  return new;
end;
$$;

drop trigger if exists change_requests_status_effects on public.change_requests;
create trigger change_requests_status_effects
  before update of status on public.change_requests
  for each row execute function public.change_requests_status_effects();

-- ---------------------------------------------------------------------------------------------
-- 5. Attachment storage
-- ---------------------------------------------------------------------------------------------

-- Private bucket. Uploads use short-lived signed upload URLs created by the API (service role),
-- and reads use signed URLs, so no storage policies are needed for clients.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'request-attachments', 'request-attachments', false, 10485760,
  array['image/png', 'image/jpeg', 'image/webp', 'image/gif', 'application/pdf']
)
on conflict (id) do nothing;
