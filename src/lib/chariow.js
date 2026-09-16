import { supabase } from './supabaseClient';

// Ne fait JAMAIS d'appel direct à l'API Chariow depuis le frontend :
// on passe systématiquement par une Edge Function Supabase, qui seule
// connaît la clé secrète Chariow (voir supabase/functions/chariow-create-payment).
export async function startChariowCheckout(packCode) {
  const { data, error } = await supabase.functions.invoke('chariow-create-payment', {
    body: { packCode }
  });
  if (error) throw error;
  return data.checkoutUrl; // à ouvrir (window.location.href = checkoutUrl) ou en nouvel onglet
}
