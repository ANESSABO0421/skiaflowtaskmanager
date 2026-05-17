-- Repair missing workspace tables and owner defaults used by the app.
-- Safe to run after a partial schema setup; policies/triggers are recreated idempotently.

create extension if not exists "pgcrypto";

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  full_name text,
  avatar_url text,
  role text not null default 'developer'
    check (role in ('super_admin', 'developer', 'designer', 'client')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    coalesce(new.raw_user_meta_data->>'role', 'developer')
  )
  on conflict (id) do update set
    email = excluded.email,
    full_name = coalesce(public.profiles.full_name, excluded.full_name),
    role = coalesce(public.profiles.role, excluded.role);
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

insert into public.profiles (id, email, full_name)
select id, email, coalesce(raw_user_meta_data->>'full_name', split_part(email, '@', 1))
from auth.users
on conflict (id) do nothing;

create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  client_name text not null,
  company_name text,
  email text,
  phone text,
  project_type text,
  budget numeric,
  status text default 'new'
    check (status in ('new', 'discussion', 'proposal_sent', 'approved', 'rejected', 'on_hold')),
  note text,
  created_by uuid references public.profiles(id) on delete set null default auth.uid(),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.clients (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  company text,
  email text,
  phone text,
  website text,
  status text default 'active'
    check (status in ('active', 'inactive', 'archived')),
  notes text,
  created_by uuid references public.profiles(id) on delete set null default auth.uid(),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  client_id uuid references public.clients(id) on delete set null,
  status text default 'planning'
    check (status in ('planning', 'active', 'on_hold', 'completed', 'cancelled')),
  budget numeric,
  start_date date,
  end_date date,
  created_by uuid references public.profiles(id) on delete set null default auth.uid(),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.project_members (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  role text default 'member'
    check (role in ('owner', 'member', 'viewer')),
  created_at timestamptz default now(),
  unique (project_id, user_id)
);

create table if not exists public.tasks (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  title text not null,
  description text,
  status text default 'todo'
    check (status in ('todo', 'in_progress', 'review', 'done')),
  priority text default 'medium'
    check (priority in ('low', 'medium', 'high', 'urgent')),
  assignee_id uuid references public.profiles(id) on delete set null,
  position integer default 0,
  due_date date,
  created_by uuid references public.profiles(id) on delete set null default auth.uid(),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.comments (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references public.projects(id) on delete cascade,
  task_id uuid references public.tasks(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade default auth.uid(),
  content text not null,
  mentions uuid[] default '{}',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  message text,
  type text default 'info'
    check (type in ('info', 'success', 'warning', 'mention', 'task', 'invoice')),
  read boolean default false,
  link text,
  created_at timestamptz default now()
);

create table if not exists public.assets (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references public.projects(id) on delete cascade,
  name text not null,
  file_path text not null,
  file_type text,
  file_size bigint,
  uploaded_by uuid references public.profiles(id) on delete set null default auth.uid(),
  created_at timestamptz default now()
);

create table if not exists public.invoices (
  id uuid primary key default gen_random_uuid(),
  client_id uuid references public.clients(id) on delete set null,
  project_id uuid references public.projects(id) on delete set null,
  invoice_number text unique not null,
  amount numeric not null default 0,
  status text default 'draft'
    check (status in ('draft', 'sent', 'paid', 'overdue', 'cancelled')),
  due_date date,
  issued_at date default current_date,
  created_by uuid references public.profiles(id) on delete set null default auth.uid(),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.activities (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete set null default auth.uid(),
  entity_type text not null,
  entity_id uuid,
  action text not null,
  metadata jsonb default '{}',
  created_at timestamptz default now()
);

alter table public.leads alter column created_by set default auth.uid();
alter table public.clients alter column created_by set default auth.uid();
alter table public.projects alter column created_by set default auth.uid();
alter table public.tasks alter column created_by set default auth.uid();
alter table public.comments alter column user_id set default auth.uid();
alter table public.assets alter column uploaded_by set default auth.uid();
alter table public.invoices alter column created_by set default auth.uid();
alter table public.activities alter column user_id set default auth.uid();

create index if not exists idx_leads_status on public.leads(status);
create index if not exists idx_leads_created_by on public.leads(created_by);
create index if not exists idx_clients_status on public.clients(status);
create index if not exists idx_projects_client on public.projects(client_id);
create index if not exists idx_tasks_project on public.tasks(project_id);
create index if not exists idx_tasks_status on public.tasks(status);
create index if not exists idx_notifications_user on public.notifications(user_id, read);
create index if not exists idx_comments_project on public.comments(project_id);
create index if not exists idx_activities_created on public.activities(created_at desc);

create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists leads_updated on public.leads;
create trigger leads_updated before update on public.leads for each row execute function public.set_updated_at();
drop trigger if exists clients_updated on public.clients;
create trigger clients_updated before update on public.clients for each row execute function public.set_updated_at();
drop trigger if exists projects_updated on public.projects;
create trigger projects_updated before update on public.projects for each row execute function public.set_updated_at();
drop trigger if exists tasks_updated on public.tasks;
create trigger tasks_updated before update on public.tasks for each row execute function public.set_updated_at();
drop trigger if exists invoices_updated on public.invoices;
create trigger invoices_updated before update on public.invoices for each row execute function public.set_updated_at();

alter table public.profiles enable row level security;
alter table public.leads enable row level security;
alter table public.clients enable row level security;
alter table public.projects enable row level security;
alter table public.project_members enable row level security;
alter table public.tasks enable row level security;
alter table public.comments enable row level security;
alter table public.notifications enable row level security;
alter table public.assets enable row level security;
alter table public.invoices enable row level security;
alter table public.activities enable row level security;

drop policy if exists "profiles_select" on public.profiles;
create policy "profiles_select" on public.profiles for select to authenticated using (true);
drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own" on public.profiles for update to authenticated using (auth.uid() = id);

drop policy if exists "leads_select" on public.leads;
create policy "leads_select" on public.leads for select to authenticated using (true);
drop policy if exists "leads_insert" on public.leads;
create policy "leads_insert" on public.leads for insert to authenticated with check (created_by = auth.uid());
drop policy if exists "leads_update" on public.leads;
create policy "leads_update" on public.leads for update to authenticated using (true);
drop policy if exists "leads_delete" on public.leads;
create policy "leads_delete" on public.leads for delete to authenticated using (created_by = auth.uid());

drop policy if exists "clients_select" on public.clients;
create policy "clients_select" on public.clients for select to authenticated using (true);
drop policy if exists "clients_insert" on public.clients;
create policy "clients_insert" on public.clients for insert to authenticated with check (created_by = auth.uid());
drop policy if exists "clients_update" on public.clients;
create policy "clients_update" on public.clients for update to authenticated using (true);
drop policy if exists "clients_delete" on public.clients;
create policy "clients_delete" on public.clients for delete to authenticated using (created_by = auth.uid());

drop policy if exists "projects_select" on public.projects;
create policy "projects_select" on public.projects for select to authenticated using (true);
drop policy if exists "projects_insert" on public.projects;
create policy "projects_insert" on public.projects for insert to authenticated with check (created_by = auth.uid());
drop policy if exists "projects_update" on public.projects;
create policy "projects_update" on public.projects for update to authenticated using (true);
drop policy if exists "projects_delete" on public.projects;
create policy "projects_delete" on public.projects for delete to authenticated using (created_by = auth.uid());

drop policy if exists "pm_select" on public.project_members;
create policy "pm_select" on public.project_members for select to authenticated using (true);
drop policy if exists "pm_insert" on public.project_members;
create policy "pm_insert" on public.project_members for insert to authenticated with check (true);
drop policy if exists "pm_delete" on public.project_members;
create policy "pm_delete" on public.project_members for delete to authenticated using (true);

drop policy if exists "tasks_select" on public.tasks;
create policy "tasks_select" on public.tasks for select to authenticated using (true);
drop policy if exists "tasks_insert" on public.tasks;
create policy "tasks_insert" on public.tasks for insert to authenticated with check (created_by = auth.uid());
drop policy if exists "tasks_update" on public.tasks;
create policy "tasks_update" on public.tasks for update to authenticated using (true);
drop policy if exists "tasks_delete" on public.tasks;
create policy "tasks_delete" on public.tasks for delete to authenticated using (true);

drop policy if exists "comments_select" on public.comments;
create policy "comments_select" on public.comments for select to authenticated using (true);
drop policy if exists "comments_insert" on public.comments;
create policy "comments_insert" on public.comments for insert to authenticated with check (user_id = auth.uid());
drop policy if exists "comments_update" on public.comments;
create policy "comments_update" on public.comments for update to authenticated using (user_id = auth.uid());
drop policy if exists "comments_delete" on public.comments;
create policy "comments_delete" on public.comments for delete to authenticated using (user_id = auth.uid());

drop policy if exists "notifications_select" on public.notifications;
create policy "notifications_select" on public.notifications for select to authenticated using (user_id = auth.uid());
drop policy if exists "notifications_insert" on public.notifications;
create policy "notifications_insert" on public.notifications for insert to authenticated with check (true);
drop policy if exists "notifications_update" on public.notifications;
create policy "notifications_update" on public.notifications for update to authenticated using (user_id = auth.uid());

drop policy if exists "assets_select" on public.assets;
create policy "assets_select" on public.assets for select to authenticated using (true);
drop policy if exists "assets_insert" on public.assets;
create policy "assets_insert" on public.assets for insert to authenticated with check (uploaded_by = auth.uid());
drop policy if exists "assets_delete" on public.assets;
create policy "assets_delete" on public.assets for delete to authenticated using (uploaded_by = auth.uid());

drop policy if exists "invoices_select" on public.invoices;
create policy "invoices_select" on public.invoices for select to authenticated using (true);
drop policy if exists "invoices_insert" on public.invoices;
create policy "invoices_insert" on public.invoices for insert to authenticated with check (created_by = auth.uid());
drop policy if exists "invoices_update" on public.invoices;
create policy "invoices_update" on public.invoices for update to authenticated using (true);
drop policy if exists "invoices_delete" on public.invoices;
create policy "invoices_delete" on public.invoices for delete to authenticated using (created_by = auth.uid());

drop policy if exists "activities_select" on public.activities;
create policy "activities_select" on public.activities for select to authenticated using (true);
drop policy if exists "activities_insert" on public.activities;
create policy "activities_insert" on public.activities for insert to authenticated with check (true);

insert into storage.buckets (id, name, public)
values ('assets', 'assets', false)
on conflict (id) do nothing;
