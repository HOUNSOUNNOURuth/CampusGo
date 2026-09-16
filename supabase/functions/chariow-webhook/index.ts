// ============================================================================
// Edge Function: chariow-webhook
// Rôle : recevoir la confirmation de paiement envoyée par Chariow (webhook),
// vérifier son authenticité, puis créditer le pack sur le compte utilisateur.
//
// URL publique à configurer dans le dashboard Chariow :
//   https://<project-ref>.supabase.co/functions/v1/chariow-webhook
// Secret requis : CHARIOW_WEBHOOK_SECRET (pour vérifier la signature de la requête)
// ============================================================================

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

Deno.serve(async (req) => {
  try {
    const signature = req.headers.get('x-chariow-signature');
    const rawBody = await req.text();

    // TODO: vérifier `signature` contre CHARIOW_WEBHOOK_SECRET selon le schéma
    // documenté par Chariow (HMAC, etc.) avant de faire confiance au payload.
    // if (!isValidSignature(rawBody, signature)) return new Response('Invalid signature', { status: 401 });

    const event = JSON.parse(rawBody);

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    // On suppose que `event.reference` correspond à l'id de notre ligne `payments`
    const { data: payment, error } = await supabase
      .from('payments')
      .select('*, packs(*)')
      .eq('id', event.reference)
      .single();
    if (error || !payment) {
      return new Response(JSON.stringify({ error: 'Paiement introuvable' }), { status: 404 });
    }

    if (event.status === 'success' || event.status === 'paid') {
      // 1. Marquer le paiement comme payé
      await supabase.from('payments').update({
        status: 'paid',
        raw_webhook_payload: event
      }).eq('id', payment.id);

      // 2. Créditer le pack correspondant à l'utilisateur
      const pack = payment.packs;
      await supabase.from('user_packs').insert({
        user_id: payment.user_id,
        pack_id: pack.id,
        searches_remaining: pack.search_credits, // null si pack en durée illimitée
        expires_at: pack.duration_days
          ? new Date(Date.now() + pack.duration_days * 86400000).toISOString()
          : null,
        status: 'active'
      });
    } else {
      await supabase.from('payments').update({
        status: 'failed',
        raw_webhook_payload: event
      }).eq('id', payment.id);
    }

    return new Response(JSON.stringify({ ok: true }), { headers: { 'Content-Type': 'application/json' } });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: 'Erreur serveur' }), { status: 500 });
  }
});
