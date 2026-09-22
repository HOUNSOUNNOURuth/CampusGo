import { useEffect, useRef, useState } from 'react';

/**
 * Suit la position GPS de l'utilisateur en continu tant que `enabled` est vrai.
 * Retourne { position, error }.
 *   position: { lat, lng, accuracy } | null
 *   error: 'unsupported' | 'denied' | 'unavailable' | null
 */
export default function useGeolocation({ enabled = false, highAccuracy = true, maximumAge = 4000, timeout = 8000 } = {}) {
  const [position, setPosition] = useState(null);
  const [error, setError] = useState(null);
  const watchIdRef = useRef(null);

  useEffect(() => {
    if (!enabled) {
      if (watchIdRef.current != null && navigator.geolocation) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
      watchIdRef.current = null;
      return;
    }

    if (!navigator.geolocation) {
      setError('unsupported');
      return;
    }

    watchIdRef.current = navigator.geolocation.watchPosition(
      (pos) => {
        setError(null);
        setPosition({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          accuracy: pos.coords.accuracy
        });
      },
      (err) => {
        setError(err.code === 1 ? 'denied' : 'unavailable');
      },
      { enableHighAccuracy: highAccuracy, maximumAge, timeout }
    );

    return () => {
      if (watchIdRef.current != null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
      }
    };
  }, [enabled, highAccuracy, maximumAge, timeout]);

  return { position, error };
}
