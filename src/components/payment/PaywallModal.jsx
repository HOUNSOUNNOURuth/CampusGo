import { startChariowCheckout } from '../../lib/chariow';
import PricingCard from './PricingCard.jsx';

// S'ouvre quand useSearchQuota().canSearch === false (après 2 recherches gratuites).
// Au clic sur un pack : startChariowCheckout(packCode) -> redirige vers Chariow.
// Le crédit du pack sur le compte utilisateur se fait ensuite via le webhook
// Chariow (supabase/functions/chariow-webhook), PAS directement dans ce composant.
export default function PaywallModal({ open, onClose }) {
  if (!open) return null;

  async function handleSelect(packCode) {
    const url = await startChariowCheckout(packCode);
    window.location.href = url;
  }

  return (
    <div className="modal-backdrop show">
      <div className="modal">
        <button onClick={onClose}>×</button>
        <h2>Vous avez utilisé vos recherches gratuites</h2>
        <PricingCard name="Pack Étudiant" priceFcfa={1000} features={['3 recherches']} onSelect={() => handleSelect('student')} highlight />
        <PricingCard name="Pack Semaine" priceFcfa={2500} features={['Illimité 7 jours']} onSelect={() => handleSelect('week')} />
        <PricingCard name="Pack Mois" priceFcfa={8000} features={['Illimité 30 jours']} onSelect={() => handleSelect('month')} />
      </div>
    </div>
  );
}
