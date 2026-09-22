-- (2 plus proches voisins par lieu) — à exécuter après 0003_auto_distance.sql
-- ============================================================================
-- 15 liaisons générées (2 plus proches voisins par lieu)

-- Amphi 1000 <-> EPAC (~151 m)
insert into public.location_edges (from_location_id, to_location_id)
select a.id, b.id from public.campus_locations a, public.campus_locations b
where a.short_name = 'Amphi 1000' and b.short_name = 'EPAC'
on conflict do nothing;

-- Amphi 1000 <-> FASEG (~249 m)
insert into public.location_edges (from_location_id, to_location_id)
select a.id, b.id from public.campus_locations a, public.campus_locations b
where a.short_name = 'Amphi 1000' and b.short_name = 'FASEG'
on conflict do nothing;

-- Bibliothèque Centrale <-> FAST (~111 m)
insert into public.location_edges (from_location_id, to_location_id)
select a.id, b.id from public.campus_locations a, public.campus_locations b
where a.short_name = 'Bibliothèque Centrale' and b.short_name = 'FAST'
on conflict do nothing;

-- Bibliothèque Centrale <-> IMSP (~302 m)
insert into public.location_edges (from_location_id, to_location_id)
select a.id, b.id from public.campus_locations a, public.campus_locations b
where a.short_name = 'Bibliothèque Centrale' and b.short_name = 'IMSP'
on conflict do nothing;

-- Bibliothèque Centrale <-> Restaurant Universitaire (~234 m)
insert into public.location_edges (from_location_id, to_location_id)
select a.id, b.id from public.campus_locations a, public.campus_locations b
where a.short_name = 'Bibliothèque Centrale' and b.short_name = 'Restaurant Universitaire'
on conflict do nothing;

-- Cité universitaire <-> FADESP (~277 m)
insert into public.location_edges (from_location_id, to_location_id)
select a.id, b.id from public.campus_locations a, public.campus_locations b
where a.short_name = 'Cité universitaire' and b.short_name = 'FADESP'
on conflict do nothing;

-- Cité universitaire <-> FASEG (~445 m)
insert into public.location_edges (from_location_id, to_location_id)
select a.id, b.id from public.campus_locations a, public.campus_locations b
where a.short_name = 'Cité universitaire' and b.short_name = 'FASEG'
on conflict do nothing;

-- ENEAM <-> FLASH (~277 m)
insert into public.location_edges (from_location_id, to_location_id)
select a.id, b.id from public.campus_locations a, public.campus_locations b
where a.short_name = 'ENEAM' and b.short_name = 'FLASH'
on conflict do nothing;

-- ENEAM <-> Terrain de sport (~206 m)
insert into public.location_edges (from_location_id, to_location_id)
select a.id, b.id from public.campus_locations a, public.campus_locations b
where a.short_name = 'ENEAM' and b.short_name = 'Terrain de sport'
on conflict do nothing;

-- EPAC <-> IMSP (~308 m)
insert into public.location_edges (from_location_id, to_location_id)
select a.id, b.id from public.campus_locations a, public.campus_locations b
where a.short_name = 'EPAC' and b.short_name = 'IMSP'
on conflict do nothing;

-- FADESP <-> FASEG (~284 m)
insert into public.location_edges (from_location_id, to_location_id)
select a.id, b.id from public.campus_locations a, public.campus_locations b
where a.short_name = 'FADESP' and b.short_name = 'FASEG'
on conflict do nothing;

-- FADESP <-> FLASH (~228 m)
insert into public.location_edges (from_location_id, to_location_id)
select a.id, b.id from public.campus_locations a, public.campus_locations b
where a.short_name = 'FADESP' and b.short_name = 'FLASH'
on conflict do nothing;

-- FAST <-> IMSP (~253 m)
insert into public.location_edges (from_location_id, to_location_id)
select a.id, b.id from public.campus_locations a, public.campus_locations b
where a.short_name = 'FAST' and b.short_name = 'IMSP'
on conflict do nothing;

-- FLASH <-> Restaurant Universitaire (~179 m)
insert into public.location_edges (from_location_id, to_location_id)
select a.id, b.id from public.campus_locations a, public.campus_locations b
where a.short_name = 'FLASH' and b.short_name = 'Restaurant Universitaire'
on conflict do nothing;

-- Restaurant Universitaire <-> Terrain de sport (~235 m)
insert into public.location_edges (from_location_id, to_location_id)
select a.id, b.id from public.campus_locations a, public.campus_locations b
where a.short_name = 'Restaurant Universitaire' and b.short_name = 'Terrain de sport'
on conflict do nothing;

-- Liaisons générées automatiquement à partir des coordonnées GPS des lieux
