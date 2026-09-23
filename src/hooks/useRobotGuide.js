import { useCallback, useEffect, useRef, useState } from 'react';
import { haversine } from '../utils/geo';
import { buildRouteNodes } from '../data/campusMap';
import useGeolocation from './useGeolocation';

const GPS_THRESHOLD_M = 25;   // distance (m) à laquelle on considère le repère "atteint" en mode réel
const DEMO_WALK_DELAY = 2600; // délai simulé (ms) avant d'avancer en mode démo
const PHOTO_DISPLAY_MS = 3200; // durée d'affichage de PhotoCard à un repère intermédiaire

/**
 * @param {Object} opts
 * @param {Array|Object} opts.places - lieux du campus (voir campusLocations.js)
 * @param {(key: string) => string} opts.t - fonction de traduction (useI18n().t)
 */
export default function useRobotGuide({ places, t }) {
  const [nodes, setNodes] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [avatarPos, setAvatarPos] = useState(null); // { lat, lng }
  const [mode, setMode] = useState('demo');         // 'demo' | 'real'
  const [distanceHint, setDistanceHint] = useState(null); // distance restante (m) en mode réel
  const [status, setStatus] = useState('idle');     // 'idle' | 'traveling' | 'arrived'
  const [photoVisible, setPhotoVisible] = useState(false);

  const tokenRef = useRef(0);        // annule les animations/timers d'un trajet précédent
  const advancingRef = useRef(false);
  const demoTimerRef = useRef(null);
  const photoTimerRef = useRef(null);

  const { position, error: geoError } = useGeolocation({
    enabled: mode === 'real' && status === 'traveling'
  });

  // anime l'avatar de nodes[fromIdx] vers nodes[fromIdx+1], en lat/lng
  const animateLeg = useCallback((fromIdx, currentNodes, token) => {
    const fromNode = currentNodes[fromIdx];
    const toNode = currentNodes[fromIdx + 1];
    const distanceM = fromNode.legDist; // déjà calculé par buildRouteNodes
    const duration = Math.max(900, Math.min(2800, distanceM * 3));
    const t0 = performance.now();

    return new Promise((resolve) => {
      function frame(now) {
        if (token !== tokenRef.current) { resolve(); return; }
        const progress = Math.min(1, (now - t0) / duration);
        setAvatarPos({
          lat: fromNode.lat + (toNode.lat - fromNode.lat) * progress,
          lng: fromNode.lng + (toNode.lng - fromNode.lng) * progress
        });
        if (progress < 1) requestAnimationFrame(frame);
        else resolve();
      }
      requestAnimationFrame(frame);
    });
  }, []);

  const travelLeg = useCallback((fromIdx, token, currentNodes) => {
    if (token !== tokenRef.current || advancingRef.current) return;
    advancingRef.current = true;
    animateLeg(fromIdx, currentNodes, token).then(() => {
      advancingRef.current = false;
      if (token !== tokenRef.current) return;
      const nextIdx = fromIdx + 1;
      setCurrentIdx(nextIdx);
      if (nextIdx < currentNodes.length - 1) {
        startLeg(nextIdx, token, currentNodes);
      } else {
        setStatus('arrived');
      }
    });
    // eslint-disable-next-line no-use-before-define
  }, [animateLeg]);

  const startLeg = useCallback((idx, token, currentNodes) => {
    if (token !== tokenRef.current) return;
    if (idx >= currentNodes.length - 1) return;
    if (mode === 'demo') {
      demoTimerRef.current = setTimeout(() => {
        if (token === tokenRef.current) travelLeg(idx, token, currentNodes);
      }, DEMO_WALK_DELAY);
    }
    // en mode 'real', l'effet ci-dessous appelle travelLeg quand le GPS se rapproche
  }, [mode, travelLeg]);

  const start = useCallback((destName) => {
    tokenRef.current += 1;
    const token = tokenRef.current;
    if (demoTimerRef.current) clearTimeout(demoTimerRef.current);

    const built = buildRouteNodes(destName, places, t);
    if (!built.length) return;

    setNodes(built);
    setCurrentIdx(0);
    setAvatarPos({ lat: built[0].lat, lng: built[0].lng });
    setStatus('traveling');

    startLeg(0, token, built);
  }, [places, t, startLeg]);

  // mode réel : avance quand le GPS se rapproche du prochain repère
  useEffect(() => {
    if (mode !== 'real' || !position || !nodes.length || status !== 'traveling') return;
    const target = nodes[currentIdx + 1];
    if (!target) return;
    const d = Math.round(haversine({ lat: position.lat, lng: position.lng }, target));
    setDistanceHint(d);
    if (d < GPS_THRESHOLD_M) travelLeg(currentIdx, tokenRef.current, nodes);
  }, [position, mode, currentIdx, nodes, status, travelLeg]);

  // repli automatique sur le mode démo si le GPS est refusé/indisponible
  useEffect(() => {
    if (mode === 'real' && geoError) setMode('demo');
  }, [geoError, mode]);

  // PhotoCard : visible 3,2s à chaque repère atteint, persiste à l'arrivée finale
  useEffect(() => {
    if (!nodes.length) return;
    setPhotoVisible(true);
    if (photoTimerRef.current) clearTimeout(photoTimerRef.current);
    const isLast = currentIdx === nodes.length - 1;
    if (!isLast) {
      photoTimerRef.current = setTimeout(() => setPhotoVisible(false), PHOTO_DISPLAY_MS);
    }
    return () => {
      if (photoTimerRef.current) clearTimeout(photoTimerRef.current);
    };
  }, [currentIdx, nodes]);

  const setGpsMode = useCallback((nextMode) => {
    tokenRef.current += 1; // annule ce qui attendait sous l'ancien mode
    if (demoTimerRef.current) clearTimeout(demoTimerRef.current);
    setMode(nextMode);
    if (status === 'traveling' && nodes.length) {
      startLeg(currentIdx, tokenRef.current, nodes);
    }
  }, [status, nodes, currentIdx, startLeg]);

  useEffect(() => () => {
    tokenRef.current += 1;
    if (demoTimerRef.current) clearTimeout(demoTimerRef.current);
    if (photoTimerRef.current) clearTimeout(photoTimerRef.current);
  }, []);

  const currentNode = nodes[currentIdx] || null;
  const totalDistance = nodes.reduce((sum, n) => sum + (n.legDist || 0), 0);

  return {
    nodes,
    currentIdx,
    currentNode,
    avatarPos,     // { lat, lng }
    status,        // 'idle' | 'traveling' | 'arrived'
    mode,          // 'demo' | 'real'
    distanceHint,
    totalDistance,
    photoVisible,
    start,         // start(destName)
    setGpsMode     // setGpsMode('demo' | 'real')
  };
}
