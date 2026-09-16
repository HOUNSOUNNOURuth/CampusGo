// TODO (Personne A pour les données / Personne C pour le visuel)
// Reprend la page dashboard de la maquette : stats, historique (useSearchHistory),
// pack actif (user_packs), bouton "changer de pack" -> <PaywallModal />.
import { useSearchHistory } from '../hooks/useSearchHistory';
import HistoryTable from '../components/dashboard/HistoryTable.jsx';

export default function DashboardPage() {
  const { history, loading } = useSearchHistory();
  return (
    <section>
      <h1>Tableau de bord</h1>
      {!loading && <HistoryTable history={history} />}
    </section>
  );
}
