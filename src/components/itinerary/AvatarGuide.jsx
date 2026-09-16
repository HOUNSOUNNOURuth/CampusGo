// Représente le robot/avatar sur la carte (le <g id="avatar-g"> de la maquette).
// Séparé en composant pour pouvoir, plus tard, changer son apparence
// (robot, personnage, mascotte UAC) sans toucher au moteur de déplacement.
export default function AvatarGuide({ x, y }) {
  return (
    <g transform={`translate(${x ?? 0},${y ?? 0})`}>
      <circle r="15" fill="var(--route-orange)" stroke="#10131A" strokeWidth="3" />
      <text y="5" textAnchor="middle" fontSize="15">🤖</text>
    </g>
  );
}
