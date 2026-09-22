import { useEffect, useState } from 'react';
import CampusMap from '../components/itinerary/CampusMap.jsx';
import SearchBar from '../components/itinerary/SearchBar.jsx';
import { fetchCampusLocations } from '../data/campusLocations.js';

// TODO (Personne B) — reste à ajouter : vérification useSearchQuota().canSearch
// avant d'appeler setDestinationName, et <PaywallModal /> si le quota est dépassé.
export default function ItineraryPage() {
  const [places, setPlaces] = useState(null); // null = chargement en cours
  const [destinationName, setDestinationName] = useState('');

  useEffect(() => {
    let cancelled = false;
    fetchCampusLocations().then((data) => {
      if (!cancelled) setPlaces(data);
    });
    return () => { cancelled = true; };
  }, []);

  return (
    <section style={{ padding: 24 }}>
      <h2>Où voulez-vous aller ?</h2>

      {places === null ? (
        <p>Chargement des lieux du campus…</p>
      ) : (
        <>
          <SearchBar places={places} onSelectDestination={setDestinationName} />
          <div style={{ marginTop: 16 }}>
            <CampusMap destinationName={destinationName} places={places} />
          </div>
        </>
      )}
    </section>
  );
}
