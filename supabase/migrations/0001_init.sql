-- ============================================================================
-- CampusGo — schéma initial Supabase (Postgres)
-- À exécuter via `supabase db push` ou dans l'éditeur SQL du dashboard.
-- ============================================================================

-- Extension nécessaire pour uuid_generate_v4() (souvent déjà activée sur Supabase)
create extension if not exists "uuid-ossp";

-- ----------------------------------------------------------------------------
-- 1) PROFILES — infos publiques d'un utilisateur, liées à auth.users
-- ----------------------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  email text,
  preferred_lang text not null default 'fr' check (preferred_lang in ('fr','en')),
  free_searches_used int not null default 0,
  created_at timestamptz not null default now()
);

-- Un profil est créé automatiquement à chaque inscription Supabase Auth
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, email)
  values (new.id, new.raw_user_meta_data->>'full_name', new.email);
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ----------------------------------------------------------------------------
-- 2) CAMPUS_LOCATIONS — tous les lieux guidables du campus UAC
-- ----------------------------------------------------------------------------
create table if not exists public.campus_locations (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  short_name text not null,
  category text not null default 'faculte', -- faculte | service | loisir | restauration | sport
  lat double precision not null,
  lng double precision not null,
  description text,
  photo_url text,
  is_landmark boolean not null default false, -- repère utilisable comme point de passage
  created_at timestamptz not null default now()
);

-- ----------------------------------------------------------------------------
-- 3) PACKS — offres tarifaires (gratuit inclus, pour référence)
-- ----------------------------------------------------------------------------
create table if not exists public.packs (
  id uuid primary key default uuid_generate_v4(),
  code text unique not null,           -- 'free' | 'student' | 'week' | 'month'
  name text not null,
  price_fcfa int not null default 0,
  search_credits int,                  -- null = illimité pendant duration_days
  duration_days int,                   -- null = pas de limite de durée (ex: pack étudiant à la recherche)
  is_active boolean not null default true
);

insert into public.packs (code, name, price_fcfa, search_credits, duration_days) values
  ('free',    'Découverte',    0,    2,    null),
  ('student', 'Pack Étudiant', 1000, 3,    null),
  ('week',    'Pack Semaine',  2500, null, 7),
  ('month',   'Pack Mois',     8000, null, 30)
on conflict (code) do nothing;

-- ----------------------------------------------------------------------------
-- 4) USER_PACKS — pack(s) actif(s)/consommés par un utilisateur
-- ----------------------------------------------------------------------------
create table if not exists public.user_packs (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  pack_id uuid not null references public.packs(id),
  searches_remaining int,              -- null si le pack est en durée illimitée (week/month)
  expires_at timestamptz,              -- null si le pack est en crédits (student)
  status text not null default 'active' check (status in ('active','expired','consumed')),
  created_at timestamptz not null default now()
);

-- ----------------------------------------------------------------------------
-- 5) PAYMENTS — historique des paiements Chariow
-- ----------------------------------------------------------------------------
create table if not exists public.payments (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  pack_id uuid not null references public.packs(id),
  amount_fcfa int not null,
  chariow_reference text unique,       -- id de transaction renvoyé par Chariow
  status text not null default 'pending' check (status in ('pending','paid','failed','cancelled')),
  raw_webhook_payload jsonb,
  created_at timestamptz not null default now()
);

-- ----------------------------------------------------------------------------
-- 6) SEARCH_HISTORY — chaque itinéraire demandé par un utilisateur
-- ----------------------------------------------------------------------------
create table if not exists public.search_history (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  destination_id uuid references public.campus_locations(id),
  destination_name text not null,      -- copie du nom au moment de la recherche
  distance_m int,
  duration_min int,
  created_at timestamptz not null default now()
);

-- ============================================================================
-- ROW LEVEL SECURITY
-- ============================================================================
alter table public.profiles        enable row level security;
alter table public.campus_locations enable row level security;
alter table public.packs           enable row level security;
alter table public.user_packs      enable row level security;
alter table public.payments        enable row level security;
alter table public.search_history  enable row level security;

-- profiles : chacun ne voit/modifie que son propre profil
create policy "profiles: select own" on public.profiles
  for select using (auth.uid() = id);
create policy "profiles: update own" on public.profiles
  for update using (auth.uid() = id);

-- campus_locations : lecture publique (même sans compte), écriture réservée au service_role (admin)
create policy "campus_locations: public read" on public.campus_locations
  for select using (true);

-- packs : lecture publique (pour afficher les tarifs)
create policy "packs: public read" on public.packs
  for select using (true);

-- user_packs : chacun ne voit que ses propres packs
create policy "user_packs: select own" on public.user_packs
  for select using (auth.uid() = user_id);
-- l'insertion/mise à jour se fait uniquement via la Edge Function (service_role), pas de policy insert côté client

-- payments : chacun ne voit que ses propres paiements
create policy "payments: select own" on public.payments
  for select using (auth.uid() = user_id);
-- idem, écriture réservée à la Edge Function (service_role)

-- search_history : chacun gère son propre historique
create policy "search_history: select own" on public.search_history
  for select using (auth.uid() = user_id);
create policy "search_history: insert own" on public.search_history
  for insert with check (auth.uid() = user_id);

-- ============================================================================
-- DONNÉES DE DÉPART — quelques lieux du campus UAC (à compléter/corriger)
-- ============================================================================
insert into public.campus_locations (name, short_name, category, lat, lng, is_landmark) values
  ('EPAC — École Polytechnique d''Abomey-Calavi', 'EPAC', 'faculte', 6.4508, 2.3462, false),
  ('FAST — Faculté des Sciences et Techniques', 'FAST', 'faculte', 6.4500, 2.3502, false),
  ('FLASH — Faculté des Lettres, Arts et Sciences Humaines', 'FLASH', 'faculte', 6.4468, 2.3492, false),
  ('FADESP — Faculté de Droit et de Science Politique', 'FADESP', 'faculte', 6.4458, 2.3474, false),
  ('FASEG — Faculté des Sciences Économiques et de Gestion', 'FASEG', 'faculte', 6.4478, 2.3458, false),
  ('IMSP', 'IMSP', 'faculte', 6.4518, 2.3488, false),
  ('ENEAM', 'ENEAM', 'faculte', 6.4448, 2.3507, false),
  ('Bibliothèque Centrale', 'Bibliothèque Centrale', 'service', 6.4492, 2.3496, true),
  ('Restaurant Universitaire (RU)', 'Restaurant Universitaire', 'restauration', 6.4474, 2.3507, true),
  ('Amphithéâtre 1000 places', 'Amphi 1000', 'service', 6.4497, 2.3470, true),
  ('Cité universitaire', 'Cité universitaire', 'service', 6.4438, 2.3459, false),
  ('Terrain de sport', 'Terrain de sport', 'sport', 6.4459, 2.3522, false)
on conflict do nothing;
