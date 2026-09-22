// Calcule le cap (bearing) en degrés entre deux points GPS (0 = nord, 90 = est...)
function bearing(lat1, lon1, lat2, lon2) {
  const toRad = (d) => (d * Math.PI) / 180;
  const toDeg = (r) => (r * 180) / Math.PI;
  const dLon = toRad(lon2 - lon1);
  const y = Math.sin(dLon) * Math.cos(toRad(lat2));
  const x =
    Math.cos(toRad(lat1)) * Math.sin(toRad(lat2)) -
    Math.sin(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.cos(dLon);
  return (toDeg(Math.atan2(y, x)) + 360) % 360;
}

// Détermine "left" / "right" / "straight" à partir de la variation de cap
// entre le segment qui arrive et celui qui part d'un repère.
function turnFromBearings(prevBearing, nextBearing) {
  let diff = nextBearing - prevBearing;
  diff = ((diff + 180) % 360) - 180; // ramène entre -180 et 180
  if (diff > 25) return "right";
  if (diff < -25) return "left";
  return "straight";
}

// Emprise GPS approximative du campus UAC (à ajuster si de nouveaux lieux
// sortent de cette zone), utilisée pour projeter les coordonnées réelles sur
// le repère de la carte SVG (viewBox "0 0 800 600").
const CAMPUS_BOUNDS = { minLat: 6.443, maxLat: 6.453, minLng: 2.344, maxLng: 2.353 };
const SVG_WIDTH = 800;
const SVG_HEIGHT = 600;
const SVG_PADDING = 60;

function projectToSvg(lat, lng) {
  const { minLat, maxLat, minLng, maxLng } = CAMPUS_BOUNDS;
  const xRatio = (lng - minLng) / (maxLng - minLng);
  const yRatio = (lat - maxLat) / (minLat - maxLat); // inversé : lat max = haut de l'écran
  const x = SVG_PADDING + xRatio * (SVG_WIDTH - 2 * SVG_PADDING);
  const y = SVG_PADDING + yRatio * (SVG_HEIGHT - 2 * SVG_PADDING);
  return { x, y };
}

/**
 * Trouve le plus court chemin entre deux lieux via l'algorithme de Dijkstra,
 * en utilisant le graphe `location_edges` (distances piétonnes réelles, pas
 * à vol d'oiseau). Retourne une liste ordonnée d'étapes avec instruction et
 * turn_direction déjà calculés.
 *
 * @param {Array} locations - lignes de campus_locations [{id, name, lat, lng, photo_url, ...}]
 * @param {Array} edges - lignes de location_edges [{from_location_id, to_location_id, distance_m, bidirectional}]
 * @param {string} startId
 * @param {string} endId
 */
export function computeRoute(locations, edges, startId, endId) {
  const byId = new Map(locations.map((l) => [l.id, l]));

  const adjacency = new Map();
  for (const loc of locations) adjacency.set(loc.id, []);
  for (const e of edges) {
    adjacency.get(e.from_location_id)?.push({ to: e.to_location_id, dist: e.distance_m });
    if (e.bidirectional) {
      adjacency.get(e.to_location_id)?.push({ to: e.from_location_id, dist: e.distance_m });
    }
  }

  // Dijkstra
  const distances = new Map(locations.map((l) => [l.id, Infinity]));
  const previous = new Map();
  distances.set(startId, 0);
  const unvisited = new Set(locations.map((l) => l.id));

  while (unvisited.size > 0) {
    let currentId = null;
    let currentDist = Infinity;
    for (const id of unvisited) {
      if (distances.get(id) < currentDist) {
        currentDist = distances.get(id);
        currentId = id;
      }
    }
    if (currentId === null || currentId === endId) break;
    unvisited.delete(currentId);

    for (const neighbor of adjacency.get(currentId) ?? []) {
      const alt = currentDist + neighbor.dist;
      if (alt < distances.get(neighbor.to)) {
        distances.set(neighbor.to, alt);
        previous.set(neighbor.to, currentId);
      }
    }
  }

  if (distances.get(endId) === Infinity) {
    throw new Error("Aucun chemin trouvé entre ces deux lieux (graphe location_edges incomplet).");
  }

  // Reconstruction du chemin
  const pathIds = [endId];
  let cur = endId;
  while (cur !== startId) {
    cur = previous.get(cur);
    pathIds.unshift(cur);
  }

  // Construction des étapes avec instruction + turn_direction
  const steps = pathIds.map((id, i) => {
    const place = byId.get(id);
    const prev = i > 0 ? byId.get(pathIds[i - 1]) : null;
    const next = i < pathIds.length - 1 ? byId.get(pathIds[i + 1]) : null;

    let turn_direction = "straight";
    if (prev && next) {
      const inBearing = bearing(prev.lat, prev.lng, place.lat, place.lng);
      const outBearing = bearing(place.lat, place.lng, next.lat, next.lng);
      turn_direction = turnFromBearings(inBearing, outBearing);
    }

    const isLast = i === pathIds.length - 1;
    const instruction = isLast
      ? "Vous êtes arrivé."
      : turn_direction === "left"
        ? `Tournez à gauche, continuons vers ${next.short_name ?? next.name}.`
        : turn_direction === "right"
          ? `Tournez à droite, continuons vers ${next.short_name ?? next.name}.`
          : `Continuez tout droit vers ${next.short_name ?? next.name}.`;

    const { x, y } = projectToSvg(place.lat, place.lng);

    return {
      place_id: place.id,
      place_name: place.short_name ?? place.name,
      photo_url: place.photo_url,
      lat: place.lat,
      lon: place.lng,
      x,
      y,
      turn_direction,
      instruction,
    };
  });

  const totalDistanceM = distances.get(endId);
  return { steps, totalDistanceM };
}
