import { useEffect, useRef, useState } from 'react';

// Porté depuis renderSuggestions/pickLocation de campusgo-maquette.html.
// `places` est maintenant reçu en prop (chargé une seule fois par ItineraryPage)
// pour garantir que SearchBar et CampusMap utilisent exactement la même liste.
// onSelectDestination ne reçoit QUE le nom exact d'un lieu connu.
export default function SearchBar({ places, onSelectDestination }) {
  const [query, setQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const q = query.toLowerCase().trim();
  const suggestions = q ? places.filter((p) => p.name.toLowerCase().includes(q)) : places;

  function pickLocation(name) {
    setQuery(name);
    setShowSuggestions(false);
    setNotFound(false);
  }

  function handleSubmit() {
    const exactMatch = places.find((p) => p.name === query);
    if (!exactMatch) {
      console.warn('[SearchBar] Aucun lieu ne correspond exactement à :', JSON.stringify(query));
      setNotFound(true);
      return;
    }
    setNotFound(false);
    onSelectDestination?.(exactMatch.name);
    setShowSuggestions(false);
  }

  return (
    <div ref={containerRef} className="search-row">
      <input
        value={query}
        onChange={(e) => { setQuery(e.target.value); setShowSuggestions(true); }}
        onFocus={() => setShowSuggestions(true)}
        placeholder="Ex: EPAC, Bibliothèque Centrale…"
      />
      <button onClick={handleSubmit} className="btn btn-primary">Itinéraire</button>
      {notFound && (
        <div style={{ color: 'var(--clay)', marginTop: 6, fontSize: 13 }}>
          Aucun lieu ne correspond à « {query} ». Choisis-en un dans la liste.
        </div>
      )}

      {showSuggestions && suggestions.length > 0 && (
        <div className="suggest-list show">
          {suggestions.map((p) => (
            <div
              key={p.name}
              className="suggest-item"
              onClick={() => pickLocation(p.name)}
            >
              {p.name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
