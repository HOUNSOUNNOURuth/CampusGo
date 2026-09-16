import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from './useAuth';

// Charge l'historique des recherches de l'utilisateur connecté (table search_history).
// Utilisé par DashboardPage.
export function useSearchHistory() {
  const { user } = useAuth();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { setHistory([]); setLoading(false); return; }
    supabase
      .from('search_history')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(20)
      .then(({ data }) => { setHistory(data ?? []); setLoading(false); });
  }, [user]);

  // Insère une entrée d'historique — à appeler après un buildRoute() réussi
  async function addEntry({ destinationId, destinationName, distanceM, durationMin }) {
    if (!user) return;
    await supabase.from('search_history').insert({
      user_id: user.id,
      destination_id: destinationId,
      destination_name: destinationName,
      distance_m: distanceM,
      duration_min: durationMin
    });
  }

  return { history, loading, addEntry };
}
