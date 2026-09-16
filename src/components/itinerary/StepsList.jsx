export default function StepsList({ nodes = [], currentIndex = 0 }) {
  return (
    <div className="steps-float">
      <div className="steps-head">Détail de l'itinéraire</div>
      <div className="steps-list">
        {nodes.map((n, i) => (
          <div key={i} className={i === currentIndex ? 'step-row current' : 'step-row'}>
            {n.message}
          </div>
        ))}
      </div>
    </div>
  );
}
