import { useEffect, useRef } from 'react';

// TODO (Personne B) — CŒUR TECHNIQUE DU PROJET.
// Porter ici, en React, le moteur déjà validé dans campusgo-maquette.html :
//   - computeBounds() / project() -> conversion lat/lng vers coordonnées SVG
//   - drawSvg() -> polyline + marqueurs + avatar (voir <g id="avatar-g">)
//   - animateAvatarPx() -> déplacement animé de l'avatar (requestAnimationFrame)
//   - travelLeg() / startJourneyFromNode() -> progression qui ATTEND le déplacement
//     réel (via useGeolocation) ou le mode démo, jamais un simple clic
//   - showNodeState() -> message + <PhotoCard/> qui apparaissent automatiquement
// Le SVG doit rester auto-suffisant (pas de tuiles externes) pour un rendu fiable.
export default function CampusMap({ destinationName }) {
  const svgRef = useRef(null);

  useEffect(() => {
    if (!destinationName) return;
    // buildRoute(destinationName) — à porter ici
  }, [destinationName]);

  return (
    <div className="map-stage">
      <svg ref={svgRef} viewBox="0 0 800 600" />
      {/* <InstructionCard /> <PhotoCard /> <StepsList /> se superposent en position absolute */}
    </div>
  );
}
