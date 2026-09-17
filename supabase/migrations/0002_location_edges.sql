-- ============================================================================
-- CampusGo — graphe des chemins piétons entre repères
-- Complète campus_locations : indique quels lieux sont directement reliés
-- par un chemin piéton (le trajet réel n'est pas une ligne droite GPS).
-- ============================================================================

create table if not exists public.location_edges (
  id uuid primary key default uuid_generate_v4(),
  from_location_id uuid not null references public.campus_locations(id) on delete cascade,
  to_location_id uuid not null references public.campus_locations(id) on delete cascade,
  distance_m int not null,          -- distance piétonne réelle du chemin (pas à vol d'oiseau)
  bidirectional boolean not null default true,
  created_at timestamptz not null default now(),
  unique (from_location_id, to_location_id)
);

alter table public.location_edges enable row level security;

create policy "location_edges: public read" on public.location_edges
  for select using (true);

-- ============================================================================
-- Exemple de graphe à adapter avec les vrais chemins du campus UAC
-- (remplacer les noms par des sous-requêtes sur short_name le temps de ne pas
-- connaître les uuid générés)
-- ============================================================================
insert into public.location_edges (from_location_id, to_location_id, distance_m, bidirectional)
select a.id, b.id, 180, true
from public.campus_locations a, public.campus_locations b
where a.short_name = 'Bibliothèque Centrale' and b.short_name = 'Amphi 1000'
on conflict do nothing;

insert into public.location_edges (from_location_id, to_location_id, distance_m, bidirectional)
select a.id, b.id, 220, true
from public.campus_locations a, public.campus_locations b
where a.short_name = 'Amphi 1000' and b.short_name = 'FAST'
on conflict do nothing;

insert into public.location_edges (from_location_id, to_location_id, distance_m, bidirectional)
select a.id, b.id, 260, true
from public.campus_locations a, public.campus_locations b
where a.short_name = 'Bibliothèque Centrale' and b.short_name = 'Restaurant Universitaire'
on conflict do nothing;

insert into public.location_edges (from_location_id, to_location_id, distance_m, bidirectional)
select a.id, b.id, 300, true
from public.campus_locations a, public.campus_locations b
where a.short_name = 'Restaurant Universitaire' and b.short_name = 'EPAC'
on conflict do nothing;

-- À COMPLÉTER PAR L'ÉQUIPE : chaque paire de repères réellement reliée par un
-- chemin piéton sur le campus doit avoir une ligne ici. C'est ce graphe qui
-- rend les virages réalistes (sans lien direct = pas de raccourci en ligne
-- droite à travers un bâtiment).
