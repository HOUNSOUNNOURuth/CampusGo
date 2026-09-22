import { supabase } from "./supabaseClient.js";
import { computeRoute } from "./routing.js";

/**
 * Récupère tous les lieux guidables (utilisables comme point de départ ou
 * destination) pour l'écran d'accueil.
 */
export async function listDestinations() {
  const { data, error } = await supabase
    .from("campus_locations")
    .select("id, name, short_name, category, lat, lng, photo_url")
    .order("name", { ascending: true });
  if (error) throw error;
  return data;
}

/**
 * Calcule un itinéraire complet entre deux lieux : charge le graphe
 * (campus_locations + location_edges) puis calcule le plus court chemin
 * avec virages déduits du cap GPS réel (voir services/routing.js).
 */
export async function getRouteBetween(startId, endId) {
  const [{ data: locations, error: locError }, { data: edges, error: edgeError }] =
    await Promise.all([
      supabase.from("campus_locations").select("id, name, short_name, lat, lng, photo_url"),
      supabase.from("location_edges").select("from_location_id, to_location_id, distance_m, bidirectional"),
    ]);

  if (locError) throw locError;
  if (edgeError) throw edgeError;

  return computeRoute(locations, edges, startId, endId);
}

/**
 * Enregistre une recherche dans l'historique de l'utilisateur connecté.
 */
export async function logSearch({ userId, destinationId, destinationName, distanceM, durationMin }) {
  const { error } = await supabase.from("search_history").insert({
    user_id: userId,
    destination_id: destinationId,
    destination_name: destinationName,
    distance_m: distanceM,
    duration_min: durationMin,
  });
  if (error) throw error;
}
