import { useEffect } from 'react';
import useRobotGuide from '../../hooks/useRobotGuide';
import { FALLBACK_LOCATIONS } from '../../data/campusLocations';
import AvatarGuide from './AvatarGuide';
import InstructionCard from './InstructionCard';
import StepsList from './StepsList';
import PhotoCard from './PhotoCard';

/**
 * @param {string} destinationName - nom du lieu choisi (depuis SearchBar)
 * @param {Array} [places] - lieux déjà chargés (sinon fallback statique)
 */
export default function CampusMap({ destinationName, places }) {
  const placesList = places ?? FALLBACK_LOCATIONS;

  const {
    nodes, currentIdx, currentNode, avatarPos, status, mode, distanceHint, photoVisible, start, setGpsMode
  } = useRobotGuide({ places: placesList });

  useEffect(() => {
    if (!destinationName) return;
    start(destinationName);
  }, [destinationName, start]);

  if (!nodes.length) {
    return (
      <div className="map-stage">
        {/* TODO: brancher sur les clés i18n app.guide.empty / erreur */}
        {destinationName ? (
          <p>
            Impossible de calculer un itinéraire vers « {destinationName} »
            (pas assez de repères disponibles pour tracer le trajet).
          </p>
        ) : (
          <p>Choisissez une destination pour démarrer le guidage.</p>
        )}
      </div>
    );
  }

  const routePoints = nodes.map((n) => `${n.x},${n.y}`).join(' ');
  const isLast = status === 'arrived';
  const subtitle = isLast
    ? 'Trajet terminé'
    : `${currentNode?.legDist ?? 0} m jusqu'au prochain repère`;

  return (
    <div className="map-stage" style={{ position: 'relative' }}>
      <svg viewBox="0 0 800 600">
        <rect x="0" y="0" width="800" height="600" fill="#10131A" />

        <polyline
          points={routePoints}
          fill="none"
          stroke="#FF7A33"
          strokeWidth="5"
          strokeLinejoin="round"
          strokeLinecap="round"
        />

        {nodes.map((n, i) => {
          if (i === 0) {
            return (
              <g key={`node-${i}`}>
                <circle cx={n.x} cy={n.y} r="8" fill="#1B7F6E" stroke="#10131A" strokeWidth="2" />
                <text x={n.x} y={n.y - 16} textAnchor="middle" fill="#B7BDC6" fontSize="11">
                  Vous
                </text>
              </g>
            );
          }
          if (i === nodes.length - 1) {
            return (
              <g key={`node-${i}`}>
                <g transform={`translate(${n.x},${n.y}) rotate(-45)`}>
                  <rect x="-13" y="-26" width="26" height="26" rx="13" fill="#FF7A33" stroke="#fff" strokeWidth="2" />
                </g>
                <text x={n.x} y={n.y - 40} textAnchor="middle" fill="#F2F0EA" fontSize="13" fontWeight="700">
                  {n.name}
                </text>
              </g>
            );
          }
          return (
            <g key={`node-${i}`}>
              <circle cx={n.x} cy={n.y} r="12" fill="#1B7F6E" stroke="#fff" strokeWidth="2" />
              <text x={n.x} y={n.y + 4} textAnchor="middle" fill="#fff" fontSize="10" fontWeight="700">
                0{i}
              </text>
            </g>
          );
        })}

        {avatarPos && <AvatarGuide x={avatarPos.x} y={avatarPos.y} />}
      </svg>

      <InstructionCard
        title={currentNode?.message}
        subtitle={subtitle}
        waiting={status === 'traveling'}
        gpsMode={mode}
        onToggleGps={(isDemo) => setGpsMode(isDemo ? 'demo' : 'real')}
      />

      <StepsList nodes={nodes} currentIndex={currentIdx} />

      <PhotoCard
        name={currentNode?.name}
        show={photoVisible}
        arrival={status === 'arrived'}
      />

      {mode === 'real' && (
        <div style={{ marginTop: 8, fontFamily: 'monospace', fontSize: 13 }}>
          distance jusqu'au prochain repère :{' '}
          {distanceHint != null ? `${distanceHint} m` : "en attente du GPS..."}
        </div>
      )}
    </div>
  );
}
