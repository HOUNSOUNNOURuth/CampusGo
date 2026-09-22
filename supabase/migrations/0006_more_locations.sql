-- 1) Nouveaux lieux
insert into public.campus_locations (name, short_name, category, lat, lng, is_landmark) values
  ('INE', 'INE', 'service', 6.451, 2.352, false)
on conflict do nothing;
insert into public.campus_locations (name, short_name, category, lat, lng, is_landmark) values
  ('Jardin Botanique', 'Jardin Botanique', 'loisir', 6.4465, 2.3465, true)
on conflict do nothing;
insert into public.campus_locations (name, short_name, category, lat, lng, is_landmark) values
  ('Zone Master', 'Zone Master', 'service', 6.4482, 2.3486, false)
on conflict do nothing;
insert into public.campus_locations (name, short_name, category, lat, lng, is_landmark) values
  ('Amphi Amoussouga', 'Amphi Amoussouga', 'service', 6.4495, 2.348, true)
on conflict do nothing;
insert into public.campus_locations (name, short_name, category, lat, lng, is_landmark) values
  ('Amphi Ouattara', 'Amphi Ouattara', 'service', 6.4488, 2.3465, true)
on conflict do nothing;
insert into public.campus_locations (name, short_name, category, lat, lng, is_landmark) values
  ('Amphi UEMOA', 'Amphi UEMOA', 'service', 6.447, 2.35, true)
on conflict do nothing;
insert into public.campus_locations (name, short_name, category, lat, lng, is_landmark) values
  ('Amphi Idriss Déby', 'Amphi Idriss Déby', 'service', 6.446, 2.349, true)
on conflict do nothing;

-- 2) Liaisons (recalculées sur tous les lieux, doublons ignorés)
-- Amphi 1000 <-> Amphi Amoussouga (~113 m)
insert into public.location_edges (from_location_id, to_location_id)
select a.id, b.id from public.campus_locations a, public.campus_locations b
where a.short_name = 'Amphi 1000' and b.short_name = 'Amphi Amoussouga'
on conflict do nothing;

-- Amphi 1000 <-> Amphi Ouattara (~114 m)
insert into public.location_edges (from_location_id, to_location_id)
select a.id, b.id from public.campus_locations a, public.campus_locations b
where a.short_name = 'Amphi 1000' and b.short_name = 'Amphi Ouattara'
on conflict do nothing;

-- Amphi 1000 <-> EPAC (~151 m)
insert into public.location_edges (from_location_id, to_location_id)
select a.id, b.id from public.campus_locations a, public.campus_locations b
where a.short_name = 'Amphi 1000' and b.short_name = 'EPAC'
on conflict do nothing;

-- Amphi Amoussouga <-> Zone Master (~159 m)
insert into public.location_edges (from_location_id, to_location_id)
select a.id, b.id from public.campus_locations a, public.campus_locations b
where a.short_name = 'Amphi Amoussouga' and b.short_name = 'Zone Master'
on conflict do nothing;

-- Amphi Idriss Déby <-> Amphi UEMOA (~157 m)
insert into public.location_edges (from_location_id, to_location_id)
select a.id, b.id from public.campus_locations a, public.campus_locations b
where a.short_name = 'Amphi Idriss Déby' and b.short_name = 'Amphi UEMOA'
on conflict do nothing;

-- Amphi Idriss Déby <-> ENEAM (~230 m)
insert into public.location_edges (from_location_id, to_location_id)
select a.id, b.id from public.campus_locations a, public.campus_locations b
where a.short_name = 'Amphi Idriss Déby' and b.short_name = 'ENEAM'
on conflict do nothing;

-- Amphi Idriss Déby <-> FADESP (~178 m)
insert into public.location_edges (from_location_id, to_location_id)
select a.id, b.id from public.campus_locations a, public.campus_locations b
where a.short_name = 'Amphi Idriss Déby' and b.short_name = 'FADESP'
on conflict do nothing;

-- Amphi Idriss Déby <-> FLASH (~92 m)
insert into public.location_edges (from_location_id, to_location_id)
select a.id, b.id from public.campus_locations a, public.campus_locations b
where a.short_name = 'Amphi Idriss Déby' and b.short_name = 'FLASH'
on conflict do nothing;

-- Amphi Ouattara <-> EPAC (~225 m)
insert into public.location_edges (from_location_id, to_location_id)
select a.id, b.id from public.campus_locations a, public.campus_locations b
where a.short_name = 'Amphi Ouattara' and b.short_name = 'EPAC'
on conflict do nothing;

-- Amphi Ouattara <-> FASEG (~135 m)
insert into public.location_edges (from_location_id, to_location_id)
select a.id, b.id from public.campus_locations a, public.campus_locations b
where a.short_name = 'Amphi Ouattara' and b.short_name = 'FASEG'
on conflict do nothing;

-- Amphi UEMOA <-> FLASH (~91 m)
insert into public.location_edges (from_location_id, to_location_id)
select a.id, b.id from public.campus_locations a, public.campus_locations b
where a.short_name = 'Amphi UEMOA' and b.short_name = 'FLASH'
on conflict do nothing;

-- Amphi UEMOA <-> Restaurant Universitaire (~89 m)
insert into public.location_edges (from_location_id, to_location_id)
select a.id, b.id from public.campus_locations a, public.campus_locations b
where a.short_name = 'Amphi UEMOA' and b.short_name = 'Restaurant Universitaire'
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

-- Bibliothèque Centrale <-> Zone Master (~157 m)
insert into public.location_edges (from_location_id, to_location_id)
select a.id, b.id from public.campus_locations a, public.campus_locations b
where a.short_name = 'Bibliothèque Centrale' and b.short_name = 'Zone Master'
on conflict do nothing;

-- Cité universitaire <-> FADESP (~277 m)
insert into public.location_edges (from_location_id, to_location_id)
select a.id, b.id from public.campus_locations a, public.campus_locations b
where a.short_name = 'Cité universitaire' and b.short_name = 'FADESP'
on conflict do nothing;

-- Cité universitaire <-> Jardin Botanique (~307 m)
insert into public.location_edges (from_location_id, to_location_id)
select a.id, b.id from public.campus_locations a, public.campus_locations b
where a.short_name = 'Cité universitaire' and b.short_name = 'Jardin Botanique'
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

-- FADESP <-> Jardin Botanique (~126 m)
insert into public.location_edges (from_location_id, to_location_id)
select a.id, b.id from public.campus_locations a, public.campus_locations b
where a.short_name = 'FADESP' and b.short_name = 'Jardin Botanique'
on conflict do nothing;

-- FASEG <-> Jardin Botanique (~164 m)
insert into public.location_edges (from_location_id, to_location_id)
select a.id, b.id from public.campus_locations a, public.campus_locations b
where a.short_name = 'FASEG' and b.short_name = 'Jardin Botanique'
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

-- FAST <-> INE (~228 m)
insert into public.location_edges (from_location_id, to_location_id)
select a.id, b.id from public.campus_locations a, public.campus_locations b
where a.short_name = 'FAST' and b.short_name = 'INE'
on conflict do nothing;

-- FSA <-> IMSP (~182 m)
insert into public.location_edges (from_location_id, to_location_id)
select a.id, b.id from public.campus_locations a, public.campus_locations b
where a.short_name = 'FSA' and b.short_name = 'IMSP'
on conflict do nothing;

-- IFRI <-> INE (~299 m)
insert into public.location_edges (from_location_id, to_location_id)
select a.id, b.id from public.campus_locations a, public.campus_locations b
where a.short_name = 'IFRI' and b.short_name = 'INE'
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

