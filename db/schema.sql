create extension if not exists pgcrypto;

create table if not exists profiles (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  category text not null check (category in ('fictional', 'public_figure')),
  source_title text,
  description text not null,
  image_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists typing_systems (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  name text not null
);

create table if not exists type_options (
  id uuid primary key default gen_random_uuid(),
  typing_system_id uuid not null references typing_systems(id) on delete cascade,
  code text not null,
  label text not null,
  description text,
  unique (typing_system_id, code)
);

do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'type_options_id_typing_system_id_key'
  ) then
    alter table type_options add constraint type_options_id_typing_system_id_key unique (id, typing_system_id);
  end if;
end $$;

create table if not exists votes (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references profiles(id) on delete cascade,
  user_id uuid not null,
  typing_system_id uuid not null references typing_systems(id) on delete cascade,
  type_option_id uuid not null references type_options(id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, profile_id, typing_system_id)
);

do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'votes_type_option_matches_system'
  ) then
    alter table votes
      add constraint votes_type_option_matches_system
      foreign key (type_option_id, typing_system_id)
      references type_options(id, typing_system_id)
      on delete cascade;
  end if;
end $$;

create table if not exists evidence_cards (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references profiles(id) on delete cascade,
  user_id uuid not null,
  typing_system_id uuid not null references typing_systems(id) on delete cascade,
  type_option_id uuid not null references type_options(id) on delete cascade,
  title text not null,
  body text not null,
  stance text not null check (stance in ('for', 'against')),
  score integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'evidence_cards_type_option_matches_system'
  ) then
    alter table evidence_cards
      add constraint evidence_cards_type_option_matches_system
      foreign key (type_option_id, typing_system_id)
      references type_options(id, typing_system_id)
      on delete cascade;
  end if;
end $$;

create table if not exists evidence_votes (
  id uuid primary key default gen_random_uuid(),
  evidence_card_id uuid not null references evidence_cards(id) on delete cascade,
  user_id uuid not null,
  value integer not null check (value in (-1, 1)),
  created_at timestamptz not null default now(),
  unique (user_id, evidence_card_id)
);

create table if not exists comments (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references profiles(id) on delete cascade,
  user_id uuid not null,
  body text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists profiles_search_idx on profiles using gin (
  to_tsvector('english', coalesce(name, '') || ' ' || coalesce(source_title, ''))
);
create index if not exists votes_profile_system_idx on votes(profile_id, typing_system_id);
create index if not exists evidence_profile_idx on evidence_cards(profile_id, score desc);

create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists profiles_set_updated_at on profiles;
create trigger profiles_set_updated_at before update on profiles
for each row execute function set_updated_at();

drop trigger if exists votes_set_updated_at on votes;
create trigger votes_set_updated_at before update on votes
for each row execute function set_updated_at();

drop trigger if exists evidence_cards_set_updated_at on evidence_cards;
create trigger evidence_cards_set_updated_at before update on evidence_cards
for each row execute function set_updated_at();

drop trigger if exists comments_set_updated_at on comments;
create trigger comments_set_updated_at before update on comments
for each row execute function set_updated_at();

alter table profiles enable row level security;
alter table typing_systems enable row level security;
alter table type_options enable row level security;
alter table votes enable row level security;
alter table evidence_cards enable row level security;
alter table evidence_votes enable row level security;
alter table comments enable row level security;

drop policy if exists "Profiles are public" on profiles;
create policy "Profiles are public" on profiles for select using (true);

drop policy if exists "Authenticated users create profiles" on profiles;
create policy "Authenticated users create profiles" on profiles for insert to authenticated with check (true);

drop policy if exists "Typing systems are public" on typing_systems;
create policy "Typing systems are public" on typing_systems for select using (true);

drop policy if exists "Type options are public" on type_options;
create policy "Type options are public" on type_options for select using (true);

drop policy if exists "Votes are public" on votes;
create policy "Votes are public" on votes for select using (true);

drop policy if exists "Users create own votes" on votes;
create policy "Users create own votes" on votes for insert to authenticated with check (auth.uid() = user_id);

drop policy if exists "Users update own votes" on votes;
create policy "Users update own votes" on votes for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "Evidence cards are public" on evidence_cards;
create policy "Evidence cards are public" on evidence_cards for select using (true);

drop policy if exists "Users create own evidence" on evidence_cards;
create policy "Users create own evidence" on evidence_cards for insert to authenticated with check (auth.uid() = user_id);

drop policy if exists "Evidence votes are public" on evidence_votes;
create policy "Evidence votes are public" on evidence_votes for select using (true);

drop policy if exists "Users create own evidence votes" on evidence_votes;
create policy "Users create own evidence votes" on evidence_votes for insert to authenticated with check (auth.uid() = user_id);

drop policy if exists "Users update own evidence votes" on evidence_votes;
create policy "Users update own evidence votes" on evidence_votes for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "Comments are public" on comments;
create policy "Comments are public" on comments for select using (true);

drop policy if exists "Users create own comments" on comments;
create policy "Users create own comments" on comments for insert to authenticated with check (auth.uid() = user_id);
