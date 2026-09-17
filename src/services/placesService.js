import { supabase } from "./supabaseClient.js";

export async function getLocationById(locationId) {
  const { data, error } = await supabase
    .from("campus_locations")
    .select("id, name, short_name, category, description, photo_url, lat, lng, is_landmark")
    .eq("id", locationId)
    .single();
  if (error) throw error;
  return data;
}

export async function listLandmarks() {
  const { data, error } = await supabase
    .from("campus_locations")
    .select("id, name, short_name, category, description, photo_url, lat, lng")
    .eq("is_landmark", true);
  if (error) throw error;
  return data;
}
