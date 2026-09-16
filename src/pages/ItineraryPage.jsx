// TODO (Personne B) — PAGE CENTRALE DE L'APP.
// Porter ici toute la logique de campusgo-maquette.html :
//   - CampusMap (SVG + polyline + avatar animé)
//   - sélection destination + repères intermédiaires (pickLandmarks)
//   - progression conditionnée au déplacement réel (useGeolocation) ou mode démo
//   - InstructionCard (message + photo qui apparaissent automatiquement)
//   - StepsList (repères parcourus/à venir)
// Avant de lancer un nouvel itinéraire : vérifier useSearchQuota().canSearch,
// sinon ouvrir <PaywallModal />.
import CampusMap from '../components/itinerary/CampusMap.jsx';
import SearchBar from '../components/itinerary/SearchBar.jsx';

export default function ItineraryPage() {
  return (
    <section>
      <SearchBar />
      <CampusMap />
    </section>
  );
}
