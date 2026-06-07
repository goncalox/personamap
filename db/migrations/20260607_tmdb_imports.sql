create table if not exists external_imports (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid references profiles(id) on delete cascade,
  external_source text not null check (external_source = 'tmdb'),
  source_type text not null check (source_type in ('movie', 'movie_cast')),
  external_movie_id bigint not null,
  external_credit_id text not null default '',
  release_date date,
  actor_name text,
  poster_url text,
  import_status text not null default 'draft' check (import_status in ('draft', 'preview', 'ready', 'imported', 'failed')),
  raw_payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (external_source, source_type, external_movie_id, external_credit_id)
);

create index if not exists external_imports_source_idx on external_imports(external_source, source_type, external_movie_id);
create index if not exists external_imports_profile_idx on external_imports(profile_id);

drop trigger if exists external_imports_set_updated_at on external_imports;
create trigger external_imports_set_updated_at before update on external_imports
for each row execute function set_updated_at();

alter table external_imports enable row level security;

drop policy if exists "External imports are public" on external_imports;
create policy "External imports are public" on external_imports for select using (true);

drop policy if exists "Authenticated users create external imports" on external_imports;
create policy "Authenticated users create external imports" on external_imports for insert to authenticated with check (true);

drop policy if exists "Authenticated users update external imports" on external_imports;
create policy "Authenticated users update external imports" on external_imports for update to authenticated using (true) with check (true);

drop policy if exists "Authenticated users delete external imports" on external_imports;
create policy "Authenticated users delete external imports" on external_imports for delete to authenticated using (true);
