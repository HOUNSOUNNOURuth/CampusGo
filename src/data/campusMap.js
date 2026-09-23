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

const DIR_KEY = { N: 'dir.n', S: 'dir.s', E: 'dir.e', O: 'dir.o' };

function shortName(fullName) {
  return fullName.split('—')[0].trim();
}

function pickLandmarks(destName, placesByName) {
  const pool = LANDMARK_CANDIDATES.filter((l) => l !== destName && placesByName[l]);
  if (pool.length < 2) {
    Object.keys(placesByName).forEach((k) => {
      if (k !== destName && !pool.includes(k)) pool.push(k);
    });
  }
  return pool.length >= 2 ? [pool[0], pool[1]] : null;
}

function attachMessages(nodes, t) {
  nodes.forEach((n, i) => {
    if (i === 0) {
      const dir = t(DIR_KEY[bearingDir(n, nodes[1])]);
      n.message = `${t('app.depart')} ${n.name}. ${t('app.towards')} ${dir}.`;
    } else if (i === nodes.length - 1) {
      n.message = `${t('app.arrived_prefix')} ${n.name} ! 🎉`;
    } else {
      const turnPhrase = n.turn === 'left' ? t('app.left') : t('app.right');
      n.message = `${t('app.currently')} ${n.name}. ${turnPhrase}, continuons notre trajet vers ${nodes[nodes.length - 1].name}.`;
    }
  });
}

/**
 * Construit les 4 nœuds du trajet (départ, 2 repères, destination),
 * avec virage (turn), distance (legDist, m) et message texte (i18n).
 * Les coordonnées restent en lat/lng — c'est Leaflet qui gère la projection
 * à l'écran, plus besoin de calculer des coordonnées pixels ici.
 *
 * @param {string} destName - nom exact du lieu, tel que dans `places`
 * @param {Array<{name:string,lat:number,lng:number}> | Object} places
 * @param {(key: string) => string} t - fonction de traduction (useI18n().t)
 */
export function buildRouteNodes(destName, places, t) {
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

  attachMessages(nodes, t);

  return nodes;
}
