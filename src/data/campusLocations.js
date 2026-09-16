import { supabase } from '../lib/supabaseClient';

// En dev/démo sans backend prêt, on peut retomber sur cette liste figée
// (identique à celle de la maquette HTML). En production, campusPlaces()
// doit lire la table `campus_locations` pour rester éditable sans redéploiement.
export const FALLBACK_LOCATIONS = [
  { name: "EPAC — École Polytechnique d'Abomey-Calavi", lat: 6.4508, lng: 2.3462 },
  { name: 'FAST — Faculté des Sciences et Techniques', lat: 6.4500, lng: 2.3502 },
  { name: 'Bibliothèque Centrale', lat: 6.4492, lng: 2.3496 },
  { name: 'Restaurant Universitaire (RU)', lat: 6.4474, lng: 2.3507 },
  { name: 'Amphithéâtre 1000 places', lat: 6.4497, lng: 2.3470 }
  // TODO (Personne B) : compléter avec la liste complète de campusgo-maquette.html
];

export async function fetchCampusLocations() {
  const { data, error } = await supabase.from('campus_locations').select('*').order('name');
  if (error || !data?.length) return FALLBACK_LOCATIONS;
  return data;
}
