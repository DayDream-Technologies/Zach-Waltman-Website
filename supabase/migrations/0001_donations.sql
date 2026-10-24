-- Donation ledger for the Zach Waltman Foundation.
-- The public site never queries these tables. Lambda and Edge Functions use the
-- service role, which bypasses row level security. No anon or authenticated
-- policies are created on purpose.

create extension if not exists pgcrypto;

create table public.campaigns (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  goal_cents integer,
  raised_cents integer not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create sequence public.donation_receipt_seq start with 1001;

create table public.donations (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  status text not null default 'pending'
    check (status in ('pending', 'succeeded', 'refunded', 'expired', 'failed')),
  donor_name text not null,
  donor_email text not null,
  gift_amount_cents integer not null check (gift_amount_cents > 0),
  fee_cents integer not null default 0,
  charged_amount_cents integer not null check (charged_amount_cents > 0),
  cover_fees boolean not null default false,
  currency text not null default 'usd',
  frequency text not null check (frequency in ('one_time', 'monthly', 'annual')),
  designation text,
  campaign_id uuid references public.campaigns (id),
  stripe_checkout_session_id text,
  stripe_payment_intent_id text,
  stripe_subscription_id text,
  stripe_invoice_id text,
  stripe_customer_id text,
  receipt_number text unique,
  receipt_sent_at timestamptz,
  refunded_amount_cents integer not null default 0,
  is_renewal boolean not null default false,
  parent_donation_id uuid references public.donations (id)
);

create table public.donation_events (
  id uuid primary key default gen_random_uuid(),
  donation_id uuid references public.donations (id),
  event_type text not null,
  stripe_event_id text not null unique,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index donations_email_idx on public.donations (donor_email);
create index donations_status_idx on public.donations (status);
create index donations_session_idx on public.donations (stripe_checkout_session_id);
create index donations_subscription_idx on public.donations (stripe_subscription_id);
create unique index donations_invoice_idx
  on public.donations (stripe_invoice_id)
  where stripe_invoice_id is not null;

alter table public.campaigns enable row level security;
alter table public.donations enable row level security;
alter table public.donation_events enable row level security;

revoke all on sequence public.donation_receipt_seq from public, anon, authenticated;
grant usage, select on sequence public.donation_receipt_seq to service_role;

-- Moves a pending row to succeeded exactly once, assigns a receipt number,
-- and adds the designated gift (not the covered fee) to the campaign total.
create or replace function public.mark_donation_succeeded(
  donation uuid,
  session_id text,
  payment_intent text,
  subscription_id text,
  customer_id text
) returns public.donations
language plpgsql
security definer
set search_path = public
as $$
declare
  row public.donations;
begin
  update public.donations as d
  set status = 'succeeded',
      stripe_checkout_session_id = coalesce(session_id, d.stripe_checkout_session_id),
      stripe_payment_intent_id = coalesce(payment_intent, d.stripe_payment_intent_id),
      stripe_subscription_id = coalesce(subscription_id, d.stripe_subscription_id),
      stripe_customer_id = coalesce(customer_id, d.stripe_customer_id),
      updated_at = now()
  where d.id = donation
    and d.status = 'pending'
  returning * into row;

  if not found then
    select * into row from public.donations where id = donation;
    return row;
  end if;

  if row.receipt_number is null then
    update public.donations
    set receipt_number = 'ZWF-' || to_char(now(), 'YYYY') || '-' || lpad(nextval('public.donation_receipt_seq')::text, 5, '0'),
        updated_at = now()
    where id = row.id
    returning * into row;
  end if;

  if row.campaign_id is not null then
    update public.campaigns
    set raised_cents = raised_cents + row.gift_amount_cents
    where id = row.campaign_id;
  end if;

  return row;
end;
$$;

revoke all on function public.mark_donation_succeeded(uuid, text, text, text, text) from public, anon, authenticated;
grant execute on function public.mark_donation_succeeded(uuid, text, text, text, text) to service_role;
