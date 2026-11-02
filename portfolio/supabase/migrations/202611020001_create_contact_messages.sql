create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(btrim(name)) between 2 and 100),
  email text not null check (
    char_length(btrim(email)) between 3 and 254
    and position('@' in email) > 1
  ),
  message text not null check (char_length(btrim(message)) between 10 and 5000),
  is_answered boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.portfolio_admins (
  user_id uuid primary key references auth.users (id) on delete cascade
);

alter table public.contact_messages enable row level security;
alter table public.portfolio_admins enable row level security;

revoke all on table public.contact_messages from anon, authenticated;
revoke all on table public.portfolio_admins from anon, authenticated;
grant insert on table public.contact_messages to anon;
grant select on table public.contact_messages to authenticated;
grant update (is_answered) on table public.contact_messages to authenticated;
grant select on table public.portfolio_admins to authenticated;

drop policy if exists "Anyone can submit a contact message"
  on public.contact_messages;
create policy "Anyone can submit a contact message"
  on public.contact_messages
  for insert
  to anon, authenticated
  with check (true);

drop policy if exists "Admins can view contact messages"
  on public.contact_messages;
create policy "Admins can view contact messages"
  on public.contact_messages
  for select
  to authenticated
  using (
    exists (
      select 1
      from public.portfolio_admins
      where portfolio_admins.user_id = (select auth.uid())
    )
  );

drop policy if exists "Admins can update contact messages"
  on public.contact_messages;
create policy "Admins can update contact messages"
  on public.contact_messages
  for update
  to authenticated
  using (
    exists (
      select 1
      from public.portfolio_admins
      where portfolio_admins.user_id = (select auth.uid())
    )
  )
  with check (
    exists (
      select 1
      from public.portfolio_admins
      where portfolio_admins.user_id = (select auth.uid())
    )
  );

drop policy if exists "Admins can view their own admin record"
  on public.portfolio_admins;
create policy "Admins can view their own admin record"
  on public.portfolio_admins
  for select
  to authenticated
  using (user_id = (select auth.uid()));
