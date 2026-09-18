-- ============================================================================
-- Calcule automatiquement distance_m à partir des coordonnées GPS des deux
-- lieux (formule de Haversine), pour ne plus avoir à l'estimer soi-même.
-- ============================================================================

create or replace function public.haversine_m(lat1 double precision, lon1 double precision,
                                                lat2 double precision, lon2 double precision)
returns double precision as $$
declare
  r double precision := 6371000; -- rayon de la Terre en mètres
  d_lat double precision := radians(lat2 - lat1);
  d_lon double precision := radians(lon2 - lon1);
  a double precision;
begin
  a := sin(d_lat/2)^2 + cos(radians(lat1)) * cos(radians(lat2)) * sin(d_lon/2)^2;
  return r * 2 * asin(sqrt(a));
end;
$$ language plpgsql immutable;

-- distance_m devient optionnelle : si tu ne la donnes pas, elle est calculée
-- automatiquement à partir des coordonnées des deux lieux.
alter table public.location_edges alter column distance_m drop not null;

create or replace function public.fill_edge_distance()
returns trigger as $$
declare
  from_lat double precision; from_lng double precision;
  to_lat double precision; to_lng double precision;
begin
  if new.distance_m is null then
    select lat, lng into from_lat, from_lng from public.campus_locations where id = new.from_location_id;
    select lat, lng into to_lat, to_lng from public.campus_locations where id = new.to_location_id;
    new.distance_m := round(public.haversine_m(from_lat, from_lng, to_lat, to_lng));
  end if;
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_fill_edge_distance on public.location_edges;
create trigger trg_fill_edge_distance
  before insert on public.location_edges
  for each row execute procedure public.fill_edge_distance();
