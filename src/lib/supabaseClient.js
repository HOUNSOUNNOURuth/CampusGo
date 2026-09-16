import { createClient } from '@supabase/supabase-js';

// Clés publiques uniquement — la clé "anon" est protégée par les policies RLS.
// La vraie sécurité vient des Row Level Security policies (voir supabase/migrations),
// jamais de cette clé elle-même.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
