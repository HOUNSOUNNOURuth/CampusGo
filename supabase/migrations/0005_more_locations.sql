-- 1) Nouveaux lieux
insert into public.campus_locations (name, short_name, category, lat, lng, is_landmark) values
  ('FSA', 'FSA', 'faculte', 6.4528, 2.3475, false)
on conflict do nothing;
insert into public.campus_locations (name, short_name, category, lat, lng, is_landmark) values
  ('INJEPS', 'INJEPS', 'sport', 6.4445, 2.3535, false)
on conflict do nothing;
insert into public.campus_locations (name, short_name, category, lat, lng, is_landmark) values
  ('IFRI', 'IFRI', 'service', 6.4485, 2.351, false)
on conflict do nothing;

-- 2) Liaisons (recalculées sur tous les lieux, y compris les nouveaux — les doublons sont ignorés)
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

-- Bibliothèque Centrale <-> IFRI (~173 m)
insert into public.location_edges (from_location_id, to_location_id)
select a.id, b.id from public.campus_locations a, public.campus_locations b
where a.short_name = 'Bibliothèque Centrale' and b.short_name = 'IFRI'
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

-- ENEAM <-> INJEPS (~311 m)
insert into public.location_edges (from_location_id, to_location_id)
select a.id, b.id from public.campus_locations a, public.campus_locations b
where a.short_name = 'ENEAM' and b.short_name = 'INJEPS'
on conflict do nothing;

-- ENEAM <-> Terrain de sport (~206 m)
insert into public.location_edges (from_location_id, to_location_id)
select a.id, b.id from public.campus_locations a, public.campus_locations b
where a.short_name = 'ENEAM' and b.short_name = 'Terrain de sport'
on conflict do nothing;

-- EPAC <-> FSA (~265 m)
insert into public.location_edges (from_location_id, to_location_id)
select a.id, b.id from public.campus_locations a, public.campus_locations b
where a.short_name = 'EPAC' and b.short_name = 'FSA'
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

-- FAST <-> IFRI (~189 m)
insert into public.location_edges (from_location_id, to_location_id)
select a.id, b.id from public.campus_locations a, public.campus_locations b
where a.short_name = 'FAST' and b.short_name = 'IFRI'
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

-- FSA <-> IMSP (~182 m)
insert into public.location_edges (from_location_id, to_location_id)
select a.id, b.id from public.campus_locations a, public.campus_locations b
where a.short_name = 'FSA' and b.short_name = 'IMSP'
on conflict do nothing;

-- IFRI <-> Restaurant Universitaire (~127 m)
insert into public.location_edges (from_location_id, to_location_id)
select a.id, b.id from public.campus_locations a, public.campus_locations b
where a.short_name = 'IFRI' and b.short_name = 'Restaurant Universitaire'
on conflict do nothing;

-- INJEPS <-> Terrain de sport (~212 m)
insert into public.location_edges (from_location_id, to_location_id)
select a.id, b.id from public.campus_locations a, public.campus_locations b
where a.short_name = 'INJEPS' and b.short_name = 'Terrain de sport'
on conflict do nothing;

