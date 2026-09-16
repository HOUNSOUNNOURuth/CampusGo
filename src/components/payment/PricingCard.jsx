export default function PricingCard({ name, priceFcfa, features = [], onSelect, highlight }) {
  return (
    <div className={highlight ? 'price-card highlight' : 'price-card'}>
      <h3>{name}</h3>
      <div className="amount">{priceFcfa} FCFA</div>
      <ul>{features.map((f, i) => <li key={i}>{f}</li>)}</ul>
      <button onClick={onSelect}>Choisir ce pack</button>
    </div>
  );
}
