create table if not exists public.featured_projects (
  repo_full_name text primary key,
  created_at timestamptz not null default now()
);

alter table public.featured_projects enable row level security;

revoke all on table public.featured_projects from anon, authenticated;
grant select on table public.featured_projects to anon, authenticated;
grant insert, update, delete on table public.featured_projects to authenticated;

drop policy if exists "Anyone can view featured projects"
  on public.featured_projects;
create policy "Anyone can view featured projects"
  on public.featured_projects
  for select
  to anon, authenticated
  using (true);

drop policy if exists "Admins can manage featured projects"
  on public.featured_projects;
create policy "Admins can manage featured projects"
  on public.featured_projects
  for all
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
