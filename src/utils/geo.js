// Fonctions géométriques pures, portées de campusgo-maquette.html.
// Aucune dépendance React ici : testable indépendamment (Personne B).

export function haversine(a, b) {
  const R = 6371000;
  const toRad = (d) => (d * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat), dLng = toRad(b.lng - a.lng);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

export function turnAt(prev, corner, next) {
  const v1 = { x: corner.lng - prev.lng, y: corner.lat - prev.lat };
  const v2 = { x: next.lng - corner.lng, y: next.lat - corner.lat };
  const cross = v1.x * v2.y - v1.y * v2.x;
  return cross > 0 ? 'left' : 'right';
}

export function bearingDir(a, b) {
  const dLat = b.lat - a.lat, dLng = b.lng - a.lng;
  if (Math.abs(dLat) > Math.abs(dLng)) return dLat > 0 ? 'N' : 'S';
  return dLng > 0 ? 'E' : 'O';
}
