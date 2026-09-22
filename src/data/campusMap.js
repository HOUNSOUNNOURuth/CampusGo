import { haversine, turnAt, bearingDir } from '../utils/geo';

// Point de départ fixe (entrée principale du campus UAC).
export const START_POINT = { name: "Entrée principale", lat: 6.4489, lng: 2.3480 };

// Repères intermédiaires possibles pour construire un trajet à 4 nœuds
// (départ -> repère -> repère -> destination), comme dans la maquette.
export const LANDMARK_CANDIDATES = [
  "Bibliothèque Centrale",
  "Amphithéâtre 1000 places",
  "Restaurant Universitaire (RU)"
];

const DIR_LABELS = { N: 'nord', S: 'sud', E: 'est', O: 'ouest' };

function shortName(fullName) {
  return fullName.split('—')[0].trim();
}

function pickLandmarks(destName, placesByName) {
  // on ignore un candidat s'il n'existe pas réellement dans `places`
  // (évite un crash si la liste chargée diffère de LANDMARK_CANDIDATES)
  const pool = LANDMARK_CANDIDATES.filter((l) => l !== destName && placesByName[l]);
  if (pool.length < 2) {
    Object.keys(placesByName).forEach((k) => {
      if (k !== destName && !pool.includes(k)) pool.push(k);
    });
  }
  // pas assez de lieux disponibles pour construire un trajet à 4 nœuds
  return pool.length >= 2 ? [pool[0], pool[1]] : null;
}

// TODO (i18n) : ces messages sont en français en dur. Une fois les clés
// confirmées dans src/i18n/fr.json et en.json, les remplacer par t('app.xxx').
function attachMessages(nodes) {
  const destShort = nodes[nodes.length - 1].name;
  nodes.forEach((n, i) => {
    if (i === 0) {
      const dir = DIR_LABELS[bearingDir(n, nodes[1])];
      n.message = `Départ depuis ${n.name}. Continuez vers le ${dir}.`;
    } else if (i === nodes.length - 1) {
      n.message = `Vous êtes arrivé à ${n.name} ! 🎉`;
    } else {
      const turnPhrase = n.turn === 'left' ? 'Tournez à gauche' : 'Tournez à droite';
      n.message = `Vous êtes actuellement à ${n.name}. ${turnPhrase}, continuons notre trajet vers ${destShort}.`;
    }
  });
}

/**
 * Construit les 4 nœuds du trajet (départ, 2 repères, destination),
 * avec virage (turn), distance (legDist, m) et message texte calculés.
 *
 * @param {string} destName - nom exact du lieu, tel que dans `places`
 * @param {Array<{name:string,lat:number,lng:number}> | Object} places
 */
export function buildRouteNodes(destName, places) {
  const placesByName = Array.isArray(places)
    ? Object.fromEntries(places.map((p) => [p.name, p]))
    : places;

  const dest = placesByName[destName];
  if (!dest) return [];

  const picked = pickLandmarks(destName, placesByName);
  if (!picked) return []; // pas assez de repères disponibles pour tracer un itinéraire

  const destShort = shortName(destName);
  const [lm1Name, lm2Name] = picked;

  const nodes = [
    { lat: START_POINT.lat, lng: START_POINT.lng, name: START_POINT.name, key: 'start' },
    { lat: placesByName[lm1Name].lat, lng: placesByName[lm1Name].lng, name: shortName(lm1Name), key: 'landmark' },
    { lat: placesByName[lm2Name].lat, lng: placesByName[lm2Name].lng, name: shortName(lm2Name), key: 'landmark' },
    { lat: dest.lat, lng: dest.lng, name: destShort, key: 'dest' }
  ];

  nodes[1].turn = turnAt(nodes[0], nodes[1], nodes[2]);
  nodes[2].turn = turnAt(nodes[1], nodes[2], nodes[3]);

  nodes.forEach((n, i) => {
    n.legDist = i < nodes.length - 1 ? Math.round(haversine(n, nodes[i + 1])) : 0;
  });

  attachMessages(nodes);

  return nodes;
}

export function computeBounds(nodes) {
  const lats = nodes.map((n) => n.lat);
  const lngs = nodes.map((n) => n.lng);
  return {
    minLat: Math.min(...lats),
    maxLat: Math.max(...lats),
    minLng: Math.min(...lngs),
    maxLng: Math.max(...lngs)
  };
}

// Projection lat/lng -> coordonnées SVG (viewBox 800x600, marge 100px).
export function project(node, bounds) {
  const m = 100, w = 800 - 2 * m, h = 600 - 2 * m;
  const lngSpan = bounds.maxLng - bounds.minLng || 0.0005;
  const latSpan = bounds.maxLat - bounds.minLat || 0.0005;
  return {
    x: m + ((node.lng - bounds.minLng) / lngSpan) * w,
    y: m + (1 - (node.lat - bounds.minLat) / latSpan) * h
  };
}

export function projectNodes(nodes) {
  const bounds = computeBounds(nodes);
  return nodes.map((n) => ({ ...n, ...project(n, bounds) }));
}
