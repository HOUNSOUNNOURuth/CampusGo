// ============================================================================
// Edge Function: chariow-create-payment
// Rôle : créer une demande de paiement Chariow pour un pack donné, côté serveur,
// SANS jamais exposer la clé secrète Chariow au frontend.
//
// Appelée par le frontend via : supabase.functions.invoke('chariow-create-payment', { body: { packCode } })
// Déploiement : supabase functions deploy chariow-create-payment
// Secret requis : CHARIOW_SECRET_KEY (à définir avec `supabase secrets set`)
// ============================================================================

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const CHARIOW_API_URL = 'https://api.chariow.com/v1'; // TODO: vérifier l'URL exacte dans la doc Chariow

Deno.serve(async (req) => {
  try {
    const { packCode } = await req.json();

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    // 1. Authentifier l'utilisateur à partir du token envoyé par le frontend
    const authHeader = req.headers.get('Authorization');
    const { data: { user }, error: authError } = await supabase.auth.getUser(
      authHeader?.replace('Bearer ', '')
    );
    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Non authentifié' }), { status: 401 });
    }

    // 2. Récupérer le pack demandé
    const { data: pack, error: packError } = await supabase
      .from('packs')
      .select('*')
      .eq('code', packCode)
      .eq('is_active', true)
      .single();
    if (packError || !pack) {
      return new Response(JSON.stringify({ error: 'Pack introuvable' }), { status: 404 });
    }

    // 3. Créer une ligne "payments" en attente
    const { data: payment, error: paymentError } = await supabase
      .from('payments')
      .insert({ user_id: user.id, pack_id: pack.id, amount_fcfa: pack.price_fcfa, status: 'pending' })
      .select()
      .single();
    if (paymentError) throw paymentError;

    // 4. Demander à Chariow de créer le lien/checkout de paiement
    const chariowRes = await fetch(`${CHARIOW_API_URL}/checkouts`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('CHARIOW_SECRET_KEY')}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        amount: pack.price_fcfa,
        currency: 'XOF',
        reference: payment.id,
        description: `CampusGo — ${pack.name}`,
        // webhook_url à configurer côté Chariow pour pointer vers chariow-webhook
      })
    });
    const chariowData = await chariowRes.json();

    // 5. Mémoriser la référence Chariow sur le paiement
    await supabase
      .from('payments')
      .update({ chariow_reference: chariowData.id ?? null })
      .eq('id', payment.id);

    return new Response(JSON.stringify({ checkoutUrl: chariowData.checkout_url }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: 'Erreur serveur' }), { status: 500 });
  }
});
