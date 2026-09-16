import { createContext, useContext } from 'react';

// TODO (Personne A) : contexte qui expose l'état des recherches gratuites/payantes
// restantes, en s'appuyant sur `profiles.free_searches_used` et `user_packs`.
// Doit exposer : { canSearch, remaining, consumeOneSearch(), openPaywall } etc.
// Consommé par ItineraryPage avant de lancer buildRoute().

const SearchQuotaContext = createContext(null);

export function SearchQuotaProvider({ children }) {
  // TODO: brancher sur Supabase (profiles + user_packs) au lieu de ces valeurs figées
  const value = {
    remaining: 2,
    canSearch: true,
    consumeOneSearch: async () => {},
    openPaywall: () => {}
  };
  return <SearchQuotaContext.Provider value={value}>{children}</SearchQuotaContext.Provider>;
}

export function useSearchQuota() {
  const ctx = useContext(SearchQuotaContext);
  if (!ctx) throw new Error('useSearchQuota doit être utilisé sous <SearchQuotaProvider>');
  return ctx;
}
