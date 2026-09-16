export function formatDistance(m) {
  return m >= 1000 ? `${(m / 1000).toFixed(1)} km` : `${Math.round(m)} m`;
}
export function formatDuration(minutes) {
  return `${Math.max(1, Math.round(minutes))} min`;
}
