// Carte-photo qui apparaît 2-4s à chaque repère atteint (persiste à l'arrivée).
// TODO (Personne B) : remplacer l'icône par `photo_url` de campus_locations
// (stocké dans Supabase Storage) une fois les vraies photos disponibles.
export default function PhotoCard({ name, show, arrival }) {
  return (
    <div className={show ? 'photo-card show' : 'photo-card'}>
      <div className="photo-visual">{arrival ? '🎓' : '📍'}</div>
      <div className="photo-caption">
        <div className="pc-label">{arrival ? 'Destination atteinte' : 'Vous êtes ici'}</div>
        <div className="pc-name">{name}</div>
      </div>
    </div>
  );
}
