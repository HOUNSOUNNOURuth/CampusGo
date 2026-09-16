import { useEffect, useRef, useState } from 'react';

// TODO (Personne B) : porter ici la logique de campusgo-maquette.html
// (fonctions ensureGeoWatch / clearGeoWatch / onGpsToggle du prototype).
//
// Usage prévu :
//   const { position, error, mode, setMode } = useGeolocation();
//   - mode 'demo'  -> ne lit pas le GPS, le composant appelant avance par minuterie
//   - mode 'real'  -> watchPosition() réel, renvoie position à chaque mise à jour
export function useGeolocation({ enabled = false } = {}) {
  const [position, setPosition] = useState(null);
  const [error, setError] = useState(null);
  const watchId = useRef(null);

  useEffect(() => {
    if (!enabled || !navigator.geolocation) return;
    watchId.current = navigator.geolocation.watchPosition(
      (pos) => setPosition({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      (err) => setError(err),
      { enableHighAccuracy: true, maximumAge: 4000, timeout: 8000 }
    );
    return () => {
      if (watchId.current != null) navigator.geolocation.clearWatch(watchId.current);
    };
  }, [enabled]);

  return { position, error };
}
