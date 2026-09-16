// Bandeau flottant bas-gauche : message courant + distance + statut d'attente
// de déplacement ("Avancez pour continuer…") + toggle mode démo/GPS réel.
export default function InstructionCard({ title, subtitle, waiting, gpsMode, onToggleGps }) {
  return (
    <div className="instr-float">
      <div className="instr-top">
        <div className="instr-title">{title}</div>
        <div className="instr-sub">{subtitle}</div>
      </div>
      {waiting && <div className="waiting-row">Avancez pour continuer votre trajet…</div>}
      <label>
        <input type="checkbox" checked={gpsMode === 'demo'} onChange={(e) => onToggleGps?.(e.target.checked)} />
        Mode démonstration
      </label>
    </div>
  );
}
