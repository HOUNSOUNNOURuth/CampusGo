export default function PackCard({ packName, searchesRemaining, onUpgrade }) {
  return (
    <div className="pack-box">
      <h3>Votre pack</h3>
      <p>{packName} — {searchesRemaining} recherche(s) restante(s)</p>
      <button onClick={onUpgrade}>Changer de pack</button>
    </div>
  );
}
