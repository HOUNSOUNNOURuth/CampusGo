import { useState } from 'react';

// TODO (Personne B) : brancher sur fetchCampusLocations() + autocomplete
// (reprendre renderSuggestions/pickLocation de la maquette).
export default function SearchBar({ onSelectDestination }) {
  const [query, setQuery] = useState('');
  return (
    <div>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Ex: EPAC, Bibliothèque Centrale…"
      />
      <button onClick={() => onSelectDestination?.(query)}>Itinéraire</button>
    </div>
  );
}
