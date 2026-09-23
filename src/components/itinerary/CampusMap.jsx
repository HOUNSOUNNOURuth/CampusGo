import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import useRobotGuide from '../../hooks/useRobotGuide';
import { FALLBACK_LOCATIONS } from '../../data/campusLocations';
import InstructionCard from './InstructionCard';
import StepsList from './StepsList';
import PhotoCard from './PhotoCard';
import { useI18n } from '../../i18n/I18nContext.jsx';

const startIcon = L.divIcon({
  className: '',
  html: '<div style="width:16px;height:16px;border-radius:50%;background:#1B7F6E;border:2px solid #10131A;box-shadow:0 0 0 2px rgba(255,255,255,.6)"></div>',
  iconSize: [16, 16],
  iconAnchor: [8, 8]
});

const destIcon = L.divIcon({
  className: '',
  html: '<div style="width:26px;height:26px;border-radius:50% 50% 50% 0;background:#FF7A33;border:2px solid #fff;transform:rotate(-45deg);box-shadow:0 2px 6px rgba(0,0,0,.4);"></div>',
  iconSize: [26, 26],
  iconAnchor: [13, 26]
});

const avatarDivIcon = L.divIcon({
  className: '',
  html: '<div style="width:30px;height:30px;border-radius:50%;background:#FF7A33;border:3px solid #10131A;display:flex;align-items:center;justify-content:center;font-size:15px;box-shadow:0 2px 8px rgba(0,0,0,.5);">🤖</div>',
  iconSize: [30, 30],
  iconAnchor: [15, 15]
});

function landmarkIcon(number) {
  return L.divIcon({
    className: '',
    html: `<div style="width:24px;height:24px;border-radius:50%;background:#1B7F6E;border:2px solid #fff;color:#fff;font:700 10px 'Space Grotesk',sans-serif;display:flex;align-items:center;justify-content:center;">0${number}</div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12]
  });
}

// recentre la carte quand on atteint un nouveau nœud (pas à chaque frame d'animation)
function FollowNode({ position }) {
  const map = useMap();
  useEffect(() => {
    if (position) map.flyTo(position, map.getZoom(), { duration: 0.8 });
  }, [position, map]);
  return null;
}

// boutons de zoom/recentrage : réellement fonctionnels avec Leaflet
function MapControls({ centerOn }) {
  const map = useMap();
  return (
    <div className="map-controls">
      <button type="button" aria-label="Recentrer" onClick={() => centerOn && map.flyTo(centerOn, 16)}>⌖</button>
      <button type="button" aria-label="Zoomer" onClick={() => map.zoomIn()}>+</button>
      <button type="button" aria-label="Dézoomer" onClick={() => map.zoomOut()}>−</button>
    </div>
  );
}

/**
 * @param {string} destinationName - nom du lieu choisi (depuis SearchBar)
 * @param {Array} [places] - lieux déjà chargés (sinon fallback statique)
 */
export default function CampusMap({ destinationName, places }) {
  const { t } = useI18n();
  const placesList = places ?? FALLBACK_LOCATIONS;

  const {
    nodes, currentIdx, currentNode, avatarPos, status, mode, distanceHint, photoVisible, start, setGpsMode
  } = useRobotGuide({ places: placesList, t });

  useEffect(() => {
    if (!destinationName) return;
    start(destinationName);
  }, [destinationName, start]);

  if (!nodes.length) {
    return (
      <div className="map-stage">
        {destinationName ? (
          <p>{t('app.no_route_prefix')} « {destinationName} » {t('app.no_route_suffix')}</p>
        ) : (
          <p>{t('app.guide.empty')}</p>
        )}
      </div>
    );
  }

  const isLast = status === 'arrived';
  const subtitle = isLast
    ? t('app.route_finished')
    : `${currentNode?.legDist ?? 0} ${t('app.distance_to_next')}`;

  const routeLatLngs = nodes.map((n) => [n.lat, n.lng]);
  const center = [nodes[0].lat, nodes[0].lng];
  const currentNodeLatLng = currentNode ? [currentNode.lat, currentNode.lng] : null;

  return (
    <div className="map-stage">
      <MapContainer center={center} zoom={16} style={{ height: '100%', width: '100%' }} zoomControl={false}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <Polyline positions={routeLatLngs} pathOptions={{ color: '#FF7A33', weight: 5 }} />

        {nodes.map((n, i) => {
          if (i === 0) return <Marker key={`n-${i}`} position={[n.lat, n.lng]} icon={startIcon} />;
          if (i === nodes.length - 1) return <Marker key={`n-${i}`} position={[n.lat, n.lng]} icon={destIcon} />;
          return <Marker key={`n-${i}`} position={[n.lat, n.lng]} icon={landmarkIcon(i)} />;
        })}

        {avatarPos && <Marker position={[avatarPos.lat, avatarPos.lng]} icon={avatarDivIcon} />}

        <FollowNode position={currentNodeLatLng} />
        <MapControls centerOn={avatarPos ? [avatarPos.lat, avatarPos.lng] : center} />
      </MapContainer>

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
    </div>
  );
}
